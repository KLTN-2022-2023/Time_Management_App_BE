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
  phone: {
    required: true,
    type: String
  },
  age: {
    required: false,
    type: Number,
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

module.exports = mongoose.model("user", dataSchema);
