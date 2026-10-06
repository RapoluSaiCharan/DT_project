import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Authenticated Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import TransportProfile from './pages/TransportProfile';
import FindTransport from './pages/FindTransport';
import Pools from './pages/Pools';
import PoolDetails from './pages/PoolDetails';
import CreatePool from './pages/CreatePool';
import Trips from './pages/Trips';
import TripDetails from './pages/TripDetails';
import PickupPoints from './pages/PickupPoints';
import CollegeBuses from './pages/CollegeBuses';
import Notifications from './pages/Notifications';
import Safety from './pages/Safety';
import Feedback from './pages/Feedback';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminPools from './pages/Admin/AdminPools';
import AdminPickupPoints from './pages/Admin/AdminPickupPoints';
import AdminBuses from './pages/Admin/AdminBuses';
import AdminReports from './pages/Admin/AdminReports';
import AdminAnalytics from './pages/Admin/AdminAnalytics';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Authenticated Commuter Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transport-profile"
                  element={
                    <ProtectedRoute>
                      <TransportProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/find-transport"
                  element={
                    <ProtectedRoute>
                      <FindTransport />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/matches"
                  element={
                    <ProtectedRoute>
                      <FindTransport />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pools"
                  element={
                    <ProtectedRoute>
                      <Pools />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pools/:id"
                  element={
                    <ProtectedRoute>
                      <PoolDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-pool"
                  element={
                    <ProtectedRoute>
                      <CreatePool />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/trips"
                  element={
                    <ProtectedRoute>
                      <Trips />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/trips/:id"
                  element={
                    <ProtectedRoute>
                      <TripDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pickup-points"
                  element={
                    <ProtectedRoute>
                      <PickupPoints />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/buses"
                  element={
                    <ProtectedRoute>
                      <CollegeBuses />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/safety"
                  element={
                    <ProtectedRoute>
                      <Safety />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/feedback"
                  element={
                    <ProtectedRoute>
                      <Feedback />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Management Routes (Restricted by Role) */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['TRANSPORT_ADMIN', 'SUPER_ADMIN']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute allowedRoles={['TRANSPORT_ADMIN', 'SUPER_ADMIN']}>
                      <AdminUsers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/pools"
                  element={
                    <ProtectedRoute allowedRoles={['TRANSPORT_ADMIN', 'SUPER_ADMIN']}>
                      <AdminPools />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/pickup-points"
                  element={
                    <ProtectedRoute allowedRoles={['TRANSPORT_ADMIN', 'SUPER_ADMIN']}>
                      <AdminPickupPoints />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/buses"
                  element={
                    <ProtectedRoute allowedRoles={['TRANSPORT_ADMIN', 'SUPER_ADMIN']}>
                      <AdminBuses />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/reports"
                  element={
                    <ProtectedRoute allowedRoles={['TRANSPORT_ADMIN', 'SUPER_ADMIN']}>
                      <AdminReports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <ProtectedRoute allowedRoles={['TRANSPORT_ADMIN', 'SUPER_ADMIN']}>
                      <AdminAnalytics />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
