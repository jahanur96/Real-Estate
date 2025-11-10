const db = require("../../db");
const fs = require("fs");
const path = require("path");

// Helper to delete a file safely
function deleteFile(filePath) {
  const fullPath = path.join(__dirname, "../../../frontend", filePath);
  if (fs.existsSync(fullPath)) {
    fs.unlink(fullPath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });
  }
}

// Get all categories
exports.getAll = (req, res) => {
  const sql =
    "SELECT id, category_name AS name, slug, icon AS image FROM category";
  db.query(sql, (err, results) => {
    if (err)
      return res.status(500).json({ success: false, message: err.message });
    res.json(results.rows);
  });
};

// Create category
exports.create = (req, res) => {
  const { category_name, slug } = req.body;
  const icon = req.file ? `/admin/uploads/category/${req.file.filename}` : null;

  const sql =
    "INSERT INTO category (category_name, slug, icon) VALUES ($1, $2, $3) RETURNING id";
  db.query(sql, [category_name, slug, icon], (err, result) => {
    if (err)
      return res.status(500).json({ success: false, message: err.message });
    const newId = result.rows.length > 0 ? result.rows[0].id : null;
    res.json({
      success: true,
      message: "✅ Category added successfully!",
      id: newId,
    });
  });
};

// Update category
exports.update = (req, res) => {
  const { id } = req.params;
  const { category_name, slug } = req.body;

  // First, get the old image if exists
  db.query("SELECT icon FROM category WHERE id=$1", [id], (err, result) => {
    if (err)
      return res.status(500).json({ success: false, message: err.message });

    const oldIcon = result.rows[0]?.icon;

    if (req.file) {
      const icon = `/admin/uploads/category/${req.file.filename}`;
      const sql =
        "UPDATE category SET category_name=$1, slug=$2, icon=$3 WHERE id=$4";
      db.query(sql, [category_name, slug, icon, id], (err) => {
        if (err)
          return res.status(500).json({ success: false, message: err.message });

        // Delete old image if exists
        if (oldIcon) deleteFile(oldIcon);

        res.json({
          success: true,
          message: "✅ Category updated successfully (with new image)!",
        });
      });
    } else {
      const sql = "UPDATE category SET category_name=$1, slug=$2 WHERE id=$3";
      db.query(sql, [category_name, slug, id], (err) => {
        if (err)
          return res.status(500).json({ success: false, message: err.message });
        res.json({
          success: true,
          message: "✅ Category updated successfully!",
        });
      });
    }
  });
};

// Delete category
exports.remove = (req, res) => {
  const { id } = req.params;

  // Get image path first to delete file
  db.query("SELECT icon FROM category WHERE id=$1", [id], (err, result) => {
    if (err)
      return res.status(500).json({ success: false, message: err.message });

    const icon = result.rows[0]?.icon;

    db.query("DELETE FROM category WHERE id=$1", [id], (err) => {
      if (err)
        return res.status(500).json({ success: false, message: err.message });

      // Delete image file if exists
      if (icon) deleteFile(icon);

      res.json({ success: true, message: "🗑️ Category deleted successfully!" });
    });
  });
};
