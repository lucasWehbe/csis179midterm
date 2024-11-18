const { check } = require('express-validator');

const validateGeofenceCreation = [
    check('user_id').isInt().withMessage('User ID must be an integer').notEmpty().withMessage('User ID is required'),
    check('geofence_name').isString().withMessage('Geofence name must be a string').isLength({ max: 255 }).withMessage('Geofence name must be less than 255 characters').notEmpty().withMessage('Geofence name is required'),
    check('geofence_latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90').notEmpty().withMessage('Latitude is required'),
    check('geofence_longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180').notEmpty().withMessage('Longitude is required'),
    check('geofence_radius').isInt({ min: 1 }).withMessage('Radius must be a positive integer').notEmpty().withMessage('Radius is required'),
   
];

module.exports = { validateGeofenceCreation };
