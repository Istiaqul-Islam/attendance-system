// src/controllers/lectureController.js

const db = require("../database/connection");

exports.createLecture = (req, res) => {
  const { Lecture_Name, Date, Duration, Course_Id } = req.body;
  if (!Lecture_Name || !Date || !Course_Id) {
    return res
      .status(400)
      .json({ error: "Lecture Name, Date, and Course ID are required." });
  }

  const sql =
    "INSERT INTO Lecture (Lecture_Name, Date, Duration, Course_Id) VALUES (?, ?, ?, ?)";
  db.run(sql, [Lecture_Name, Date, Duration, Course_Id], function (err) {
    if (err) {
      if (err.message.includes("FOREIGN KEY"))
        return res.status(404).json({ error: "Invalid Course ID." });
      return res.status(500).json({ error: err.message });
    }
    res
      .status(201)
      .json({ message: "Lecture created successfully", id: this.lastID });
  });
};

exports.updateLecture = (req, res) => {
  const { Lecture_Name, Date, Duration } = req.body;
  const sql = `UPDATE Lecture SET 
                 Lecture_Name = COALESCE(?, Lecture_Name), 
                 Date = COALESCE(?, Date), 
                 Duration = COALESCE(?, Duration)
               WHERE Lecture_No = ?`;
  db.run(sql, [Lecture_Name, Date, Duration, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ message: "Lecture not found." });
    res.json({ message: "Lecture updated successfully." });
  });
};

exports.getLecturesForCourse = (req, res) => {
  const courseId = req.params.id;
  const sql = "SELECT * FROM Lecture WHERE Course_Id = ? ORDER BY Date";
  db.all(sql, [courseId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Success", data: rows });
  });
};

exports.getLectureById = (req, res) => {
  const lectureId = req.params.id;
  const sql = `
        SELECT 
            l.Lecture_No, l.Lecture_Name, l.Date, l.Duration,
            c.Course_Id,
            cb.Course_Code, cb.Course_Title,
            fac.Name as Faculty_Name
        FROM Lecture l
        JOIN Courses c ON l.Course_Id = c.Course_Id
        JOIN CourseBlueprints cb ON c.Blueprint_Id = cb.Blueprint_Id
        JOIN Faculty fac ON c.Faculty_Id = fac.Id
        WHERE l.Lecture_No = ?
    `;
  db.get(sql, [lectureId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: "Lecture not found." });
    res.json({ message: "Success", data: row });
  });
};
