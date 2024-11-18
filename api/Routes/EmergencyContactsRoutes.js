const express = require("express");
const router = express.Router();

const {
    createEmergencyContactController,
    getAllEmergencyContactsController,
    getEmergencyContactByIdController,
    updateEmergencyContactController,
    deleteEmergencyContactController,
    getEmergencyContactsByUserIdController
} = require("../Controllers/EmergencyContactsController");


const {
    validateEmergencyContactCreation,
} = require("../Validators/EmergencyContactsValidator");


// Emergency Contacts Routes
router.post("/", validateEmergencyContactCreation, createEmergencyContactController);
router.get("/", getAllEmergencyContactsController);
router.get("/:user_id", getEmergencyContactsByUserIdController);
router.put("/:id", validateEmergencyContactCreation, updateEmergencyContactController);
router.delete("/:id", deleteEmergencyContactController);

module.exports = router;