const express = require('express');
const router = express.Router();
const {
  startTripFromPool,
  getTrips,
  getTripById,
  updateTripStatus,
  updateTripCost,
  getTripCost,
} = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');
const {
  updateTripCostValidator,
  updateTripStatusValidator,
} = require('../validators/tripValidators');
const { validate } = require('../middleware/validationMiddleware');

router.use(protect);

router.post('/start', startTripFromPool);
router.get('/', getTrips);
router.get('/:id', getTripById);
router.patch('/:id/status', updateTripStatusValidator, validate, updateTripStatus);
router.post('/:id/cost', updateTripCostValidator, validate, updateTripCost);
router.get('/:id/cost', getTripCost);

module.exports = router;
