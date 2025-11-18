// src/features/about/components/RatingSummary.js

import React from 'react';
import './RatingSummary.scss';

const Star = ({ filled }) => (
  <span className={`star ${filled ? 'filled' : ''}`}>&#9733;</span>
);

function RatingSummary({ summary }) {
  // If the summary data hasn't loaded yet, use default placeholder data to prevent errors.
  const safeSummary = summary || {
    averageRating: 0,
    totalReviews: 0,
    starCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  };

  const { averageRating, totalReviews, starCounts } = safeSummary;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<Star key={i} filled={i <= Math.round(rating)} />);
    }
    return stars;
  };

  return (
    <div className="rating-summary-container content-panel">
      <div className="summary-overview">
        <div className="average-rating">{averageRating.toFixed(1)}</div>
        <div className="stars-display">{renderStars(averageRating)}</div>
        <div className="total-reviews">{totalReviews} reviews</div>
      </div>

      <div className="summary-bars">
        {[5, 4, 3, 2, 1].map((star) => (
          <div className="bar-row" key={star}>
            <div className="bar-label">{star}</div>
            <div className="bar-wrapper">
              <div
                className="bar-fill"
                style={{ width: totalReviews > 0 ? `${(starCounts[star] / totalReviews) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RatingSummary;
