// src/features/about/components/ReviewList.js

import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './ReviewList.scss';

const Star = ({ filled }) => (
  <span className={`star ${filled ? 'filled' : ''}`}>&#9733;</span>
);

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function ReviewList({ reviews, onUpdateReview, onDeleteReview }) {
  const { user } = useAuth();
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editData, setEditData] = useState({ rating: 0, comment: '' });

  const handleEditClick = (review) => {
    setEditingReviewId(review.Review_Id);
    setEditData({ rating: review.Rating, comment: review.Comment });
  };

  const handleCancelClick = () => {
    setEditingReviewId(null);
  };

  const handleSaveClick = () => {
    onUpdateReview(editingReviewId, editData);
    setEditingReviewId(null);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<Star key={i} filled={i <= rating} />);
    }
    return stars;
  };

  if (!reviews || reviews.length === 0) {
    return <p style={{ marginTop: '24px' }}>No reviews yet. Be the first to write one!</p>;
  }

  return (
    <div className="review-list">
      {reviews.map((review) => {
        const isUserOwner = user && (user.userId === review.user_id || user.role === 'admin');
        const isEditing = editingReviewId === review.Review_Id;

        return (
          <div key={review.Review_Id} className="review-card content-panel">
            <div className="review-header">
              <div className="review-author">{review.user_id}</div>
              <div className="review-date">{formatDate(review.CreatedAt)}</div>
            </div>

            {isEditing ? (
              <div className="editing-form">
                <div className="star-rating-input">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} className={editData.rating >= star ? 'filled' : ''} onClick={() => setEditData({...editData, rating: star})}>&#9733;</span>
                  ))}
                </div>
                <textarea
                  className="form-control"
                  value={editData.comment}
                  onChange={(e) => setEditData({...editData, comment: e.target.value})}
                  rows="3"
                />
                <div className="editing-actions">
                  <button onClick={handleSaveClick} className="btn btn-primary">Save</button>
                  <button onClick={handleCancelClick} className="btn btn-secondary">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="review-stars">{renderStars(review.Rating)}</div>
                <p className="review-comment">{review.Comment}</p>
                {isUserOwner && (
                  <div className="owner-actions">
                    <button onClick={() => handleEditClick(review)} className="btn-link">Edit</button>
                    <button onClick={() => onDeleteReview(review.Review_Id)} className="btn-link btn-link-danger">Delete</button>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ReviewList;
