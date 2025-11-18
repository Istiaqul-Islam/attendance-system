// src/controllers/courseBlueprintController.js

const db = require("../database/connection");

exports.getAllBlueprints = (req, res) => {
  const sql = `
        SELECT 
            cb.Blueprint_Id, cb.Course_Code, cb.Course_Title,
            COALESCE(d.Dept_Name, 'Non-Departmental') as Dept_Name
        FROM CourseBlueprints cb
        LEFT JOIN Departments d ON cb.Dept_Id = d.Dept_Id
        ORDER BY cb.Course_Code
    `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Success", data: rows });
  });
};

exports.createBlueprint = (req, res) => {
  const { Course_Code, Course_Title, Dept_Id } = req.body;
  if (!Course_Code || !Course_Title) {
    return res
      .status(400)
      .json({ error: "Course Code and Title are required." });
  }

  const finalDeptId = Dept_Id ? Dept_Id : null;
  const sql =
    "INSERT INTO CourseBlueprints (Course_Code, Course_Title, Dept_Id) VALUES (?, ?, ?)";
  db.run(sql, [Course_Code, Course_Title, finalDeptId], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE"))
        return res.status(409).json({ error: "Course Code already exists." });
      return res.status(500).json({ error: err.message });
    }
    res
      .status(201)
      .json({ message: "Course Blueprint created", id: this.lastID });
  });
};

exports.deleteBlueprint = (req, res) => {
  const sql = "DELETE FROM CourseBlueprints WHERE Blueprint_Id = ?";
  db.run(sql, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ message: "Course Blueprint not found." });
    res.json({ message: "Course Blueprint deleted successfully." });
  });
};
