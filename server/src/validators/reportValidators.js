const { body } = require('express-validator');

const createReportValidator = [
  body('reason').notEmpty().withMessage('Reason for report is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Incident description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
];

const createRatingValidator = [
  body('tripId').isMongoId().withMessage('Valid Trip ID required'),
  body('ratee').isMongoId().withMessage('Valid user ID to rate required'),
  body('score')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating score must be an integer between 1 and 5'),
  body('feedback')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Feedback must not exceed 500 characters'),
];

module.exports = {
  createReportValidator,
  createRatingValidator,
};
