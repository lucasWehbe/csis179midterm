const { check } = require('express-validator');

const validateHeatmapDataCreation = [
    check('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90').notEmpty().withMessage('Latitude is required'),
    check('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180').notEmpty().withMessage('Longitude is required'),
    check('data_source').isString().withMessage('Data source must be a string').isLength({ max: 255 }).withMessage('Data source must be less than 255 characters').notEmpty().withMessage('Data source is required'),
    check('severity_level').isInt({ min: 1, max: 5 }).withMessage('Severity level must be between 1 and 5').notEmpty().withMessage('Severity level is required'),

];

module.exports = { validateHeatmapDataCreation };
