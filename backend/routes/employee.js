const express = require("express");
const Employee = require("../models/Employee");
const router = express.Router();

// Tính lương dựa trên level và số shifts
const calculateSalary = (level, shifts) => {
  const rates = { 1: 110000, 2: 125000, 3: 150000 };
  return rates[level] * shifts;
};

// Lấy danh sách nhân viên
router.get("/", async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

// Lấy thông tin nhân viên theo ID
router.get("/:employeeCode", async (req, res) => {
  try {
    const employeeCode = req.params.employeeCode;
    const employee = await Employee.findOne({ employeeCode });
    if (!employee) {
      res.status(404).json({ message: "Nhân viên không tồn tại" });
    } else {
      res.json(employee);
    }
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin nhân viên" });
  }
});

// Thêm nhân viên mới
router.post("/", async (req, res) => {
  try {
    const { level, shifts } = req.body;
    const salary = calculateSalary(level, shifts); // Tính lương
    const newEmployee = new Employee({ ...req.body, salary });
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi thêm nhân viên" });
  }
});

// Xóa nhân viên
router.delete("/:employeeCode", async (req, res) => {
  try {
    const employeeCode = req.params.employeeCode;
    await Employee.findOneAndDelete({ employeeCode });
    res.status(200).json({ message: "Nhân viên đã được xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xóa nhân viên" });
  }
});

// Reset tháng làm việc
router.put("/reset", async (req, res) => {
  try {
    await Employee.updateMany({}, { $set: { shifts: 0, salary: 0 } });
    res.status(200).send({ message: "Employees reset successfully." });
  } catch (error) {
    res.status(500).send({ message: "Error resetting employees.", error });
  }
});

// Sửa thông tin nhân viên
router.put("/:employeeCode", async (req, res) => {
  try {
    const { level, shifts } = req.body;
    const salary = calculateSalary(level, shifts); // Tính lương
    const updatedEmployee = await Employee.findOneAndUpdate(
      { employeeCode: req.params.employeeCode },
      { ...req.body, salary }, // Cập nhật salary
      { new: true, runValidators: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Nhân viên không tồn tại" });
    }
    res.status(200).json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi sửa thông tin nhân viên" });
  }
});

module.exports = router;
