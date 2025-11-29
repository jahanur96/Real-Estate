const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");

// Routes
router.get("/", locationController.getAll);
router.post("/", locationController.create);
router.put("/:id", locationController.update);
router.delete("/:id", locationController.remove);

module.exports = router;
