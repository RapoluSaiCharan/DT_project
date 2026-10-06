const express = require('express');
const router = express.Router();
const {
  getStats,
  getDemandAnalytics,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

// Transport admin and Super admin
router.get('/stats', authorize('TRANSPORT_ADMIN', 'SUPER_ADMIN'), getStats);
router.get('/analytics', authorize('TRANSPORT_ADMIN', 'SUPER_ADMIN'), getDemandAnalytics);
router.get('/users', authorize('TRANSPORT_ADMIN', 'SUPER_ADMIN'), getAllUsers);
router.patch('/users/:id/status', authorize('TRANSPORT_ADMIN', 'SUPER_ADMIN'), toggleUserStatus);

// Super Admin only actions
router.patch('/users/:id/role', authorize('SUPER_ADMIN'), updateUserRole);

module.exports = router;
