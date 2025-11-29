const db = require("../../db");

// Dropdowns
exports.getCategories = (req, res) => {
  db.query(
    "SELECT id, category_name FROM category ORDER BY category_name ASC",
    (err, result) => {
      if (err)
        return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, data: result.rows });
    }
  );
};

exports.getFeatureCategories = (req, res) => {
  db.query(
    "SELECT id, category_name FROM feture_category ORDER BY category_name ASC",
    (err, result) => {
      if (err)
        return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, data: result.rows });
    }
  );
};

exports.getLocations = (req, res) => {
  db.query(
    "SELECT id, location_name FROM locations ORDER BY location_name ASC",
    (err, result) => {
      if (err)
        return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, data: result.rows });
    }
  );
};

// CRUD
exports.getAll = (req, res) => {
  const sql = `
    SELECT p.id, p.property_title, p.price,
           c.category_name,
           f.category_name AS feture_category,
           l.location_name
    FROM properties p
    LEFT JOIN category c ON p.category=c.id
    LEFT JOIN feture_category f ON p.feture_category=f.id
    LEFT JOIN locations l ON p.location=l.id
    ORDER BY p.id DESC
  `;
  db.query(sql, (err, result) => {
    if (err)
      return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, data: result.rows });
  });
};

exports.getById = (req, res) => {
  db.query(
    "SELECT * FROM properties WHERE id=$1",
    [req.params.id],
    (err, result) => {
      if (err)
        return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, data: result.rows[0] });
    }
  );
};

exports.create = (req, res) => {
  const data = req.body;
  const sql = `
    INSERT INTO properties(
      property_title, price, category, feture_category, short_description, location,
      property_description, size, bedrooms, bathrooms, kitchen, garage, year_built,
      heating, air_conditioning, wifi, security_cameras, cable_tv, solar_power,
      fireplace, ventilation, internet, lift, dishwasher, pool, parking, gym
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27
    ) RETURNING id
  `;
  const values = [
    data.property_title,
    data.price,
    data.category || null,
    data.feture_category || null,
    data.short_description,
    data.location || null,
    data.property_description,
    data.size,
    data.bedrooms,
    data.bathrooms,
    data.kitchen,
    data.garage,
    data.year_built,
    data.heating,
    data.air_conditioning,
    data.wifi,
    data.security_cameras,
    data.cable_tv,
    data.solar_power,
    data.fireplace,
    data.ventilation,
    data.internet,
    data.lift,
    data.dishwasher,
    data.pool,
    data.parking,
    data.gym,
  ];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.status(500).json({ success: false, message: err.message });
    res.json({
      success: true,
      message: "Property created successfully",
      id: result.rows[0].id,
    });
  });
};

exports.update = (req, res) => {
  const data = req.body;
  const sql = `
    UPDATE properties SET
      property_title=$1, price=$2, category=$3, feture_category=$4, short_description=$5, location=$6,
      property_description=$7, size=$8, bedrooms=$9, bathrooms=$10, kitchen=$11, garage=$12, year_built=$13,
      heating=$14, air_conditioning=$15, wifi=$16, security_cameras=$17, cable_tv=$18, solar_power=$19,
      fireplace=$20, ventilation=$21, internet=$22, lift=$23, dishwasher=$24, pool=$25, parking=$26, gym=$27
    WHERE id=$28
  `;
  const values = [
    data.property_title,
    data.price,
    data.category || null,
    data.feture_category || null,
    data.short_description,
    data.location || null,
    data.property_description,
    data.size,
    data.bedrooms,
    data.bathrooms,
    data.kitchen,
    data.garage,
    data.year_built,
    data.heating,
    data.air_conditioning,
    data.wifi,
    data.security_cameras,
    data.cable_tv,
    data.solar_power,
    data.fireplace,
    data.ventilation,
    data.internet,
    data.lift,
    data.dishwasher,
    data.pool,
    data.parking,
    data.gym,
    req.params.id,
  ];
  db.query(sql, values, (err) => {
    if (err)
      return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: "Property updated successfully" });
  });
};

exports.remove = (req, res) => {
  db.query("DELETE FROM properties WHERE id=$1", [req.params.id], (err) => {
    if (err)
      return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: "Property deleted successfully" });
  });
};
