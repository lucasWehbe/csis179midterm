const {
    createSOSAlert,
    getAllSOSAlerts,
    getSOSAlertById,
    updateSOSAlert,
    deleteSOSAlert,
} = require('../Services/SOSAlertsService');
const { getUserById} = require('../Services/UserService')

const { sendMessageToNumber } = require('../WhatsappClient');

const EmergencyContactsService = require('../Services/EmergencyContactsServices');
const { sendMessage } = require('../WhatsappClient');

const createSOSAlertController = async (req, res) => {
    const { userId, latitude, longitude, message } = req.body;
    
    if (!userId || !latitude || !longitude) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const sosResponse = await createSOSAlert(userId, latitude, longitude, message);
        res.status(200).json({ message: "SOS Alert created successfully", sosResponse });
    } catch (error) {
        console.error("Error creating SOS Alert:", error);
        res.status(500).json({ error: "Failed to create SOS alert" });
    }
};

const getAllSOSAlertsController = async (req, res) => {
    try {
        const alerts = await getAllSOSAlerts();
        res.status(200).json({ alerts });
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
};

const getSOSAlertByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const alert = await getSOSAlertById(id);
        res.status(200).json({ alert });
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
};

const updateSOSAlertController = async (req, res) => {
    const { id } = req.params;
    const { latitude, longitude, message } = req.body;
    try {
        const updatedAlert = await updateSOSAlert(id, latitude, longitude, message);
        res.status(200).json({ message: 'SOS alert updated', alert: updatedAlert });
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
};

const deleteSOSAlertController = async (req, res) => {
    const { id } = req.params;
    try {
        await deleteSOSAlert(id);
        res.status(200).json({ message: 'SOS alert deleted' });
    } catch (error) {
        res.status(500).json({ error: error?.message });
    }
};

const sendSosToContacts = async (req, res) => {
    try {

        const { userId, coordinates } = req.body;
        const { latitude, longitude } = coordinates;
        const contacts = await EmergencyContactsService.getEmergencyContactsByUserId(userId);
        const user = await getUserById(userId);
  
      if (!contacts || contacts.length === 0) {
        return res.status(404).json({ message: "No emergency contacts found." });
      }
  
      // Construct the SOS message with location coordinates
      const message = `🚨 SOS! ${user.user_username} has triggered an emergency alert and requires immediate assistance. Location: https://maps.google.com/?q=${latitude},${longitude}`;
  
      for (const contact of contacts) {
        let contactPhone = contact.contact_phone;
  
        // If the phone number starts with '0', remove it
        if (contactPhone.startsWith('0')) {
          contactPhone = contactPhone.slice(1);
        }
  
        await sendMessageToNumber(contactPhone, message);
        console.log(`SOS message sent to ${contact.contact_name} at ${contactPhone}`);
      }
  
      res.status(200).json({ message: "SOS messages sent to emergency contacts." });
    } catch (error) {
      console.error("Error sending SOS message:", error);
      res.status(500).json({ error: "Failed to send SOS messages." });
    }
  };

module.exports = {
    createSOSAlertController,
    getAllSOSAlertsController,
    getSOSAlertByIdController,
    updateSOSAlertController,
    deleteSOSAlertController,
    sendSosToContacts
};
