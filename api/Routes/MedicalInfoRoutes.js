const express = require("express");
const router = express.Router();

const {
    createMedicalInfoController,
    getAllMedicalInfoController,
    getMedicalInfoByIdController,
    updateMedicalInfoController,
    deleteMedicalInfoController,
} = require("../Controllers/MedicalInfoController");

const {
    validateMedicalInfoCreation,
} = require("../Validators/MedicalInfoValidator");
const {validateRequest} = require('../Middleware/ValidateRequest');


// Medical Information Routes
router.post("/", validateMedicalInfoCreation, createMedicalInfoController);
router.get("/", getAllMedicalInfoController);
router.get("/:id", getMedicalInfoByIdController);
router.put("/:id", validateMedicalInfoCreation, updateMedicalInfoController);
router.delete("/:id", deleteMedicalInfoController);

module.exports = router;