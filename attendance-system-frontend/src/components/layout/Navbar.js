// src/components/layout/Navbar.js

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ReactComponent as Logo } from "../../assets/images/logo.svg";
import "./Navbar.scss";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/login");
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  const getNavLinkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <header className="site-header">
      <div className="navbar-top">
        <NavLink to="/" className="navbar-brand">
          <Logo className="navbar-logo" />
          <span className="navbar-brand-text">Group Alpha</span>
        </NavLink>
        <div className="nav-user-actions">
          <span className="user-info">
            {user?.userId} <span className="user-role">({user?.role})</span>
          </span>

          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>
      <nav className="navbar-bottom">
        <button
          className={`nav-toggle ${isMenuOpen ? "open" : ""}`}
          aria-label="toggle navigation"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="hamburger"></span>
        </button>
        <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <NavLink
            to="/"
            className={getNavLinkClass}
            onClick={handleLinkClick}
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/courses"
            className={getNavLinkClass}
            onClick={handleLinkClick}
          >
            Courses
          </NavLink>
          {user?.role === "admin" && (
            <>
              <NavLink
                to="/departments"
                className={getNavLinkClass}
                onClick={handleLinkClick}
              >
                Departments
              </NavLink>
              <NavLink
                to="/course-blueprints"
                className={getNavLinkClass}
                onClick={handleLinkClick}
              >
                Course Manage
              </NavLink>
              <NavLink
                to="/students"
                className={getNavLinkClass}
                onClick={handleLinkClick}
              >
                Students
              </NavLink>
              <NavLink
                to="/faculty"
                className={getNavLinkClass}
                onClick={handleLinkClick}
              >
                Faculty
              </NavLink>
              <NavLink
                to="/enrollments"
                className={getNavLinkClass}
                onClick={handleLinkClick}
              >
                Enrollments
              </NavLink>
            </>
          )}
          <NavLink
            to="/about"
            className={getNavLinkClass}
            onClick={handleLinkClick}
          >
            About
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
