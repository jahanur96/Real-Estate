const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Folder where images will be saved
const uploadDir = path.join(
  __dirname,
  "../../../frontend/admin/uploads/property_images"
);

// Create folder if it doesn't exist
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// Multer instance
const upload = multer({ storage });

module.exports = upload;
