const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const authRoutes = require("./public/routes/authRoutes");
const categoryRoutes = require("./admin/routes/categoryRoutes");
const featureCategoryRoutes = require("./admin/routes/featurecategoryRoutes");
const sliderRoutes = require("./admin/routes/sliderRoutes");
const agentsRoutes = require("./admin/routes/agentsRoutes");
const propertiesRoutes = require("./admin/routes/propertiesRoutes");
// Location Routes
const locationRoutes = require("./admin/routes/locationsRoutes");
const testimonialsRoutes = require("./admin/routes/testimonialsRoutes");
const propertyImagesRoutes = require("./admin/routes/propertyImagesRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));
app.use(express.urlencoded({ extended: true }));

// Serve admin static files
app.use("/admin", express.static(path.join(__dirname, "../frontend/admin")));
app.use(
  "/admin/uploads",
  express.static(path.join(__dirname, "../frontend/admin/uploads"))
);

// Catch-all for admin HTML pages (like category.html)
app.get("/admin/:page", (req, res) => {
  const page = req.params.page;
  const filePath = path.join(__dirname, "../frontend/admin", `${page}.html`);

  // Check if file exists
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send("Page not found");
  }
});

// API routes
app.use("/", authRoutes);
app.use("/category", categoryRoutes);
app.use("/feature-category", featureCategoryRoutes);
app.use("/sliders", sliderRoutes);
app.use("/agents", agentsRoutes);
app.use("/properties", propertiesRoutes);
app.use("/locations", locationRoutes);
app.use("/testimonials", testimonialsRoutes);
app.use("/property-images", propertyImagesRoutes);

// Test route
app.get("/", (req, res) => res.send("Server is running"));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res
    .status(500)
    .json({ success: false, message: "Server error", error: err.message });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
