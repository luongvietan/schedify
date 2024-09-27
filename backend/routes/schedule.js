const express = require("express");
const router = express.Router();
const Schedule = require("../models/schedule");

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

module.exports = router;
