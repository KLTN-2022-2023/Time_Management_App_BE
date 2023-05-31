const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  userId: {
    required: true,
    type: String,
  },
  taskId: {
    required: true,
    type: String,
  },
  title: {
    required: false,
    type: String,
    default: null,
  },
  content: {
    required: false,
    type: String,
    default: null,
  },
  isSeen: {
    required: true,
    type: Boolean,
    default: false,
  },
  // Date Time
  remindTime: {
    required: false,
    type: Date,
    default: null,
  },
  //Default
  createdDate: {
    required: false,
    type: Date,
    default: null,
  },
  updatedDate: {
    required: false,
    type: Date,
    default: null,
  },
  isDeleted: {
    required: false,
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("notification", dataSchema);
