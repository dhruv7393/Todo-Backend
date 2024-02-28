const mongoose = require("mongoose");

const ToDoModel = require("../models/todoModel");
const ToDoHeadersModel = require("../models/todoHeaderModel");
const sendCompleteLog = require("../commonComponents/sendCompleteLog");
const sendCompleteLogById = require("../commonComponents/sendCompleteLogByID");
const deleteById = require("../commonComponents/deleteById");
const checkAndPostMissingField = require("../commonComponents/checkAndPostMissingField");
const addLog = require("../commonComponents/addLog");
const updateLog = require("../commonComponents/updateLog");

const getToDos = async (req, res) => {
  sendCompleteLog(req, res, ToDoModel);
};

const getToDosById = async (req, res) => {
  sendCompleteLogById(req, res, ToDoModel);
};

const deleteTodo = async (req, res) => {
  deleteById(req, res, ToDoModel);
};

const postToDo = async (req, res) => {
  let defaultValue = {
    done: false,
    notes: "",
    completedOn: "",
    completeBy: "",
    addedOn: "",
  };
  let { headerId } = req.body;

  checkAndPostMissingField(req, res, ["title", "headerId", "imp", "addedOn"]);

  const todoHeadersList = await ToDoHeadersModel.findById(headerId);
  if (headerId == todoHeadersList["_id"]) {
    addLog(req, res, ToDoModel, defaultValue);
  } else {
    res.status(400).send("Please add header to associate todo");
  }
};

const updateTodo = async (req, res) => {
  checkAndPostMissingField(
    req,
    res,
    ["title", "headerId", "imp", "addedOn"],
    ["id"]
  );

  let defaultValue = {
    done: false,
    notes: "",
    completedOn: "",
    completeBy: "",
    addedOn: "",
  };

  let { headerId, done = false, completedOn = "" } = req.body;
  const { id } = req.params;

  if (done && !completedOn) {
    completedOn = new Date().toLocaleDateString();
  }

  const todoHeadersList = await ToDoHeadersModel.findById(headerId);
  if (headerId == todoHeadersList["_id"]) {
    updateLog(req, res, ToDoModel, defaultValue);
  } else {
    res.status(400).send("Please add header to associate todo");
  }
};

module.exports = {
  getToDos,
  postToDo,
  getToDosById,
  updateTodo,
  deleteTodo,
};
