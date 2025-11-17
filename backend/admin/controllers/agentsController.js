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

// Get all agents
exports.getAll = (req, res) => {
  const sql =
    "SELECT id, name, designation, image, facebook, twitter, instagram FROM agents";
  db.query(sql, (err, results) => {
    if (err)
      return res.status(500).json({ success: false, message: err.message });
    res.json(results.rows);
  });
};

// Create agent
exports.create = (req, res) => {
  const { name, designation, facebook, twitter, instagram } = req.body;
  const image = req.file ? `/admin/uploads/agents/${req.file.filename}` : null;

  const sql =
    "INSERT INTO agents (name, designation, image, facebook, twitter, instagram) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id";
  db.query(
    sql,
    [name, designation, image, facebook, twitter, instagram],
    (err, result) => {
      if (err)
        return res.status(500).json({ success: false, message: err.message });
      const newId = result.rows.length > 0 ? result.rows[0].id : null;
      res.json({
        success: true,
        message: " Agent added successfully!",
        id: newId,
      });
    }
  );
};

// Update agent
exports.update = (req, res) => {
  const { id } = req.params;
  const { name, designation, facebook, twitter, instagram } = req.body;

  // First, get the old image if exists
  db.query("SELECT image FROM agents WHERE id=$1", [id], (err, result) => {
    if (err)
      return res.status(500).json({ success: false, message: err.message });

    const oldImage = result.rows[0]?.image;

    if (req.file) {
      const image = `/admin/uploads/agents/${req.file.filename}`;
      const sql =
        "UPDATE agents SET name=$1, designation=$2, image=$3, facebook=$4, twitter=$5, instagram=$6 WHERE id=$7";
      db.query(
        sql,
        [name, designation, image, facebook, twitter, instagram, id],
        (err) => {
          if (err)
            return res
              .status(500)
              .json({ success: false, message: err.message });

          // Delete old image if exists
          if (oldImage) deleteFile(oldImage);

          res.json({
            success: true,
            message: " Agent updated successfully (with new image)!",
          });
        }
      );
    } else {
      const sql =
        "UPDATE agents SET name=$1, designation=$2, facebook=$3, twitter=$4, instagram=$5 WHERE id=$6";
      db.query(
        sql,
        [name, designation, facebook, twitter, instagram, id],
        (err) => {
          if (err)
            return res
              .status(500)
              .json({ success: false, message: err.message });
          res.json({
            success: true,
            message: " Agent updated successfully!",
          });
        }
      );
    }
  });
};

// Delete agent
exports.remove = (req, res) => {
  const { id } = req.params;

  // Get image path first to delete file
  db.query("SELECT image FROM agents WHERE id=$1", [id], (err, result) => {
    if (err)
      return res.status(500).json({ success: false, message: err.message });

    const image = result.rows[0]?.image;

    db.query("DELETE FROM agents WHERE id=$1", [id], (err) => {
      if (err)
        return res.status(500).json({ success: false, message: err.message });

      // Delete image file if exists
      if (image) deleteFile(image);

      res.json({ success: true, message: "🗑️ Agent deleted successfully!" });
    });
  });
};
