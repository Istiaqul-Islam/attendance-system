// src/database/connection.js

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Resolve the path to the database file in the root of the backend directory
const dbPath = path.resolve(__dirname, "..", "..", "attendance.db");

// Create a new database instance
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database", err.message);
  } else {
    // This message confirms that the application has successfully connected to the database file on startup.
    console.log("Successfully connected to the database.");
  }
});

// Export the single database connection instance to be used by other parts of the application
module.exports = db;
