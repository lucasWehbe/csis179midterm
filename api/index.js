const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
require("./WhatsappClient");

// Import your geolocation-specific routes
const userRoutes = require("./Routes/UserRoutes");
const geofenceRoutes = require("./Routes/GeofencesRoutes");
const locationHistoryRoutes = require("./Routes/LocationHistoryRoutes");
const sosAlertRoutes = require("./Routes/SOSAlertsRoutes");
const emergencyContactRoutes = require("./Routes/EmergencyContactsRoutes");
const medicalInfoRoutes = require("./Routes/MedicalInfoRoutes");
const heatmapRoutes = require("./Routes/HeatmapRoutes");

// const { initDB } = require('./Config/db');

dotenv.config();

const app = express();

app.use(cors());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//  initDB();

// Register geolocation-specific routes
app.use("/api/users", userRoutes);
app.use("/api/geofences", geofenceRoutes);
app.use("/api/location-history", locationHistoryRoutes);
app.use("/api/sos-alerts", sosAlertRoutes);
app.use("/api/emergency-contacts", emergencyContactRoutes);
app.use("/api/medical-info", medicalInfoRoutes);
app.use("/api/heatmap", heatmapRoutes);

// Root route to confirm the API is running
app.get("/", (req, res) => {
  res.send("Geolocation API running");
});

// Global error handling middleware
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ message: "Internal Server Error" });
  } else {
    console.error(err.stack);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`====================================`);
  console.log(`Geolocation server running on port ${PORT}`);
  console.log(`====================================`);
});
