const EmergencyContact = require('../Models/EmergencyContacts');
const { findUserByPhone } = require('../Services/UserService');


const createEmergencyContact = async (userId, name, phone, relationship) => {
    try {

        return await EmergencyContact.create({
            user_id: userId,
            contact_name: name,
            contact_phone: phone,
            relationship: relationship,
        });
    } catch (error) {
        console.error('Error creating emergency contact:', error);
        throw error;
    }
};

    const getAllEmergencyContacts = async() => {
        try {
            return await EmergencyContact.findAll();
        } catch (error) {
            console.error('Error retrieving emergency contacts:', error);
            throw new Error('Failed to retrieve emergency contacts');
        }
    }

    const getEmergencyContactsByUserId = async (user_id) => {
        try {
            return await EmergencyContact.findAll({ where: { user_id: user_id } });
        } catch (error) {
            console.error('Error fetching emergency contacts by user_id:', error);
            throw new Error('Failed to fetch emergency contacts for the user');
        }
    };

    const getEmergencyContactById = async(id) => {
        try {
            const contact = await EmergencyContact.findByPk(id);
            return contact;
        } catch (error) {
            console.error('Error retrieving emergency contact by id:', error);
            throw new Error('Failed to retrieve emergency contact');
        }
    }

    

    const updateEmergencyContact = async(id, name, phone, relationship) => {
        try {
            const updated = await EmergencyContact.update({ 
                contact_name: name,
                contact_phone: phone,
                relationship: relationship
                },{
                     where: { contact_id: id } 
                    });

            return updated;
            
        } catch (error) {
            console.error('Error updating emergency contact:', error);
            throw new Error('Failed to update emergency contact');
        }
    }

    const deleteEmergencyContact = async(id) => {
        try {
            const contact = await EmergencyContact.findByPk(id);
            if (!contact) throw new Error(`Contact with id ${id} not found`);
            return await contact.destroy();
        } catch (error) {
            console.error('Error deleting emergency contact:', error);
            throw new Error('Failed to delete emergency contact');
        }
    }


module.exports = {
    createEmergencyContact,
    getAllEmergencyContacts,
    getEmergencyContactById,
    updateEmergencyContact,
    deleteEmergencyContact,
    getEmergencyContactsByUserId
}
