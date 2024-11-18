const express = require("express");
const router = express.Router();

const {
    createSOSAlertController,
    getAllSOSAlertsController,
    getSOSAlertByIdController,
    updateSOSAlertController,
    deleteSOSAlertController,
    sendSosToContacts
} = require("../Controllers/SOSAlertsController");

const {
    validateSOSAlertCreation,
} = require("../Validators/SOSAlertValidator");

  // SOS Alerts Routes
router.post("/", validateSOSAlertCreation, createSOSAlertController);
router.post("/wp", sendSosToContacts);
router.get("/", getAllSOSAlertsController);
router.get("/:id", getSOSAlertByIdController);
router.put("/:id", validateSOSAlertCreation, updateSOSAlertController);
router.delete("/:id", deleteSOSAlertController);

module.exports = router;

