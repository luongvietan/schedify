// models/Employee.js
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  employeeCode: { type: String, required: true },
  name: { type: String, required: true },
  gender: { type: String, required: true },
  level: { type: Number, required: true },
  shifts: { type: Number, required: true },
  salary: { type: Number, required: true },
});

module.exports = mongoose.model("Employee", employeeSchema);
