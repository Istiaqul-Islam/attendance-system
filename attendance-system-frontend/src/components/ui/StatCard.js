// src/components/ui/StatCard.js

import React from "react";
import "./StatCard.scss";

/**
 * A reusable card component for displaying a key statistic.
 * @param {object} props
 * @param {string} props.title - The label for the statistic (e.g., "Total Students").
 * @param {string|number} props.value - The value of the statistic (e.g., 40).
 * @param {string} [props.className] - Optional additional class for custom styling.
 */
function StatCard({ title, value, className }) {
  return (
    <div className={`stat-card ${className || ""}`}>
      <h3 className="stat-card-title">{title}</h3>
      <p className="stat-card-value">{value}</p>
    </div>
  );
}

export default StatCard;
