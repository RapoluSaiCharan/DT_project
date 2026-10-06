const express = require('express');
const router = express.Router();
const { submitRating, getUserRatings } = require('../controllers/ratingController');
const { protect } = require('../middleware/authMiddleware');
const { createRatingValidator } = require('../validators/reportValidators');
const { validate } = require('../middleware/validationMiddleware');

// Get ratings for a user (can be public/authenticated)
router.get('/users/:id', getUserRatings);

// Submit rating (authenticated)
router.post('/', protect, createRatingValidator, validate, submitRating);

module.exports = router;
