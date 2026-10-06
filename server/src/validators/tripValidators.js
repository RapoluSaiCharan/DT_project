const { body, param } = require('express-validator');

const updateTripCostValidator = [
  param('id').isMongoId().withMessage('Invalid Trip ID'),
  body('totalCost')
    .notEmpty()
    .withMessage('Total cost is required')
    .isFloat({ min: 0 })
    .withMessage('Total cost cannot be negative'),
  body('driverContribution')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Driver contribution cannot be negative'),
];

const updateTripStatusValidator = [
  param('id').isMongoId().withMessage('Invalid Trip ID'),
  body('status')
    .notEmpty()
    .isIn(['SCHEDULED', 'STARTED', 'COMPLETED', 'CANCELLED', 'EMERGENCY'])
    .withMessage('Invalid trip status'),
];

module.exports = {
  updateTripCostValidator,
  updateTripStatusValidator,
};
