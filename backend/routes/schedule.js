const express = require("express");
const router = express.Router();
const Schedule = require("../models/Schedule");

// Lấy danh sách lịch
router.get("/", async (req, res) => {
  const schedule = await Schedule.find();
  res.json(schedule);
});

// Thêm lịch làm việc mới
router.post("/", async (req, res) => {
  const schedule = new Schedule({
    week: req.body.week,
    days: req.body.days,
  });

  try {
    const newSchedule = await schedule.save();
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Lấy lịch làm việc theo tuần
router.get("/week/:week", async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ week: req.params.week });
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cập nhật lịch làm việc
router.put("/update", async (req, res) => {
  const { employeeId, day, shift, week } = req.body;

  console.log("Received update request:", req.body);

  try {
    const schedule = await Schedule.findOne({ week });
    if (!schedule) {
      console.log("Schedule not found for week:", week);
      return res.status(404).json({ message: "Schedule not found" });
    }

    // Tìm và cập nhật lịch làm việc cho nhân viên cụ thể
    const daySchedule = schedule.days.find((d) => d.date === day);
    if (daySchedule) {
      if (!daySchedule.shifts[shift]) {
        daySchedule.shifts[shift] = [];
      }
      const employeeIndex = daySchedule.shifts[shift].findIndex(
        (e) => e.employeeId === employeeId
      );
      if (employeeIndex === -1) {
        daySchedule.shifts[shift].push({ employeeId });
      }
    } else {
      schedule.days.push({
        date: day,
        shifts: { [shift]: [{ employeeId }] },
      });
    }

    // Đảm bảo rằng employeeCode được cung cấp
    if (!schedule.days[7].shifts.Ca1[0].employeeCode) {
      return res
        .status(400)
        .json({ error: "employeeCode is required for shift Ca1 on day 7" });
    }

    // Lưu lịch trình
    schedule.save((err) => {
      if (err) {
        console.error("Error updating schedule:", err);
        return res.status(500).json({ error: "Error updating schedule" });
      }
      res.status(200).json({ message: "Schedule updated successfully" });
    });
  } catch (error) {
    console.error("Error updating schedule:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
