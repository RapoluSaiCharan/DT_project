/**
 * Restrict access to specified roles
 * @param  {...string} roles - e.g. 'TRANSPORT_ADMIN', 'SUPER_ADMIN'
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user.role}' is not authorized to access this resource`,
      });
    }

    next();
  };
};

/**
 * Check if the user is verified by college administration before joining or creating pools
 */
const requireVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated',
    });
  }

  // Admins are always allowed
  if (['TRANSPORT_ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
    return next();
  }

  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Your college identity is pending verification. Only verified college members can create or join pools.',
    });
  }

  next();
};

module.exports = { authorize, requireVerified };
