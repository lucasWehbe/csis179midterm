const express = require("express");
const router = express.Router();

const {
    createGeofenceController,
    getAllGeofencesController,
    getGeofenceByIdController,
    updateGeofenceController,
    deleteGeofenceController,
} = require("../Controllers/GeofencesController");

const {
    validateGeofenceCreation,
} = require("../Validators/GeofencesValidator");

// Geofences Routes
router.post("/", validateGeofenceCreation, createGeofenceController);
router.get("/", getAllGeofencesController);
router.get("/:id", getGeofenceByIdController);
router.put("/:id", validateGeofenceCreation, updateGeofenceController);
router.delete("/:id", deleteGeofenceController);

module.exports = router;