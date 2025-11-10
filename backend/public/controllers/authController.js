const pool = require("../../db"); // PostgreSQL connection file

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password required" });
  }

  try {
    // ✅ PostgreSQL syntax uses $1, $2 placeholders
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const user = result.rows[0];
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
  } catch (err) {
    console.error("❌ Database query error:", err);
    return res.status(500).json({ success: false, message: "Database error" });
  }
};
