const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const employeeRoutes = require("./routes/employee");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

// Kết nối đến MongoDB
mongoose
  .connect("mongodb://localhost:27017/schedify")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Middleware để phân tích cú pháp JSON
app.use(bodyParser.json());

// Định tuyến cho API nhân viên
app.use("/api/employees", employeeRoutes);

// Route trang chủ
app.get("/", (req, res) => {
  res.send("Welcome to the Schedify API!");
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
