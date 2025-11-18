// src/features/about/components/ProfileCard.js

import React from "react";
import "./ProfileCard.scss";

/**
 * A reusable card for displaying team member or instructor profiles.
 * @param {object} props
 * @param {string} props.imageSrc - The source path for the profile image.
 * @param {string} props.name - The name of the person.
 * @param {object} props.details - An object of key-value pairs for other details (e.g., { ID: '123', Role: 'Developer' }).
 */
function ProfileCard({ imageSrc, name, details }) {
  return (
    <div className="profile-card">
      <div className="profile-card-image-container">
        <img
          src={imageSrc}
          alt={`Profile of ${name}`}
          className="profile-card-image"
        />
      </div>
      <div className="profile-card-content">
        <h4 className="profile-card-name">{name}</h4>
        <ul className="profile-card-details">
          {Object.entries(details).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProfileCard;
