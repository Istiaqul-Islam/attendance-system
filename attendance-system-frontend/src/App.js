// src/App.js

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute, { AdminRoute } from "./components/auth/ProtectedRoute";
import Notification from "./components/ui/Notification";
import ConfirmationModal from "./components/ui/ConfirmationModal";

// Import all page components
import LoginPage from "./features/auth/LoginPage";
import StudentDashboard from "./features/dashboard/StudentDashboard";
import DepartmentsPage from "./features/departments/DepartmentsPage";
import CourseBlueprintsPage from "./features/courseBlueprints/CourseBlueprintsPage";
import CoursesPage from "./features/courses/CoursesPage";
import CourseDetailsPage from "./features/courses/CourseDetailsPage";
import StudentsPage from "./features/students/StudentsPage";
import FacultyPage from "./features/faculty/FacultyPage";
import EnrollmentsPage from "./features/enrollments/EnrollmentsPage";
import AttendancePage from "./features/courses/AttendancePage";
import AboutPage from "./features/about/AboutPage";

// --- MODIFICATION START ---

// This component determines which layout to use based on the current URL
const AppContent = () => {
  const location = useLocation();
  const isFullScreenPage = location.pathname === "/login";

  const pageRoutes = (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <CoursesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:courseId"
        element={
          <ProtectedRoute>
            <CourseDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lectures/:lectureId/attendance"
        element={
          <ProtectedRoute>
            <AttendancePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/about"
        element={
          <ProtectedRoute>
            <AboutPage />
          </ProtectedRoute>
        }
      />
      {/* Admin-only Routes */}
      <Route
        path="/departments"
        element={
          <AdminRoute>
            <DepartmentsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/course-blueprints"
        element={
          <AdminRoute>
            <CourseBlueprintsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/students"
        element={
          <AdminRoute>
            <StudentsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/faculty"
        element={
          <AdminRoute>
            <FacultyPage />
          </AdminRoute>
        }
      />
      <Route
        path="/enrollments"
        element={
          <AdminRoute>
            <EnrollmentsPage />
          </AdminRoute>
        }
      />
    </Routes>
  );

  return (
    <>
      {/* These components are now truly global and will render on every page */}
      <Notification />
      <ConfirmationModal />

      {isFullScreenPage ? (
        // For login, just render the routes directly
        pageRoutes
      ) : (
        // For all other pages, wrap them in the standard layout
        <>
          <Navbar />
          <MainLayout>{pageRoutes}</MainLayout>
        </>
      )}
    </>
  );
};
// --- MODIFICATION END ---

// The main App function sets up the Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
