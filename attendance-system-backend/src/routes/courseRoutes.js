// src/routes/courseRoutes.js

const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const lectureController = require("../controllers/lectureController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// Admin-only routes for creating and deleting scheduled courses
router.post("/", protect, isAdmin, courseController.createCourse);
router.delete("/:id", protect, isAdmin, courseController.deleteCourse);

// Routes accessible to all logged-in users (admin, faculty, student)
router.get("/", protect, courseController.getAllCourses);
router.get("/:id", protect, courseController.getCourseById);

// Routes to get related data for a specific course
router.get("/:id/students", protect, courseController.getStudentsForCourse);
router.get("/:id/lectures", protect, lectureController.getLecturesForCourse);

// Advanced routes for the attendance dashboard
router.get(
  "/:id/attendance-summary",
  protect,
  courseController.getAttendanceSummary
);
router.get(
  "/:id/attendance/:date",
  protect,
  courseController.getAttendanceForDate
);

module.exports = router;
