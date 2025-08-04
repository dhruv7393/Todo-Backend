const mongoose = require("mongoose");
const VaccationModel = require("../models/VaccationModel");
const sendCompleteLog = require("../commonComponents/sendCompleteLog");
const addLog = require("../commonComponents/addLog");
const updateLog = require("../commonComponents/updateLog");
const deleteById = require("../commonComponents/deleteById");

const getAllVaccationTasks = async (req, res) => {
  sendCompleteLog(req, res, VaccationModel);
};

const addVaccationTask = async (req, res) => {
  try {
    const { nestUnder = "", ...taskData } = req.body;

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
  let defaultValue = {
    isDone: false,
    canBeReseted: true,
    listOfSubTasks: [],
  };
  updateLog(req, res, VaccationModel, defaultValue);
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

module.exports = {
  getAllVaccationTasks,
  addVaccationTask,
  updateVaccationTask,
  deleteVaccationTask,
};
