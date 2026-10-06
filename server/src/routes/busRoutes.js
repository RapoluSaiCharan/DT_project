const express = require('express');
const router = express.Router();
const {
  getBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
} = require('../controllers/busController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public/commuters can view bus schedules
router.get('/', getBuses);
router.get('/:id', getBusById);

// Admin-only bus fleet management
router.post('/', protect, authorize('TRANSPORT_ADMIN', 'SUPER_ADMIN'), createBus);
router.patch('/:id', protect, authorize('TRANSPORT_ADMIN', 'SUPER_ADMIN'), updateBus);
router.delete('/:id', protect, authorize('TRANSPORT_ADMIN', 'SUPER_ADMIN'), deleteBus);

module.exports = router;
