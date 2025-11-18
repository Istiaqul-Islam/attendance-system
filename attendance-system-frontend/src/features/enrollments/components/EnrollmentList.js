// src/features/enrollments/components/EnrollmentList.js

import React from "react";

// The component now accepts an 'onDelete' prop
function EnrollmentList({ enrollments, onDelete }) {
  if (!enrollments || enrollments.length === 0) {
    return <p>No student enrollments found.</p>;
  }

  return (
    <div>
      <h3>Current Enrollments</h3>
      <div className="table-responsive-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Term</th>
              <th>Faculty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment) => (
              <tr key={`${enrollment.Std_Id}-${enrollment.Course_Id}`}>
                <td>
                  {enrollment.Std_Name} ({enrollment.Student_UserID})
                </td>
                <td>
                  {enrollment.Course_Code} - {enrollment.Course_Title}
                </td>
                <td>
                  {enrollment.Academic_Year}yr, {enrollment.Semester_No}sem
                </td>
                <td>{enrollment.Faculty_Name}</td>
                <td>
                  <button
                    onClick={() =>
                      onDelete(enrollment.Std_Id, enrollment.Course_Id)
                    }
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EnrollmentList;
