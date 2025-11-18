// src/features/departments/components/DepartmentList.js

import React from "react";

function DepartmentList({ departments, onDelete }) {
  if (!departments || departments.length === 0) {
    return <p>No departments found. Please add a new one.</p>;
  }

  return (
    <div>
      <h3>Existing Departments</h3>
      <div className="table-responsive-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Dept. Code</th>
              <th>Department Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.Dept_Id}>
                <td>
                  <strong>{dept.Dept_Code}</strong>
                </td>
                <td>{dept.Dept_Name}</td>
                <td>
                  <button
                    onClick={() => onDelete(dept.Dept_Id)}
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

export default DepartmentList;
