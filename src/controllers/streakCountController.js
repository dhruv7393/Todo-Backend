const mongoose = require("mongoose");

const StreakCountModel = require("../models/streakCountModel");
const sendCompleteLog = require("../commonComponents/sendCompleteLog");
const updateLog = require("../commonComponents/updateLog");

const getStreakCount = async (req, res) => {
  sendCompleteLog(req, res, StreakCountModel);
};

const updateSincerityCount = async (req, res) => {
  const streakCountDetails = await StreakCountModel.find();
  let streak = streakCountDetails[0]["_doc"];
  streak.sincerity[req.params.id] += 1;
  const resultStreak = await StreakCountModel.findByIdAndUpdate(
    streak._id,
    streak
  );
  sendCompleteLog(req, res, StreakCountModel);
};

module.exports = {
  getStreakCount,
  updateSincerityCount,
};
