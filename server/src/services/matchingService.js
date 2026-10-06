const Pool = require('../models/Pool');
const TransportProfile = require('../models/TransportProfile');
const User = require('../models/User');

/**
 * Convert HH:MM string to minutes from midnight
 */
const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
};

/**
 * Calculate match percentage between query and a pool/profile
 */
const calculateMatchScore = (areaA, areaB, timeDiffMinutes, maxTolerance) => {
  let score = 50; // base score
  const normA = (areaA || '').toLowerCase().trim();
  const normB = (areaB || '').toLowerCase().trim();

  // Exact area match
  if (normA && normB && (normA === normB || normA.includes(normB) || normB.includes(normA))) {
    score += 35;
  }

  // Time closeness penalty / bonus
  const timeProximity = Math.max(0, 1 - timeDiffMinutes / maxTolerance);
  score += Math.round(timeProximity * 15);

  return Math.min(100, Math.max(10, score));
};

/**
 * Find matching transport pools based on user criteria
 */
const findMatchingPools = async ({
  originArea,
  destinationCampus,
  departureTime,
  seatsRequired = 1,
  transportType,
  currentUserId,
}) => {
  const toleranceMinutes = parseInt(process.env.MATCH_TIME_TOLERANCE_MINUTES || '30', 10);
  const targetMinutes = timeToMinutes(departureTime);

  // Build query for candidate pools
  const query = {
    status: { $in: ['OPEN', 'ACTIVE'] },
    availableSeats: { $gte: Number(seatsRequired) },
  };

  // Do not show pools created by current user
  if (currentUserId) {
    query.creator = { $ne: currentUserId };
    query['members.user'] = { $ne: currentUserId };
  }

  if (transportType && transportType !== 'ALL') {
    query.transportType = transportType;
  }

  // Fetch pools with populated driver & pickup points
  const candidatePools = await Pool.find(query)
    .populate('driver', 'name email role department year isVerified phone')
    .populate('pickupPoint', 'name address area landmark latitude longitude')
    .populate('members.user', 'name role department')
    .sort({ createdAt: -1 })
    .lean();

  const matches = [];

  for (const pool of candidatePools) {
    const poolMinutes = timeToMinutes(pool.departureTime);
    const timeDiff = Math.abs(poolMinutes - targetMinutes);

    // If departure time is specified, filter by tolerance; otherwise accept all open pools in area
    if (departureTime && timeDiff > toleranceMinutes) {
      continue;
    }

    const poolOriginArea = pool.origin?.area || '';
    const matchScore = calculateMatchScore(originArea, poolOriginArea, timeDiff, toleranceMinutes);

    matches.push({
      ...pool,
      timeDiffMinutes: timeDiff,
      matchScore,
      isExactAreaMatch: (originArea || '').toLowerCase().trim() === poolOriginArea.toLowerCase().trim(),
    });
  }

  // Sort by match score descending, then by time difference
  matches.sort((a, b) => b.matchScore - a.matchScore || a.timeDiffMinutes - b.timeDiffMinutes);

  return matches;
};

/**
 * Find matching peers (students/faculty with complementary travel profiles)
 */
const findMatchingPeers = async ({
  originArea,
  departureTime,
  transportType,
  currentUserId,
}) => {
  const toleranceMinutes = parseInt(process.env.MATCH_TIME_TOLERANCE_MINUTES || '30', 10);
  const targetMinutes = timeToMinutes(departureTime);

  const query = {};
  if (currentUserId) {
    query.userId = { $ne: currentUserId };
  }

  const profiles = await TransportProfile.find(query)
    .populate('userId', 'name email role department year isVerified phone')
    .populate('preferredPickupPoint')
    .lean();

  const peerMatches = [];

  for (const prof of profiles) {
    if (!prof.userId || !prof.userId.name) continue;

    const profMinutes = timeToMinutes(prof.travelTime);
    const timeDiff = Math.abs(profMinutes - targetMinutes);

    if (departureTime && timeDiff > toleranceMinutes) {
      continue;
    }

    const peerOriginArea = prof.homeLocation?.area || '';
    const matchScore = calculateMatchScore(originArea, peerOriginArea, timeDiff, toleranceMinutes);

    peerMatches.push({
      profile: prof,
      user: prof.userId,
      matchScore,
      timeDiffMinutes: timeDiff,
    });
  }

  peerMatches.sort((a, b) => b.matchScore - a.matchScore);
  return peerMatches.slice(0, 10);
};

module.exports = {
  findMatchingPools,
  findMatchingPeers,
  timeToMinutes,
};
