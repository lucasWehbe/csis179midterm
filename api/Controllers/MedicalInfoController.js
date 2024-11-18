const {
    createMedicalInfo,
    getAllMedicalInfo,
    getMedicalInfoById,
    updateMedicalInfo,
    deleteMedicalInfo,
} = require('../Services/MedicalInfoService');

const createMedicalInfoController = async (req, res) => {
    const { user_id, blood_type, allergies, medical_conditions, emergency_notes } = req.body;
    try {
        const info = await createMedicalInfo(user_id, blood_type, allergies, medical_conditions, emergency_notes);
        res.status(201).json({ message: 'Medical info created', info });
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
};

const getAllMedicalInfoController = async (req, res) => {
    try {
        const infoList = await getAllMedicalInfo();
        res.status(200).json({ infoList });
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
};

const getMedicalInfoByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const info = await getMedicalInfoById(id);
        res.status(200).json({ info });
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
};

const updateMedicalInfoController = async (req, res) => {
    const { id } = req.params;
    const { blood_type, allergies, medical_conditions, emergency_notes } = req.body;
    try {
        const updatedInfo = await updateMedicalInfo(id, blood_type, allergies, medical_conditions, emergency_notes);
        res.status(200).json({ message: 'Medical info updated', info: updatedInfo });
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
};

const deleteMedicalInfoController = async (req, res) => {
    const { id } = req.params;
    try {
        await deleteMedicalInfo(id);
        res.status(200).json({ message: 'Medical info deleted' });
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
};

module.exports = {
    createMedicalInfoController,
    getAllMedicalInfoController,
    getMedicalInfoByIdController,
    updateMedicalInfoController,
    deleteMedicalInfoController,
};
