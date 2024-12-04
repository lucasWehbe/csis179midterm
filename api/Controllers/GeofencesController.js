const {
    createGeofence,
    getAllGeofences,
    getGeofenceById,
    updateGeofence,
    deleteGeofence,
} = require('../Services/GeofencesService');

const createGeofenceController = async (req, res) => {
    const { user_id, name, latitude, longitude, radius } = req.body;
    try {
        const geofence = await createGeofence(user_id, name, latitude, longitude, radius);
        res.status(201).json({ message: 'Geofence created', geofence });
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
};

const getAllGeofencesController = async (req, res) => {
    try {
        const geofences = await getAllGeofences();
        res.status(200).json({ geofences });
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
};

const getGeofenceByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const geofence = await getGeofenceById(id);
        res.status(200).json({ geofence });
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
};

const updateGeofenceController = async (req, res) => {
    const { id } = req.params;
    const { name, latitude, longitude, radius } = req.body;
    try {
        const updatedGeofence = await updateGeofence(id, name, latitude, longitude, radius);
        res.status(200).json({ message: 'Geofence updated', geofence: updatedGeofence });
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
};

const deleteGeofenceController = async (req, res) => {
    const { id } = req.params;
    try {
        await deleteGeofence(id);
        res.status(200).json({ message: 'Geofence deleted' });
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
};

module.exports = {
    createGeofenceController,
    getAllGeofencesController,
    getGeofenceByIdController,
    updateGeofenceController,
    deleteGeofenceController,
};
