const MedicalInfo = require('../Models/MedicalInformation');

const createMedicalInfo = async (userId, bloodType, allergies, medicalConditions, emergencyNotes) => {
    try {
        return await MedicalInfo.create({
            user_id: userId,
            blood_type: bloodType,
            allergies: allergies,
            medical_conditions: medicalConditions,
            emergency_notes: emergencyNotes,
        });
    } catch (error) {
        console.error('Error creating medical info:', error);
        throw new Error('Failed to create medical info');
    }
};

const getAllMedicalInfo = async () => {
    try {
        return await MedicalInfo.findAll();
    } catch (error) {
        console.error('Error retrieving medical info:', error);
        throw new Error('Failed to retrieve medical info');
    }
};

const getMedicalInfoById = async (id) => {
    try {
        const info = await MedicalInfo.findByPk(id);
        return info;
    } catch (error) {
        console.error('Error retrieving medical info by id:', error);
        throw new Error('Failed to retrieve medical info');
    }
};

const updateMedicalInfo = async (id, bloodType, allergies, medicalConditions, emergencyNotes) => {
    try {
        const updated = await MedicalInfo.update(
            {
                blood_type: bloodType,
                allergies: allergies,
                medical_conditions: medicalConditions,
                emergency_notes: emergencyNotes,
            },{ 
                where: { medical_info_id: id }
            });
        return updated;
    } catch (error) {
        console.error('Error updating medical info:', error);
        throw new Error('Failed to update medical info');
    }
};

const deleteMedicalInfo = async (id) => {
    try {
        const info = await MedicalInfo.findByPk(id);
        if (!info) throw new Error(`Medical info with id ${id} not found`);
        return await info.destroy();
    } catch (error) {
        console.error('Error deleting medical info:', error);
        throw new Error('Failed to delete medical info');
    }
};

module.exports = {
    createMedicalInfo,
    getAllMedicalInfo,
    getMedicalInfoById,
    updateMedicalInfo,
    deleteMedicalInfo
};
