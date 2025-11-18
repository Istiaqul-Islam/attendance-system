// src/features/departments/DepartmentsPage.js

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AddDepartmentForm from "./components/AddDepartmentForm";
import DepartmentList from "./components/DepartmentList";
import { useNotification } from "../../context/NotificationContext";
import { useModal } from "../../context/ModalContext";

function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const { showNotification } = useNotification();
  const { showModal } = useModal();

  // Fetches the list of departments from the backend.
  // useCallback is used to prevent this function from being recreated on every render.
  const fetchDepartments = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/departments");
      setDepartments(res.data.data);
    } catch (error) {
      console.error("Failed to fetch departments", error);
      showNotification("Could not load departments.", "error");
    }
  }, [showNotification]);

  // useEffect hook to call fetchDepartments once when the component is first mounted.
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // Handler for deleting a department.
  const handleDelete = (id) => {
    // This is the function that will be executed if the user confirms the modal.
    const confirmDelete = async () => {
      try {
        await axios.delete(`http://localhost:3001/api/departments/${id}`);
        fetchDepartments(); // Refresh the department list after a successful deletion.
        showNotification("Department deleted successfully.", "success");
      } catch (error) {
        console.error("Failed to delete department", error);
        const errorMessage =
          error.response?.data?.error ||
          "Failed to delete. Make sure no students or faculty are assigned to this department.";
        showNotification(errorMessage, "error");
      }
    };

    // Use the global modal context to ask for user confirmation.
    showModal({
      title: "Delete Department?",
      message:
        "Are you sure you want to delete this department? This could affect existing students and faculty.",
      onConfirm: confirmDelete,
    });
  };

  return (
    <div>
      <h2>Manage Departments</h2>

      <div className="content-panel">
        <AddDepartmentForm onDepartmentAdded={fetchDepartments} />
      </div>
      <DepartmentList departments={departments} onDelete={handleDelete} />
    </div>
  );
}

export default DepartmentsPage;
