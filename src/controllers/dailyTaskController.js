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
  const dayOftheWeek = new Date().getDay()

  dailyTaskList.forEach(async (task) => {
    
    if(task.edited !== today && dayOftheWeek==5){
      if(task.title==="Study New Concept"|| task.title==="Understing Finance"){
        task.pending = task.pending -5
      }else if(task.title==="Exercise"){
        task.pending = task.pending -3
      }else{
        task.pending = task.pending -7
      }
      task.edited = today;
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
