const db = require("../../db");
const fs = require("fs");
const path = require("path");

// Helper: safely delete file
function deleteFile(filePath) {
  try {
    const fullPath = path.join(__dirname, "../../frontend", filePath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  } catch (err) {
    console.error("Error deleting file:", err);
  }
}

/**
 * Get all images with property title
 */
exports.getAll = (req, res) => {
  const sql = `
    SELECT pi.id, pi.property_id, pi.image, pi.image_type, pi.status, p.property_title
    FROM property_images pi
    LEFT JOIN properties p ON pi.property_id = p.id
    ORDER BY pi.id DESC
  `;
  db.query(sql, (err, result) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Database error",
        error: err.message,
      });
    res.json({ success: true, data: result.rows });
  });
};

/**
 * Get images by property
 */
exports.getByProperty = (req, res) => {
  const { property_id } = req.params;
  const sql = `
    SELECT pi.id, pi.property_id, pi.image, pi.image_type, pi.status, p.property_title
    FROM property_images pi
    LEFT JOIN properties p ON pi.property_id = p.id
    WHERE pi.property_id=$1
    ORDER BY pi.id DESC
  `;
  db.query(sql, [property_id], (err, result) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Database error",
        error: err.message,
      });
    res.json({ success: true, data: result.rows });
  });
};

/**
 * Upload multiple images for a property
 */
exports.createMultiple = (req, res) => {
  const { property_id, image_type, status } = req.body;
  if (!property_id)
    return res
      .status(400)
      .json({ success: false, message: "property_id required" });
  if (!req.files || req.files.length === 0)
    return res
      .status(400)
      .json({ success: false, message: "At least one image required" });

  const sql = `INSERT INTO property_images (property_id, image, image_type, status) VALUES ($1,$2,$3,$4) RETURNING id`;

  const promises = req.files.map((file) => {
    const imgPath = `/admin/uploads/property_images/${file.filename}`;
    return new Promise((resolve, reject) => {
      db.query(
        sql,
        [property_id, imgPath, image_type || 1, status || 1],
        (err, result) => {
          if (err) reject(err);
          else resolve(result.rows[0].id);
        }
      );
    });
  });

  Promise.all(promises)
    .then((ids) =>
      res.json({ success: true, message: "Images uploaded successfully", ids })
    )
    .catch((err) =>
      res
        .status(500)
        .json({ success: false, message: "Database error", error: err.message })
    );
};

/**
 * Update multiple images for a property (replace all)
 */
exports.updateMultiple = (req, res) => {
  const { property_id, image_type, status } = req.body;
  if (!property_id)
    return res
      .status(400)
      .json({ success: false, message: "property_id required" });
  if (!req.files || req.files.length === 0)
    return res
      .status(400)
      .json({ success: false, message: "At least one image required" });

  // Fetch old images
  db.query(
    "SELECT id, image FROM property_images WHERE property_id=$1",
    [property_id],
    (err, result) => {
      if (err)
        return res.status(500).json({
          success: false,
          message: "Database error",
          error: err.message,
        });

      // Delete old files
      result.rows.forEach((r) => deleteFile(r.image));

      // Delete old DB records
      db.query(
        "DELETE FROM property_images WHERE property_id=$1",
        [property_id],
        (err2) => {
          if (err2)
            return res.status(500).json({
              success: false,
              message: "Database error",
              error: err2.message,
            });

          // Insert new images
          const sql = `INSERT INTO property_images (property_id, image, image_type, status) VALUES ($1,$2,$3,$4) RETURNING id`;
          const promises = req.files.map((file) => {
            const imgPath = `/admin/uploads/property_images/${file.filename}`;
            return new Promise((resolve, reject) => {
              db.query(
                sql,
                [property_id, imgPath, image_type || 1, status || 1],
                (err, result) => {
                  if (err) reject(err);
                  else resolve(result.rows[0].id);
                }
              );
            });
          });

          Promise.all(promises)
            .then((ids) =>
              res.json({
                success: true,
                message: "Images updated successfully",
                ids,
              })
            )
            .catch((err) =>
              res.status(500).json({
                success: false,
                message: "Database error",
                error: err.message,
              })
            );
        }
      );
    }
  );
};

/**
 * Delete single image
 */
exports.remove = (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT image FROM property_images WHERE id=$1",
    [id],
    (err, result) => {
      if (err)
        return res.status(500).json({
          success: false,
          message: "Database error",
          error: err.message,
        });

      const img = result.rows[0]?.image;

      db.query("DELETE FROM property_images WHERE id=$1", [id], (err2) => {
        if (err2)
          return res.status(500).json({
            success: false,
            message: "Database error",
            error: err2.message,
          });

        if (img) deleteFile(img);
        res.json({ success: true, message: "Image deleted successfully" });
      });
    }
  );
};

/**
 * Delete all images for a property
 */
exports.removeByProperty = (req, res) => {
  const { property_id } = req.params;
  db.query(
    "SELECT image FROM property_images WHERE property_id=$1",
    [property_id],
    (err, result) => {
      if (err)
        return res.status(500).json({
          success: false,
          message: "Database error",
          error: err.message,
        });

      result.rows.forEach((r) => deleteFile(r.image));

      db.query(
        "DELETE FROM property_images WHERE property_id=$1",
        [property_id],
        (err2) => {
          if (err2)
            return res.status(500).json({
              success: false,
              message: "Database error",
              error: err2.message,
            });

          res.json({
            success: true,
            message: "All images for this property deleted",
          });
        }
      );
    }
  );
};
