const LocationHistory = require('../Models/LocationHistory');

const createLocationHistory = async (userId, latitude, longitude) => {
    try {
        return await LocationHistory.create({
            user_id: userId,
            latitude: latitude,
            longitude: longitude,
            timestamp: new Date(),
        });
    } catch (error) {
        console.error('Error creating location history:', error);
        throw new Error('Failed to create location history');
    }
};

const getAllLocationHistory = async () => {
    try {
        return await LocationHistory.findAll();
    } catch (error) {
        console.error('Error retrieving location history:', error);
        throw new Error('Failed to retrieve location history');
    }
};

const getLocationHistoryById = async (id) => {
    try {
        const location = await LocationHistory.findByPk(id);
        return location;
    } catch (error) {
        console.error('Error retrieving location history by id:', error);
        throw new Error('Failed to retrieve location history');
    }
};

const updateLocationHistory = async (id, latitude, longitude, timestamp) => {
    try {
        const updated = await LocationHistory.update({ 
            latitude: latitude,
            longitude: longitude,
            timestamp: timestamp 
        },{ 
            where: { location_id: id }
         });
        return updated;
    } catch (error) {
        console.error('Error updating location history:', error);
        throw new Error('Failed to update location history');
    }
};

const deleteLocationHistory = async (id) => {
    try {
        const location = await LocationHistory.findByPk(id);
        if (!location) throw new Error(`Location history with id ${id} not found`);
        return await location.destroy();
    } catch (error) {
        console.error('Error deleting location history:', error);
        throw new Error('Failed to delete location history');
    }
};

module.exports = {
    createLocationHistory,
    getAllLocationHistory,
    getLocationHistoryById,
    updateLocationHistory,
    deleteLocationHistory
};
