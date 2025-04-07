const mongoose = require("mongoose");

const TasksSchems = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  key: { type: mongoose.Schema.Types.ObjectId },
  label: {
    type: String,
    required: [true, "Please add name for task"],
  },
  type: {
    type: String,
    required: [true, "Please add type for task"],
  },
  items: {
    type: [String],
    required: [true, "Please add subtasks"],
  },
  checked: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, "Please add subtasks"],
  },
  imp: {
    type: Number,
    required: [true, "Please add how critical task is"],
  },
  noDelete: {
    type: Boolean,
    required: [true, "Please add if task can be deleted fom ui"],
  },
  repeatOn: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, "Please add when task needs to be repeated"],
  },
  reset: {
    type: Boolean,
    required: [true, "Please add if task needs to be reseted on repeat"],
  },
});

module.exports = mongoose.model("Tasks", TasksSchems, "Tasks");
