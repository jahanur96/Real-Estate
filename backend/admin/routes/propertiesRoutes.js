const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/propertiesController");

// Dropdowns
router.get("/categories", propertyController.getCategories);
router.get("/feature-categories", propertyController.getFeatureCategories);
router.get("/locations", propertyController.getLocations);

// CRUD
router.get("/", propertyController.getAll);
router.get("/:id", propertyController.getById);
router.post("/", propertyController.create);
router.put("/:id", propertyController.update);
router.delete("/:id", propertyController.remove);

module.exports = router;
