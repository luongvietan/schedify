// routes/employee.js
const express = require("express");
const Employee = require("../models/Employee");
const router = express.Router();

// Lấy danh sách nhân viên
router.get("/", async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});
/// Lấy thông tin nhân viên theo ID
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
  const newEmployee = new Employee(req.body);
  await newEmployee.save();
  res.status(201).json(newEmployee);
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

// Sửa thông tin nhân viên
// Sửa thông tin nhân viên
router.put("/:employeeCode", async (req, res) => {
  try {
    const employeeCode = req.params.employeeCode;
    const updatedEmployee = await Employee.findOneAndUpdate(
      { employeeCode }, // Tìm theo employeeCode
      req.body,
      { new: true, runValidators: true } // Trả về đối tượng mới và kiểm tra dữ liệu
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
