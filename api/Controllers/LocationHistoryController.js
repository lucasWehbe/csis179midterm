const {
    createLocationHistory,
    getAllLocationHistory,
    getLocationHistoryById,
    updateLocationHistory,
    deleteLocationHistory,
} = require('../Services/LocationHistoryService');

const createLocationHistoryController = async (req, res) => {
    const { userId, latitude, longitude } = req.body;
    try {
        const location = await createLocationHistory(userId, latitude, longitude);
        res.status(201).json({ message: 'Location history created', location });
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
};

const getAllLocationHistoryController = async (req, res) => {
    try {
        const locations = await getAllLocationHistory();
        res.status(200).json({ locations });
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
};

const getLocationHistoryByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const location = await getLocationHistoryById(id);
        res.status(200).json({ location });
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
};

const updateLocationHistoryController = async (req, res) => {
    const { id } = req.params;
    const { latitude, longitude, timestamp } = req.body;
    try {
        const updatedLocation = await updateLocationHistory(id, latitude, longitude, timestamp);
        res.status(200).json({ message: 'Location history updated', location: updatedLocation });
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
};

const deleteLocationHistoryController = async (req, res) => {
    const { id } = req.params;
    try {
        await deleteLocationHistory(id);
        res.status(200).json({ message: 'Location history deleted' });
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
};

module.exports = {
    createLocationHistoryController,
    getAllLocationHistoryController,
    getLocationHistoryByIdController,
    updateLocationHistoryController,
    deleteLocationHistoryController,
};
