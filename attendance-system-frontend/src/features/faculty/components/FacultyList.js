// src/features/faculty/components/FacultyList.js

import React, { useState } from "react";

function FacultyList({ facultyList, onDeleteFaculty, onUpdateFaculty }) {
  const [editingFacultyId, setEditingFacultyId] = useState(null);
  const [editFormData, setEditFormData] = useState({ Name: "", Email: "" });

  const handleEditClick = (faculty) => {
    setEditingFacultyId(faculty.Id);
    setEditFormData({ Name: faculty.Name, Email: faculty.Email });
  };

  const handleCancelClick = () => setEditingFacultyId(null);

  const handleInputChange = (e) =>
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });

  const handleSaveClick = (facultyId) => {
    onUpdateFaculty(facultyId, editFormData);
    setEditingFacultyId(null);
  };

  if (!facultyList || facultyList.length === 0) {
    return <p>No faculty members found. Please add a new one.</p>;
  }

  return (
    <div>
      <h3>Faculty List</h3>
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
            {facultyList.map((faculty) => (
              <tr key={faculty.Id}>
                {editingFacultyId === faculty.Id ? (
                  // --- EDITING MODE ---
                  <>
                    <td>{faculty.user_id}</td>
                    <td>
                      <input
                        type="text"
                        name="Name"
                        className="form-control"
                        value={editFormData.Name}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>{faculty.Dept_Name}</td>
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
                      <button onClick={() => handleSaveClick(faculty.Id)} className="btn btn-primary" style={{ marginRight: "8px" }}>
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
                      <strong>{faculty.user_id}</strong>
                    </td>
                    <td>{faculty.Name}</td>
                    <td>{faculty.Dept_Name}</td>
                    <td>{faculty.Email}</td>
                    <td>
                      <button onClick={() => handleEditClick(faculty)} className="btn btn-secondary" style={{ marginRight: "8px" }}>
                        Edit
                      </button>
                      <button onClick={() => onDeleteFaculty(faculty.Id)} className="btn btn-danger">
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

export default FacultyList;
