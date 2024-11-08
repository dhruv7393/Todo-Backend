/*
    @desc Add entry to table
*/

const mongoose = require("mongoose");

const updateLog = async (req, res, model, defaultValue) => {
  try {
    const { id } = req.params;
    if (await model.findById(id)) {
      const result = await model.findByIdAndUpdate(id, {
        ...defaultValue,
        ...req.body,
      });
      const newResult = await model.findById(id)
      res.status(200).json(newResult);
    } else {
      res
        .status(400)
        .json("The requested Id " + id + " to be updated could not be found");
    }
  } catch (e) {
    res
      .status(400)
      .json("Could not add entry to table. Please find detailed error - ", e);
  }
};

module.exports = updateLog;
