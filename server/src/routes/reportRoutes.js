const express = require('express');
const router = express.Router();
const {
  createReport,
  getReports,
  updateReport,
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { createReportValidator } = require('../validators/reportValidators');
const { validate } = require('../middleware/validationMiddleware');

router.use(protect);

router.post('/', createReportValidator, validate, createReport);
router.get('/', authorize('TRANSPORT_ADMIN', 'SUPER_ADMIN'), getReports);
router.patch('/:id', authorize('TRANSPORT_ADMIN', 'SUPER_ADMIN'), updateReport);

module.exports = router;
