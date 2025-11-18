// src/routes/enrollmentRoutes.js

const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.post("/bulk", protect, isAdmin, enrollmentController.bulkEnroll);
router.post("/", protect, isAdmin, enrollmentController.enrollStudentInCourse);
router.get("/", protect, isAdmin, enrollmentController.getAllEnrollments);
router.delete(
  "/:stdId/:courseId",
  protect,
  isAdmin,
  enrollmentController.deleteEnrollment
);

module.exports = router;
