// src/context/NotificationContext.js

import React, { createContext, useState, useContext, useCallback } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type });

    // Set a timer to automatically hide the notification after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  }, []);

  const hideNotification = () => {
    setNotification(null);
  };

  const value = {
    notification,
    showNotification,
    hideNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to make it easy to use the context in other components
export const useNotification = () => {
  return useContext(NotificationContext);
};
