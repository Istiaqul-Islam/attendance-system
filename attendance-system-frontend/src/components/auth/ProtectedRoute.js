// src/components/auth/ProtectedRoute.js

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// This component protects routes that require any authenticated user.
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation(); // Gets the current URL location

  // If the user is not authenticated, redirect them to the login page.
  // 'state={{ from: location }}' saves the page they were trying to access,
  // so we can redirect them back there after they log in. 'replace' avoids
  // adding the login page to the browser history.
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user is authenticated, render the child components (the actual page).
  return children;
};

// This component protects routes that require an authenticated ADMIN user.
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // After confirming authentication, check the user's role.
  if (user.role !== "admin") {
    // If not an admin, redirect them to the homepage.
    return <Navigate to="/" replace />;
  }

  // If the user is an admin, render the child components.
  return children;
};

export default ProtectedRoute;
