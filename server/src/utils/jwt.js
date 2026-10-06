const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'campus_pool_super_secret_jwt_key_2026_dev_env_only!';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const COOKIE_NAME = process.env.COOKIE_NAME || 'campus_pool_auth';

/**
 * Generate a JWT token containing user id and role
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
};

/**
 * Set HTTP-only secure cookie with the JWT token
 */
const setAuthCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: maxAge,
    path: '/',
  });
};

/**
 * Clear the authentication cookie
 */
const clearAuthCookie = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/',
  });
};

/**
 * Verify JWT token
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  generateToken,
  setAuthCookie,
  clearAuthCookie,
  verifyToken,
  COOKIE_NAME,
};
