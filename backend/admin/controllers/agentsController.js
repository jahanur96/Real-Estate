const db = require("../../db");
const fs = require("fs");
const path = require("path");

function deleteFile(filePath) {
  try {
    const fullPath = path.join(__dirname, "../../../frontend", filePath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  } catch (err) {
    console.error("Error deleting file:", err);
  }
}

exports.getAll = (req, res) => {
  const sql = `SELECT id, Name AS name, image, designation, facebook, twitter, instagram FROM agents ORDER BY id DESC`;
  db.query(sql, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    res.json({ success: true, data: result.rows });
  });
};

exports.create = (req, res) => {
  const { name, designation, facebook, twitter, instagram } = req.body;
  const image = req.file ? `/admin/uploads/agents/${req.file.filename}` : null;
  if (!name)
    return res
      .status(400)
      .json({ success: false, message: "Name is required" });

  const sql = `INSERT INTO agents (Name, image, designation, facebook, twitter, instagram) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`;
  db.query(
    sql,
    [name, image, designation, facebook, twitter, instagram],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      res.json({
        success: true,
        message: "Agent created successfully",
        id: result.rows[0].id,
      });
    }
  );
};

exports.update = (req, res) => {
  const { id } = req.params;
  const { name, designation, facebook, twitter, instagram } = req.body;

  db.query("SELECT image FROM agents WHERE id=$1", [id], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    const oldImage = result.rows[0]?.image;
    const newImage = req.file
      ? `/admin/uploads/agents/${req.file.filename}`
      : oldImage;

    const sql = req.file
      ? `UPDATE agents SET Name=$1, designation=$2, facebook=$3, twitter=$4, instagram=$5, image=$6 WHERE id=$7`
      : `UPDATE agents SET Name=$1, designation=$2, facebook=$3, twitter=$4, instagram=$5 WHERE id=$6`;

    const params = req.file
      ? [name, designation, facebook, twitter, instagram, newImage, id]
      : [name, designation, facebook, twitter, instagram, id];

    db.query(sql, params, (err) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      if (req.file && oldImage) deleteFile(oldImage);
      res.json({ success: true, message: "Agent updated successfully" });
    });
  });
};

exports.remove = (req, res) => {
  const { id } = req.params;
  db.query("SELECT image FROM agents WHERE id=$1", [id], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    const image = result.rows[0]?.image;
    db.query("DELETE FROM agents WHERE id=$1", [id], (err2) => {
      if (err2)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      if (image) deleteFile(image);
      res.json({ success: true, message: "Agent deleted successfully" });
    });
  });
};
