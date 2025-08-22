const VaccationModel = require("../models/VaccationModel");
const { sortToDos } = require("dhruvtodo");

const getAllVaccationTasks = async (req, res) => {
  try {
    const logs = await VaccationModel.find();
    const logsCopy = JSON.parse(JSON.stringify(logs));
    res.status(200).json(sortToDos(logsCopy));
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
