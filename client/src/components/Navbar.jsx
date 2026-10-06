import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Car,
  Bell,
  AlertTriangle,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Compass,
  Users,
  Route,
  Bus,
  Settings,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import EmergencyModal from './EmergencyModal';
import { Badge } from './UIPrimitives';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isFaculty } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-8">
              <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xl tracking-tight text-slate-900">
                      Campus<span className="text-blue-600">Pool</span>
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                      Smart
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 tracking-wider font-medium uppercase -mt-0.5">
                    College Transit Hub
                  </p>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              {isAuthenticated && (
                <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
                  <Link
                    to="/dashboard"
                    className="px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/find-transport"
                    className="px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <Compass className="w-4 h-4 text-blue-500" />
                    Find Transport
                  </Link>
                  <Link
                    to="/pools"
                    className="px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <Users className="w-4 h-4 text-emerald-500" />
                    Pools
                  </Link>
                  <Link
                    to="/trips"
                    className="px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <Route className="w-4 h-4 text-purple-500" />
                    My Trips
                  </Link>
                  <Link
                    to="/buses"
                    className="px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <Bus className="w-4 h-4 text-amber-500" />
                    College Buses
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="px-3 py-2 rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Settings className="w-4 h-4" />
                      Admin Desk
                    </Link>
                  )}
                </nav>
              )}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {isAuthenticated ? (
                <>
                  {/* SOS Button */}
                  <button
                    onClick={() => setSosModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition-all active:scale-95 animate-pulse"
                    title="Instant Emergency SOS"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>SOS</span>
                  </button>

                  {/* Notifications Bell */}
                  <Link
                    to="/notifications"
                    className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>

                  {/* User Profile Dropdown Button */}
                  <div className="relative">
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center border border-blue-200">
                        {user.name?.charAt(0)}
                      </div>
                      <div className="hidden lg:block">
                        <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                          {user.name}
                          {user.isVerified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" title="Verified College Member" />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          {user.role === 'STUDENT' ? 'Student' : user.role === 'FACULTY' ? 'Faculty Member' : 'Admin'}
                        </div>
                      </div>
                    </button>

                    {/* Dropdown Menu */}
                    {profileDropdownOpen && (
                      <div
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-fade-in"
                        onMouseLeave={() => setProfileDropdownOpen(false)}
                      >
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                          <div className="mt-1 flex gap-1">
                            <Badge variant={isFaculty ? 'faculty' : isAdmin ? 'admin' : 'primary'} size="sm">
                              {user.role}
                            </Badge>
                            {user.isVerified && (
                              <Badge variant="success" size="sm">
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>

                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          My College Profile
                        </Link>
                        <Link
                          to="/transport-profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                        >
                          <Car className="w-4 h-4 text-slate-400" />
                          Commute Preferences
                        </Link>
                        <Link
                          to="/safety"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-rose-600"
                        >
                          <AlertTriangle className="w-4 h-4 text-slate-400" />
                          Safety & Incident Reports
                        </Link>

                        <div className="border-t border-slate-100 mt-1 pt-1">
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              handleLogout();
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 text-left transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile Menu Toggle */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                  >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-600/30 transition-all"
                  >
                    Register College ID
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && isAuthenticated && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1">
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Dashboard
            </Link>
            <Link
              to="/find-transport"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Find Transport & Matches
            </Link>
            <Link
              to="/pools"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Transport Pools
            </Link>
            <Link
              to="/trips"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              My Trips & Cost Sharing
            </Link>
            <Link
              to="/buses"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              College Buses
            </Link>
            <Link
              to="/pickup-points"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Smart Pickup Points
            </Link>
            <Link
              to="/safety"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Campus Safety & Reports
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
              >
                Admin Management Desk
              </Link>
            )}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Instant Global SOS Modal */}
      <EmergencyModal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
