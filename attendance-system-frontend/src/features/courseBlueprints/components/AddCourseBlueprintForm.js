// src/features/courseBlueprints/components/AddCourseBlueprintForm.js

import React, { useState } from "react";
import axios from "axios";
import { useNotification } from "../../../context/NotificationContext";
import CustomScrollableDropdown from "../../../components/ui/CustomScrollableDropdown";

function AddCourseBlueprintForm({ onBlueprintAdded, departments }) {
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [deptId, setDeptId] = useState("");
  const { showNotification } = useNotification();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!courseTitle || !courseCode) {
      showNotification("Please enter both course code and title.", "error");
      return;
    }
    try {
      await axios.post("http://localhost:3001/api/course-blueprints", {
        Course_Code: courseCode,
        Course_Title: courseTitle,
        Dept_Id: deptId || null,
      });
      setCourseTitle("");
      setCourseCode("");
      setDeptId("");
      onBlueprintAdded();
      showNotification("Course definition created successfully!", "success");
    } catch (error) {
      console.error("Error adding course blueprint:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to add course blueprint.";
      showNotification(errorMessage, "error");
    }
  };

  const departmentOptions = [
    // Add the "Non-Departmental" option manually
    { value: "", label: "-- Non-Departmental --" },
    ...departments.map((dept) => ({
      value: dept.Dept_Id,
      label: dept.Dept_Name,
    })),
  ];

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add a New Course Definition</h3>
      <div className="form-inline">
        <CustomScrollableDropdown
          options={departmentOptions}
          value={deptId}
          onChange={setDeptId}
          placeholder="-- Select Department --"
        />
        <input
          type="text"
          placeholder="Course Code (e.g., CSE-101)"
          className="form-control"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Course Title (e.g., Intro to Programming)"
          className="form-control"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary">
          Add Course
        </button>
      </div>
    </form>
  );
}

export default AddCourseBlueprintForm;
