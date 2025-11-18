// src/features/dashboard/StudentDashboard.js

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/ui/StatCard";
import "./StudentDashboard.scss";

function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await axios.get(
        "http://localhost:3001/api/dashboard/stats"
      );
      setStats(response.data.data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
      setError("Could not load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const renderAdminDashboard = () => (
    <>
      <div className="dashboard-header">
        <h2>Admin Home Page</h2>
        <p>
          Welcome to the Admin Dashboard. Manage the system, oversee users, and
          monitor all academic activities.
        </p>
      </div>
      <div className="stats-grid">
        <StatCard title="Total Students" value={stats.totalStudents} />
        <StatCard title="Total Faculty" value={stats.totalFaculty} />
        <StatCard title="Total Departments" value={stats.totalDepartments} />
        <StatCard title="Total Courses" value={stats.totalCourses} />
      </div>
    </>
  );

  const renderFacultyDashboard = () => (
    <>
      <div className="dashboard-header">
        <h2>Faculty Home Page</h2>
        {/* Use user.name for the personalized message */}
        <p>
          Welcome, {user?.name}! Your class management dashboard awaits. Get
          started by selecting a course to take attendance or review student
          progress.
        </p>
      </div>
      <div className="stats-grid">
        <StatCard title="Assigned Courses" value={stats.totalCourses} />
        <StatCard title="Total Students" value={stats.totalStudents} />
      </div>
    </>
  );

  const renderStudentDashboard = () => (
    <>
      <div className="dashboard-header">
        <h2>Student Home Page</h2>
        {/* Use user.name for the personalized message */}
        <p>
          Hello, {user?.name}! Track your academic progress instantly. View your
          current attendance status and class schedule below.
        </p>
      </div>
      <div className="stats-grid">
        <StatCard title="Enrolled Courses" value={stats.totalCourses} />
        <StatCard title="Total Classes" value={stats.totalClasses} />
        <StatCard title="Classes Present" value={stats.totalPresent} />
        <StatCard title="Attendance" value={`${stats.percentage}%`} />
      </div>
    </>
  );

  const renderDashboardContent = () => {
    if (isLoading) return <p>Loading dashboard...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!stats) return <p>No data to display.</p>;

    switch (user.role) {
      case "admin":
        return renderAdminDashboard();
      case "faculty":
        return renderFacultyDashboard();
      case "student":
        return renderStudentDashboard();
      default:
        return <p>Welcome to the dashboard.</p>;
    }
  };

  return <div>{renderDashboardContent()}</div>;
}

export default StudentDashboard;
