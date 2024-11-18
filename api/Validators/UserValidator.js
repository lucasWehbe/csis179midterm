const { check } = require('express-validator');

const insertUserValidation = [
    check('user_email')
        .isEmail().withMessage('Email must be a valid email address')
        .notEmpty().withMessage('Email is required'),
    check('user_pass')
        .isString().withMessage('Password must be a string')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .notEmpty().withMessage('Password is required'),
    check('user_username')
        .isString().withMessage('Name must be a string')
        .isLength({ max: 255 }).withMessage('Name must be less than 255 characters')
        .notEmpty().withMessage('Name is required'),
    check('user_phone')
        .isString().withMessage('Phone number must be a string')
        .matches(/^[0-9+\-\s()]*$/).withMessage('Phone number must contain only numbers and valid symbols')
        .isLength({  min: 8, max: 8  }).withMessage('Phone number must be 8 characters'),
];

const updateUserValidation = [
    check('user_email')
        .isEmail().withMessage('Email must be a valid email address'),
    check('user_username')
        .isString().withMessage('Name must be a string')
        .isLength({ max: 255 }).withMessage('Name must be less than 255 characters'),
    check('user_phone')
        .isString().withMessage('Phone number must be a string')
        .matches(/^[0-9+\-\s()]*$/).withMessage('Phone number must contain only numbers and valid symbols')
        .isLength({ max: 20 }).withMessage('Phone number must be less than 20 characters'),
];

module.exports = {
    insertUserValidation,
    updateUserValidation,
};
