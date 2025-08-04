const mongoose = require("mongoose");

const VaccationSchems = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  taskName: {
    type: String,
    required: [true, "Please add name for task"],
  },
  isDone: {
    type: Boolean,
    required: [true, "Please specify if the task is done"],
  },
  carryyOutOn: {
    type: String,
    required: [
      true,
      "Please add when task needs to be carried out - date / day of week /  after certain days / specific date of every month",
    ],
  },
  dateOfCarryOut: {
    type: Date,
    required: [true, "Please add when task needs to be carried out"],
  },
  canBeReseted: {
    type: Boolean,
    required: [true, "Please specify if the task can be reset"],
  },
  listOfSubTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vaccation",
      required: [false, "Please add subtasks for the task"],
    },
  ],
});

module.exports = mongoose.model("Vaccation", VaccationSchems, "Vaccation");
