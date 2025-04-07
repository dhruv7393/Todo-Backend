const mongoose = require("mongoose");

const StreakCountModel = require("../models/streakCountModel");
const sendCompleteLog = require("../commonComponents/sendCompleteLog");
const updateLog = require("../commonComponents/updateLog");

const getStreakCount = async (req, res) => {
  sendCompleteLog(req, res, StreakCountModel);
};

const updateStreakCount = async (req, res) => {
  const streakCountDetails = await StreakCountModel.find();
  let defaultValue = streakCountDetails[0]["_doc"];
  const { updatedOn } = defaultValue;

  const today = new Date().toLocaleDateString();

  defaultValue["activeDays"] =
    !defaultValue.onVaccation && updatedOn !== today
      ? (parseInt(defaultValue.activeDays) + 1).toString()
      : defaultValue.activeDays;

  defaultValue["totalDays"] =
    updatedOn !== today
      ? (parseInt(defaultValue.totalDays) + 1).toString()
      : defaultValue["totalDays"];

  defaultValue["updatedOn"] = new Date().toLocaleDateString();

  const { onVaccation = defaultValue.onVaccation } = req.body;

  req.params.id = defaultValue["_id"];
  updateLog(req, res, StreakCountModel, defaultValue);
};

module.exports = {
  getStreakCount,
  updateStreakCount,
};
