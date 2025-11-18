// src/features/about/AboutPage.js

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { useModal } from "../../context/ModalContext";

import "./AboutPage.scss";

// Import all child components
import RatingSummary from "./components/RatingSummary";
import ReviewList from "./components/ReviewList";
import WriteReview from "./components/WriteReview";
import ProfileCard from "./components/ProfileCard";

// Import placeholder images
import facultyPlaceholder from "../../assets/images/placeholder-faculty.png";
import studentPlaceholder from "../../assets/images/placeholder-student.png";
import studentPlaceholder2 from "../../assets/images/placeholder-student-2.png";
import studentPlaceholder3 from "../../assets/images/placeholder-student-3.png";

function AboutPage() {
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();
  const { showModal } = useModal();

  const [isLoading, setIsLoading] = useState(true);
  const [reviewData, setReviewData] = useState({
    reviews: [],
    summary: null,
  });

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:3001/api/reviews");
      setReviewData(res.data.data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      showNotification("Could not load review data.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleReviewSubmit = async ({ rating, comment }) => {
    try {
      await axios.post("http://localhost:3001/api/reviews", {
        rating,
        comment,
      });
      showNotification("Your review has been submitted!", "success");
      fetchData();
    } catch (error) {
      console.error("Failed to submit review:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to submit review.";
      showNotification(errorMessage, "error");
    }
  };

  const handleDeleteReview = (reviewId) => {
    showModal({
      title: "Delete Review?",
      message: "Are you sure you want to permanently delete this review?",
      onConfirm: async () => {
        try {
          await axios.delete(`http://localhost:3001/api/reviews/${reviewId}`);
          showNotification("Review deleted.", "success");
          fetchData();
        } catch (error) {
          console.error("Failed to delete review:", error);
          showNotification(
            error.response?.data?.error || "Failed to delete review.",
            "error"
          );
        }
      },
    });
  };

  const handleUpdateReview = async (reviewId, updatedData) => {
    try {
      await axios.put(
        `http://localhost:3001/api/reviews/${reviewId}`,
        updatedData
      );
      showNotification("Review updated.", "success");
      fetchData();
    } catch (error) {
      console.error("Failed to update review:", error);
      showNotification(
        error.response?.data?.error || "Failed to update review.",
        "error"
      );
    }
  };

  return (
    <div className="about-page-layout">
      <div className="about-section content-panel">
        <h2>About Our Site</h2>
        <p>
          This website is an Attendance Management System designed to take,
          view, and track attendance. It was developed as a semester project for
          the Database Management System Lab.
        </p>
      </div>

      <div className="about-section">
        <h2>Guidance and Acknowledgments</h2>
        <ProfileCard
          imageSrc={facultyPlaceholder}
          name="Tasmin Akther"
          details={{
            Role: "Lecturer, Instructor",
            Department: "Computer Science and Engineering",
          }}
        />
      </div>

      <div className="about-section">
        <h2>The Development Team</h2>
        <div className="team-grid">
          <ProfileCard
            imageSrc={studentPlaceholder}
            name="Md. Istiaqul Islam"
            details={{
              ID: "CSE 031 08169",
              Department: "BSc in CSE",
              Role: "Developer & Designer",
            }}
          />
          <ProfileCard
            imageSrc={studentPlaceholder2}
            name="Afia Hossen"
            details={{
              ID: "CSE 031 08142",
              Department: "BSc in CSE",
              Role: "Developer & Designer",
            }}
          />
          <ProfileCard
            imageSrc={studentPlaceholder3}
            name="Oishee Chakraborti"
            details={{
              ID: "CSE 031 08173",
              Department: "BSc in CSE",
              Role: "Developer & Designer",
            }}
          />
        </div>
      </div>

      <div className="about-section content-panel">
        <h2>Our Location</h2>
        <div className="map-container">
          <p>9R55+PP8, S Khulshi Rd, Chattogram</p>
          <div className="map-embed">
            <iframe
              title="Port City International University Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3689.858782352125!2d91.8074513759837!3d22.358935142171587!2m3!1f0!2f0!3f0!3m2!i1024!i768!4f13.1!3m3!1m2!1s0x30acd97f972c9cbf%3A0x8fe976105b47e2f0!2sPort%20City%20International%20University!5e0!3m2!1sen!2sbd!4v1676885542841!5m2!1sen!2sbd"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      <div className="about-section review-section">
        <h2>Reviews & Ratings</h2>
        {isLoading ? (
          <p>Loading reviews...</p>
        ) : (
          <>
            <RatingSummary summary={reviewData.summary} />
            {isAuthenticated && (
              <WriteReview onReviewSubmit={handleReviewSubmit} />
            )}
            <ReviewList
              reviews={reviewData.reviews}
              onUpdateReview={handleUpdateReview}
              onDeleteReview={handleDeleteReview}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default AboutPage;
