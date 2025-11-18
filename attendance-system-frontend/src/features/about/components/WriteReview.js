// src/features/about/components/WriteReview.js

import React, { useState } from 'react';
import './WriteReview.scss';

function WriteReview({ onReviewSubmit }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;

    // Pass the state up to the parent component to handle the submission
    onReviewSubmit({ rating, comment });

    // Reset the form
    setRating(0);
    setComment('');
  };

  return (
    <div className="write-review-container content-panel">
      <h4>Write a review</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Your Rating</label>
          <div className="star-rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={hoverRating >= star || rating >= star ? 'filled' : ''}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                &#9733;
              </span>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="review-comment" className="form-label">Your Comment</label>
          <textarea
            id="review-comment"
            className="form-control"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share details of your own experience at this place"
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary" disabled={rating === 0}>
          Submit Review
        </button>
      </form>
    </div>
  );
}

export default WriteReview;
