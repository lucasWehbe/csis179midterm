const express = require("express");
const router = express.Router();

const {
    createLocationHistoryController,
    getAllLocationHistoryController,
    getLocationHistoryByIdController,
    updateLocationHistoryController,
    deleteLocationHistoryController,
} = require("../Controllers/LocationHistoryController");

const {
    validateLocationHistoryCreation,
} = require("../Validators/LocationHistoryValidator");

// Location History Routes
router.post("/location-history", validateLocationHistoryCreation, createLocationHistoryController);
router.get("/location-history", getAllLocationHistoryController);
router.get("/location-history/:id", getLocationHistoryByIdController);
router.put("/location-history/:id", validateLocationHistoryCreation, updateLocationHistoryController);
router.delete("/location-history/:id", deleteLocationHistoryController);

module.exports = router;