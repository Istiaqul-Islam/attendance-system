// src/middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

// This is our main "gatekeeper" middleware.
// It will be used on almost every protected route.
const protect = (req, res, next) => {
  let token;

  // 1. Check if the request has an Authorization header, and if it starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2. Extract the token from the header (e.g., "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];

      // 3. Verify the token using our secret key from the .env file
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Attach the decoded payload (which contains user id and role) to the request object.
      // This makes the user's info available in all subsequent route handlers.
      req.user = decoded;

      // 5. Call next() to allow the request to proceed to the next function in the chain (the controller).
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  }

  // If there's no token at all, send an error
  if (!token) {
    res.status(401).json({ error: "Not authorized, no token" });
  }
};

// This is a role-specific middleware.
// It checks if the user's role (which we attached in the 'protect' middleware) is 'admin'.
const isAdmin = (req, res, next) => {
  // We assume this middleware runs *after* the 'protect' middleware,
  // so req.user should exist.
  if (req.user && req.user.role === "admin") {
    next(); // User is an admin, proceed.
  } else {
    res.status(403).json({ error: "Not authorized as an admin" }); // 403 Forbidden
  }
};

// A role-specific middleware for faculty
const isFaculty = (req, res, next) => {
  if (req.user && req.user.role === "faculty") {
    next();
  } else {
    res.status(403).json({ error: "Not authorized as faculty" });
  }
};

// A middleware that allows either admins or faculty
const isAdminOrFaculty = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "faculty")) {
    next();
  } else {
    res.status(403).json({ error: "Not authorized for this action" });
  }
};

module.exports = { protect, isAdmin, isFaculty, isAdminOrFaculty };
