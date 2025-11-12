const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const sliderController = require("../controllers/sliderController");

//  Ensure upload folder exists
const uploadDir = path.resolve(
  __dirname,
  "../../../frontend/admin/uploads/sliders"
);
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

//  Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

//  Multer configuration
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
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

// Middleware to handle checkbox (priority)
router.use((req, res, next) => {
  if (req.body && typeof req.body.priority !== "undefined") {
    req.body.priority =
      req.body.priority === "on" || req.body.priority === "1" ? 1 : 0;
  }
  next();
});

// Routes
router.get("/", sliderController.getAll);
router.post("/", upload.single("image"), sliderController.create);
router.put("/:id", upload.single("image"), sliderController.update);
router.delete("/:id", sliderController.remove);

// Error handling (Multer + general)
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: err.message });
  } else if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
});

module.exports = router;
