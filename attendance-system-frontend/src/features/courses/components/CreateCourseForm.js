// src/features/courses/components/CreateCourseForm.js

import React, { useState } from "react";
import axios from "axios";
import { useNotification } from "../../../context/NotificationContext";
import CustomScrollableDropdown from "../../../components/ui/CustomScrollableDropdown";
// --- 1. Import the new stylesheet ---
import "./CreateCourseForm.scss";

const getSemestersForYear = (year) => {
  if (!year) return [];
  const yearNum = parseInt(year);
  return [
    { value: yearNum * 2 - 1, label: `Semester ${yearNum * 2 - 1}` },
    { value: yearNum * 2, label: `Semester ${yearNum * 2}` },
  ];
};

const yearOptions = [
  { value: "1", label: "1st Year" },
  { value: "2", label: "2nd Year" },
  { value: "3", label: "3rd Year" },
  { value: "4", label: "4th Year" },
];

function CreateCourseForm({ blueprints, faculty, onCourseCreated }) {
  const [blueprintId, setBlueprintId] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [semesterNo, setSemesterNo] = useState("");
  const { showNotification } = useNotification();

  const handleYearChange = (year) => {
    setAcademicYear(year);
    setSemesterNo("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!blueprintId || !facultyId || !academicYear || !semesterNo) {
      showNotification(
        "Please fill out all fields to schedule a course.",
        "error"
      );
      return;
    }
    try {
      await axios.post("http://localhost:3001/api/courses", {
        Blueprint_Id: blueprintId,
        Faculty_Id: facultyId,
        Academic_Year: academicYear,
        Semester_No: semesterNo,
      });
      setBlueprintId("");
      setFacultyId("");
      setAcademicYear("");
      setSemesterNo("");
      onCourseCreated();
      showNotification("Course scheduled successfully!", "success");
    } catch (error) {
      console.error("Error creating course:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to schedule course.";
      showNotification(errorMessage, "error");
    }
  };

  const blueprintOptions = blueprints.map((b) => ({
    value: b.Blueprint_Id,
    label: `${b.Course_Code} - ${b.Course_Title}`,
  }));

  const facultyOptions = faculty.map((f) => ({
    value: f.Id,
    label: f.Name,
  }));

  const semesterOptions = getSemestersForYear(academicYear);

  return (
    <form onSubmit={handleSubmit}>
      <h3>Schedule a New Course</h3>
      {/* --- 2. Use the new layout class --- */}
      <div className="create-course-form-layout">
        <CustomScrollableDropdown
          options={blueprintOptions}
          value={blueprintId}
          onChange={setBlueprintId}
          placeholder="-- Select Course Definition --"
        />
        <CustomScrollableDropdown
          options={facultyOptions}
          value={facultyId}
          onChange={setFacultyId}
          placeholder="-- Assign Faculty --"
        />
        <CustomScrollableDropdown
          options={yearOptions}
          value={academicYear}
          onChange={handleYearChange}
          placeholder="-- Select Year --"
        />
        <CustomScrollableDropdown
          options={semesterOptions}
          value={semesterNo}
          onChange={setSemesterNo}
          placeholder="-- Select Semester --"
          // --- 3. Apply the disabled logic ---
          disabled={!academicYear}
        />
        <button type="submit" className="btn btn-primary">
          Schedule Course
        </button>
      </div>
    </form>
  );
}

export default CreateCourseForm;
