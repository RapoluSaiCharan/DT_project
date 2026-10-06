import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [transportProfile, setTransportProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check auth session on startup using /api/auth/me
  const fetchCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await authService.getCurrentUser();
      if (res.data?.success) {
        setUser(res.data.data.user);
        setTransportProfile(res.data.data.transportProfile);
      } else {
        setUser(null);
        setTransportProfile(null);
      }
    } catch (err) {
      // 401 is normal when visitor is not logged in
      setUser(null);
      setTransportProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Login handler
  const login = async (credentials) => {
    setError(null);
    try {
      const res = await authService.login(credentials);
      if (res.data?.success) {
        setUser(res.data.data.user);
        await fetchCurrentUser(); // Refresh transport profile too
        return res.data;
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  // Register handler
  const register = async (userData) => {
    setError(null);
    try {
      const res = await authService.register(userData);
      if (res.data?.success) {
        setUser(res.data.data.user);
        await fetchCurrentUser();
        return res.data;
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      setUser(null);
      setTransportProfile(null);
    }
  };

  // Helper properties
  const isStudent = user?.role === 'STUDENT';
  const isFaculty = user?.role === 'FACULTY';
  const isTransportAdmin = user?.role === 'TRANSPORT_ADMIN';
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isAdmin = isTransportAdmin || isSuperAdmin;
  const isVerified = user?.isVerified === true;

  const value = {
    user,
    transportProfile,
    loading,
    error,
    login,
    register,
    logout,
    refreshUser: fetchCurrentUser,
    isAuthenticated: !!user,
    isStudent,
    isFaculty,
    isTransportAdmin,
    isSuperAdmin,
    isAdmin,
    isVerified,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
