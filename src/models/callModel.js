const mongoose = require("mongoose");

const CallSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: [true, "Please add a text value"],
  },
  done: {
    type: Boolean,
    required: [false, "Please let me know wether you called"],
  },
});

module.exports = mongoose.model("Call", CallSchema, "Call");
