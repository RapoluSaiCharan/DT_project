const User = require('../models/User');
const Pool = require('../models/Pool');
const Trip = require('../models/Trip');
const PickupPoint = require('../models/PickupPoint');
const { getDashboardStats } = require('../services/analyticsService');

/**
 * Get Admin dashboard summary stats
 * GET /api/admin/stats
 */
const getStats = async (req, res, next) => {
  try {
    const stats = await getDashboardStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get detailed transport demand analytics
 * GET /api/admin/analytics
 */
const getDemandAnalytics = async (req, res, next) => {
  try {
    const [
      hourlyDistribution,
      popularPickups,
      roleDistribution,
      poolAverages,
      recentTrips,
    ] = await Promise.all([
      // Peak travel departure hours
      Pool.aggregate([
        {
          $project: {
            hour: { $substr: ['$departureTime', 0, 2] },
          },
        },
        {
          $group: {
            _id: '$hour',
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Most used pickup points
      PickupPoint.aggregate([
        {
          $lookup: {
            from: 'pools',
            localField: '_id',
            foreignField: 'pickupPoint',
            as: 'poolsUsing',
          },
        },
        {
          $project: {
            name: 1,
            area: 1,
            address: 1,
            usageCount: { $size: '$poolsUsing' },
          },
        },
        { $sort: { usageCount: -1 } },
        { $limit: 8 },
      ]),

      // Participation by role
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
      ]),

      // Average pool size & capacity
      Pool.aggregate([
        {
          $group: {
            _id: null,
            avgTotalSeats: { $avg: '$totalSeats' },
            avgAvailableSeats: { $avg: '$availableSeats' },
            totalPools: { $sum: 1 },
          },
        },
      ]),

      // Recent 5 completed trips
      Trip.find({ status: 'COMPLETED' })
        .populate('driverId', 'name role')
        .sort({ arrivalTime: -1 })
        .limit(5),
    ]);

    res.status(200).json({
      success: true,
      data: {
        peakTravelHours: hourlyDistribution.map((h) => ({
          hour: `${h._id}:00`,
          count: h.count,
        })),
        popularPickupPoints: popularPickups,
        roleParticipation: roleDistribution,
        poolMetrics: poolAverages[0] || { avgTotalSeats: 4, avgAvailableSeats: 2, totalPools: 0 },
        recentCompletedTrips: recentTrips,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all users with filters and search (Admin only)
 * GET /api/admin/users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { role, isVerified, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (isVerified !== undefined) query.isVerified = isVerified === 'true';

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { collegeId: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const users = await User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        total,
        page: parseInt(page, 10),
        pages: Math.ceil(total / parseInt(limit, 10)),
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user role (Super Admin only)
 * PATCH /api/admin/users/:id/role
 */
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['STUDENT', 'FACULTY', 'TRANSPORT_ADMIN', 'SUPER_ADMIN'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified.',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role} successfully.`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle user active/suspend or verification status
 * PATCH /api/admin/users/:id/status
 */
const toggleUserStatus = async (req, res, next) => {
  try {
    const { isActive, isVerified } = req.body;
    const update = {};

    if (isActive !== undefined) update.isActive = isActive;
    if (isVerified !== undefined) update.isVerified = isVerified;

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select(
      '-passwordHash'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User status updated successfully.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getDemandAnalytics,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
};
