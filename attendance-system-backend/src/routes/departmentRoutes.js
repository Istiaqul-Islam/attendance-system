// src/routes/departmentRoutes.js

const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/departmentController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// All routes in this file are protected and require admin privileges.

router.get("/", protect, isAdmin, departmentController.getAllDepartments);

router.post("/", protect, isAdmin, departmentController.createDepartment);

router.delete("/:id", protect, isAdmin, departmentController.deleteDepartment);

module.exports = router;
