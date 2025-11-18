// src/routes/courseBlueprintRoutes.js

const express = require("express");
const router = express.Router();
const courseBlueprintController = require("../controllers/courseBlueprintController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// All routes in this file are protected and require admin privileges.

router.get("/", protect, isAdmin, courseBlueprintController.getAllBlueprints);

router.post("/", protect, isAdmin, courseBlueprintController.createBlueprint);

router.delete(
  "/:id",
  protect,
  isAdmin,
  courseBlueprintController.deleteBlueprint
);

module.exports = router;
