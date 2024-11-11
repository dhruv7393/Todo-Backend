const sendCompleteLog = require("../commonComponents/sendCompleteLog");
const sendCompleteLogById = require("../commonComponents/sendCompleteLogByID");
const callModel = require("../models/callModel");
const deleteById = require("../commonComponents/deleteById");
const checkAndPostMissingField = require("../commonComponents/checkAndPostMissingField");
const updateLog = require("../commonComponents/updateLog");
const addLog = require("../commonComponents/addLog");

const getCallHistory = async (req, res) => {
  sendCompleteLog(req, res, callModel);
};

const getCallHistoryById = async (req, res) => {
  sendCompleteLogById(req, res, callModel);
};

const deleteCallById = async (req, res) => {
  deleteById(req, res, callModel);
};

const toggleCall = async (req, res) => {
  checkAndPostMissingField(req, res, ["title"], ["id"]);
  let defaultValue = {
    done: false,
  };
  updateLog(req, res, callModel, defaultValue);
};

const postCall = async (req, res) => {
  checkAndPostMissingField(req, res, ["title"]);
  let defaultValue = { done: false };
  addLog(req, res, callModel, defaultValue);
};

module.exports = {
  getCallHistory,
  getCallHistoryById,
  deleteCallById,
  toggleCall,
  postCall,
};
