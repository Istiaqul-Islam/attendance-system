// src/controllers/studentController.js

const db = require("../database/connection");
const bcrypt = require("bcryptjs");

exports.getAllStudents = (req, res) => {
  const dataSql = `
    SELECT 
      s.Std_Id, s.Std_Name, s.Email, s.Gender, s.Date_of_Birth,
      d.Dept_Name,
      u.user_id,
      s.Dept_Id -- THIS IS THE NEWLY ADDED LINE
    FROM Students s
    JOIN Departments d ON s.Dept_Id = d.Dept_Id
    LEFT JOIN Users u ON s.Std_Id = u.reference_id AND u.role = 'student'
    ORDER BY u.user_id
  `;

  db.all(dataSql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      message: "Success",
      data: rows,
    });
  });
};

exports.getStudentById = (req, res) => {
  const sql = `
    SELECT s.*, d.Dept_Name 
    FROM Students s 
    JOIN Departments d ON s.Dept_Id = d.Dept_Id 
    WHERE s.Std_Id = ?
  `;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Success", data: row });
  });
};

exports.createStudent = (req, res) => {
  const { Std_Name, Email, user_id, Dept_Id, Gender, Date_of_Birth } = req.body;

  if (!Std_Name || !Email || !user_id || !Dept_Id) {
    return res
      .status(400)
      .json({ error: "Name, Email, User ID, and Department are required." });
  }

  const studentPassword = "student1234";

  db.serialize(() => {
    db.run("BEGIN TRANSACTION;");

    bcrypt.hash(studentPassword, 10, (err, hash) => {
      if (err) {
        db.run("ROLLBACK;");
        return res.status(500).json({ error: "Error hashing password." });
      }

      const studentSql =
        "INSERT INTO Students (Std_Name, Email, Dept_Id, Gender, Date_of_Birth) VALUES (?, ?, ?, ?, ?)";
      const studentParams = [Std_Name, Email, Dept_Id, Gender, Date_of_Birth];

      db.run(studentSql, studentParams, function (err) {
        if (err) {
          db.run("ROLLBACK;");
          return res.status(500).json({
            error: err.message.includes("UNIQUE")
              ? "Student email already exists."
              : err.message,
          });
        }

        const studentId = this.lastID;
        const userSql =
          "INSERT INTO Users (user_id, email, password, role, reference_id) VALUES (?, ?, ?, ?, ?)";
        const userParams = [user_id, Email, hash, "student", studentId];

        db.run(userSql, userParams, (err) => {
          if (err) {
            db.run("ROLLBACK;");
            return res.status(500).json({
              error: err.message.includes("UNIQUE")
                ? "User ID or Email already exists for another user."
                : err.message,
            });
          }
          db.run("COMMIT;");
          res.status(201).json({
            message: "Student and user created successfully",
            id: studentId,
          });
        });
      });
    });
  });
};

exports.updateStudent = (req, res) => {
  const { Std_Name, Email, Gender, Date_of_Birth, Dept_Id } = req.body;
  const sql = `UPDATE Students SET 
                 Std_Name = COALESCE(?, Std_Name), 
                 Email = COALESCE(?, Email), 
                 Gender = COALESCE(?, Gender), 
                 Date_of_Birth = COALESCE(?, Date_of_Birth),
                 Dept_Id = COALESCE(?, Dept_Id)
               WHERE Std_Id = ?`;
  const params = [
    Std_Name,
    Email,
    Gender,
    Date_of_Birth,
    Dept_Id,
    req.params.id,
  ];

  db.run(sql, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student updated successfully." });
  });
};

exports.deleteStudent = (req, res) => {
  db.serialize(() => {
    db.run("BEGIN TRANSACTION;");

    const userSql =
      "DELETE FROM Users WHERE role = 'student' AND reference_id = ?";
    db.run(userSql, req.params.id, (err) => {
      if (err) {
        db.run("ROLLBACK;");
        return res
          .status(500)
          .json({ error: "Failed to delete user login: " + err.message });
      }
    });

    const studentSql = "DELETE FROM Students WHERE Std_Id = ?";
    db.run(studentSql, req.params.id, function (err) {
      if (err) {
        db.run("ROLLBACK;");
        return res
          .status(500)
          .json({ error: "Failed to delete student: " + err.message });
      }
      if (this.changes === 0) {
        db.run("ROLLBACK;");
        return res.status(404).json({ message: "Student not found" });
      }

      db.run("COMMIT;");
      res.json({ message: "Student deleted successfully." });
    });
  });
};

exports.getStudentCourseStats = (req, res) => {
  const { courseId } = req.params;
  const { userId, role } = req.user;

  if (role !== "student") {
    return res.status(403).json({ error: "This action is for students only." });
  }

  db.get(
    "SELECT reference_id FROM Users WHERE user_id = ?",
    [userId],
    (err, userRow) => {
      if (err || !userRow)
        return res
          .status(500)
          .json({ error: "Could not find student reference." });
      const studentId = userRow.reference_id;

      const totalLecturesQuery =
        "SELECT COUNT(*) as count FROM Lecture WHERE Course_Id = ?";
      const presentCountQuery = `
      SELECT COUNT(*) as count 
      FROM Attendance a
      JOIN Lecture l ON a.Lecture_No = l.Lecture_No
      WHERE l.Course_Id = ? AND a.Std_Id = ? AND a.Status = 'Present'`;

      const queries = [
        new Promise((resolve, reject) =>
          db.get(totalLecturesQuery, [courseId], (err, row) =>
            err ? reject(err) : resolve(row.count)
          )
        ),
        new Promise((resolve, reject) =>
          db.get(presentCountQuery, [courseId, studentId], (err, row) =>
            err ? reject(err) : resolve(row.count)
          )
        ),
      ];

      Promise.all(queries)
        .then(([totalClasses, presentCount]) => {
          const percentage =
            totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;
          res.json({
            message: "Success",
            data: {
              totalClasses,
              presentCount,
              percentage: parseFloat(percentage.toFixed(2)),
            },
          });
        })
        .catch((err) => res.status(500).json({ error: err.message }));
    }
  );
};
