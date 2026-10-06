const User = require('../models/User');
const TransportProfile = require('../models/TransportProfile');

/**
 * Get profile of current user
 * GET /api/users/profile
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const transportProfile = await TransportProfile.findOne({ userId: req.user._id }).populate('preferredPickupPoint');

    res.status(200).json({
      success: true,
      data: {
        user: user.toSafeObject(),
        transportProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update current user profile info
 * PATCH /api/users/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, department, year } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (department) user.department = department;
    if (year) user.year = year;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get transport profile
 * GET /api/users/transport-profile
 */
const getTransportProfile = async (req, res, next) => {
  try {
    let profile = await TransportProfile.findOne({ userId: req.user._id }).populate('preferredPickupPoint');

    if (!profile) {
      profile = await TransportProfile.create({
        userId: req.user._id,
        homeLocation: { area: 'Campus Vicinity', address: '' },
        travelTime: '08:30',
        returnTime: '17:00',
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update transport profile
 * PUT /api/users/transport-profile
 */
const updateTransportProfile = async (req, res, next) => {
  try {
    const {
      homeLocation,
      destination,
      preferredPickupPoint,
      travelTime,
      returnTime,
      transportType,
      availableSeats,
      requiresRide,
      offersRide,
      preferences,
    } = req.body;

    const profile = await TransportProfile.findOneAndUpdate(
      { userId: req.user._id },
      {
        userId: req.user._id,
        homeLocation,
        destination,
        preferredPickupPoint: preferredPickupPoint || undefined,
        travelTime,
        returnTime,
        transportType,
        availableSeats,
        requiresRide,
        offersRide,
        preferences,
      },
      { new: true, upsert: true, runValidators: true }
    ).populate('preferredPickupPoint');

    res.status(200).json({
      success: true,
      message: 'Transport profile updated successfully',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getTransportProfile,
  updateTransportProfile,
};
