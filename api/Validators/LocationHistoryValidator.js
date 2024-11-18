const { check } = require('express-validator');

const validateLocationHistoryCreation = [
    check('user_id').isInt().withMessage('User ID must be an integer').notEmpty().withMessage('User ID is required'),
    check('location_latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90').notEmpty().withMessage('Latitude is required'),
    check('location_longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180').notEmpty().withMessage('Longitude is required'),
    
];

module.exports = { validateLocationHistoryCreation };
