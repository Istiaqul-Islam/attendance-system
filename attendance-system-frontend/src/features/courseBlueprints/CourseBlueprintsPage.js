// src/features/courseBlueprints/CourseBlueprintsPage.js

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CourseBlueprintList from "./components/CourseBlueprintList";
import AddCourseBlueprintForm from "./components/AddCourseBlueprintForm";
import { useNotification } from "../../context/NotificationContext";
import { useModal } from "../../context/ModalContext";

function CourseBlueprintsPage() {
  const [blueprints, setBlueprints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const { showNotification } = useNotification();
  const { showModal } = useModal();

  // Fetches both course blueprints and departments from the backend.
  const fetchData = useCallback(async () => {
    try {
      const [blueprintsRes, deptsRes] = await Promise.all([
        axios.get("http://localhost:3001/api/course-blueprints"),
        axios.get("http://localhost:3001/api/departments"),
      ]);
      setBlueprints(blueprintsRes.data.data);
      setDepartments(deptsRes.data.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      showNotification("Could not load course management data.", "error");
    }
  }, [showNotification]);

  // Run fetchData when the component mounts.
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handler for deleting a course blueprint.
  const handleDelete = (id) => {
    // This function will be called only after the user confirms the modal.
    const confirmDelete = async () => {
      try {
        await axios.delete(`http://localhost:3001/api/course-blueprints/${id}`);
        fetchData(); // Refresh the list after deleting.
        showNotification("Course definition deleted successfully.", "success");
      } catch (error) {
        console.error("Failed to delete course blueprint:", error);
        showNotification("Failed to delete course blueprint.", "error");
      }
    };

    // Show the confirmation modal before proceeding with the deletion.
    showModal({
      title: "Delete Course Definition?",
      message:
        "Are you sure? Deleting a course definition will also delete all its scheduled sections and their related lectures and attendance records. This action cannot be undone.",
      onConfirm: confirmDelete,
    });
  };

  return (
    <div>
      <h2>Course Management</h2>

      <div className="content-panel">
        <AddCourseBlueprintForm
          onBlueprintAdded={fetchData} // Pass fetchData so the form can trigger a refresh.
          departments={departments}
        />
      </div>

      <CourseBlueprintList blueprints={blueprints} onDelete={handleDelete} />
    </div>
  );
}

export default CourseBlueprintsPage;
