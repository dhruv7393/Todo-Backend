const mongoose = require("mongoose");

const StreakCountModel = require("../models/streakCountModel");
const sendCompleteLog = require("../commonComponents/sendCompleteLog");
const updateLog = require("../commonComponents/updateLog");

const getStreakCount = async (req, res) => {
  sendCompleteLog(req, res, StreakCountModel);
};

module.exports = {
  getStreakCount,
};
