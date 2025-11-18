// src/controllers/dashboardController.js

const db = require("../database/connection");

exports.getStats = (req, res) => {
  const { role, userId } = req.user;

  switch (role) {
    case "admin":
      getAdminStats(req, res);
      break;
    case "faculty":
      getFacultyStats(req, res);
      break;
    case "student":
      getStudentStats(req, res);
      break;
    default:
      res.status(403).json({ error: "Unknown user role." });
  }
};

const getAdminStats = (req, res) => {
  const queries = [
    new Promise((resolve, reject) =>
      db.get("SELECT COUNT(*) as count FROM Students", [], (err, row) =>
        err ? reject(err) : resolve(row.count)
      )
    ),

    new Promise((resolve, reject) =>
      db.get("SELECT COUNT(*) as count FROM Faculty", [], (err, row) =>
        err ? reject(err) : resolve(row.count)
      )
    ),
    new Promise((resolve, reject) =>
      db.get("SELECT COUNT(*) as count FROM Departments", [], (err, row) =>
        err ? reject(err) : resolve(row.count)
      )
    ),

    new Promise((resolve, reject) =>
      db.get("SELECT COUNT(*) as count FROM CourseBlueprints", [], (err, row) =>
        err ? reject(err) : resolve(row.count)
      )
    ),
  ];

  Promise.all(queries)
    .then(([totalStudents, totalFaculty, totalDepartments, totalCourses]) => {
      res.json({
        message: "Success",
        data: { totalStudents, totalFaculty, totalDepartments, totalCourses },
      });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

const getFacultyStats = (req, res) => {
  const { userId } = req.user;

  const facultyIdQuery = "SELECT reference_id FROM Users WHERE user_id = ?";
  db.get(facultyIdQuery, [userId], (err, userRow) => {
    if (err || !userRow)
      return res
        .status(500)
        .json({ error: "Could not find faculty reference." });
    const facultyId = userRow.reference_id;

    const queries = [
      new Promise((resolve, reject) =>
        db.get(
          "SELECT COUNT(*) as count FROM Courses WHERE Faculty_Id = ?",
          [facultyId],
          (err, row) => (err ? reject(err) : resolve(row.count))
        )
      ),

      new Promise((resolve, reject) =>
        db.get(
          "SELECT COUNT(DISTINCT e.Std_Id) as count FROM Enrollments e JOIN Courses c ON e.Course_Id = c.Course_Id WHERE c.Faculty_Id = ?",
          [facultyId],
          (err, row) => (err ? reject(err) : resolve(row.count))
        )
      ),
    ];

    Promise.all(queries)
      .then(([totalCourses, totalStudents]) => {
        res.json({ message: "Success", data: { totalCourses, totalStudents } });
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  });
};

const getStudentStats = (req, res) => {
  const { userId } = req.user;

  const studentIdQuery = "SELECT reference_id FROM Users WHERE user_id = ?";
  db.get(studentIdQuery, [userId], (err, userRow) => {
    if (err || !userRow)
      return res
        .status(500)
        .json({ error: "Could not find student reference." });
    const studentId = userRow.reference_id;

    const totalCoursesQuery =
      "SELECT COUNT(*) as count FROM Enrollments WHERE Std_Id = ?";
    const totalLecturesQuery = `
            SELECT COUNT(l.Lecture_No) as count 
            FROM Lecture l
            JOIN Enrollments e ON l.Course_Id = e.Course_Id
            WHERE e.Std_Id = ?`;
    const presentCountQuery = `
            SELECT COUNT(a.Attendance_Id) as count 
            FROM Attendance a
            JOIN Lecture l ON a.Lecture_No = l.Lecture_No
            JOIN Enrollments e ON l.Course_Id = e.Course_Id
            WHERE e.Std_Id = ? AND a.Std_Id = ? AND a.Status = 'Present'`;

    const queries = [
      new Promise((resolve, reject) =>
        db.get(totalCoursesQuery, [studentId], (err, row) =>
          err ? reject(err) : resolve(row.count)
        )
      ),

      new Promise((resolve, reject) =>
        db.get(totalLecturesQuery, [studentId], (err, row) =>
          err ? reject(err) : resolve(row.count)
        )
      ),

      new Promise((resolve, reject) =>
        db.get(presentCountQuery, [studentId, studentId], (err, row) =>
          err ? reject(err) : resolve(row.count)
        )
      ),
    ];

    Promise.all(queries)
      .then(([totalCourses, totalClasses, totalPresent]) => {
        const percentage =
          totalClasses > 0 ? (totalPresent / totalClasses) * 100 : 0;
        res.json({
          message: "Success",
          data: {
            totalCourses,
            totalClasses,
            totalPresent,
            percentage: parseFloat(percentage.toFixed(2)),
          },
        });
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  });
};
