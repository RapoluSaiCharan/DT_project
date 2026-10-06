const User = require('../models/User');
const Pool = require('../models/Pool');
const Trip = require('../models/Trip');
const Bus = require('../models/Bus');
const Report = require('../models/Report');
const PickupPoint = require('../models/PickupPoint');

const getDashboardStats = async () => {
  const [
    totalUsers,
    verifiedUsers,
    roleCounts,
    poolCounts,
    tripCounts,
    activeBuses,
    pendingReports,
    popularOrigins,
  ] = await Promise.all([
    User.countDocuments({ isActive: true }),
    User.countDocuments({ isVerified: true, isActive: true }),
    User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]),
    Pool.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Trip.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Bus.countDocuments({ isActive: true }),
    Report.countDocuments({ status: { $in: ['PENDING', 'INVESTIGATING'] } }),
    Pool.aggregate([
      { $group: { _id: '$origin.area', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
  ]);

  // Format roles
  const roles = {
    STUDENT: 0,
    FACULTY: 0,
    TRANSPORT_ADMIN: 0,
    SUPER_ADMIN: 0,
  };
  roleCounts.forEach((r) => {
    roles[r._id] = r.count;
  });

  // Format pools
  const pools = {
    OPEN: 0,
    FULL: 0,
    ACTIVE: 0,
    COMPLETED: 0,
    CANCELLED: 0,
  };
  poolCounts.forEach((p) => {
    pools[p._id] = p.count;
  });

  // Format trips
  const trips = {
    SCHEDULED: 0,
    STARTED: 0,
    COMPLETED: 0,
    CANCELLED: 0,
    EMERGENCY: 0,
  };
  tripCounts.forEach((t) => {
    trips[t._id] = t.count;
  });

  // Green metrics:
  // Each completed trip pool reduces ~2 solo vehicles = approx 2.5 kg CO2 saved per trip
  // Average money saved per participant per trip = ~₹60
  const completedTripsCount = trips.COMPLETED || 0;
  const estimatedCo2SavedKg = Math.round(completedTripsCount * 3.2);
  const estimatedFuelCostSaved = Math.round(completedTripsCount * 140);

  return {
    users: {
      total: totalUsers,
      verified: verifiedUsers,
      verificationRate: totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 100,
      byRole: roles,
    },
    pools: {
      total: Object.values(pools).reduce((a, b) => a + b, 0),
      active: (pools.OPEN || 0) + (pools.ACTIVE || 0),
      byStatus: pools,
    },
    trips: {
      total: Object.values(trips).reduce((a, b) => a + b, 0),
      completed: completedTripsCount,
      byStatus: trips,
    },
    buses: {
      active: activeBuses,
    },
    safety: {
      pendingReports,
    },
    sustainability: {
      co2SavedKg: estimatedCo2SavedKg,
      fuelCostSaved: estimatedFuelCostSaved,
      greenTrips: completedTripsCount,
    },
    popularRoutes: popularOrigins.map((o) => ({
      origin: o._id || 'Campus Vicinity',
      count: o.count,
    })),
  };
};

module.exports = {
  getDashboardStats,
};
