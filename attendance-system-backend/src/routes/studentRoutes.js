// src/routes/studentRoutes.js

const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// All routes in this file are protected and require admin privileges...
// ...except for the new course-stats route which is for students.

router.get("/", protect, isAdmin, studentController.getAllStudents);

router.post("/", protect, isAdmin, studentController.createStudent);

router.get("/:id", protect, isAdmin, studentController.getStudentById);

// This route is for logged-in students to get their own stats for a specific course.
router.get(
  "/course-stats/:courseId",
  protect,
  studentController.getStudentCourseStats
);

router.put("/:id", protect, isAdmin, studentController.updateStudent);

router.delete("/:id", protect, isAdmin, studentController.deleteStudent);

module.exports = router;
