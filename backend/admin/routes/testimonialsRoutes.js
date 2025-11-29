const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const testimonialsController = require("../controllers/testimonialsController");

// Ensure folder exists
const uploadDir = path.resolve(
  __dirname,
  "../../../frontend/admin/uploads/testimonials"
);
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    if (allowed.test(file.mimetype)) cb(null, true);
    else cb(new Error("Only image files allowed!"));
  },
});

// Routes
router.get("/", testimonialsController.getAll);
router.post("/", upload.single("image"), testimonialsController.create);
router.put("/:id", upload.single("image"), testimonialsController.update);
router.delete("/:id", testimonialsController.remove);

// Error handling
router.use((err, req, res, next) =>
  res.status(400).json({ success: false, message: err.message })
);

module.exports = router;
