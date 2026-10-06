const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const matchRoutes = require('./matchRoutes');
const poolRoutes = require('./poolRoutes');
const pickupRoutes = require('./pickupRoutes');
const tripRoutes = require('./tripRoutes');
const busRoutes = require('./busRoutes');
const safetyRoutes = require('./safetyRoutes');
const reportRoutes = require('./reportRoutes');
const ratingRoutes = require('./ratingRoutes');
const notificationRoutes = require('./notificationRoutes');
const adminRoutes = require('./adminRoutes');

// API Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CampusPool Backend API is running healthy',
    timestamp: new Date().toISOString(),
  });
});

// Mount modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/matches', matchRoutes);
router.use('/pools', poolRoutes);
router.use('/pickup-points', pickupRoutes);
router.use('/trips', tripRoutes);
router.use('/buses', busRoutes);
router.use('/safety', safetyRoutes);
router.use('/reports', reportRoutes);
router.use('/ratings', ratingRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
