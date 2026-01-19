const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");

// Import Middlewares
const { verifyToken, isAdmin } = require("./admin/middleware/authMiddleware");

// Import Routes
const authRoutes = require("./admin/routes/authRoutes");
const categoryRoutes = require("./admin/routes/categoryRoutes");
const featureCategoryRoutes = require("./admin/routes/featurecategoryRoutes");
const sliderRoutes = require("./admin/routes/sliderRoutes");
const agentsRoutes = require("./admin/routes/agentsRoutes");
const propertiesRoutes = require("./admin/routes/propertiesRoutes");
const locationRoutes = require("./admin/routes/locationsRoutes");
const testimonialsRoutes = require("./admin/routes/testimonialsRoutes");
const propertyImagesRoutes = require("./admin/routes/propertyImagesRoutes");

const app = express();

// --- GLOBAL MIDDLEWARES ---
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// --- STATIC FILES (Frontend Public Folder) ---
// এটি login.html এবং অন্যান্য পাবলিক অ্যাসেট সার্ভ করবে
app.use(express.static(path.join(__dirname, "../frontend/public")));

// --- AUTH ROUTE ---
app.use("/auth", authRoutes);
app.use("/category", categoryRoutes);
app.use("/feature-category", featureCategoryRoutes);
app.use("/sliders", sliderRoutes);
app.use("/agents", agentsRoutes);
app.use("/properties", propertiesRoutes);
app.use("/locations", locationRoutes);
app.use("/testimonials", testimonialsRoutes);
app.use("/property-images", propertyImagesRoutes);

// --- ADMIN DASHBOARD ROUTE (The Protector) ---
// 1. মূল অ্যাডমিন HTML ফাইল সার্ভ করা (verifyToken দিয়ে প্রোটেক্টেড)
app.get("/admin", verifyToken, isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin/index.html"));
});

// 2. অ্যাডমিন প্যানেলের ভিতরের ফাইলগুলো (CSS, JS, Pages) সার্ভ করা
// এটি জরুরি, কারণ admin/index.html এর ভিতর থেকে 'dist/css/adminlte.min.css' কল করা হয়
app.use(
  "/admin",
  verifyToken,
  isAdmin,
  express.static(path.join(__dirname, "../frontend/admin")),
);

// --- ROOT ROUTE ---
// কেউ শুধু '/' এ হিট করলে লগইন পেজে পাঠাবে
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public/login.html"));
});

// --- SERVER START ---
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
