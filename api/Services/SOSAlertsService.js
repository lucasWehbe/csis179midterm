const SOSAlert = require('../Models/SOSAlerts');
const EmergencyContact = require('../Models/EmergencyContacts');


const createSOSAlert = async (userId, latitude, longitude, message) => {
    try {
        return await SOSAlert.create({
            user_id: userId,
            latitude: latitude,
            longitude: longitude,
            message: message,
            triggered_at: new Date(),
        });
    } catch (error) {
        console.error('Error creating SOS alert:', error);
        throw new Error('Failed to create SOS alert');
    }
};

const getAllSOSAlerts = async () => {
    try {
        return await SOSAlert.findAll();
    } catch (error) {
        console.error('Error retrieving SOS alerts:', error);
        throw new Error('Failed to retrieve SOS alerts');
    }
};

const getSOSAlertById = async (id) => {
    try {
        const alert = await SOSAlert.findByPk(id);
        return alert;
    } catch (error) {
        console.error('Error retrieving SOS alert by id:', error);
        throw new Error('Failed to retrieve SOS alert');
    }
};

const updateSOSAlert = async (id, latitude, longitude, message) => {
    try {
        const updated = await SOSAlert.update(
            {
                latitude: latitude,
                longitude: longitude,
                message: message,
            },{ 
                where: { sos_id: id } 
            });
        return updated;
    } catch (error) {
        console.error('Error updating SOS alert:', error);
        throw new Error('Failed to update SOS alert');
    }
};

const deleteSOSAlert = async (id) => {
    try {
        const alert = await SOSAlert.findByPk(id);
        if (!alert) throw new Error(`SOS alert with id ${id} not found`);
        return await alert.destroy();
    } catch (error) {
        console.error('Error deleting SOS alert:', error);
        throw new Error('Failed to delete SOS alert');
    }
};




module.exports = {
    createSOSAlert,
    getAllSOSAlerts,
    getSOSAlertById,
    updateSOSAlert,
    deleteSOSAlert,
};
