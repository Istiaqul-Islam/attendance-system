// src/features/faculty/components/AddFacultyForm.js

import React, { useState } from "react";
import axios from "axios";
import { useNotification } from "../../../context/NotificationContext";
import CustomScrollableDropdown from "../../../components/ui/CustomScrollableDropdown";

function AddFacultyForm({ onFacultyAdded, departments }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [deptId, setDeptId] = useState("");
  const { showNotification } = useNotification();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name || !email || !userId || !deptId) {
      showNotification(
        "Please fill out all fields, including department.",
        "error"
      );
      return;
    }
    try {
      await axios.post("http://localhost:3001/api/faculty", {
        Name: name,
        Email: email,
        user_id: userId,
        Dept_Id: deptId,
      });
      setName("");
      setEmail("");
      setUserId("");
      setDeptId("");
      onFacultyAdded();
      showNotification("Faculty member added successfully!", "success");
    } catch (error) {
      console.error("Error adding faculty:", error);
      const errorMessage =
        error.response?.data?.error ||
        "An error occurred while adding the faculty member.";
      showNotification(errorMessage, "error");
    }
  };

  const departmentOptions = departments.map((dept) => ({
    value: dept.Dept_Id,
    label: dept.Dept_Name,
  }));

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Faculty</h3>
      <div className="form-inline">
        <CustomScrollableDropdown
          options={departmentOptions}
          value={deptId}
          onChange={setDeptId}
          placeholder="-- Select Department --"
        />
        <input
          type="text"
          placeholder="User ID (e.g., Fac003)"
          className="form-control"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Faculty Name"
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
          Add Faculty
        </button>
      </div>
    </form>
  );
}

export default AddFacultyForm;
