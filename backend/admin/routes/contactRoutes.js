const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController"); // Controller path thik koro

// POST request path: /contact/submit
router.post("/submit", contactController.submitContactForm);

module.exports = router;
