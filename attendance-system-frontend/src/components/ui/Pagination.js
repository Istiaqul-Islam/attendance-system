// src/components/ui/Pagination.js

import React from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  // If there's only one page or less, don't render the component.
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    // Go to the previous page, but not lower than 1.
    onPageChange(Math.max(currentPage - 1, 1));
  };

  const handleNext = () => {
    // Go to the next page, but not higher than the total number of pages.
    onPageChange(Math.min(currentPage + 1, totalPages));
  };

  return (
    <div
      style={{
        marginTop: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end", // Align to the right
      }}
    >
      <span style={{ margin: "0 15px", color: "#6c757d" }}>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="btn btn-secondary"
        style={{ marginRight: "8px" }}
      >
        Previous
      </button>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="btn btn-secondary"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
