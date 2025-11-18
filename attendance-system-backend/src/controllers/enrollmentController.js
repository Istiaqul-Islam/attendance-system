// src/controllers/enrollmentController.js

const db = require("../database/connection");

exports.bulkEnroll = (req, res) => {
  const { studentIds, courseIds } = req.body;

  if (
    !studentIds ||
    studentIds.length === 0 ||
    !courseIds ||
    courseIds.length === 0
  ) {
    return res
      .status(400)
      .json({ error: "Student IDs and Course IDs are required." });
  }

  const sql = "INSERT INTO Enrollments (Std_Id, Course_Id) VALUES (?, ?)";

  db.serialize(() => {
    db.run("BEGIN TRANSACTION;");

    const stmt = db.prepare(sql);

    for (const studentId of studentIds) {
      for (const courseId of courseIds) {
        stmt.run(studentId, courseId, function (err) {
          if (err && !err.message.includes("UNIQUE constraint failed")) {
            console.error(
              `Failed to enroll student ${studentId} in course ${courseId}:`,
              err.message
            );
          }
        });
      }
    }

    stmt.finalize((err) => {
      if (err) {
        db.run("ROLLBACK;");
        return res.status(500).json({
          error: "Failed to finalize enrollment statement: " + err.message,
        });
      }

      db.run("COMMIT;", (commitErr) => {
        if (commitErr) {
          return res.status(500).json({
            error: "Failed to commit transaction: " + commitErr.message,
          });
        }
        res
          .status(201)
          .json({ message: "Bulk enrollment process completed successfully." });
      });
    });
  });
};

exports.enrollStudentInCourse = (req, res) => {
  const { Std_Id, Course_Id } = req.body;

  if (!Std_Id || !Course_Id) {
    return res
      .status(400)
      .json({ error: "Student ID and Course ID are required." });
  }

  const sql = "INSERT INTO Enrollments (Std_Id, Course_Id) VALUES (?, ?)";

  db.run(sql, [Std_Id, Course_Id], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE constraint failed")) {
        return res
          .status(409)
          .json({ error: "This student is already enrolled in this course." });
      }
      if (err.message.includes("FOREIGN KEY constraint failed")) {
        return res
          .status(404)
          .json({ error: "Invalid Student ID or Course ID provided." });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      message: "Student enrolled in course successfully.",
      enrollment: { Std_Id, Course_Id },
    });
  });
};

exports.getAllEnrollments = (req, res) => {
  const sql = `
        SELECT
            e.Std_Id, 
            e.Course_Id,
            s.Std_Name,
            u.user_id as Student_UserID,
            cb.Course_Code,
            cb.Course_Title,
            c.Academic_Year,
            c.Semester_No,
            fac.Name as Faculty_Name
        FROM Enrollments e
        JOIN Students s ON e.Std_Id = s.Std_Id
        LEFT JOIN Users u ON s.Std_Id = u.reference_id AND u.role = 'student'
        JOIN Courses c ON e.Course_Id = c.Course_Id
        JOIN CourseBlueprints cb ON c.Blueprint_Id = cb.Blueprint_Id
        JOIN Faculty fac ON c.Faculty_Id = fac.Id
        ORDER BY u.user_id, cb.Course_Code
    `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Success", data: rows });
  });
};

exports.deleteEnrollment = (req, res) => {
  const { stdId, courseId } = req.params;

  const sql = "DELETE FROM Enrollments WHERE Std_Id = ? AND Course_Id = ?";

  db.run(sql, [stdId, courseId], function (err) {
    if (err) {
      return res.status(500).json({ error: "Database error: " + err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Enrollment not found." });
    }
    res.json({ message: "Student unenrolled successfully." });
  });
};
