const express = require('express');
const router = express.Router();
const {
  createPool,
  getPools,
  getPoolById,
  joinPool,
  leavePool,
  updatePool,
  cancelPool,
  deletePool,
} = require('../controllers/poolController');
const { protect } = require('../middleware/authMiddleware');
const { requireVerified } = require('../middleware/roleMiddleware');
const { createPoolValidator, joinPoolValidator } = require('../validators/poolValidators');
const { validate } = require('../middleware/validationMiddleware');

router.use(protect);

router.post('/', requireVerified, createPoolValidator, validate, createPool);
router.get('/', getPools);
router.get('/:id', getPoolById);
router.post('/:id/join', requireVerified, joinPoolValidator, validate, joinPool);
router.post('/:id/leave', leavePool);
router.patch('/:id', updatePool);
router.post('/:id/cancel', cancelPool);
router.delete('/:id', deletePool);

module.exports = router;
