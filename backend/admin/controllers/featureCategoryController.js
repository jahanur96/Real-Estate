const db = require("../../db");
const fs = require("fs");
const path = require("path");

//  Helper to safely delete files
function deleteFile(filePath) {
  const fullPath = path.join(__dirname, "../../../frontend", filePath);
  if (fs.existsSync(fullPath)) {
    fs.unlink(fullPath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });
  }
}

//Get all feature categories
exports.getAll = (req, res) => {
  const sql = `
    SELECT 
      id, 
      category_name, 
      slug, 
      image, 
      is_special 
    FROM feture_category 
    ORDER BY id DESC
  `;

  db.query(sql, (err, results) => {
    if (err)
      return res.status(500).json({ success: false, message: err.message });
    res.json(results.rows);
  });
};

// Create new feature category
exports.create = (req, res) => {
  const { category_name, slug, is_special } = req.body;
  const image = req.file
    ? `/admin/uploads/feature_category/${req.file.filename}`
    : null;

  const sql = `
    INSERT INTO feture_category (category_name, slug, image, is_special)
    VALUES ($1, $2, $3, $4)
    RETURNING id
  `;

  db.query(
    sql,
    [category_name, slug, image, is_special || 0],
    (err, result) => {
      if (err)
        return res.status(500).json({ success: false, message: err.message });

      const newId = result.rows.length > 0 ? result.rows[0].id : null;
      res.json({
        success: true,
        message: " Feature category added successfully!",
        id: newId,
      });
    }
  );
};

//  Update existing feature category
exports.update = (req, res) => {
  const { id } = req.params;
  const { category_name, slug, is_special } = req.body;

  // Fetch existing image first
  db.query(
    "SELECT image FROM feture_category WHERE id=$1",
    [id],
    (err, result) => {
      if (err)
        return res.status(500).json({ success: false, message: err.message });

      const oldImage = result.rows[0]?.image;

      // If new file uploaded
      if (req.file) {
        const image = `/admin/uploads/feature_category/${req.file.filename}`;
        const sql = `
        UPDATE feture_category 
        SET category_name=$1, slug=$2, image=$3, is_special=$4
        WHERE id=$5
      `;
        db.query(
          sql,
          [category_name, slug, image, is_special || 0, id],
          (err) => {
            if (err)
              return res
                .status(500)
                .json({ success: false, message: err.message });

            if (oldImage) deleteFile(oldImage);

            res.json({
              success: true,
              message:
                "✅ Feature category updated successfully (with new image)!",
            });
          }
        );
      } else {
        // No new image uploaded
        const sql = `
        UPDATE feture_category 
        SET category_name=$1, slug=$2, is_special=$3
        WHERE id=$4
      `;
        db.query(sql, [category_name, slug, is_special || 0, id], (err) => {
          if (err)
            return res
              .status(500)
              .json({ success: false, message: err.message });

          res.json({
            success: true,
            message: "Feature category updated successfully!",
          });
        });
      }
    }
  );
};

//  Delete feature category
exports.remove = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT image FROM feture_category WHERE id=$1",
    [id],
    (err, result) => {
      if (err)
        return res.status(500).json({ success: false, message: err.message });

      const image = result.rows[0]?.image;

      db.query("DELETE FROM feture_category WHERE id=$1", [id], (err) => {
        if (err)
          return res.status(500).json({ success: false, message: err.message });

        if (image) deleteFile(image);

        res.json({
          success: true,
          message: "Feature category deleted successfully!",
        });
      });
    }
  );
};
