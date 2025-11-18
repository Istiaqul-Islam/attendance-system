// src/database/setup.js

const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");

// Define paths to the database file and the schema file
const dbFile = path.join(__dirname, "..", "..", "attendance.db");
const schemaFile = path.join(__dirname, "..", "..", "schema.sql");

// Read the entire SQL schema file into a string
const schema = fs.readFileSync(schemaFile, "utf8");

// Connect to the SQLite database. If the file doesn't exist, it will be created.
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error("Error opening database", err.message);
    return;
  }
  console.log("Connected to the SQLite database.");
});

// Function to add the default admin user
const addAdminUser = () => {
  const adminPassword = "1234"; // A default, easy-to-remember password for development

  // Hash the password asynchronously with a salt round of 10
  bcrypt.hash(adminPassword, 10, (err, hash) => {
    if (err) {
      console.error("Error hashing password", err);
      return;
    }

    const insertAdminSql = `
      INSERT INTO Users (user_id, email, password, role) 
      VALUES (?, ?, ?, ?)
    `;

    // Insert the admin user with the hashed password
    db.run(
      insertAdminSql,
      ["admin01", "admin@gmail.com", hash, "admin"],
      function (err) {
        if (err) {
          // It might fail if the user already exists, which is fine on re-runs
          if (err.message.includes("UNIQUE constraint failed")) {
            console.log("Admin user already exists.");
          } else {
            console.error("Error inserting admin user", err.message);
          }
        } else {
          console.log("Admin user created successfully.");
        }
        // Once the admin has been inserted (or we confirmed it exists), we can close the connection.
        closeDatabase();
      }
    );
  });
};

// Function to gracefully close the database connection
const closeDatabase = () => {
  db.close((err) => {
    if (err) {
      console.error("Error closing database", err.message);
    } else {
      console.log("Database connection closed.");
    }
  });
};

// Main execution block
// db.exec() can execute multiple SQL statements from a string
db.exec(schema, (err) => {
  if (err) {
    console.error("Error executing schema", err.message);
    // Close the DB even if the schema fails to prevent hanging processes
    closeDatabase();
  } else {
    console.log("Database tables created successfully.");
    // If the schema is created successfully, then add the admin user
    addAdminUser();
  }
});
