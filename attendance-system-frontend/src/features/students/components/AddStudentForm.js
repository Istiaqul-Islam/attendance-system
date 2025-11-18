// src/features/students/components/AddStudentForm.js

import React, { useState } from "react";
import axios from "axios";
import { useNotification } from "../../../context/NotificationContext";
import CustomScrollableDropdown from "../../../components/ui/CustomScrollableDropdown";

function AddStudentForm({ onStudentAdded, departments }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [deptId, setDeptId] = useState("");
  const { showNotification } = useNotification();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name || !email || !userId || !deptId) {
      showNotification(
        "Please fill out all fields, including selecting a department.",
        "error"
      );
      return;
    }
    try {
      await axios.post("http://localhost:3001/api/students", {
        Std_Name: name,
        Email: email,
        user_id: userId,
        Dept_Id: deptId,
      });
      setName("");
      setEmail("");
      setUserId("");
      setDeptId("");
      onStudentAdded();
      showNotification("Student added successfully!", "success");
    } catch (error) {
      console.error("Error adding student:", error);
      const errorMessage =
        error.response?.data?.error ||
        "An error occurred while adding the student.";
      showNotification(errorMessage, "error");
    }
  };

  // Format department data for the custom dropdown
  const departmentOptions = departments.map((dept) => ({
    value: dept.Dept_Id,
    label: dept.Dept_Name,
  }));

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Student</h3>
      <div className="form-inline">
        <CustomScrollableDropdown
          options={departmentOptions}
          value={deptId}
          onChange={setDeptId}
          placeholder="-- Select Department --"
        />
        <input
          type="text"
          placeholder="User ID (e.g., CSE032001)"
          className="form-control"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Student Name"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary">
          Add Student
        </button>
      </div>
    </form>
  );
}

export default AddStudentForm;
