const db = require("../../db");
const fs = require("fs");
const path = require("path");

// Helper to delete old image
function deleteFile(filePath) {
  try {
    const fullPath = path.join(__dirname, "../../../frontend", filePath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  } catch (err) {
    console.error("Error deleting file:", err);
  }
}

// Get all testimonials
exports.getAll = (req, res) => {
  const sql = `SELECT * FROM testimonials ORDER BY id DESC`;
  db.query(sql, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    res.json({ success: true, data: result.rows });
  });
};

// Create testimonial
exports.create = (req, res) => {
  const { client_name, profession, details } = req.body;
  const image = req.file
    ? `/admin/uploads/testimonials/${req.file.filename}`
    : null;

  if (!client_name)
    return res
      .status(400)
      .json({ success: false, message: "Client name is required" });

  const sql = `INSERT INTO testimonials (client_name, profession, details, image)
               VALUES ($1, $2, $3, $4) RETURNING id`;

  db.query(sql, [client_name, profession, details, image], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    res.json({
      success: true,
      message: "Testimonial created successfully",
      id: result.rows[0].id,
    });
  });
};

// Update testimonial
exports.update = (req, res) => {
  const { id } = req.params;
  const { client_name, profession, details } = req.body;

  db.query(
    "SELECT image FROM testimonials WHERE id=$1",
    [id],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });

      const oldImage = result.rows[0]?.image;
      const newImage = req.file
        ? `/admin/uploads/testimonials/${req.file.filename}`
        : oldImage;

      const sql = `UPDATE testimonials SET client_name=$1, profession=$2, details=$3, image=$4 WHERE id=$5`;
      db.query(sql, [client_name, profession, details, newImage, id], (err) => {
        if (err)
          return res
            .status(500)
            .json({ success: false, message: "Database error" });

        if (req.file && oldImage) deleteFile(oldImage);

        res.json({
          success: true,
          message: "Testimonial updated successfully",
        });
      });
    }
  );
};

// Delete testimonial
exports.remove = (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT image FROM testimonials WHERE id=$1",
    [id],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });

      const image = result.rows[0]?.image;

      db.query("DELETE FROM testimonials WHERE id=$1", [id], (err2) => {
        if (err2)
          return res
            .status(500)
            .json({ success: false, message: "Database error" });

        if (image) deleteFile(image);

        res.json({
          success: true,
          message: "Testimonial deleted successfully",
        });
      });
    }
  );
};
