const {
    createEmergencyContact,
    getAllEmergencyContacts,
    getEmergencyContactById,
    updateEmergencyContact,
    deleteEmergencyContact,
    getEmergencyContactsByUserId
} = require('../Services/EmergencyContactsServices');

const createEmergencyContactController = async (req, res) => {
    const { userId, contact_name, contact_phone, relationship } = req.body;
    try {
        if (!userId || !contact_name || !contact_phone || !relationship) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }        

        const newContact = await createEmergencyContact(userId, contact_name, contact_phone, relationship);
        res.status(201).json({ message: 'Emergency contact created', contact: newContact });
    } catch (error) {
        const statusCode = error.statusCode || 500; 
        res.status(statusCode).json({ error: error.message || 'Failed to create emergency contact' });
    }
};

const getAllEmergencyContactsController = async (req, res) => {
    try {
        const contacts = await getAllEmergencyContacts();
        res.status(200).json({ contacts });
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
};

const getEmergencyContactByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const contact = await getEmergencyContactById(id);
        res.status(200).json({ contact });
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
};

const getEmergencyContactsByUserIdController = async (req, res) => {
    const { user_id } = req.params; 
    try {
        const contacts = await getEmergencyContactsByUserId(user_id);
        res.status(200).json({ contacts });
    } catch (error) {
        console.error("Error fetching emergency contacts by user ID:", error);
        res.status(500).json({ error: "An error occurred while fetching emergency contacts" });
    }
};

const updateEmergencyContactController = async (req, res) => {
    const { id } = req.params;
    const { name, phone, relationship } = req.body;
    try {
        const updatedContact = await updateEmergencyContact(id, name, phone, relationship);
        res.status(200).json({ message: 'Contact updated', contact: updatedContact });
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
};

const deleteEmergencyContactController = async (req, res) => {
    const { id } = req.params;
    try {
        await deleteEmergencyContact(id);
        res.status(200).json({ message: 'Contact deleted' });
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
};

module.exports = {
    createEmergencyContactController,
    getAllEmergencyContactsController,
    getEmergencyContactByIdController,
    updateEmergencyContactController,
    deleteEmergencyContactController,
    getEmergencyContactsByUserIdController
};
