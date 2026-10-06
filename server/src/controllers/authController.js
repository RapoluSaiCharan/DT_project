const bcrypt = require('bcryptjs');
const User = require('../models/User');
const TransportProfile = require('../models/TransportProfile');
const { generateToken, setAuthCookie, clearAuthCookie } = require('../utils/jwt');

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, collegeId, phone, department, year, role } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    // Check if college ID already registered
    const existingCollegeId = await User.findOne({ collegeId: collegeId.toUpperCase() });
    if (existingCollegeId) {
      return res.status(409).json({
        success: false,
        message: 'An account with this College ID / Roll Number is already registered.',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Default verification: Students/faculty verified in dev, can be managed by admin
    const isVerified = true;

    // Create user
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      collegeId: collegeId.toUpperCase(),
      phone,
      department,
      year: year || '1st Year',
      role: role || 'STUDENT',
      isVerified,
      isActive: true,
    });

    // Create initial default transport profile for user
    await TransportProfile.create({
      userId: newUser._id,
      homeLocation: {
        address: 'Near Metro / Campus Area',
        area: 'Miyapur',
        city: 'Hyderabad',
      },
      destination: {
        address: 'Campus Main Gate',
        campusName: 'Main Campus',
      },
      travelTime: '08:15',
      returnTime: '17:00',
      transportType: 'CAR',
      availableSeats: 3,
      requiresRide: true,
      offersRide: false,
    });

    // Generate JWT and set HTTP-only cookie
    const token = generateToken(newUser);
    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully. Welcome to CampusPool!',
      data: {
        user: newUser.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user and include passwordHash
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact campus administration.',
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    // Generate token and set HTTP-only cookie
    const token = generateToken(user);
    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        user: user.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
const logout = async (req, res, next) => {
  try {
    clearAuthCookie(res);
    res.status(200).json({
      success: true,
      message: 'Logged out successfully. Authentication cookie cleared.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user
 * GET /api/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    // req.user is populated by protect middleware
    const transportProfile = await TransportProfile.findOne({ userId: req.user._id }).populate('preferredPickupPoint');

    res.status(200).json({
      success: true,
      data: {
        user: req.user,
        transportProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh / verify session token
 * POST /api/auth/refresh
 */
const refresh = async (req, res, next) => {
  try {
    const token = generateToken(req.user);
    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'Session refreshed successfully.',
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  refresh,
};
