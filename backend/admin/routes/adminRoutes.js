const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const path = require("path");

router.get("/admin", verifyToken, isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "../../../frontend/admin/index.html"));
});

module.exports = router;
