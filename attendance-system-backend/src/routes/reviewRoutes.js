// src/routes/reviewRoutes.js

const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

// GET /api/reviews - Get all reviews and the summary data
// This is a public route, anyone can see the reviews.
router.get("/", reviewController.getReviewsSummary);

// POST /api/reviews - Create a new review
// This is a protected route. Only logged-in users can post a review.
router.post("/", protect, reviewController.createReview);

// PUT /api/reviews/:id - Update a specific review (Protected)
router.put("/:id", protect, reviewController.updateReview);

// DELETE /api/reviews/:id - Delete a specific review (Protected)
router.delete("/:id", protect, reviewController.deleteReview);

module.exports = router;
