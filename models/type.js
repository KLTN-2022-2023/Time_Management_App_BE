const StaticValue = require("./static");
const mongoose = require("mongoose");
const moment = require("moment-timezone");

// moment.tz.setDefault("Asia/Ho_Chi_Minh");

const dataSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  description: {
    required: false,
    type: String,
    default: null,
  },
  userId: {
    require: true,
    type: String,
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

module.exports = mongoose.model("type", dataSchema);
