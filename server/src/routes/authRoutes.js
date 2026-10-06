const express = require('express');
const router = express.Router();
const { register, login, logout, getMe, refresh } = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidators');
const { validate } = require('../middleware/validationMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimitMiddleware');

router.post('/register', authLimiter, registerValidator, validate, register);
router.post('/login', authLimiter, loginValidator, validate, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/refresh', protect, refresh);

module.exports = router;
