const db = require("../../db");
const fs = require("fs");
const path = require("path");

/**
 * Helper: Delete file safely
 */
function deleteFile(filePath) {
  try {
    const fullPath = path.join(__dirname, "../../../frontend", filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log("🗑️ Deleted old file:", filePath);
    }
  } catch (err) {
    console.error(" Error deleting file:", err);
  }
}

/**
 *  Get all sliders
 */
exports.getAll = (req, res) => {
  const sql = `
    SELECT id, title, poirity, short_description, url, image
    FROM sliders
    ORDER BY  id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(" Error fetching sliders:", err.message);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }

    console.log("Slider list result:", results.rows); // <-- ADD THIS LINE
    res.json({ success: true, data: results.rows });
  });
};

/**
 * Create new slider
 */
exports.create = (req, res) => {
  const { title, poirity, short_description, url } = req.body;
  const image = req.file ? `/admin/uploads/sliders/${req.file.filename}` : null;

  if (!image) {
    return res.status(400).json({
      success: false,
      message: "Image is required for creating a slider.",
    });
  }

  const sql = `
    INSERT INTO sliders (title, poirity, short_description, url, image)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `;

  db.query(
    sql,
    [title, poirity || 0, short_description, url, image],
    (err, result) => {
      if (err) {
        console.error(" Error inserting slider:", err.message);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }

      res.json({
        success: true,
        message: " Slider created successfully!",
        id: result.rows[0]?.id || null,
      });
    }
  );
};

/**
 *  Update existing slider
 */
exports.update = (req, res) => {
  const { id } = req.params;
  const { title, poirity, short_description, url } = req.body;

  // Get current image
  db.query("SELECT image FROM sliders WHERE id=$1", [id], (err, result) => {
    if (err) {
      console.error(" Error fetching old image:", err.message);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }

    const oldImage = result.rows[0]?.image;

    // If new image uploaded
    if (req.file) {
      const newImage = `/admin/uploads/sliders/${req.file.filename}`;
      const sql = `
        UPDATE sliders
        SET title=$1, poirity=$2, short_description=$3, url=$4, image=$5
        WHERE id=$6
      `;

      db.query(
        sql,
        [title, poirity || 0, short_description, url, newImage, id],
        (err) => {
          if (err) {
            console.error(
              " Error updating slider (with new image):",
              err.message
            );
            return res
              .status(500)
              .json({ success: false, message: "Database error" });
          }

          if (oldImage) deleteFile(oldImage);

          res.json({
            success: true,
            message: " Slider updated successfully (new image uploaded)!",
          });
        }
      );
    } else {
      // No new image uploaded
      const sql = `
        UPDATE sliders
        SET title=$1, poirity=$2, short_description=$3, url=$4
        WHERE id=$5
      `;

      db.query(
        sql,
        [title, poirity || 0, short_description, url, id],
        (err) => {
          if (err) {
            console.error(" Error updating slider:", err.message);
            return res
              .status(500)
              .json({ success: false, message: "Database error" });
          }

          res.json({
            success: true,
            message: " Slider updated successfully!",
          });
        }
      );
    }
  });
};

/**
 *  Delete a slider
 */
exports.remove = (req, res) => {
  const { id } = req.params;

  db.query("SELECT image FROM sliders WHERE id=$1", [id], (err, result) => {
    if (err) {
      console.error(" Error fetching slider for deletion:", err.message);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }

    const image = result.rows[0]?.image;

    db.query("DELETE FROM sliders WHERE id=$1", [id], (err2) => {
      if (err2) {
        console.error("Error deleting slider:", err2.message);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }

      if (image) deleteFile(image);

      res.json({
        success: true,
        message: "Slider deleted successfully!",
      });
    });
  });
};
