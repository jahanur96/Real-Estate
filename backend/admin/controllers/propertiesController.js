const db = require("../../db");
const fs = require("fs");
const path = require("path");
// ---------------- DROPDOWN ----------------

// Get all categories
exports.getCategories = (req, res) => {
  const sql = `SELECT id, category_name FROM category ORDER BY category_name ASC`;
  db.query(sql, (err, result) => {
    if (err)
      return res.status(500).json({ success: false, message: "DB error" });
    res.json({ success: true, data: result.rows });
  });
};

// Get all feature categories
exports.getFetureCategories = (req, res) => {
  const sql = `SELECT id, category_name FROM feture_category ORDER BY category_name ASC`;
  db.query(sql, (err, result) => {
    if (err)
      return res.status(500).json({ success: false, message: "DB error" });
    res.json({ success: true, data: result.rows });
  });
};

// Get all locations
exports.getLocations = (req, res) => {
  const sql = `SELECT id, location_name FROM locations ORDER BY location_name ASC`;
  db.query(sql, (err, result) => {
    if (err)
      return res.status(500).json({ success: false, message: "DB error" });
    res.json({ success: true, data: result.rows });
  });
};

// ---------------- PROPERTIES ----------------

// Get all properties
exports.getAll = (req, res) => {
  const sql = `
    SELECT p.id, p.property_title, p.price,
           c.category_name,
           f.feture_name AS feture_category,
           l.location_name,
           p.order_id
    FROM properties p
    LEFT JOIN category c ON p.category = c.category_id
    LEFT JOIN feture_category f ON p.feture_category = f.feture_id
    LEFT JOIN locations l ON p.location = l.id
    ORDER BY p.id DESC
  `;
  db.query(sql, (err, result) => {
    if (err)
      return res.status(500).json({ success: false, message: "DB error" });
    res.json({ success: true, data: result.rows });
  });
};

// Get single property by ID
exports.getById = (req, res) => {
  const sql = "SELECT * FROM properties WHERE id=$1";
  db.query(sql, [req.params.id], (err, result) => {
    if (err)
      return res.status(500).json({ success: false, message: "DB error" });
    res.json({ success: true, data: result.rows[0] });
  });
};

// Create new property
exports.create = (req, res) => {
  const {
    property_title,
    price,
    category,
    feture_category,
    location,
    order_id,
  } = req.body;

  const sql = `
    INSERT INTO properties
    (property_title, price, category, feture_category, location, order_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id
  `;
  db.query(
    sql,
    [property_title, price, category, feture_category, location, order_id],
    (err, result) => {
      if (err)
        return res.status(500).json({ success: false, message: "DB error" });
      res.json({
        success: true,
        message: "Property created successfully",
        id: result.rows[0].id,
      });
    }
  );
};

// Update property
exports.update = (req, res) => {
  const {
    property_title,
    price,
    category,
    feture_category,
    location,
    order_id,
  } = req.body;

  const sql = `
    UPDATE properties
    SET property_title=$1, price=$2, category=$3, feture_category=$4, location=$5, order_id=$6
    WHERE id=$7
  `;
  db.query(
    sql,
    [
      property_title,
      price,
      category,
      feture_category,
      location,
      order_id,
      req.params.id,
    ],
    (err) => {
      if (err)
        return res.status(500).json({ success: false, message: "DB error" });
      res.json({ success: true, message: "Property updated successfully" });
    }
  );
};

// Delete property
exports.remove = (req, res) => {
  const sql = "DELETE FROM properties WHERE id=$1";
  db.query(sql, [req.params.id], (err) => {
    if (err)
      return res.status(500).json({ success: false, message: "DB error" });
    res.json({ success: true, message: "Property deleted successfully" });
  });
};
