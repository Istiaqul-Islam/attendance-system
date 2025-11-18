// src/features/departments/components/AddDepartmentForm.js

import React, { useState } from "react";
import axios from "axios";
import { useNotification } from "../../../context/NotificationContext";

function AddDepartmentForm({ onDepartmentAdded }) {
  const [deptName, setDeptName] = useState("");
  const [deptCode, setDeptCode] = useState("");
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!deptName || !deptCode) {
      showNotification(
        "Please provide both department name and code.",
        "error"
      );
      return;
    }
    try {
      await axios.post("http://localhost:3001/api/departments", {
        Dept_Name: deptName,
        Dept_Code: deptCode,
      });
      // Reset the form fields on success.
      setDeptName("");
      setDeptCode("");
      onDepartmentAdded(); // Notify the parent component to re-fetch data.
      showNotification("Department created successfully!", "success");
    } catch (error) {
      console.error("Error adding department:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to add department.";
      showNotification(errorMessage, "error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create New Department</h3>
      <div className="form-inline">
        <input
          type="text"
          placeholder="Department Name (e.g., Computer Science)"
          className="form-control"
          value={deptName}
          onChange={(e) => setDeptName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Department Code (e.g., CSE)"
          className="form-control"
          value={deptCode}
          onChange={(e) => setDeptCode(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary">
          Add Department
        </button>
      </div>
    </form>
  );
}

export default AddDepartmentForm;
