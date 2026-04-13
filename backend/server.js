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
const contactRoutes = require("./admin/routes/contactRoutes");
const app = express();

// --- GLOBAL MIDDLEWARES ---
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/admin/uploads",
  express.static(path.join(__dirname, "../frontend/admin/uploads")),
);

app.use(express.static(path.join(__dirname, "../frontend/public")));

app.use("/auth", authRoutes);
app.use("/category", categoryRoutes);
app.use("/feature-category", featureCategoryRoutes);
app.use("/sliders", sliderRoutes);
app.use("/agents", agentsRoutes);
app.use("/properties", propertiesRoutes);
app.use("/locations", locationRoutes);
app.use("/testimonials", testimonialsRoutes);
app.use("/property-images", propertyImagesRoutes);
app.use("/contact", contactRoutes);

// Admin Page access (Route based protection)
app.get("/admin", verifyToken, isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin/index.html"));
});

app.use(
  "/admin",
  verifyToken,
  isAdmin,
  express.static(path.join(__dirname, "../frontend/admin")),
);

// --- 4. ROOT ROUTE ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public/login.html"));
});

// --- SERVER START ---
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
