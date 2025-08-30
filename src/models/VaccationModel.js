const mongoose = require("mongoose");

const VaccationSchems = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: [true, "Please add name for task"],
  },
  color: {
    type: String,
    required: [true, "Please add color for task"],
  },
  border: {
    type: String,
    required: [true, "Please add color for border of task"],
  },
  priority: {
    type: Number,
    required: [true, "Please specify priority of task"],
  },
  done: {
    type: Number,
    required: [true, "Please specify the number of tasks done"],
  },
  notDone: {
    type: Number,
    required: [true, "Please specify the number of tasks not done"],
  },
  total: {
    type: Number,
    required: [true, "Please specify the total number of tasks"],
  },
  isMarkedDone: {
    type: Boolean,
    required: [true, "Please specify if the task is marked done"],
  },
  tasks: [
    {
      name: {
        type: String,
        required: [true, "Please add name for task"],
      },
      notes: {
        type: String,
        required: [true, "Please add notes for task"],
      },
      done: {
        type: Boolean,
        required: [true, "Please specify if task is done"],
      },
      canBeRepeated: {
        type: Boolean,
        required: [true, "Please specify if task can be repeated"],
      },
      priority: {
        type: Number,
        required: [true, "Please specify priority of task"],
      },
      when: {
        type: String,
        required: false,
      },
    },
  ],
});

module.exports = mongoose.model("Vaccation", VaccationSchems, "Vaccation");
