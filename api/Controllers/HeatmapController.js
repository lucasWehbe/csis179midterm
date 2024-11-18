const {
    createHeatmapData,
    getAllHeatmapData,
    getHeatmapDataById,
    updateHeatmapData,
    deleteHeatmapData,
} = require('../Services/HeatmapServices');

const createHeatmapDataController = async (req, res) => {
    const { latitude, longitude, dataSource, severityLevel } = req.body;
    try {
        const data = await createHeatmapData(latitude, longitude, dataSource, severityLevel);
        res.status(201).json({ message: 'Heatmap data created', data });
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
};

const getAllHeatmapDataController = async (req, res) => {
    try {
        const heatmapData = await getAllHeatmapData();
        res.status(200).json({ heatmapData });
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
};

const getHeatmapDataByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await getHeatmapDataById(id);
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
};

const updateHeatmapDataController = async (req, res) => {
    const { id } = req.params;
    const { latitude, longitude, dataSource, severityLevel } = req.body;
    try {
        const updatedData = await updateHeatmapData(id, latitude, longitude, dataSource, severityLevel);
        res.status(200).json({ message: 'Heatmap data updated', data: updatedData });
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
};

const deleteHeatmapDataController = async (req, res) => {
    const { id } = req.params;
    try {
        await deleteHeatmapData(id);
        res.status(200).json({ message: 'Heatmap data deleted' });
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
};

module.exports = {
    createHeatmapDataController,
    getAllHeatmapDataController,
    getHeatmapDataByIdController,
    updateHeatmapDataController,
    deleteHeatmapDataController,
};
