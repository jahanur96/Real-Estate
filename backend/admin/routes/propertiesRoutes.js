const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/propertiesController");

// Middleware to normalize checkbox-like values (e.g., featured, status)
router.use((req, res, next) => {
  const normalize = (val) => (val === "on" || val === "1" || val === 1 ? 1 : 0);

  if (req.body) {
    if (typeof req.body.is_featured !== "undefined") {
      req.body.is_featured = normalize(req.body.is_featured);
    }

    if (typeof req.body.status !== "undefined") {
      req.body.status = normalize(req.body.status);
    }
  }

  next();
});

// Dropdown endpoints
router.get("/categories", propertyController.getCategories);
router.get("/feturecategories", propertyController.getFetureCategories);
router.get("/locations", propertyController.getLocations);

// Routes
router.get("/", propertyController.getAll);
router.get("/:id", propertyController.getById);
router.post("/", propertyController.create);
router.put("/:id", propertyController.update);
router.delete("/:id", propertyController.remove);

module.exports = router;
