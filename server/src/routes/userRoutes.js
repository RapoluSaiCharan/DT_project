const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getTransportProfile,
  updateTransportProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { updateTransportProfileValidator } = require('../validators/profileValidators');
const { validate } = require('../middleware/validationMiddleware');

router.use(protect);

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.get('/transport-profile', getTransportProfile);
router.put('/transport-profile', updateTransportProfileValidator, validate, updateTransportProfile);

module.exports = router;
