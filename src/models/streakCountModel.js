const mongoose = require("mongoose");

const StreakCountSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  updatedOn: {
    type: String,
    required: [true, "Please add a started from"],
  },
  activeSince: {
    type: String,
    required: [true, "Please add wether you are on vaccation or not"],
  },
  onVaccation: {
    type: Boolean,
    required: [true, "Please add number of vaccation days"],
  },
  activeDays: {
    type: Number,
    required: [true, "Please add a started from"],
  },
  weekDays: {
    type: Number,
    required: [true, "Please add a started from"],
  },
  sincerity: {
    type: Object,
    required: [true, "Please add a started from"],
  },
});

module.exports = mongoose.model(
  "StreakCount",
  StreakCountSchema,
  "StreakCount"
);
