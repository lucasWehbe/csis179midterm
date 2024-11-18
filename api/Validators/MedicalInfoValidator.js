const { check } = require('express-validator');

const validateMedicalInfoCreation = [
    check('blood_type').optional().isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood type'),
    check('allergies').optional().isString().withMessage('Allergies must be a string').isLength({ max: 500 }).withMessage('Allergies must be less than 500 characters'),
    check('medical_conditions').optional().isString().withMessage('Medical conditions must be a string').isLength({ max: 500 }).withMessage('Medical conditions must be less than 500 characters'),
    check('emergency_notes').optional().isString().withMessage('Emergency notes must be a string').isLength({ max: 1000 }).withMessage('Emergency notes must be less than 1000 characters'),
    
];

module.exports = { validateMedicalInfoCreation };
