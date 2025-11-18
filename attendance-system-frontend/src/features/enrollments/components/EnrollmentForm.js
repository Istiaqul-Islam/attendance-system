// src/features/enrollments/components/EnrollmentForm.js

import React, { useState, useMemo } from "react";
import axios from "axios";
import { useNotification } from "../../../context/NotificationContext";
import CustomScrollableDropdown from "../../../components/ui/CustomScrollableDropdown";
import MultiSelectDropdown from "../../../components/ui/MultiSelectDropdown";
import "./EnrollmentForm.scss";

function EnrollmentForm({
  students,
  courses,
  onEnrollmentCreated,
  departments,
}) {
  // State for the department filter
  const [filterDeptId, setFilterDeptId] = useState("");

  // State for the multi-select dropdowns
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);

  const { showNotification } = useNotification();

  // --- FILTERING LOGIC ---
  // useMemo ensures these lists are only recalculated when the filter or master lists change.
  const filteredStudents = useMemo(() => {
    if (!filterDeptId) return students;
    return students.filter((s) => s.Dept_Id === parseInt(filterDeptId));
  }, [filterDeptId, students]);

  const filteredCourses = useMemo(() => {
    if (!filterDeptId) return courses;
    return courses.filter((c) => c.Dept_Id === parseInt(filterDeptId));
  }, [filterDeptId, courses]);

  // --- SUBMIT HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedStudentIds.length === 0 || selectedCourseIds.length === 0) {
      showNotification(
        "Please select at least one student and one course.",
        "error"
      );
      return;
    }
    try {
      // Call the new bulk endpoint
      await axios.post("http://localhost:3001/api/enrollments/bulk", {
        studentIds: selectedStudentIds,
        courseIds: selectedCourseIds,
      });
      // Reset the form on success
      setSelectedStudentIds([]);
      setSelectedCourseIds([]);
      onEnrollmentCreated();
      showNotification("Students enrolled successfully!", "success");
    } catch (error) {
      console.error("Error creating bulk enrollment:", error);
      showNotification(
        error.response?.data?.error || "Failed to enroll students.",
        "error"
      );
    }
  };

  // --- DATA FORMATTING for dropdowns ---
  const departmentOptions = [
    { value: "", label: "All Departments" },
    ...departments.map((d) => ({ value: d.Dept_Id, label: d.Dept_Name })),
  ];
  const studentOptions = filteredStudents.map((s) => ({
    value: s.Std_Id,
    label: `${s.user_id} - ${s.Std_Name}`,
  }));
  const courseOptions = filteredCourses.map((c) => ({
    value: c.Course_Id,
    label: `${c.Course_Code} - ${c.Course_Title}`,
  }));

  return (
    <form onSubmit={handleSubmit} className="bulk-enrollment-form">
      <h3>Enroll Students in Courses</h3>

      {/* Filter Section */}
      <div className="filter-section">
        <h4>Filter by Department</h4>
        <CustomScrollableDropdown
          options={departmentOptions}
          value={filterDeptId}
          onChange={(val) => {
            setFilterDeptId(val);
            // Clear selections when filter changes to avoid confusion
            setSelectedStudentIds([]);
            setSelectedCourseIds([]);
          }}
          placeholder="-- Select a Department to Filter --"
        />
      </div>

      {/* Selection Section */}
      <div className="selection-section">
        <MultiSelectDropdown
          options={studentOptions}
          selectedValues={selectedStudentIds}
          onChange={setSelectedStudentIds}
          placeholder="Select Students"
        />
        <MultiSelectDropdown
          options={courseOptions}
          selectedValues={selectedCourseIds}
          onChange={setSelectedCourseIds}
          placeholder="Select Courses"
        />
      </div>

      {/* Button Section */}
      <div className="enroll-button-container">
        <button type="submit" className="btn btn-primary">
          Enroll Selected
        </button>
      </div>
    </form>
  );
}

export default EnrollmentForm;
