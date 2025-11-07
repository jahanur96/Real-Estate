const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const authRoutes = require("./public/routes/authRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Admin static folder serve
app.use("/admin", express.static(path.join(__dirname, "../frontend/admin")));
// Routes
app.use("/", authRoutes);

// Example route
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
