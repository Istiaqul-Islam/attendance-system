// src/features/courses/components/CourseList.js

import React from "react";
import { Link } from "react-router-dom";

// Helper function to format academic term
const formatTerm = (year, semester) => {
  if (!year || !semester) return "Invalid Term";
  const yearSuffix = year === 1 ? "st" : year === 2 ? "nd" : year === 3 ? "rd" : "th";
  const semSuffix = semester === 1 ? "st" : semester === 2 ? "nd" : semester === 3 ? "rd" : "th";
  return `${year}${yearSuffix} Year, ${semester}${semSuffix} Semester`;
};

function CourseList({ courses, onDelete, user }) {
  if (!courses || courses.length === 0) {
    return <p>No scheduled courses found.</p>;
  }

  // Group courses by term for a more organized display
  const groupedCourses = courses.reduce((acc, course) => {
    const term = formatTerm(course.Academic_Year, course.Semester_No);
    if (!acc[term]) {
      acc[term] = [];
    }
    acc[term].push(course);
    return acc;
  }, {});

  return (
    <div>
      {Object.keys(groupedCourses).map(term => (
        <div key={term}>
          <h3>{term}</h3>
          <div className="table-responsive-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Faculty</th>
                  {user?.role === "admin" && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {groupedCourses[term].map((course) => (
                  <tr key={course.Course_Id}>
                    <td>
                      <Link to={`/courses/${course.Course_Id}`}>
                        {course.Course_Code} - {course.Course_Title}
                      </Link>
                    </td>
                    <td>{course.Faculty_Name}</td>
                    {user?.role === "admin" && (
                      <td>
                        <button
                          onClick={() => onDelete(course.Course_Id)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CourseList;
