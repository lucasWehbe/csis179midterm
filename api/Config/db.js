const sequelize = require('./DBConfig'); // Import your DBConfig with Sequelize instance

// Import all 7 models
const User = require('../Models/User');
const Geofence = require('../Models/Geofences');
const LocationHistory = require('../Models/LocationHistory');
const SOSAlert = require('../Models/SOSAlerts');
const EmergencyContact = require('../Models/EmergencyContacts');
const MedicalInfo = require('../Models/MedicalInformation');
const HeatmapData = require('../Models/Heatmap');

// Function to initialize associations and sync the database
const initDB = async () => {
    try {
        // Set up associations
        User.associate({ Geofence, LocationHistory, SOSAlert, EmergencyContact, MedicalInfo });
        Geofence.associate({ User });
        LocationHistory.associate({ User });
        SOSAlert.associate({ User });
        EmergencyContact.associate({ User });
        MedicalInfo.associate({ User });
        // No association for HeatmapData if standalone

        // Sync database models
        await sequelize.sync({ alter: true });
        console.log('Database models synchronized and tables created.');
    } catch (error) {
        console.error('Error initializing database:', error.message || error);
    }
};

module.exports = { sequelize, initDB };