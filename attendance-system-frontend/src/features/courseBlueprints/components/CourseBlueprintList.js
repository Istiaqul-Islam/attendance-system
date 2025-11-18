// src/features/courseBlueprints/components/CourseBlueprintList.js

import React from "react";

function CourseBlueprintList({ blueprints, onDelete }) {
  if (!blueprints || blueprints.length === 0) {
    return <p>No course definitions found. Please add a new one.</p>;
  }

  return (
    <div>
      <h3>Available Course Definitions</h3>
      <div className="table-responsive-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blueprints.map((blueprint) => (
              <tr key={blueprint.Blueprint_Id}>
                <td>
                  <strong>{blueprint.Course_Code}</strong>
                </td>
                <td>{blueprint.Course_Title}</td>
                <td>{blueprint.Dept_Name}</td>
                <td>
                  <button
                    onClick={() => onDelete(blueprint.Blueprint_Id)}
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

export default CourseBlueprintList;
