const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  // Check cookie first (for browser redirects) then check headers (for API calls)
  const token =
    req.cookies.token ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!token) {
    return res.status(401).send(`
      <div style="text-align:center; padding-top:50px; font-family:sans-serif;">
        <h1 style="color:red;">Unauthorized Access</h1>
        <p>Your session has expired. Please <a href="/login.html">Login</a> to continue.</p>
      </div>
    `);
  }

  try {
    const decoded = jwt.verify(token, "SECRET_KEY_2025");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Invalid Token. Please login again.");
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Access Denied: You are not an administrator!");
  }
  next();
};
