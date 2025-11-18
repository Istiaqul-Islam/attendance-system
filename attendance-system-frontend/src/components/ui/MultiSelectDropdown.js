// src/components/ui/MultiSelectDropdown.js

import React, { useState, useRef } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import "./MultiSelectDropdown.scss";

/**
 * A reusable dropdown component that allows for multiple selections with checkboxes.
 * @param {object} props
 * @param {Array<{value: string|number, label: string}>} props.options - The list of all possible options.
 * @param {Array<string|number>} props.selectedValues - An array of the currently selected values.
 * @param {Function} props.onChange - The callback function to call when the selection changes. It receives the new array of selected values.
 * @param {string} props.placeholder - The text to display when no items are selected.
 * @param {boolean} [props.disabled=false] - Whether the dropdown is disabled.
 */
function MultiSelectDropdown({
  options,
  selectedValues,
  onChange,
  placeholder,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Use our custom hook to close the dropdown when clicking outside
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleHeaderClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  // Handler for when an individual checkbox is clicked
  const handleOptionClick = (optionValue) => {
    let newSelectedValues;
    if (selectedValues.includes(optionValue)) {
      // If the item is already selected, remove it
      newSelectedValues = selectedValues.filter((v) => v !== optionValue);
    } else {
      // If the item is not selected, add it
      newSelectedValues = [...selectedValues, optionValue];
    }
    onChange(newSelectedValues); // Notify the parent component
  };

  // Handler for the "Select All" checkbox
  const handleSelectAll = () => {
    if (selectedValues.length === options.length) {
      // If all are selected, deselect all
      onChange([]);
    } else {
      // If not all are selected, select all
      onChange(options.map((opt) => opt.value));
    }
  };

  // Determine the text to display in the header
  const getHeaderText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    if (selectedValues.length === 1) {
      // If one is selected, show its label
      return (
        options.find((opt) => opt.value === selectedValues[0])?.label ||
        placeholder
      );
    }
    // If multiple are selected, show the count
    return `${selectedValues.length} items selected`;
  };

  const areAllSelected =
    options.length > 0 && selectedValues.length === options.length;

  return (
    <div className="multi-select-dropdown-container" ref={dropdownRef}>
      <button
        type="button"
        className={`dropdown-header form-control ${isOpen ? "open" : ""} ${
          disabled ? "disabled" : ""
        }`}
        onClick={handleHeaderClick}
        disabled={disabled}
      >
        <span>{getHeaderText()}</span>
        <span className="caret"></span>
      </button>

      {isOpen && (
        <ul className="dropdown-list">
          {/* "Select All" Option */}
          <li className="select-all-item">
            <label>
              <input
                type="checkbox"
                checked={areAllSelected}
                onChange={handleSelectAll}
              />
              Select All
            </label>
          </li>

          {/* All other options */}
          {options.map((option) => (
            <li key={option.value} className="dropdown-item">
              <label>
                <input
                  type="checkbox"
                  value={option.value}
                  checked={selectedValues.includes(option.value)}
                  onChange={() => handleOptionClick(option.value)}
                />
                {option.label}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MultiSelectDropdown;
