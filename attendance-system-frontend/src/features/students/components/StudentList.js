// src/features/students/components/StudentList.js

import React, { useState } from "react";

function StudentList({ students, onDeleteStudent, onUpdateStudent }) {
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editFormData, setEditFormData] = useState({ Std_Name: "", Email: "" });

  const handleEditClick = (student) => {
    setEditingStudentId(student.Std_Id);
    setEditFormData({ Std_Name: student.Std_Name, Email: student.Email });
  };

  const handleCancelClick = () => {
    setEditingStudentId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleSaveClick = (studentId) => {
    onUpdateStudent(studentId, editFormData);
    setEditingStudentId(null);
  };

  if (!students || students.length === 0) {
    return <p>No students found.</p>;
  }

  return (
    <div>
      <h3>Student List</h3>
      <div className="table-responsive-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Email</th>
              <th style={{ width: "200px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.Std_Id}>
                {editingStudentId === student.Std_Id ? (
                  // --- EDITING MODE ---
                  <>
                    <td>{student.user_id}</td>
                    <td>
                      <input
                        type="text"
                        name="Std_Name"
                        className="form-control"
                        value={editFormData.Std_Name}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>{student.Dept_Name}</td>
                    <td>
                      <input
                        type="email"
                        name="Email"
                        className="form-control"
                        value={editFormData.Email}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <button onClick={() => handleSaveClick(student.Std_Id)} className="btn btn-primary" style={{ marginRight: "8px" }}>
                        Save
                      </button>
                      <button onClick={handleCancelClick} className="btn btn-secondary">
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  // --- DISPLAY MODE ---
                  <>
                    <td>
                      <strong>{student.user_id}</strong>
                    </td>
                    <td>{student.Std_Name}</td>
                    <td>{student.Dept_Name}</td>
                    <td>{student.Email}</td>
                    <td>
                      <button onClick={() => handleEditClick(student)} className="btn btn-secondary" style={{ marginRight: "8px" }}>
                        Edit
                      </button>
                      <button onClick={() => onDeleteStudent(student.Std_Id)} className="btn btn-danger">
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentList;
