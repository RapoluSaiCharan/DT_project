const express = require('express');
const router = express.Router();
const { searchMatches, getRecommendations } = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');

// Matches can be queried with or without authentication, but recommendations require auth
router.get('/', (req, res, next) => {
  // Optional auth middleware check
  if (req.cookies && req.cookies.campus_pool_auth) {
    return protect(req, res, () => searchMatches(req, res, next));
  }
  return searchMatches(req, res, next);
});

router.post('/search', (req, res, next) => {
  if (req.cookies && req.cookies.campus_pool_auth) {
    return protect(req, res, () => searchMatches(req, res, next));
  }
  return searchMatches(req, res, next);
});

router.get('/recommendations', protect, getRecommendations);

module.exports = router;
