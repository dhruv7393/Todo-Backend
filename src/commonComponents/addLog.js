/*
    @desc Add entry to table
*/

const mongoose = require("mongoose");

const addLog = async (req, res, model, defaultValue) => {
  try {
    const valueToBeAdded = {
      _id: new mongoose.Types.ObjectId(),
      ...defaultValue,
      ...req.body,
    }
    const result = await model.create(valueToBeAdded);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json("Could not add entry to table. Please find detailed error - ", e);
  }
};

module.exports = addLog;
