const express = require("express");
const router = express.Router();
const propertyImagesController = require("../controllers/propertyImagesController");
const upload = require("../middleware/uploadPropertyImages"); // multer middleware

// Get all images
router.get("/", propertyImagesController.getAll);

// Get images by property_id
router.get("/property/:property_id", propertyImagesController.getByProperty);

// Upload multiple images
router.post(
  "/",
  upload.array("images", 20),
  propertyImagesController.createMultiple
);

// Update multiple images for a property
router.put(
  "/",
  upload.array("images", 20),
  propertyImagesController.updateMultiple
);

// Delete single image
router.delete("/:id", propertyImagesController.remove);

// Delete all images for a property
router.delete(
  "/property/:property_id",
  propertyImagesController.removeByProperty
);

module.exports = router;
