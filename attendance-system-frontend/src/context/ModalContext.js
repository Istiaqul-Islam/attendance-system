// src/context/ModalContext.js

import React, { createContext, useState, useContext, useCallback } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("Confirm Action");
  const [onConfirm, setOnConfirm] = useState(null);

  // useCallback memoizes the function so it doesn't get recreated on every render.
  const showModal = useCallback((modalConfig) => {
    setTitle(modalConfig.title || "Confirm Action");
    setMessage(modalConfig.message);
    // Store the function that should be executed when the user clicks "Confirm"
    setOnConfirm(() => modalConfig.onConfirm);
    setIsOpen(true);
  }, []);

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(); // Execute the stored callback function
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const value = {
    isOpen,
    message,
    title,
    showModal,
    handleConfirm,
    handleCancel,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export const useModal = () => {
  return useContext(ModalContext);
};
