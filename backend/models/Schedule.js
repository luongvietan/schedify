const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
  employeeCode: {
    type: String,
    required: true,
  },
});

const daySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  shifts: {
    Ca1: [shiftSchema],
    Ca2: [shiftSchema],
    Ca3: [shiftSchema],
  },
});

const scheduleSchema = new mongoose.Schema({
  week: {
    type: Number,
    required: true,
  },
  days: [daySchema],
});

module.exports = mongoose.model("Schedule", scheduleSchema);
