// src/routes/dashboardRoutes.js

const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

// This single route will provide statistics tailored to the role of the logged-in user.
// The 'protect' middleware ensures only authenticated users can access it.
router.get("/stats", protect, dashboardController.getStats);

module.exports = router;
