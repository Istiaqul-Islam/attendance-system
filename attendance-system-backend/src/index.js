// src/index.js

require("dotenv").config();

// --- IMPORTS ---
const express = require("express");
const cors = require("cors");
const db = require("./database/connection");

// Import all the route handlers
const authRoutes = require("./routes/authRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const studentRoutes = require("./routes/studentRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const courseBlueprintRoutes = require("./routes/courseBlueprintRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const lectureRoutes = require("./routes/lectureRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// --- SETUP & CONFIGURATION ---
const PORT = process.env.PORT || 3001;
const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- API ROUTES ---
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Attendance Management System API!" });
});

app.use("/api/auth", authRoutes);

// New dashboard route
app.use("/api/dashboard", dashboardRoutes);

// Entity management routes
app.use("/api/departments", departmentRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/course-blueprints", courseBlueprintRoutes);
app.use("/api/courses", courseRoutes);

// Relationship and core logic routes
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/reviews", reviewRoutes);

// --- SERVER INITIALIZATION ---
app.listen(PORT, () => {
  console.log(`Server is running and listening on http://localhost:${PORT}`);
});
