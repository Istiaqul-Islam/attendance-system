// src/controllers/attendanceController.js

const db = require("../database/connection");

exports.recordAttendance = (req, res) => {
  const attendanceRecords = req.body;

  if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
    return res.status(400).json({
      error: "Request body must be a non-empty array of attendance records.",
    });
  }

  const sql =
    "INSERT INTO Attendance (Date, Status, Std_Id, Lecture_No) VALUES (CURRENT_DATE, ?, ?, ?)";

  db.serialize(() => {
    db.run("BEGIN TRANSACTION;");

    const stmt = db.prepare(sql);

    for (const record of attendanceRecords) {
      const { Status, Std_Id, Lecture_No } = record;
      if (!Status || !Std_Id || !Lecture_No) {
        db.run("ROLLBACK;");
        return res.status(400).json({
          error:
            "Each attendance record must include Status, Std_Id, and Lecture_No.",
        });
      }
      stmt.run(Status, Std_Id, Lecture_No);
    }

    stmt.finalize((err) => {
      if (err) {
        db.run("ROLLBACK;");
        return res
          .status(500)
          .json({ error: "Failed to finalize statement: " + err.message });
      }

      db.run("COMMIT;", (commitErr) => {
        if (commitErr) {
          return res.status(500).json({
            error: "Failed to commit transaction: " + commitErr.message,
          });
        }
        res.status(201).json({ message: "Attendance recorded successfully." });
      });
    });
  });
};

exports.getAttendanceForLecture = (req, res) => {
  const lectureId = req.params.id;

  const sql = `
    SELECT 
      a.Attendance_Id,
      a.Date,
      a.Status,
      s.Std_Id,
      s.Std_Name,
      s.Email
    FROM Attendance a
    JOIN Students s ON a.Std_Id = s.Std_Id
    WHERE a.Lecture_No = ?
  `;

  db.all(sql, [lectureId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Success", data: rows });
  });
};

exports.replaceAttendance = (req, res) => {
  const attendanceRecords = req.body;
  if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
    return res
      .status(400)
      .json({ error: "Request body must be a non-empty array." });
  }

  const lectureNo = attendanceRecords[0].Lecture_No;
  if (!lectureNo) {
    return res
      .status(400)
      .json({ error: "Lecture_No is missing from records." });
  }

  const deleteSql = "DELETE FROM Attendance WHERE Lecture_No = ?";
  const insertSql =
    "INSERT INTO Attendance (Date, Status, Std_Id, Lecture_No) VALUES (?, ?, ?, ?)";

  db.serialize(() => {
    db.run("BEGIN TRANSACTION;");
    db.run(deleteSql, [lectureNo], (err) => {
      if (err) {
        db.run("ROLLBACK;");
        return res
          .status(500)
          .json({ error: "Failed to delete old records: " + err.message });
      }

      const stmt = db.prepare(insertSql);
      for (const record of attendanceRecords) {
        const attendanceDate =
          record.Date || new Date().toISOString().slice(0, 10);
        stmt.run(
          attendanceDate,
          record.Status,
          record.Std_Id,
          record.Lecture_No
        );
      }

      stmt.finalize((finalizeErr) => {
        if (finalizeErr) {
          db.run("ROLLBACK;");
          return res.status(500).json({
            error: "Failed to finalize statement: " + finalizeErr.message,
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
            .json({ message: "Attendance recorded successfully." });
        });
      });
    });
  });
};
