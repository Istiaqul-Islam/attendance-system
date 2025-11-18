// src/features/students/StudentsPage.js

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import StudentList from "./components/StudentList";
import AddStudentForm from "./components/AddStudentForm";

import { useNotification } from "../../context/NotificationContext";
import { useModal } from "../../context/ModalContext";

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);

  const { showNotification } = useNotification();
  const { showModal } = useModal();

  const fetchData = useCallback(async () => {
    try {
      // The API URL is simplified.
      const [studentsRes, deptsRes] = await Promise.all([
        axios.get("http://localhost:3001/api/students"),
        axios.get("http://localhost:3001/api/departments"),
      ]);
      setStudents(studentsRes.data.data);
      setDepartments(deptsRes.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      showNotification("Failed to load student data.", "error");
    }
  }, [showNotification]);

  useEffect(() => {
    // The initial call is now simpler.
    fetchData();
  }, [fetchData]);

  const handleStudentAdded = () => {
    // This call is now simpler.
    fetchData();
  };

  const deleteStudent = (studentId) => {
    const confirmDelete = async () => {
      try {
        await axios.delete(`http://localhost:3001/api/students/${studentId}`);
        // The refresh call is now simpler.
        fetchData();
        showNotification("Student deleted successfully.", "success");
      } catch (error) {
        console.error("Error deleting student:", error);
        const errorMessage =
          error.response?.data?.error || "Failed to delete student.";
        showNotification(errorMessage, "error");
      }
    };

    showModal({
      title: "Delete Student?",
      message:
        "Are you sure you want to delete this student and their login credentials?",
      onConfirm: confirmDelete,
    });
  };

  const updateStudent = async (studentId, updatedData) => {
    try {
      await axios.put(
        `http://localhost:3001/api/students/${studentId}`,
        updatedData
      );
      // The refresh call is now simpler.
      fetchData();
      showNotification("Student updated successfully.", "success");
    } catch (error) {
      console.error("Error updating student:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to update student.";
      showNotification(errorMessage, "error");
    }
  };

  return (
    <div>
      <h2>Manage Students</h2>

      <div className="content-panel">
        <AddStudentForm
          onStudentAdded={handleStudentAdded}
          departments={departments}
        />
      </div>

      <StudentList
        students={students}
        onDeleteStudent={deleteStudent}
        onUpdateStudent={updateStudent}
      />
    </div>
  );
}

export default StudentsPage;
