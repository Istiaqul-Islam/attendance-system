// src/features/courses/CoursesPage.js

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import CreateCourseForm from "./components/CreateCourseForm";
import CourseList from "./components/CourseList";
import StudentCoursesView from "./components/StudentCoursesView";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { useModal } from "../../context/ModalContext";
import "./CoursesPage.scss";

// Helper function to format the term string
const formatTerm = (year, semester) => {
  if (!year || !semester) return "Invalid Term";
  const yearSuffix =
    year === 1 ? "st" : year === 2 ? "nd" : year === 3 ? "rd" : "th";

  // Logic for 1st, 2nd, 3rd... 4th, 5th, etc.
  const semSuffix =
    semester === 1
      ? "st"
      : semester === 2
      ? "nd"
      : semester === 3
      ? "rd"
      : "th";
  return `${year}${yearSuffix} Year, ${semester}${semSuffix} Semester`;
};

function CoursesPage() {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const { showModal } = useModal();

  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState("all");

  const [blueprints, setBlueprints] = useState([]);
  const [faculty, setFaculty] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const coursesRes = await axios.get("http://localhost:3001/api/courses");
      setAllCourses(coursesRes.data.data);
      setFilteredCourses(coursesRes.data.data);

      if (user?.role === "admin") {
        const [blueprintsRes, facultyRes] = await Promise.all([
          axios.get("http://localhost:3001/api/course-blueprints"),
          axios.get("http://localhost:3001/api/faculty"),
        ]);
        setBlueprints(blueprintsRes.data.data);
        setFaculty(facultyRes.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      showNotification("Could not load course data.", "error");
    }
  }, [user, showNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (selectedTerm === "all") {
      setFilteredCourses(allCourses);
    } else {
      const filtered = allCourses.filter(
        (course) =>
          formatTerm(course.Academic_Year, course.Semester_No) === selectedTerm
      );
      setFilteredCourses(filtered);
    }
  }, [selectedTerm, allCourses]);

  const availableTerms = useMemo(() => {
    const terms = allCourses.map((course) =>
      formatTerm(course.Academic_Year, course.Semester_No)
    );
    return [...new Set(terms)];
  }, [allCourses]);

  const handleDelete = (id) => {
    const confirmDelete = async () => {
      try {
        await axios.delete(`http://localhost:3001/api/courses/${id}`);
        fetchData();
        showNotification("Course deleted successfully.", "success");
      } catch (error) {
        console.error("Failed to delete course:", error);
        showNotification("Failed to delete course.", "error");
      }
    };

    showModal({
      title: "Delete Scheduled Course?",
      message:
        "Are you sure? Deleting this course will also delete its lectures and student enrollments.",
      onConfirm: confirmDelete,
    });
  };

  const renderContentForRole = () => {
    if (user?.role === "student") {
      return <StudentCoursesView courses={allCourses} />;
    } else {
      return (
        <>
          {user?.role === "admin" && (
            <div className="content-panel">
              <CreateCourseForm
                blueprints={blueprints}
                faculty={faculty}
                onCourseCreated={fetchData}
              />
            </div>
          )}
          {user?.role === "faculty" && availableTerms.length > 0 && (
            <div className="content-panel filter-panel">
              <label htmlFor="term-filter" className="form-label">
                Filter by Term:
              </label>
              <select
                id="term-filter"
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="form-control"
              >
                <option value="all">Show All Terms</option>
                {availableTerms.map((term) => (
                  <option key={term} value={term}>
                    {term}
                  </option>
                ))}
              </select>
            </div>
          )}
          <CourseList
            courses={filteredCourses}
            onDelete={handleDelete}
            user={user}
          />
        </>
      );
    }
  };

  return (
    <div>
      <h2>
        {user?.role === "admin" && "Manage Scheduled Courses"}
        {user?.role === "faculty" && "My Courses"}
        {user?.role === "student" && "My Course Summaries"}
      </h2>

      {renderContentForRole()}
    </div>
  );
}

export default CoursesPage;
