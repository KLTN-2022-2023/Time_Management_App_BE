const StaticValue = require("./static");
const mongoose = require("mongoose");
const moment = require("moment-timezone");

const dataSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  address: {
    required: false,
    type: String,
  },
  age: {
    required: false,
    type: Number,
  },
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  avatar: {
    required: false,
    type: String,
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

module.exports = mongoose.model("user", dataSchema);
