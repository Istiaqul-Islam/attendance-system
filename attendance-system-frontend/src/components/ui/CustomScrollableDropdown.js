// src/components/ui/CustomScrollableDropdown.js

import React, { useState, useRef } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import "./CustomScrollableDropdown.scss";

// --- 1. Add 'disabled' to the props ---
function CustomScrollableDropdown({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleHeaderClick = () => {
    // --- 2. Prevent opening if the component is disabled ---
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const selectedOptionLabel =
    options.find((opt) => opt.value === value)?.label || placeholder;

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button
        type="button"
        // --- 3. Add a 'disabled' class for styling when disabled ---
        className={`dropdown-header form-control ${isOpen ? "open" : ""} ${
          disabled ? "disabled" : ""
        }`}
        onClick={handleHeaderClick}
        // --- 4. Pass the disabled prop to the button element itself ---
        disabled={disabled}
      >
        <span>{selectedOptionLabel}</span>
        <span className="caret"></span>
      </button>

      {isOpen && (
        <ul className="dropdown-list">
          {options.map((option) => (
            <li
              key={option.value}
              className={`dropdown-item ${
                value === option.value ? "selected" : ""
              }`}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomScrollableDropdown;
