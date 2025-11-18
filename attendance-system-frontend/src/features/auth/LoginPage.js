// src/features/auth/LoginPage.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { ReactComponent as Logo } from "../../assets/images/logo.svg";
import "./LoginPage.scss";

function LoginPage() {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(userId, email, password);
      showNotification("Login Successful!", "success");
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
      const errorMessage =
        err.response?.data?.error ||
        "Login failed. Please check your credentials.";
      showNotification(errorMessage, "error");
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        {/* --- NEW LOGIN HEADER --- */}
        <div className="login-header">
          <Logo className="login-logo" />
          <h2 className="login-title">Group Alpha</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="userId">
              User ID
            </label>
            <input
              id="userId"
              type="text"
              className="form-control"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              autoComplete="username"
              placeholder="Enter your user ID"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="btn btn-primary login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
