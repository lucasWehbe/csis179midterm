const { check } = require('express-validator');

const validateSOSAlertCreation = [
    check('user_id').isInt().withMessage('User ID must be an integer').notEmpty().withMessage('User ID is required'),
    check('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90').notEmpty().withMessage('Latitude is required'),
    check('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180').notEmpty().withMessage('Longitude is required'),
    check('sos_message').optional().isString().withMessage('Message must be a string').isLength({ max: 1000 }).withMessage('Message must be less than 1000 characters'),
    
];

module.exports = { validateSOSAlertCreation };
