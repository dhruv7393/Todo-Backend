const mongoose = require("mongoose");
const VaccationModel = require("../models/VaccationModel");
const sendCompleteLog = require("../commonComponents/sendCompleteLog");
const addLog = require("../commonComponents/addLog");
const updateLog = require("../commonComponents/updateLog");
const deleteById = require("../commonComponents/deleteById");

// Helper function to recursively copy subtasks
const copySubTasksRecursively = async (subTaskIds) => {
  const copiedIds = [];

  for (const subTaskId of subTaskIds) {
    const originalSubTask = await VaccationModel.findById(subTaskId);
    if (!originalSubTask) continue;

    // Create a copy of the subtask with a new ID
    const copiedSubTask = {
      _id: new mongoose.Types.ObjectId(),
      taskName: originalSubTask.taskName,
      isDone: originalSubTask.isDone,
      carryOutOn: originalSubTask.carryOutOn,
      dateOfCarryOut: originalSubTask.dateOfCarryOut,
      canBeReseted: originalSubTask.canBeReseted,
      listOfSubTasks: [],
    };

    // If the original subtask has its own subtasks, recursively copy them
    if (
      originalSubTask.listOfSubTasks &&
      originalSubTask.listOfSubTasks.length > 0
    ) {
      copiedSubTask.listOfSubTasks = await copySubTasksRecursively(
        originalSubTask.listOfSubTasks
      );
    }

    // Create the copied subtask in the database
    const newSubTask = await VaccationModel.create(copiedSubTask);
    copiedIds.push(newSubTask._id);
  }

  return copiedIds;
};

const getAllVaccationTasks = async (req, res) => {
  sendCompleteLog(req, res, VaccationModel);
};

const addVaccationTask = async (req, res) => {
  try {
    const { nestUnder = "", copySubTasksOf = "", ...taskData } = req.body;

    console.log("Received task data:", taskData);

    // Create the new task with default values
    const defaultValue = {
      isDone: false,
      canBeReseted: true,
      listOfSubTasks: [],
    };

    const valueToBeAdded = {
      _id: new mongoose.Types.ObjectId(),
      ...defaultValue,
      ...taskData,
    };

    // Create the new task
    const newTask = await VaccationModel.create(valueToBeAdded);

    // If copySubTasksOf is provided, recursively copy all subtasks
    if (copySubTasksOf) {
      const sourceTask = await VaccationModel.findById(copySubTasksOf);
      if (!sourceTask) {
        return res.status(404).json({
          error: "Source task not found",
          message: `Source task with ID ${copySubTasksOf} could not be found for copying subtasks.`,
          task: newTask,
        });
      }

      if (sourceTask.listOfSubTasks && sourceTask.listOfSubTasks.length > 0) {
        const copiedSubTaskIds = await copySubTasksRecursively(
          sourceTask.listOfSubTasks
        );

        // Update the new task with the copied subtask IDs
        newTask.listOfSubTasks = copiedSubTaskIds;
        await newTask.save();
      }
    }

    // Deadlock/loop prevention: check if the parent (or any ancestor) is already a descendant of the new task
    const isDescendant = async (potentialDescendantId, rootId) => {
      if (!potentialDescendantId) return false;
      if (potentialDescendantId.toString() === rootId.toString()) return true;
      const node = await VaccationModel.findById(rootId);
      if (!node || !node.listOfSubTasks || node.listOfSubTasks.length === 0)
        return false;
      for (const subId of node.listOfSubTasks) {
        if (subId.toString() === potentialDescendantId.toString()) return true;
        if (await isDescendant(potentialDescendantId, subId)) return true;
      }
      return false;
    };

    // If nestUnder is provided, add this task to parent's listOfSubTasks
    if (nestUnder) {
      const parentTask = await VaccationModel.findById(nestUnder);

      if (!parentTask) {
        // If parent doesn't exist, still keep the task but return error about parent
        return res.status(404).json({
          error: "Parent task not found",
          message: `Parent task with ID ${nestUnder} could not be found. Task created but not nested.`,
          task: newTask,
          parentUpdated: false,
        });
      }

      // Check for deadlock/loop: parent (or any ancestor) should not be a descendant of the new task
      if (await isDescendant(nestUnder, newTask._id)) {
        // Remove the just-created task to avoid orphaned node
        await VaccationModel.findByIdAndDelete(newTask._id);
        return res.status(400).json({
          error: "Loop detected",
          message:
            "Cannot nest this task as it would create a circular reference.",
        });
      }

      // Add the new task ID to parent's listOfSubTasks
      parentTask.listOfSubTasks.push(newTask._id);
      await parentTask.save();
    }

    res.status(201).json({
      message: "Task created successfully",
      task: newTask,
      parentUpdated: nestUnder ? true : false,
    });
  } catch (e) {
    res.status(500).json({
      error: "Task creation failed",
      message: e.message || "Could not create task",
      details: e,
    });
  }
};

const updateVaccationTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { nestUnder, currentParent, ...updateData } = req.body;

    // Deadlock/loop prevention: check if the new parent (or any ancestor) is already a descendant of this task
    const isDescendant = async (potentialDescendantId, rootId) => {
      if (!potentialDescendantId) return false;
      if (potentialDescendantId.toString() === rootId.toString()) return true;
      const node = await VaccationModel.findById(rootId);
      if (!node || !node.listOfSubTasks || node.listOfSubTasks.length === 0)
        return false;
      for (const subId of node.listOfSubTasks) {
        if (subId.toString() === potentialDescendantId.toString()) return true;
        if (await isDescendant(potentialDescendantId, subId)) return true;
      }
      return false;
    };

    // If nestUnder is present, check for loop
    if (nestUnder && (await isDescendant(nestUnder, id))) {
      return res.status(400).json({
        error: "Loop detected",
        message:
          "Cannot nest this task as it would create a circular reference.",
      });
    }

    // Remove this task from the old parent's listOfSubTasks if currentParent is provided
    if (currentParent) {
      await VaccationModel.findByIdAndUpdate(currentParent, {
        $pull: { listOfSubTasks: id },
      });
    }

    // Add this task to the new parent's listOfSubTasks if nestUnder is provided
    if (nestUnder) {
      await VaccationModel.findByIdAndUpdate(nestUnder, {
        $addToSet: { listOfSubTasks: id },
      });
    }

    // Update the task itself
    const updatedTask = await VaccationModel.findByIdAndUpdate(
      id,
      { ...updateData, nestUnder: nestUnder || null },
      { new: true }
    );

    // If task status is being changed, recursively update all subtasks
    if (
      updateData.hasOwnProperty("isDone") &&
      updatedTask.listOfSubTasks &&
      updatedTask.listOfSubTasks.length > 0
    ) {
      if (updateData.isDone === true) {
        // Mark all subtasks as done
        for (const subTaskId of updatedTask.listOfSubTasks) {
          await markTaskAndSubtasksAsDone(subTaskId);
        }
      } else if (updateData.isDone === false) {
        // Mark all subtasks as undone
        for (const subTaskId of updatedTask.listOfSubTasks) {
          await resetTaskAndSubtasks(subTaskId);
        }
      }
    }

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
      parentUpdated: !!nestUnder,
    });
  } catch (e) {
    res.status(500).json({
      error: "Task update failed",
      message: e.message || "Could not update task",
      details: e,
    });
  }
};

const deleteVaccationTask = async (req, res) => {
  const { id } = req.params;
  try {
    // First, find the task to get its subtasks
    const task = await VaccationModel.findById(id);
    if (!task) {
      return res.status(404).json({
        error: "Task not found",
        message: `Task with ID ${id} could not be found`,
      });
    }

    // Collect all deleted task IDs recursively
    const deletedTaskIds = [];
    const collectDeletedTaskIds = async (taskId) => {
      deletedTaskIds.push(taskId.toString());
      const t = await VaccationModel.findById(taskId);
      if (t && t.listOfSubTasks && t.listOfSubTasks.length > 0) {
        for (const subId of t.listOfSubTasks) {
          await collectDeletedTaskIds(subId);
        }
      }
    };
    await collectDeletedTaskIds(id);

    // Remove all deleted task IDs from all other tasks' listOfSubTasks
    await VaccationModel.updateMany(
      {},
      { $pull: { listOfSubTasks: { $in: deletedTaskIds } } }
    );

    // Recursively delete all subtasks
    if (task.listOfSubTasks && task.listOfSubTasks.length > 0) {
      for (const subtaskId of task.listOfSubTasks) {
        await deleteSubtaskRecursively(subtaskId);
      }
    }

    // Delete the main task
    await VaccationModel.findByIdAndDelete(id);

    res.status(200).json({
      message: `Task ${id} and all its subtasks have been successfully deleted and references removed from other tasks`,
      deletedTaskIds,
    });
  } catch (e) {
    res.status(500).json({
      error: "Deletion failed",
      message: e.message || "Could not delete task and subtasks",
      details: e,
    });
  }
};

// Helper function to recursively delete subtasks
const deleteSubtaskRecursively = async (subtaskId) => {
  try {
    const subtask = await VaccationModel.findById(subtaskId);
    if (subtask) {
      // If this subtask has its own subtasks, delete them first
      if (subtask.listOfSubTasks && subtask.listOfSubTasks.length > 0) {
        for (const nestedSubtaskId of subtask.listOfSubTasks) {
          await deleteSubtaskRecursively(nestedSubtaskId);
        }
      }
      // Delete the subtask itself
      await VaccationModel.findByIdAndDelete(subtaskId);
    }
  } catch (error) {
    console.error(`Error deleting subtask ${subtaskId}:`, error);
    throw error;
  }
};

// Helper to recursively set isDone to false for a task and all its subtasks
const resetTaskAndSubtasks = async (taskId) => {
  const task = await VaccationModel.findById(taskId);
  if (!task) return;
  if (task.isDone !== false) {
    task.isDone = false;
    await task.save();
  }
  if (task.listOfSubTasks && task.listOfSubTasks.length > 0) {
    for (const subId of task.listOfSubTasks) {
      await resetTaskAndSubtasks(subId);
    }
  }
};

// Helper to recursively set isDone to true for a task and all its subtasks
const markTaskAndSubtasksAsDone = async (taskId) => {
  const task = await VaccationModel.findById(taskId);
  if (!task) return;
  if (task.isDone !== true) {
    task.isDone = true;
    await task.save();
  }
  if (task.listOfSubTasks && task.listOfSubTasks.length > 0) {
    for (const subId of task.listOfSubTasks) {
      await markTaskAndSubtasksAsDone(subId);
    }
  }
};

const chron = async (req, res) => {
  try {
    const allTasks = await VaccationModel.find({});
    const today = new Date();
    const todayDate = today.getDate();
    const todayDay = today.toLocaleString("en-US", { weekday: "long" });
    const toDelete = [];

    for (const task of allTasks) {
      if (typeof task.carryyOutOn === "string" && task.canBeReseted) {
        // Monthly: e.g. 'monthly 5'
        const monthlyMatch = task.carryyOutOn.match(/^monthly\s+(\d{1,2})$/i);
        if (monthlyMatch) {
          const dayNum = parseInt(monthlyMatch[1], 10);
          if (dayNum === todayDate) {
            await resetTaskAndSubtasks(task._id);
            continue;
          }
        }
        // Days of week: e.g. 'Monday,Wednesday'
        const daysOfWeek = task.carryyOutOn.split(",").map((s) => s.trim());
        if (daysOfWeek.includes(todayDay)) {
          await resetTaskAndSubtasks(task._id);
          continue;
        }
      }
      // Mark for deletion if done and cannot be reset
      if (task.isDone && !task.canBeReseted) {
        toDelete.push(task._id);
      }
    }

    // Delete all tasks that are done and cannot be reset (and their subtasks) using deleteVaccationTask
    for (const delId of toDelete) {
      // Mimic Express req/res for internal call
      await deleteVaccationTask(
        { params: { id: delId } },
        { status: () => ({ json: () => {} }) }
      );
    }

    res.status(200).json({
      message: "Chron job completed",
      resetTasks: allTasks.length - toDelete.length,
      deletedTasks: toDelete.length,
    });
  } catch (e) {
    res.status(500).json({
      error: "Chron job failed",
      message: e.message || "Could not process tasks",
      details: e,
    });
  }
};

module.exports = {
  getAllVaccationTasks,
  addVaccationTask,
  updateVaccationTask,
  deleteVaccationTask,
  chron,
};
