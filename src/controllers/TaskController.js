const mongoose = require("mongoose");
const TasksModel = require("../models/TasksModel");
const StreakCountModel = require("../models/streakCountModel");
const checkAndPostMissingField = require("../commonComponents/checkAndPostMissingField");
const sendCompleteLog = require("../commonComponents/sendCompleteLog");
const addLog = require("../commonComponents/addLog");
const deleteById = require("../commonComponents/deleteById");
const updateLog = require("../commonComponents/updateLog");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Fiday",
  "Saturday",
];

const today = new Date().toLocaleDateString();

const getTasks = async (req, res) => {
  sendCompleteLog(req, res, TasksModel);
};

const postTasks = async (req, res) => {
  let defaultValue = {
    imp: 1,
    noDelete: false,
    repeatOn: new Date().toLocaleDateString(),
    reset: false,
  };
  addLog(req, res, TasksModel, defaultValue);
};

const postDailyUpdate = async (req, res) => {
  //get details to check if you are on vaccation
  const streakCountDetails = await StreakCountModel.find();
  let defaultStreakCountValue = streakCountDetails[0]["_doc"];
  let { onVaccation } = defaultStreakCountValue.onVaccation;

  const taskDetailsNitya = await TasksModel.findById(
    "67f58c5d0b3ae40bdb5b3438"
  );
  const taskDetailsWeekly = await TasksModel.findById(
    "67f58d060b3ae40bdb5b343e"
  );

  taskDetailsWeekly["repeatOn"].includes(days[new Date().getDay()]) &&
    taskDetailsWeekly["checked"].forEach((task) => {
      defaultStreakCountValue["sincerity"][task] += 1;
    });

  taskDetailsNitya["repeatOn"].includes(days[new Date().getDay()]) &&
    taskDetailsNitya["checked"].forEach((task) => {
      defaultStreakCountValue["sincerity"][task] += 1;
    });

  const resultStreak = await StreakCountModel.findByIdAndUpdate(
    defaultStreakCountValue._id,
    defaultStreakCountValue
  );

  const taskDetails = await TasksModel.find();

  taskDetails.forEach(async (task) => {
    const allowUpdateIf = !onVaccation && task.reset;
    const checkForRepeatOn =
      (typeof task.repeatOn === "string" &&
        new Date(task.repeatOn) <= new Date(today)) ||
      task.repeatOn.includes(days[new Date().getDay()]);

    if (allowUpdateIf && checkForRepeatOn) {
      task.checked = typeof task.checked === "number" ? -1 : [];
      task.repeatOn = typeof task.repeatOn === "string" ? today : task.repeatOn;
      const result = await TasksModel.findByIdAndUpdate(task._id, task);
    }
  });

  sendCompleteLog(req, res, TasksModel);
};

const patchTask = async (req, res) => {
  let defaultValue = {};
  updateLog(req, res, TasksModel, defaultValue);
};

const deleteTask = async (req, res) => {
  deleteById(req, res, TasksModel);
};

module.exports = {
  getTasks,
  postTasks,
  postDailyUpdate,
  patchTask,
  deleteTask,
};
