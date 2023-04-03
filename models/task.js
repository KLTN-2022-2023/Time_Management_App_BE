const StaticValue = require("./static");
const mongoose = require("mongoose");
const moment = require("moment-timezone");

const dataSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  userId: {
    required: true,
    type: String,
  },
  parentId: {
    required: false,
    type: String,
    default: null,
  },
  description: {
    required: false,
    type: String,
    default: null,
  },
  files: {
    required: false,
    type: [
      {
        name: String,
        type: String,
        url: String,
      },
    ],
  },
  isImportant: {
    required: true,
    type: Boolean,
    default: false,
  },
  status: {
    require: true,
    type: String,
    default: StaticValue.TASK_STATUS_NEW,
  },
  // Date Time
  startTime: {
    required: false,
    type: String,
    default: moment(Date.now()).format(StaticValue.TIME_FORMAT),
  },
  dueTime: {
    required: false,
    type: String,
    default: moment(Date.now()).format(StaticValue.TIME_FORMAT),
  },
  remindTime: {
    required: false,
    type: String,
    default: null,
  },
  repeatTime: {
    required: false,
    type: String,
    default: null,
  },
  //Default
  createdDate: {
    required: false,
    type: String,
    default: moment(Date.now()).format(StaticValue.TIME_FORMAT),
  },
  updatedDate: {
    required: false,
    type: String,
    default: null,
  },
  isDeleted: {
    required: false,
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("task", dataSchema);
