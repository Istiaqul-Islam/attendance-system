// src/controllers/departmentController.js

const db = require("../database/connection");

exports.getAllDepartments = (req, res) => {
  db.all("SELECT * FROM Departments ORDER BY Dept_Name", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Success", data: rows });
  });
};

exports.createDepartment = (req, res) => {
  const { Dept_Name, Dept_Code } = req.body;
  if (!Dept_Name || !Dept_Code) {
    return res
      .status(400)
      .json({ error: "Department Name and Code are required." });
  }
  const sql = "INSERT INTO Departments (Dept_Name, Dept_Code) VALUES (?, ?)";
  db.run(sql, [Dept_Name, Dept_Code], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE")) {
        return res
          .status(409)
          .json({ error: "Department Name or Code already exists." });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Department created", id: this.lastID });
  });
};

exports.deleteDepartment = (req, res) => {
  db.run(
    "DELETE FROM Departments WHERE Dept_Id = ?",
    req.params.id,
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ message: "Department not found." });
      res.json({ message: "Department deleted" });
    }
  );
};
