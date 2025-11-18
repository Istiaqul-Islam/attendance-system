// src/features/courses/components/StudentCoursesView.js

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import StatCard from "../../../components/ui/StatCard";
import CustomScrollableDropdown from "../../../components/ui/CustomScrollableDropdown";

function StudentCoursesView({ courses }) {
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (courses && courses.length > 0) {
      setSelectedCourseId(courses[0].Course_Id);
    }
  }, [courses]);

  const fetchCourseStats = useCallback(async () => {
    if (!selectedCourseId) return;
    try {
      setIsLoading(true);
      setError("");
      const response = await axios.get(
        `http://localhost:3001/api/students/course-stats/${selectedCourseId}`
      );
      setStats(response.data.data);
    } catch (err) {
      console.error("Failed to fetch course stats:", err);
      setError("Could not load summary for this course.");
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    fetchCourseStats();
  }, [fetchCourseStats]);

  if (!courses || courses.length === 0) {
    return <p>You are not enrolled in any courses.</p>;
  }

  const courseOptions = courses.map((course) => ({
    value: course.Course_Id,
    label: `${course.Course_Code}: ${course.Course_Title}`,
  }));

  return (
    <div>
      <div className="content-panel filter-panel" style={{ maxWidth: "600px" }}>
        <label htmlFor="course-select" className="form-label">
          View Attendance Summary for:
        </label>
        <CustomScrollableDropdown
          options={courseOptions}
          value={selectedCourseId}
          onChange={setSelectedCourseId}
          placeholder="-- Select a Course --"
        />
      </div>

      <div className="course-stats-container">
        {isLoading && <p>Loading summary...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {stats && !isLoading && !error && (
          <div className="stats-grid">
            <StatCard title="Total Classes" value={stats.totalClasses} />
            <StatCard title="Classes Present" value={stats.presentCount} />
            <StatCard title="Attendance" value={`${stats.percentage}%`} />
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentCoursesView;
