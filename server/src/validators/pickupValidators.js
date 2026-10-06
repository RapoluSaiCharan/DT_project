const { body, param } = require('express-validator');

const pickupPointValidator = [
  body('name').trim().notEmpty().withMessage('Pickup point name is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('area').trim().notEmpty().withMessage('Area/Locality is required'),
  body('latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
  body('longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
];

module.exports = {
  pickupPointValidator,
};
