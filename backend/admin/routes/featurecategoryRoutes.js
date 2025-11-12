const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const featureCategoryController = require("../controllers/featureCategoryController");

// Ensure upload folder exists
const uploadDir = path.resolve(
  __dirname,
  "../../../frontend/admin/uploads/feature_category"
);
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

// Multer config
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) cb(null, true);
    else cb(new Error("Only image files (jpg, png, webp) are allowed!"));
  },
});

// Middleware to parse checkbox (is_special)
router.use((req, res, next) => {
  if (req.body && typeof req.body.is_special !== "undefined") {
    // HTML checkbox sends "on" or undefined — convert to 1 or 0
    req.body.is_special =
      req.body.is_special === "on" || req.body.is_special === "1" ? 1 : 0;
  }
  next();
});

// Routes
router.get("/", featureCategoryController.getAll);
router.post("/", upload.single("icon"), featureCategoryController.create);
router.put("/:id", upload.single("icon"), featureCategoryController.update);
router.delete("/:id", featureCategoryController.remove);

// Handle multer errors
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: err.message });
  } else if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
});

module.exports = router;
