const { findMatchingPools, findMatchingPeers } = require('../services/matchingService');
const TransportProfile = require('../models/TransportProfile');

/**
 * Search matches based on query criteria
 * POST /api/matches/search or GET /api/matches
 */
const searchMatches = async (req, res, next) => {
  try {
    const originArea = req.body.originArea || req.query.originArea || '';
    const destinationCampus = req.body.destinationCampus || req.query.destinationCampus || 'Main Campus';
    const departureTime = req.body.departureTime || req.query.departureTime || '';
    const seatsRequired = req.body.seatsRequired || req.query.seatsRequired || 1;
    const transportType = req.body.transportType || req.query.transportType || '';

    // Current authenticated user (to exclude own pools/profile)
    const currentUserId = req.user ? req.user._id : null;

    const [matchingPools, matchingPeers] = await Promise.all([
      findMatchingPools({
        originArea,
        destinationCampus,
        departureTime,
        seatsRequired,
        transportType,
        currentUserId,
      }),
      findMatchingPeers({
        originArea,
        departureTime,
        transportType,
        currentUserId,
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalMatches: matchingPools.length + matchingPeers.length,
        poolsCount: matchingPools.length,
        peersCount: matchingPeers.length,
        pools: matchingPools,
        peers: matchingPeers,
        query: {
          originArea,
          destinationCampus,
          departureTime,
          seatsRequired,
          transportType,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get recommendations based on current user's transport profile
 * GET /api/matches/recommendations
 */
const getRecommendations = async (req, res, next) => {
  try {
    const profile = await TransportProfile.findOne({ userId: req.user._id });

    const originArea = profile?.homeLocation?.area || '';
    const departureTime = profile?.travelTime || '08:30';
    const transportType = profile?.transportType || 'CAR';

    const [matchingPools, matchingPeers] = await Promise.all([
      findMatchingPools({
        originArea,
        departureTime,
        seatsRequired: 1,
        transportType,
        currentUserId: req.user._id,
      }),
      findMatchingPeers({
        originArea,
        departureTime,
        transportType,
        currentUserId: req.user._id,
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        pools: matchingPools.slice(0, 6),
        peers: matchingPeers.slice(0, 6),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchMatches,
  getRecommendations,
};
