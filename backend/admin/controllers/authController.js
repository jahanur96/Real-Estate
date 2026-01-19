const pool = require("../../db");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password],
    );

    if (result.rowCount === 0) {
      return res.json({
        success: false,
        message: "Invalid email or password!",
      });
    }

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      "SECRET_KEY_2025",
      { expiresIn: "3h" },
    );

    // Set the token in a cookie
    res.cookie("token", token, {
      httpOnly: true, // Secure: script cannot access it
      secure: false, // Set to true if using HTTPS
      maxAge: 3 * 60 * 60 * 1000, // 3 hours
    });

    res.json({
      success: true,
      token,
      role: user.role,
      name: user.name,
    });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server Error" });
  }
};
