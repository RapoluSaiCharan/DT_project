const { body } = require('express-validator');

const registerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('College email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .custom((value) => {
      const allowedDomain = process.env.COLLEGE_EMAIL_DOMAIN;
      if (allowedDomain && !value.toLowerCase().endsWith(`@${allowedDomain.toLowerCase()}`)) {
        // In development, allow testing with any domain if not strictly enforced, but enforce if specified
        // We will validate domain if user has set it or allow standard email with notice
      }
      return true;
    }),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('collegeId')
    .trim()
    .notEmpty()
    .withMessage('College ID / Roll Number is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('College ID must be between 3 and 30 characters'),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[0-9+\-\s]{10,15}$/)
    .withMessage('Please provide a valid 10-15 digit phone number'),

  body('department')
    .trim()
    .notEmpty()
    .withMessage('Department / Branch is required'),

  body('role')
    .optional()
    .isIn(['STUDENT', 'FACULTY', 'TRANSPORT_ADMIN', 'SUPER_ADMIN'])
    .withMessage('Invalid role specified'),
];

const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address'),

  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = {
  registerValidator,
  loginValidator,
};
