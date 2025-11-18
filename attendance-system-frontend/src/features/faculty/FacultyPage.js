// src/features/faculty/FacultyPage.js

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import FacultyList from "./components/FacultyList";
import AddFacultyForm from "./components/AddFacultyForm";
import { useNotification } from "../../context/NotificationContext";
import { useModal } from "../../context/ModalContext";

function FacultyPage() {
  const [facultyList, setFacultyList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const { showNotification } = useNotification();
  const { showModal } = useModal();

  // Fetches both faculty and department data.
  const fetchData = useCallback(async () => {
    try {
      const [facultyRes, deptsRes] = await Promise.all([
        axios.get("http://localhost:3001/api/faculty"),
        axios.get("http://localhost:3001/api/departments"),
      ]);
      setFacultyList(facultyRes.data.data);
      setDepartments(deptsRes.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      showNotification("Could not load faculty data.", "error");
    }
  }, [showNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteFaculty = (facultyId) => {
    const confirmDelete = async () => {
      try {
        await axios.delete(`http://localhost:3001/api/faculty/${facultyId}`);
        fetchData(); // Refresh list after delete.
        showNotification("Faculty member deleted.", "success");
      } catch (error) {
        console.error("Error deleting faculty:", error);
        showNotification("Failed to delete faculty member.", "error");
      }
    };

    showModal({
      title: "Delete Faculty Member?",
      message:
        "Are you sure you want to delete this faculty member? Their user login will also be removed.",
      onConfirm: confirmDelete,
    });
  };

  const updateFaculty = async (facultyId, updatedData) => {
    try {
      await axios.put(
        `http://localhost:3001/api/faculty/${facultyId}`,
        updatedData
      );
      fetchData(); // Refresh list after update.
      showNotification("Faculty member updated.", "success");
    } catch (error) {
      console.error("Error updating faculty:", error);
      showNotification("Failed to update faculty member.", "error");
    }
  };

  return (
    <div>
      <h2>Manage Faculty</h2>

      <div className="content-panel">
        <AddFacultyForm onFacultyAdded={fetchData} departments={departments} />
      </div>

      <FacultyList
        facultyList={facultyList}
        onDeleteFaculty={deleteFaculty}
        onUpdateFaculty={updateFaculty}
      />
    </div>
  );
}

export default FacultyPage;
