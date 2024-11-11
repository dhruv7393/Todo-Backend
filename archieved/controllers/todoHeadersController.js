const ToDoHeadersModel = require("../models/todoHeaderModel");
const ToDoModel = require("../models/todoModel");
const sendCompleteLog = require("../commonComponents/sendCompleteLog");
const sendCompleteLogById = require("../commonComponents/sendCompleteLogByID");
const checkAndPostMissingField = require("../commonComponents/checkAndPostMissingField");
const addLog = require("../commonComponents/addLog");
const updateLog = require("../commonComponents/updateLog");
const deleteById = require("../commonComponents/deleteById");

/*
    @desc Get all todo headers
    @route GET /api/headers
    @access Private
*/

const getHeaders = async (req, res) => {
  sendCompleteLog(req, res, ToDoHeadersModel);
};

const getHeadersById = async (req, res) => {
  sendCompleteLogById(req, res, ToDoHeadersModel);
};

const postHeaders = async (req, res) => {
  checkAndPostMissingField(req, res, ["title", "pinned"]);
  let defaultValue = {};
  addLog(req, res, ToDoHeadersModel, defaultValue);
};

const updateHeadersById = async (req, res) => {
  checkAndPostMissingField(req, res, ["title"], ["id"]);
  let defaultValue = {
    pinned: false,
  };
  updateLog(req, res, ToDoHeadersModel, defaultValue);
};

const deleteHeadersById = async (req, res) => {
  const { id } = req.params;
  const todosList = await ToDoModel.find();
  let todoWithId = todosList.filter(
    (todo) => todo.headerId == id && !todo.done
  );
  if (!todoWithId.length) {
    let todoToBeDeleted = todosList.filter((todo) => todo.headerId == id);
    todoToBeDeleted.forEach(
      async (todoId) => await ToDoModel.findByIdAndDelete(todoId._id)
    );
    deleteById(req, res, ToDoHeadersModel);
  } else {
    res.status(400).send("Header has todos associated");
  }
};

module.exports = {
  getHeaders,
  postHeaders,
  getHeadersById,
  updateHeadersById,
  deleteHeadersById,
};
