// routes/employee.js
const express = require("express");
const Employee = require("../models/Employee");
const router = express.Router();

// Lấy danh sách nhân viên
router.get("/", async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

// Thêm nhân viên mới
router.post("/", async (req, res) => {
  const newEmployee = new Employee(req.body);
  await newEmployee.save();
  res.status(201).json(newEmployee);
});

module.exports = router;
