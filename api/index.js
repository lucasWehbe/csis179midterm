const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
require("./WhatsappClient");
const http = require('http');
const { Server } = require("socket.io");


// Import geolocation-specific routes
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
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Your React app URL
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection handling
const trackedUsers = {}; // Store active users and their socket IDs

io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Handle user registration
  socket.on('register', (data) => {
    console.log('User registered:', data);

    const { userId, role } = data;
    socket.userId = userId;
    socket.role = role;

    // Add user to trackedUsers list if not an admin
    if (role === 'user') {
      trackedUsers[userId] = socket.id;
      console.log('Tracked user : ', trackedUsers);
      socket.join(`user-${userId}`);
    } else if (role === 'admin') {
      socket.join('admins');

      // Emit the current list of tracked users to the admin
      socket.emit('current-tracked-users', Object.keys(trackedUsers));
    }
  });

  // Handle location updates from users
  socket.on('location-update', (data) => {
    console.log(`Location update from User ${data.userId}:`, data);

    // Broadcast location updates to all connected admins
    io.to('admins').emit('location-update', {
      userId: data.userId,
      location: data.location,
    });
  });

  // Handle tracking requests from admins
  socket.on('start-tracking', (data) => {
    console.log('Admin requested to start tracking:', data);

    const targetSocketId = trackedUsers[data.targetUserId];
    if (targetSocketId) {
      io.to(targetSocketId).emit('tracking-status', { isTracking: true });
    } else {
      socket.emit('user-offline', { userId: data.targetUserId });
    }
  });

  socket.on('stop-tracking', (data) => {
    console.log('Admin requested to stop tracking:', data);

    const targetSocketId = trackedUsers[data.targetUserId];
    if (targetSocketId) {
      io.to(targetSocketId).emit('tracking-status', { isTracking: false });
    } else {
      socket.emit('user-offline', { userId: data.targetUserId });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);

    // Remove disconnected user from trackedUsers
    for (const userId in trackedUsers) {
      if (trackedUsers[userId] === socket.id) {
        delete trackedUsers[userId];
        console.log(`Removed user ${userId} from tracking list`);
        break;
      }
    }
  });
});


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
server.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================`);
  console.log(`Geolocation server running on port ${PORT}`);
  console.log(`====================================`);
});
