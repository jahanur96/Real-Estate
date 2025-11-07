const db = require("../../db");

exports.login = (req, res) => {
  const { email, password } = req.body; // <-- email আছে

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password required" });
  }

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("❌ Database query error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }

    if (results.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const user = results[0];
    if (user.role === "admin") {
      return res.json({
        success: true,
        message: "Welcome Admin!",
        role: "admin",
      });
    } else {
      return res.json({
        success: true,
        message: "Welcome Guest!",
        role: "guest",
      });
    }
  });
};
