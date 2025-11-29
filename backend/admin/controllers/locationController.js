const db = require("../../db");

/**
 *  Get all locations
 */
exports.getAll = (req, res) => {
  const sql = `
    SELECT id, location_name, location_details, map
    FROM locations
    ORDER BY id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching locations:", err.message);
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    res.json({
      success: true,
      data: results.rows,
    });
  });
};

/**
 * Create new location
 */
exports.create = (req, res) => {
  const { location_name, location_details, map } = req.body;

  const sql = `
    INSERT INTO locations (location_name, location_details, map)
    VALUES ($1, $2, $3)
    RETURNING id
  `;

  db.query(sql, [location_name, location_details, map], (err, result) => {
    if (err) {
      console.error("Error inserting location:", err.message);
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    res.json({
      success: true,
      message: "Location created successfully!",
      id: result.rows[0]?.id || null,
    });
  });
};

/**
 *  Update existing location
 */
exports.update = (req, res) => {
  const { id } = req.params;
  const { location_name, location_details, map } = req.body;

  const sql = `
    UPDATE locations 
    SET location_name=$1, location_details=$2, map=$3
    WHERE id=$4
  `;

  db.query(sql, [location_name, location_details, map, id], (err) => {
    if (err) {
      console.error("Error updating location:", err.message);
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    res.json({
      success: true,
      message: "Location updated successfully!",
    });
  });
};

/**
 *  Delete a location
 */
exports.remove = (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM locations WHERE id=$1`;

  db.query(sql, [id], (err) => {
    if (err) {
      console.error("Error deleting location:", err.message);
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    res.json({
      success: true,
      message: "Location deleted successfully!",
    });
  });
};
