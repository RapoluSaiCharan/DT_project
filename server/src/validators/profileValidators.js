const { body } = require('express-validator');

const updateTransportProfileValidator = [
  body('homeLocation.area').trim().notEmpty().withMessage('Home area/locality is required'),
  body('travelTime')
    .trim()
    .notEmpty()
    .withMessage('Departure travel time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Time must be in HH:MM format'),
  body('transportType')
    .optional()
    .isIn(['CAR', 'BIKE', 'COLLEGE_BUS', 'PUBLIC_TRANSPORT', 'OTHER'])
    .withMessage('Invalid transport type'),
  body('availableSeats')
    .optional()
    .isInt({ min: 0, max: 8 })
    .withMessage('Seats must be between 0 and 8'),
];

module.exports = {
  updateTransportProfileValidator,
};
