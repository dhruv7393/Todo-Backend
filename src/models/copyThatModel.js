const mongoose = require("mongoose");

const CopyThatSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  taskName: {
    type: String,
    required: [true, "Please add name of task"],
  },
  taskDetail: {
    type: String,
    required: [false, "Please add task details"],
  },
  importance: {
    type: Number,
    required: [true, "Please add importance"],
  },
  updatedOn: {
    type: String,
    required: [true, "Please add updatedOn"],
  },
  canBeCounted: {
    type: Boolean,
    required: [false, "Please add if can be counted"],
  },
  count: {
    type: Number,
    required: [false, "Please add counts"],
  },
  canBeRepeated: {
    type: Boolean,
    required: [false, "Please add if task can be repeated"],
  },
  repeatOn: {
    type: [String],
    required: [false, "Please add if task can be repeated"],
  },
  pinned: {
    type: Boolean,
    required: [false, "Please add if task is pinned"],
  },
  repeatAfter: {
    type: Number,
    required: [false, "Please add days after which you need to be reminded"],
  },
  done: {
    type: Boolean,
    required: [false, "Please add if task is done"],
  },
  pinned: {
    type: Boolean,
    required: [false, "Please add if task is pinned"],
  },
  setForLater: {
    type: Boolean,
    required: [false, "Please add if task is set for later"],
  },
});

module.exports = mongoose.model("CopyThat", CopyThatSchema, "CopyThat");
