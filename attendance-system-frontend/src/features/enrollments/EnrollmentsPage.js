// src/features/enrollments/EnrollmentsPage.js

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import EnrollmentForm from "./components/EnrollmentForm";
import EnrollmentList from "./components/EnrollmentList";
import { useNotification } from "../../context/NotificationContext";
import { useModal } from "../../context/ModalContext";

function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  // --- 1. Add state for departments ---
  const [departments, setDepartments] = useState([]);

  const { showNotification } = useNotification();
  const { showModal } = useModal();

  const fetchData = useCallback(async () => {
    try {
      // --- 2. Add departments to the API call ---
      const [enrollRes, studentRes, courseRes, deptRes] = await Promise.all([
        axios.get("http://localhost:3001/api/enrollments"),
        axios.get("http://localhost:3001/api/students"),
        axios.get("http://localhost:3001/api/courses"),
        axios.get("http://localhost:3001/api/departments"),
      ]);
      setEnrollments(enrollRes.data.data);
      setStudents(studentRes.data.data);
      setCourses(courseRes.data.data);
      setDepartments(deptRes.data.data); // Set the department state
    } catch (error) {
      console.error("Failed to fetch enrollment data:", error);
      showNotification("Could not load enrollment data.", "error");
    }
  }, [showNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = (stdId, courseId) => {
    const confirmDelete = async () => {
      try {
        await axios.delete(
          `http://localhost:3001/api/enrollments/${stdId}/${courseId}`
        );
        showNotification("Student unenrolled successfully.", "success");
        fetchData();
      } catch (error) {
        console.error("Failed to unenroll student:", error);
        showNotification("Failed to unenroll student.", "error");
      }
    };
    showModal({
      title: "Confirm Unenrollment",
      message: "Are you sure you want to remove this student from this course?",
      onConfirm: confirmDelete,
    });
  };

  return (
    <div>
      <h2>Manage Student Enrollments</h2>
      <div className="content-panel">
        <EnrollmentForm
          students={students}
          courses={courses}
          departments={departments} // --- 3. Pass departments down to the form ---
          onEnrollmentCreated={fetchData}
        />
      </div>
      <EnrollmentList enrollments={enrollments} onDelete={handleDelete} />
    </div>
  );
}

export default EnrollmentsPage;
