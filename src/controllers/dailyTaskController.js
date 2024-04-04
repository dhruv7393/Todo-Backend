const dailyTaskModel = require("../models/dailyTaskModel");
const sendCompleteLog = require("../commonComponents/sendCompleteLog");
const sendCompleteLogById = require("../commonComponents/sendCompleteLogByID");
const deleteById = require("../commonComponents/deleteById");
const checkAndPostMissingField = require("../commonComponents/checkAndPostMissingField");
const updateLog = require("../commonComponents/updateLog");

const getDailyTask = async (req, res) => {
  sendCompleteLog(req, res, dailyTaskModel);
};

const getDailyTaskById = async (req, res) => {
  sendCompleteLogById(req, res, dailyTaskModel);
};

const deleteDailyTaskById = async (req, res) => {
  deleteById(req, res, dailyTaskModel);
};

const updateDailyTask = async (req, res) => {
  checkAndPostMissingField(req, res, ["title"], ["id"]);

  let { pending } = req.body;

  let defaultValue = {
    done: !parseInt(pending) ? false : true,
  };

  updateLog(req, res, dailyTaskModel, defaultValue);
};

const setPendingTask = async (req, res) => {
  const dailyTaskList = await dailyTaskModel.find();
  const today = new Date().toLocaleDateString();

  dailyTaskList.forEach(async (task) => {
    
    task.pending -= Math.ceil(
      (new Date(new Date().toLocaleDateString()) - new Date(task.edited)) /
        (1000 * 60 * 60 * 24)
    )
    
    task.edited = today;

    if (!task.pending) {
      task.done = true;
    }
    const result = await dailyTaskModel.findByIdAndUpdate(task._id, task);
  });

  res.status(200).json(dailyTaskList);
};

module.exports = {
  getDailyTask,
  getDailyTaskById,
  deleteDailyTaskById,
  updateDailyTask,
  setPendingTask,
};
