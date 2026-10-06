const express = require('express');
const router = express.Router();
const {
  triggerSOS,
  getActiveEmergencies,
  resolveEmergency,
} = require('../controllers/safetyController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

// Commuters trigger SOS
router.post('/sos', triggerSOS);

// Admin-only active emergency monitoring & resolution
router.get('/active', authorize('TRANSPORT_ADMIN', 'SUPER_ADMIN'), getActiveEmergencies);
router.patch('/:id/resolve', authorize('TRANSPORT_ADMIN', 'SUPER_ADMIN'), resolveEmergency);

module.exports = router;
