// src/routes/attendanceRoutes.js

const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const { protect, isAdminOrFaculty } = require("../middleware/authMiddleware");

// This route records a new set of attendance data.
router.post(
  "/",
  protect,
  isAdminOrFaculty,
  attendanceController.recordAttendance
);

// This is the primary route used by the frontend. It replaces all attendance for a lecture.
router.post(
  "/replace",
  protect,
  isAdminOrFaculty,
  attendanceController.replaceAttendance
);

module.exports = router;
