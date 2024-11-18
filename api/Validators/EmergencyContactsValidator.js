const { check } = require('express-validator');

const validateEmergencyContactCreation = [
    check('user_id').isInt().withMessage('User ID must be an integer').notEmpty().withMessage('User ID is required'),
    check('contact_name').isString().withMessage('Name must be a string').isLength({ max: 255 }).withMessage('Name must be less than 255 characters').notEmpty().withMessage('Name is required'),
    check('contact_phone').isString().withMessage('Phone must be a string').matches(/^[0-9+\-\s()]*$/).withMessage('Phone must contain only numbers and valid symbols').isLength({ max: 20 }).withMessage('Phone must be less than 20 characters').notEmpty().withMessage('Phone is required'),
    check('relationship').isString().withMessage('Relationship must be a string').isLength({ max: 255 }).withMessage('Relationship must be less than 255 characters').notEmpty().withMessage('Relationship is required'),

];

module.exports = { validateEmergencyContactCreation };
