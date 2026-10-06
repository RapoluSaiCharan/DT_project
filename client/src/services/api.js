import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for unified error message extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      status: error.response?.status,
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected network error occurred.',
      errors: error.response?.data?.errors || [],
    };
    return Promise.reject(customError);
  }
);

// 1. Auth Services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  refreshSession: () => api.post('/auth/refresh'),
};

// 2. User & Transport Profile Services
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.patch('/users/profile', data),
  getTransportProfile: () => api.get('/users/transport-profile'),
  updateTransportProfile: (data) => api.put('/users/transport-profile', data),
};

// 3. Match Services
export const matchService = {
  searchMatches: (criteria) => api.post('/matches/search', criteria),
  getRecommendations: () => api.get('/matches/recommendations'),
};

// 4. Pool Services
export const poolService = {
  getPools: (params) => api.get('/pools', { params }),
  getPoolById: (id) => api.get(`/pools/${id}`),
  createPool: (data) => api.post('/pools', data),
  joinPool: (id, data) => api.post(`/pools/${id}/join`, data),
  leavePool: (id) => api.post(`/pools/${id}/leave`),
  updatePool: (id, data) => api.patch(`/pools/${id}`, data),
  cancelPool: (id) => api.post(`/pools/${id}/cancel`),
  deletePool: (id) => api.delete(`/pools/${id}`),
};

// 5. Trip Services
export const tripService = {
  getTrips: (params) => api.get('/trips', { params }),
  getTripById: (id) => api.get(`/trips/${id}`),
  startTrip: (poolId) => api.post('/trips/start', { poolId }),
  updateStatus: (id, status) => api.patch(`/trips/${id}/status`, { status }),
  updateCost: (id, costData) => api.post(`/trips/${id}/cost`, costData),
  getCostBreakdown: (id) => api.get(`/trips/${id}/cost`),
};

// 6. Pickup Points Services
export const pickupService = {
  getPickupPoints: (params) => api.get('/pickup-points', { params }),
  createPickupPoint: (data) => api.post('/pickup-points', data),
  updatePickupPoint: (id, data) => api.patch(`/pickup-points/${id}`, data),
  deletePickupPoint: (id) => api.delete(`/pickup-points/${id}`),
};

// 7. Bus Fleet Services
export const busService = {
  getBuses: (params) => api.get('/buses', { params }),
  getBusById: (id) => api.get(`/buses/${id}`),
  createBus: (data) => api.post('/buses', data),
  updateBus: (id, data) => api.patch(`/buses/${id}`, data),
  deleteBus: (id) => api.delete(`/buses/${id}`),
};

// 8. Safety & SOS Services
export const safetyService = {
  triggerSOS: (payload) => api.post('/safety/sos', payload),
  getActiveEmergencies: () => api.get('/safety/active'),
  resolveEmergency: (id, note) => api.patch(`/safety/${id}/resolve`, { note }),
};

// 9. Report Services
export const reportService = {
  createReport: (data) => api.post('/reports', data),
  getReports: (params) => api.get('/reports', { params }),
  updateReport: (id, data) => api.patch(`/reports/${id}`, data),
};

// 10. Rating Services
export const ratingService = {
  submitRating: (data) => api.post('/ratings', data),
  getUserRatings: (userId) => api.get(`/ratings/users/${userId}`),
};

// 11. Notification Services
export const notificationService = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
};

// 12. Admin Services
export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getAnalytics: () => api.get('/admin/analytics'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
  toggleUserStatus: (id, data) => api.patch(`/admin/users/${id}/status`, data),
};

export default api;
