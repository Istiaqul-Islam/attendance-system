// src/controllers/reviewController.js

const db = require("../database/connection");

exports.getReviewsSummary = (req, res) => {
  const reviewsSql = `
    SELECT 
      r.Review_Id, r.Rating, r.Comment, r.CreatedAt, u.user_id 
    FROM Reviews r
    JOIN Users u ON r.User_Id = u.user_id
    ORDER BY r.CreatedAt DESC
  `;

  const summarySql = `
    SELECT
      COUNT(*) as totalReviews, AVG(Rating) as averageRating,
      SUM(CASE WHEN Rating = 5 THEN 1 ELSE 0 END) as fiveStar,
      SUM(CASE WHEN Rating = 4 THEN 1 ELSE 0 END) as fourStar,
      SUM(CASE WHEN Rating = 3 THEN 1 ELSE 0 END) as threeStar,
      SUM(CASE WHEN Rating = 2 THEN 1 ELSE 0 END) as twoStar,
      SUM(CASE WHEN Rating = 1 THEN 1 ELSE 0 END) as oneStar
    FROM Reviews
  `;

  Promise.all([
    new Promise((resolve, reject) =>
      db.all(reviewsSql, [], (err, rows) => (err ? reject(err) : resolve(rows)))
    ),
    new Promise((resolve, reject) =>
      db.get(summarySql, [], (err, row) => (err ? reject(err) : resolve(row)))
    ),
  ])
    .then(([reviews, summary]) => {
      res.json({
        message: "Success",
        data: {
          reviews: reviews,
          summary: {
            totalReviews: summary.totalReviews || 0,
            averageRating: summary.averageRating
              ? parseFloat(summary.averageRating.toFixed(2))
              : 0,
            starCounts: {
              5: summary.fiveStar || 0,
              4: summary.fourStar || 0,
              3: summary.threeStar || 0,
              2: summary.twoStar || 0,
              1: summary.oneStar || 0,
            },
          },
        },
      });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

exports.createReview = (req, res) => {
  const { userId } = req.user;
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res
      .status(400)
      .json({ error: "A rating between 1 and 5 is required." });
  }

  const sql = "INSERT INTO Reviews (User_Id, Rating, Comment) VALUES (?, ?, ?)";
  db.run(sql, [userId, rating, comment], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE")) {
        return res
          .status(409)
          .json({ error: "You have already submitted a review." });
      }
      return res.status(500).json({ error: err.message });
    }
    res
      .status(201)
      .json({ message: "Review created successfully", id: this.lastID });
  });
};

exports.updateReview = (req, res) => {
  const { rating, comment } = req.body;
  const reviewId = req.params.id;
  const { userId, role } = req.user;

  db.get(
    "SELECT User_Id FROM Reviews WHERE Review_Id = ?",
    [reviewId],
    (err, review) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!review) return res.status(404).json({ error: "Review not found." });

      if (review.User_Id !== userId && role !== "admin") {
        return res
          .status(403)
          .json({ error: "Forbidden: You can only edit your own reviews." });
      }

      const sql =
        "UPDATE Reviews SET Rating = ?, Comment = ? WHERE Review_Id = ?";
      db.run(sql, [rating, comment, reviewId], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Review updated successfully." });
      });
    }
  );
};

exports.deleteReview = (req, res) => {
  const reviewId = req.params.id;
  const { userId, role } = req.user;

  db.get(
    "SELECT User_Id FROM Reviews WHERE Review_Id = ?",
    [reviewId],
    (err, review) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!review) return res.status(404).json({ error: "Review not found." });

      if (review.User_Id !== userId && role !== "admin") {
        return res
          .status(403)
          .json({ error: "Forbidden: You can only delete your own reviews." });
      }

      const sql = "DELETE FROM Reviews WHERE Review_Id = ?";
      db.run(sql, [reviewId], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Review deleted successfully." });
      });
    }
  );
};
