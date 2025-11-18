// src/controllers/authController.js

const db = require("../database/connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = (req, res) => {
  const { userId, email, password } = req.body;

  if (!userId || !email || !password) {
    return res
      .status(400)
      .json({ error: "User ID, email, and password are required." });
  }

  const sql = "SELECT * FROM Users WHERE user_id = ? AND email = ?";
  db.get(sql, [userId, email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Database error: " + err.message });
    }
    if (!user) {
      return res
        .status(401)
        .json({ error: "Invalid credentials. User not found." });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: "Error comparing passwords." });
      }
      if (!isMatch) {
        return res
          .status(401)
          .json({ error: "Invalid credentials. Password does not match." });
      }
      let nameQuery = "";
      switch (user.role) {
        case "student":
          nameQuery = `SELECT Std_Name as name FROM Students WHERE Std_Id = ?`;
          break;
        case "faculty":
          nameQuery = `SELECT Name as name FROM Faculty WHERE Id = ?`;
          break;
        case "admin":
          return sendLoginResponse(res, user, "Administrator");
        default:
          return res.status(500).json({ error: "Unknown user role." });
      }

      db.get(nameQuery, [user.reference_id], (err, nameRow) => {
        if (err || !nameRow) {
          console.error(
            "Could not find user's name for reference_id:",
            user.reference_id
          );
          return sendLoginResponse(res, user, user.user_id);
        }
        sendLoginResponse(res, user, nameRow.name);
      });
    });
  });
};

const sendLoginResponse = (res, user, userName) => {
  const payload = {
    userId: user.user_id,
    role: user.role,
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: "5h" },
    (err, token) => {
      if (err) {
        console.error("Error signing JWT:", err);
        return res.status(500).json({ error: "Error signing token." });
      }

      res.json({
        message: "Login successful!",
        token: token,
        user: {
          userId: user.user_id,
          email: user.email,
          role: user.role,
          name: userName,
        },
      });
    }
  );
};
