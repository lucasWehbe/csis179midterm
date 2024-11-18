const express = require("express");
const router = express.Router();

const {
    createHeatmapDataController,
    getAllHeatmapDataController,
    getHeatmapDataByIdController,
    updateHeatmapDataController,
    deleteHeatmapDataController,
} = require("../Controllers/HeatmapController");


const {
    validateHeatmapDataCreation,
} = require("../Validators/HeatmapValidator");


// Heatmap Routes
router.post("/heatmap", validateHeatmapDataCreation, createHeatmapDataController);
router.get("/heatmap", getAllHeatmapDataController);
router.get("/heatmap/:id", getHeatmapDataByIdController);
router.put("/heatmap/:id", validateHeatmapDataCreation, updateHeatmapDataController);
router.delete("/heatmap/:id", deleteHeatmapDataController);

module.exports = router;