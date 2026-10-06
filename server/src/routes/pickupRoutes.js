const express = require('express');
const router = express.Router();
const {
  getPickupPoints,
  createPickupPoint,
  updatePickupPoint,
  deletePickupPoint,
} = require('../controllers/pickupController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { pickupPointValidator } = require('../validators/pickupValidators');
const { validate } = require('../middleware/validationMiddleware');

// Anyone can view pickup points
router.get('/', getPickupPoints);

// Only admins can create/update/delete pickup points
router.post(
  '/',
  protect,
  authorize('TRANSPORT_ADMIN', 'SUPER_ADMIN'),
  pickupPointValidator,
  validate,
  createPickupPoint
);

router.patch(
  '/:id',
  protect,
  authorize('TRANSPORT_ADMIN', 'SUPER_ADMIN'),
  updatePickupPoint
);

router.delete(
  '/:id',
  protect,
  authorize('TRANSPORT_ADMIN', 'SUPER_ADMIN'),
  deletePickupPoint
);

module.exports = router;
