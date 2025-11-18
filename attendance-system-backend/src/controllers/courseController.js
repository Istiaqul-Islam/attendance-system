// src/controllers/courseController.js

const db = require("../database/connection");

exports.getAllCourses = (req, res) => {
  const { role, userId } = req.user;

  let sql;
  const params = [];

  const baseQuery = `
        SELECT
            c.Course_Id, c.Academic_Year, c.Semester_No,
            cb.Course_Code, cb.Course_Title,
            fac.Name as Faculty_Name,
            dep.Dept_Name,
            cb.Dept_Id -- THIS IS THE NEWLY ADDED LINE
        FROM Courses c
        JOIN CourseBlueprints cb ON c.Blueprint_Id = cb.Blueprint_Id
        JOIN Faculty fac ON c.Faculty_Id = fac.Id
        LEFT JOIN Departments dep ON cb.Dept_Id = dep.Dept_Id
    `;

  if (role === "admin") {
    sql = `${baseQuery} ORDER BY c.Academic_Year, c.Semester_No, cb.Course_Code`;
  } else if (role === "faculty") {
    sql = `${baseQuery} WHERE fac.Id = (SELECT reference_id FROM Users WHERE user_id = ?)
               ORDER BY c.Academic_Year, c.Semester_No, cb.Course_Code`;
    params.push(userId);
  } else if (role === "student") {
    sql = `${baseQuery} JOIN Enrollments e ON c.Course_Id = e.Course_Id
               WHERE e.Std_Id = (SELECT reference_id FROM Users WHERE user_id = ?)
               ORDER BY c.Academic_Year, c.Semester_No, cb.Course_Code`;
    params.push(userId);
  } else {
    return res.json({ message: "Success", data: [] });
  }

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Success", data: rows });
  });
};
exports.getCourseById = (req, res) => {
  const sql = `
        SELECT
            c.Course_Id, c.Academic_Year, c.Semester_No,
            cb.Blueprint_Id, cb.Course_Code, cb.Course_Title,
            fac.Id as Faculty_Id, fac.Name as Faculty_Name,
            dep.Dept_Name
        FROM Courses c
        JOIN CourseBlueprints cb ON c.Blueprint_Id = cb.Blueprint_Id
        JOIN Faculty fac ON c.Faculty_Id = fac.Id
        LEFT JOIN Departments dep ON cb.Dept_Id = dep.Dept_Id
        WHERE c.Course_Id = ?
    `;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Success", data: row });
  });
};

exports.createCourse = (req, res) => {
  const { Blueprint_Id, Faculty_Id, Academic_Year, Semester_No } = req.body;
  if (!Blueprint_Id || !Faculty_Id || !Academic_Year || !Semester_No) {
    return res.status(400).json({ error: "All fields are required." });
  }
  const sql =
    "INSERT INTO Courses (Blueprint_Id, Faculty_Id, Academic_Year, Semester_No) VALUES (?, ?, ?, ?)";
  db.run(
    sql,
    [Blueprint_Id, Faculty_Id, Academic_Year, Semester_No],
    function (err) {
      if (err) {
        if (err.message.includes("FOREIGN KEY")) {
          return res.status(404).json({
            error: "Invalid Course Blueprint or Faculty ID provided.",
          });
        }
        return res.status(500).json({ error: err.message });
      }
      res
        .status(201)
        .json({ message: "Course created successfully", id: this.lastID });
    }
  );
};

exports.deleteCourse = (req, res) => {
  const sql = "DELETE FROM Courses WHERE Course_Id = ?";
  db.run(sql, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ message: "Course not found." });
    res.json({ message: "Course deleted successfully." });
  });
};

exports.getStudentsForCourse = (req, res) => {
  const sql = `
        SELECT s.Std_Id, s.Std_Name, s.Email, u.user_id
        FROM Students s
        JOIN Enrollments e ON s.Std_Id = e.Std_Id
        LEFT JOIN Users u ON s.Std_Id = u.reference_id AND u.role = 'student'
        WHERE e.Course_Id = ?
        ORDER BY s.Std_Name
    `;
  db.all(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Success", data: rows });
  });
};

exports.getAttendanceSummary = (req, res) => {
  const courseId = req.params.id;

  const lecturesSql =
    "SELECT COUNT(*) as totalLectures FROM Lecture WHERE Course_Id = ?";

  const studentsSql = `
    SELECT
      s.Std_Id,
      s.Std_Name,
      u.user_id,
      (SELECT COUNT(*) 
       FROM Attendance a 
       JOIN Lecture l ON a.Lecture_No = l.Lecture_No 
       WHERE l.Course_Id = e.Course_Id AND a.Std_Id = e.Std_Id AND a.Status = 'Present'
      ) as presentCount
    FROM Enrollments e
    JOIN Students s ON e.Std_Id = s.Std_Id
    LEFT JOIN Users u ON s.Std_Id = u.reference_id AND u.role = 'student'
    WHERE e.Course_Id = ?
    ORDER BY u.user_id; -- <<< THIS IS THE MODIFIED LINE (was s.Std_Name)
  `;

  db.get(lecturesSql, [courseId], (err, lectureRow) => {
    if (err) return res.status(500).json({ error: err.message });
    const totalLectures = lectureRow.totalLectures;

    db.all(studentsSql, [courseId], (err, studentRows) => {
      if (err) return res.status(500).json({ error: err.message });

      const studentStats = studentRows.map((student) => ({
        ...student,
        attendancePercentage:
          totalLectures > 0 ? (student.presentCount / totalLectures) * 100 : 0,
      }));

      res.json({
        message: "Success",
        data: {
          totalLectures,
          studentStats,
        },
      });
    });
  });
};

exports.getAttendanceForDate = (req, res) => {
  const courseId = req.params.id;
  const date = req.params.date;

  const lectureSql =
    "SELECT Lecture_No FROM Lecture WHERE Course_Id = ? AND Date = ?";

  db.get(lectureSql, [courseId, date], (err, lectureRow) => {
    if (err) return res.status(500).json({ error: err.message });

    const lectureNo = lectureRow ? lectureRow.Lecture_No : null;

    const attendanceSql = `
      SELECT
        e.Std_Id,
        COALESCE(a.Status, 'Absent') as Status
      FROM Enrollments e
      LEFT JOIN Attendance a ON e.Std_Id = a.Std_Id AND a.Lecture_No = ?
      WHERE e.Course_Id = ?
    `;

    db.all(attendanceSql, [lectureNo, courseId], (err, attendanceRows) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        message: "Success",
        data: {
          lectureExists: !!lectureNo,
          lectureId: lectureNo,
          attendance: attendanceRows,
        },
      });
    });
  });
};
