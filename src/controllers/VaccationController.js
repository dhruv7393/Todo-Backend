const mongoose = require("mongoose");
const VaccationModel = require("../models/VaccationModel");
const sendCompleteLog = require("../commonComponents/sendCompleteLog");
const mongoose = require("mongoose");

const getAllVaccationTasks = async (req, res) => {
  try {
    const logs = await model.find();
    res.status(200).json(logs);
  } catch (e) {
    res.status(500).json({
      error: "Requested data is not available",
      message: e.message || "Internal server error",
      details: e,
    });
  }
};

module.exports = {
  getAllVaccationTasks,
};
