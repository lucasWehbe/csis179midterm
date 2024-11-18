const Geofence = require('../Models/Geofences');


    const createGeofence = async(userId, name, latitude, longitude, radius) => {
        try {
            return await Geofence.create({
                user_id: userId,
                geofence_name: name,
                geofence_latitude: latitude,
                geofence_longitude: longitude,
                geofence_radius: radius,
                created_at: new Date(),
                updated_at: new Date(),
            });
        } catch (error) {
            console.error('Error creating geofence:', error);
            throw new Error('Failed to create geofence');
        }
    }

    const getAllGeofences = async() => {
        try {
            return await Geofence.findAll();
        } catch (error) {
            console.error('Error retrieving geofences:', error);
            throw new Error('Failed to retrieve geofences');
        }
    }

    const getGeofenceById = async(id) => {
        try {
            const geofence = await Geofence.findByPk(id);
            return geofence;
        } catch (error) {
            console.error('Error retrieving geofence by id:', error);
            throw new Error('Failed to retrieve geofence');
        }
    }

    const updateGeofence = async(id, name, latitude, longitude, radius) => {
        try {
            const updated = await Geofence.update({
                geofence_name: name,
                geofence_latitude: latitude,
                geofence_longitude: longitude,
                geofence_radius: radius 
            },{ 
                where: { geofence_id: id } 
            });
            return updated;
        } catch (error) {
            console.error('Error updating geofence:', error);
            throw new Error('Failed to update geofence');
        }
    }

    const deleteGeofence = async(id) => {
        try {
            const geofence = await Geofence.findByPk(id);
            if (!geofence) throw new Error(`Geofence with id ${id} not found`);
            return await geofence.destroy();
        } catch (error) {
            console.error('Error deleting geofence:', error);
            throw new Error('Failed to delete geofence');
        }
    }


module.exports = {
    createGeofence,
    getAllGeofences,
    getGeofenceById,
    updateGeofence,
    deleteGeofence
};
