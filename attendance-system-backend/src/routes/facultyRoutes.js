// src/routes/facultyRoutes.js

const express = require("express");
const router = express.Router();
const facultyController = require("../controllers/facultyController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// All routes in this file are protected and require admin privileges.

router.get("/", protect, isAdmin, facultyController.getAllFaculty);

router.post("/", protect, isAdmin, facultyController.createFaculty);

router.get("/:id", protect, isAdmin, facultyController.getFacultyById);

router.put("/:id", protect, isAdmin, facultyController.updateFaculty);

router.delete("/:id", protect, isAdmin, facultyController.deleteFaculty);

module.exports = router;
