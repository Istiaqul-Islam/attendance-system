// src/features/courses/AttendancePage.js

import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";

const nextStatus = { Absent: "Present", Present: "Absent" };
const statusDisplay = {
  Absent: { icon: "❌", className: "status-absent" },
  Present: { icon: "✔️", className: "status-present" },
};

// The logic has been integrated into CourseDetailsPage.js for a better user experience.
function AttendancePage() {
  const { lectureId } = useParams();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [lecture, setLecture] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAttendanceData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const lectureRes = await axios.get(
        `http://localhost:3001/api/lectures/${lectureId}`
      );
      setLecture(lectureRes.data.data);
      const courseId = lectureRes.data.data.Course_Id;
      const studentsRes = await axios.get(
        `http://localhost:3001/api/courses/${courseId}/students`
      );
      setStudents(studentsRes.data.data);
      const attendanceRes = await axios.get(
        `http://localhost:3001/api/lectures/${lectureId}/attendance`
      );

      const initialAttendance = {};
      studentsRes.data.data.forEach((student) => {
        const record = attendanceRes.data.data.find(
          (att) => att.Std_Id === student.Std_Id
        );
        initialAttendance[student.Std_Id] =
          record?.Status === "Present" ? "Present" : "Absent";
      });
      setAttendance(initialAttendance);
    } catch (err) {
      setError("Failed to load attendance data. Please try again later.");
      showNotification("Failed to load attendance data.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [lectureId, showNotification]);

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  const handleStatusChange = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: nextStatus[prev[studentId] || "Absent"],
    }));
  };

  const handleSubmit = async () => {
    const attendanceRecords = Object.keys(attendance).map((stdId) => ({
      Std_Id: parseInt(stdId),
      Lecture_No: parseInt(lectureId),
      Status: attendance[stdId],
    }));
    try {
      await axios.post(
        "http://localhost:3001/api/attendance/replace",
        attendanceRecords
      );
      showNotification("Attendance submitted successfully!", "success");
    } catch (err) {
      showNotification("Failed to submit attendance.", "error");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      {lecture && (
        <Link to={`/courses/${lecture.Course_Id}`}>
          &larr; Back to Course Details
        </Link>
      )}
      <h2>Attendance for {lecture?.Lecture_Name}</h2>
      <p>
        <strong>Course:</strong> {lecture?.Course_Code} -{" "}
        {lecture?.Course_Title}
      </p>
      <p>
        <strong>Date:</strong> {lecture?.Date}
      </p>
      <table></table>
      {user?.role !== "student" && (
        <button onClick={handleSubmit}>Submit Attendance</button>
      )}
    </div>
  );
}

export default AttendancePage;
