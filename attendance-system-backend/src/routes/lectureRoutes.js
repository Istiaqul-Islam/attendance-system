// src/routes/lectureRoutes.js

const express = require("express");
const router = express.Router();
const lectureController = require("../controllers/lectureController");
const attendanceController = require("../controllers/attendanceController");
const {
  protect,
  isAdmin,
  isAdminOrFaculty,
} = require("../middleware/authMiddleware");

// Admins or Faculty can create a lecture (e.g., when taking attendance for a new day)
router.post("/", protect, isAdminOrFaculty, lectureController.createLecture);

// Admins or Faculty can update lecture details
router.put("/:id", protect, isAdminOrFaculty, lectureController.updateLecture);

// Any logged-in user can view details of a specific lecture
router.get("/:id", protect, lectureController.getLectureById);

// Any logged-in user can view the attendance for a specific lecture
router.get(
  "/:id/attendance",
  protect,
  attendanceController.getAttendanceForLecture
);

module.exports = router;
