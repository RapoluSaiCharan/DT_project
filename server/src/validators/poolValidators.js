const { body, param } = require('express-validator');

const createPoolValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Pool name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Pool name must be between 3 and 100 characters'),

  body('origin.area')
    .trim()
    .notEmpty()
    .withMessage('Origin area/locality is required'),

  body('departureTime')
    .trim()
    .notEmpty()
    .withMessage('Departure time is required (e.g. 08:30)')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Departure time must be in HH:MM format (24-hour)'),

  body('totalSeats')
    .notEmpty()
    .withMessage('Total available seats is required')
    .isInt({ min: 1, max: 10 })
    .withMessage('Total seats must be between 1 and 10'),

  body('transportType')
    .optional()
    .isIn(['CAR', 'BIKE', 'COLLEGE_BUS', 'OTHER'])
    .withMessage('Invalid transport type'),

  body('estimatedCostTotal')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cost must be a positive number'),
];

const joinPoolValidator = [
  param('id').isMongoId().withMessage('Invalid Pool ID'),
  body('seatsRequested')
    .optional()
    .isInt({ min: 1, max: 4 })
    .withMessage('Seats requested must be between 1 and 4'),
];

module.exports = {
  createPoolValidator,
  joinPoolValidator,
};
