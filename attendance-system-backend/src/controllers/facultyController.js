// src/controllers/facultyController.js

const db = require("../database/connection");
const bcrypt = require("bcryptjs");

exports.getAllFaculty = (req, res) => {
  const sql = `
    SELECT 
      f.Id, f.Name, f.Email,
      d.Dept_Name,
      u.user_id
    FROM Faculty f
    JOIN Departments d ON f.Dept_Id = d.Dept_Id
    LEFT JOIN Users u ON f.Id = u.reference_id AND u.role = 'faculty'
    ORDER BY u.user_id -- MODIFICATION: Changed sorting from f.Name to u.user_id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Success", data: rows });
  });
};

exports.getFacultyById = (req, res) => {
  const sql = `
    SELECT f.*, d.Dept_Name
    FROM Faculty f
    JOIN Departments d ON f.Dept_Id = d.Dept_Id
    WHERE f.Id = ?
  `;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: "Faculty not found" });
    res.json({ message: "Success", data: row });
  });
};

exports.createFaculty = (req, res) => {
  const { Name, Email, user_id, Dept_Id } = req.body;
  if (!Name || !Email || !user_id || !Dept_Id) {
    return res
      .status(400)
      .json({ error: "Name, Email, User ID, and Department are required." });
  }

  const facultyPassword = "facpass1234";

  db.serialize(() => {
    db.run("BEGIN TRANSACTION;");
    bcrypt.hash(facultyPassword, 10, (err, hash) => {
      if (err) {
        db.run("ROLLBACK;");
        return res.status(500).json({ error: "Error hashing password." });
      }

      const facultySql =
        "INSERT INTO Faculty (Name, Email, Dept_Id) VALUES (?, ?, ?)";
      db.run(facultySql, [Name, Email, Dept_Id], function (err) {
        if (err) {
          db.run("ROLLBACK;");
          return res.status(500).json({
            error: err.message.includes("UNIQUE")
              ? "Faculty email already exists."
              : err.message,
          });
        }
        const facultyId = this.lastID;
        const userSql =
          "INSERT INTO Users (user_id, email, password, role, reference_id) VALUES (?, ?, ?, ?, ?)";
        db.run(userSql, [user_id, Email, hash, "faculty", facultyId], (err) => {
          if (err) {
            db.run("ROLLBACK;");
            return res.status(500).json({
              error: err.message.includes("UNIQUE")
                ? "User ID or Email already exists for a user."
                : err.message,
            });
          }
          db.run("COMMIT;");
          res.status(201).json({
            message: "Faculty and user created successfully",
            id: facultyId,
          });
        });
      });
    });
  });
};

exports.updateFaculty = (req, res) => {
  const { Name, Email, Dept_Id } = req.body;
  const sql = `UPDATE Faculty SET 
                 Name = COALESCE(?, Name), 
                 Email = COALESCE(?, Email),
                 Dept_Id = COALESCE(?, Dept_Id)
               WHERE Id = ?`;
  db.run(sql, [Name, Email, Dept_Id, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ message: "Faculty not found" });
    res.json({ message: "Faculty updated successfully." });
  });
};

exports.deleteFaculty = (req, res) => {
  db.serialize(() => {
    db.run("BEGIN TRANSACTION;");

    const userSql =
      "DELETE FROM Users WHERE role = 'faculty' AND reference_id = ?";
    db.run(userSql, req.params.id, (err) => {
      if (err) {
        db.run("ROLLBACK;");
        return res
          .status(500)
          .json({ error: "Failed to delete user login: " + err.message });
      }
    });

    const facultySql = "DELETE FROM Faculty WHERE Id = ?";
    db.run(facultySql, req.params.id, function (err) {
      if (err) {
        db.run("ROLLBACK;");
        return res
          .status(500)
          .json({ error: "Failed to delete faculty: " + err.message });
      }
      if (this.changes === 0) {
        db.run("ROLLBACK;");
        return res.status(404).json({ message: "Faculty not found" });
      }
      db.run("COMMIT;");
      res.json({ message: "Faculty deleted successfully." });
    });
  });
};
