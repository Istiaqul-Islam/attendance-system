// src/routes/authRoutes.js

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Route for user login. It's a POST request because the user is sending credentials.
// This route is public and does not use the 'protect' middleware.
router.post("/login", authController.login);

module.exports = router;
