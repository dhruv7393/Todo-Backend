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
  patchTask,
  deleteTask,
};
