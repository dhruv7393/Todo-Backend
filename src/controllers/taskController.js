const mongoose = require("mongoose");

const TaskModel = require("../models/taskModel");
const ToDoHeadersModel = require("../models/todoHeaderModel");
const sendCompleteLog = require("../commonComponents/sendCompleteLog");
const sendCompleteLogById = require("../commonComponents/sendCompleteLogByID");
const deleteById = require("../commonComponents/deleteById");
const checkAndPostMissingField = require("../commonComponents/checkAndPostMissingField");
const addLog = require("../commonComponents/addLog");
const updateLog = require("../commonComponents/updateLog");

const getTasks = async (req, res) => {
  sendCompleteLog(req, res, TaskModel);
};

const getTasksById = async (req, res) => {
  sendCompleteLogById(req, res, TaskModel);
};

const deleteTask = async (req, res) => {
  deleteById(req, res, TaskModel);
};

const postTask = async (req, res) => {
  let defaultValue = {
    done: false,
    pinned: false,
    notes: [""],
    imp: 1
  };

  checkAndPostMissingField(req, res, ["title"]);

  addLog(req, res, TaskModel, defaultValue);
 
};

const updateTask = async (req, res) => {
  checkAndPostMissingField(
    req,
    res,
    ["title"],
    ["id"]
  );

  let defaultValue = {
    done: false,
    pinned: false,
    notes: [""],
    imp: 1
  };

  updateLog(req, res, TaskModel, defaultValue);
};

module.exports = {
  getTasks,
  postTask,
  getTasksById,
  updateTask,
  deleteTask,
};
