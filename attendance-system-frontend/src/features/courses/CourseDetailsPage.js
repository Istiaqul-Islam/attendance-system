// src/features/courses/CourseDetailsPage.js

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CourseDetailsPage.scss";

import Pagination from "../../components/ui/Pagination";

import gsap from "gsap";
import useFadeIn from "../../hooks/useFadeIn";

// Helper functions remain the same...
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const formatTerm = (year, semester) => {
  if (!year || !semester) return "";
  const yearSuffix =
    year === 1 ? "st" : year === 2 ? "nd" : year === 3 ? "rd" : "th";
  const semSuffix =
    semester === 1
      ? "st"
      : semester === 2
      ? "nd"
      : semester === 3
      ? "rd"
      : "th";
  return `${year}${yearSuffix} Year, ${semester}${semSuffix} Semester`;
};

function CourseDetailsPage() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [summary, setSummary] = useState({
    totalLectures: 0,
    studentStats: [],
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyAttendance, setDailyAttendance] = useState({});
  const [currentLectureId, setCurrentLectureId] = useState(null);

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const STUDENTS_PER_PAGE = 10;

  // Refs for animations
  const pageRef = useFadeIn();
  const tableBodyRef = useRef(null);
  const animationHasRun = useRef(false);

  // All data fetching logic remains exactly the same.
  const fetchCourseAndSummary = useCallback(async () => {
    setIsLoading(true);
    try {
      const [courseRes, summaryRes] = await Promise.all([
        axios.get(`http://localhost:3001/api/courses/${courseId}`),
        axios.get(
          `http://localhost:3001/api/courses/${courseId}/attendance-summary`
        ),
      ]);
      setCourse(courseRes.data.data);
      setSummary(summaryRes.data.data);
    } catch (error) {
      console.error("Failed to fetch course details or summary:", error);
      showNotification("Could not load course data.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [courseId, showNotification]);

  const fetchAttendanceForDate = useCallback(
    async (date) => {
      try {
        const dateString = formatDate(date);
        const res = await axios.get(
          `http://localhost:3001/api/courses/${courseId}/attendance/${dateString}`
        );
        const attendanceMap = res.data.data.attendance.reduce((acc, record) => {
          acc[record.Std_Id] = record.Status;
          return acc;
        }, {});
        setDailyAttendance(attendanceMap);
        setCurrentLectureId(res.data.data.lectureId);
      } catch (error) {
        console.error(
          `Failed to fetch attendance for ${formatDate(date)}:`,
          error
        );
        const resetAttendance = summary.studentStats.reduce((acc, student) => {
          acc[student.Std_Id] = "Absent";
          return acc;
        }, {});
        setDailyAttendance(resetAttendance);
        setCurrentLectureId(null);
      }
    },
    [courseId, summary.studentStats]
  );

  useEffect(() => {
    fetchCourseAndSummary();
  }, [fetchCourseAndSummary]);

  useEffect(() => {
    if (summary.studentStats.length > 0) {
      fetchAttendanceForDate(selectedDate);
    }
  }, [selectedDate, summary.studentStats, fetchAttendanceForDate]);

  const handleCheckboxChange = (studentId) => {
    setDailyAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "Present" ? "Absent" : "Present",
    }));
  };

  // The submission logic remains exactly the same. It works on the full dailyAttendance object.
  const handleSubmit = async () => {
    let lectureIdToSubmit = currentLectureId;

    if (!lectureIdToSubmit) {
      try {
        const lectureName = `Lecture on ${formatDate(selectedDate)}`;
        const res = await axios.post("http://localhost:3001/api/lectures", {
          Lecture_Name: lectureName,
          Date: formatDate(selectedDate),
          Course_Id: courseId,
        });
        lectureIdToSubmit = res.data.id;
        setCurrentLectureId(res.data.id);
      } catch (error) {
        showNotification(
          "Failed to create a new lecture for this date.",
          "error"
        );
        return;
      }
    }

    const attendanceRecords = Object.keys(dailyAttendance).map((stdId) => ({
      Std_Id: parseInt(stdId),
      Lecture_No: lectureIdToSubmit,
      Status: dailyAttendance[stdId],
    }));

    try {
      await axios.post(
        "http://localhost:3001/api/attendance/replace",
        attendanceRecords
      );
      showNotification("Attendance submitted successfully!", "success");
      fetchCourseAndSummary();
    } catch (error) {
      showNotification("Failed to submit attendance.", "error");
    }
  };

  useEffect(() => {
    if (!isLoading && tableBodyRef.current && !animationHasRun.current) {
      gsap.from(tableBodyRef.current.children, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.05,
      });
      animationHasRun.current = true;
    }
  }, [isLoading]);

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(summary.studentStats.length / STUDENTS_PER_PAGE);
  const indexOfLastStudent = currentPage * STUDENTS_PER_PAGE;
  const indexOfFirstStudent = indexOfLastStudent - STUDENTS_PER_PAGE;
  // This is the "slice" of students we will actually display on the current page.
  const currentStudents = summary.studentStats.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  // This handler simply updates the state. It does not fetch data.
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) return <p>Loading course details...</p>;
  if (!course) return <p>Course not found.</p>;

  return (
    <div ref={pageRef}>
      <Link
        to="/courses"
        style={{ marginBottom: "24px", display: "inline-block" }}
      >
        &larr; Back to All Courses
      </Link>
      <h2>
        {course.Course_Code}: {course.Course_Title}
      </h2>
      <div className="content-panel course-header-panel">
        <p>
          <strong>Term:</strong>{" "}
          {formatTerm(course.Academic_Year, course.Semester_No)}
        </p>
        <p>
          <strong>Faculty:</strong> {course.Faculty_Name}
        </p>
        <p>
          <strong>Total Classes:</strong> {summary.totalLectures}
        </p>
      </div>
      {user?.role !== "student" && (
        <div className="content-panel attendance-controls-panel">
          <h3 style={{ margin: 0 }}>Take Attendance for:</h3>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
          />
          <button onClick={handleSubmit} className="btn btn-primary">
            Submit
          </button>
        </div>
      )}
      <div className="table-responsive-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Present Days</th>
              <th>Percentage</th>
              <th>Status for {formatDate(selectedDate)}</th>
            </tr>
          </thead>
          <tbody ref={tableBodyRef}>
            {/* --- UPDATE THE MAP ---
            We now map over 'currentStudents' instead of the full list. */}
            {currentStudents.map((student) => {
              const isPresent = dailyAttendance[student.Std_Id] === "Present";
              return (
                <tr key={student.Std_Id}>
                  <td>{student.user_id}</td>
                  <td>{student.Std_Name}</td>
                  <td style={{ textAlign: "center" }}>
                    {student.presentCount}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {student.attendancePercentage.toFixed(1)}%
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={isPresent}
                      onChange={() => handleCheckboxChange(student.Std_Id)}
                      disabled={user?.role === "student"}
                      style={{ transform: "scale(1.5)" }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- ADD THE PAGINATION COMPONENT --- */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default CourseDetailsPage;
