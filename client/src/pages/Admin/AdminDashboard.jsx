import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Car,
  Route,
  Bus,
  AlertTriangle,
  TrendingUp,
  MapPin,
  ShieldCheck,
  Leaf,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import { adminService } from '../../services/api';
import { LoadingSpinner, Badge } from '../../components/UIPrimitives';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await adminService.getStats();
        if (res.data?.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <LoadingSpinner text="Loading campus administration analytics..." />
      </div>
    );
  }

  const { users, pools, trips, buses, safety, sustainability, popularRoutes } = stats || {
    users: { total: 0, verified: 0, byRole: {} },
    pools: { total: 0, active: 0 },
    trips: { completed: 0 },
    buses: { active: 0 },
    safety: { pendingReports: 0 },
    sustainability: { co2SavedKg: 0, fuelCostSaved: 0, greenTrips: 0 },
    popularRoutes: [],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Administration & Transport Desk
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus Transit Operations
          </h1>
          <p className="text-sm text-slate-500">
            Real-time management for college carpools, bus fleets, student verifications, and safety logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/analytics"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <BarChart3 className="w-4 h-4" /> Full Analytics
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link to="/admin/users" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Users</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{users.total}</div>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            {users.verified} verified ({users.verificationRate || 100}%)
          </p>
        </Link>

        <Link to="/admin/pools" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Pools</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{pools.active}</div>
          <p className="text-xs text-slate-500 mt-1">{pools.total} total pools created</p>
        </Link>

        <Link to="/admin/buses" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">College Buses</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bus className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{buses.active}</div>
          <p className="text-xs text-slate-500 mt-1">Active transit lines today</p>
        </Link>

        <Link to="/admin/reports" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Open Reports</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-600 mt-2">{safety.pendingReports}</div>
          <p className="text-xs text-slate-500 mt-1">Pending review & resolution</p>
        </Link>
      </div>

      {/* Admin Modules Quick Launch */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Link to="/admin/users" className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-blue-500 text-center transition-all group">
          <Users className="w-5 h-5 text-blue-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-800 block">User Roster</span>
          <span className="text-[10px] text-slate-400">Roles & Status</span>
        </Link>

        <Link to="/admin/pools" className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 text-center transition-all group">
          <Car className="w-5 h-5 text-emerald-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-800 block">Carpools</span>
          <span className="text-[10px] text-slate-400">Monitor Capacity</span>
        </Link>

        <Link to="/admin/pickup-points" className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-indigo-500 text-center transition-all group">
          <MapPin className="w-5 h-5 text-indigo-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-800 block">Pickup Points</span>
          <span className="text-[10px] text-slate-400">Add / Edit Zones</span>
        </Link>

        <Link to="/admin/buses" className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-amber-500 text-center transition-all group">
          <Bus className="w-5 h-5 text-amber-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-800 block">College Buses</span>
          <span className="text-[10px] text-slate-400">Fleet Timetables</span>
        </Link>

        <Link to="/admin/reports" className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-rose-500 text-center transition-all group">
          <AlertTriangle className="w-5 h-5 text-rose-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-800 block">Safety & SOS</span>
          <span className="text-[10px] text-slate-400">Resolve Incidents</span>
        </Link>

        <Link to="/admin/analytics" className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-purple-500 text-center transition-all group">
          <BarChart3 className="w-5 h-5 text-purple-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-800 block">Analytics</span>
          <span className="text-[10px] text-slate-400">Demand Heatmaps</span>
        </Link>
      </div>

      {/* Demand & Sustainability Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Popular Commute Origins */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" /> High-Demand Commute Hubs
          </h3>
          <div className="space-y-3">
            {popularRoutes.length > 0 ? (
              popularRoutes.map((route, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    {route.origin}
                  </div>
                  <span className="text-xs font-bold text-blue-600">{route.count} Active Pools</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">Demand data populates automatically with pool activity.</p>
            )}
          </div>
        </div>

        {/* Sustainability Impact */}
        <div className="lg:col-span-6 bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-950 text-white p-6 rounded-3xl border border-emerald-800/40 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Leaf className="w-4 h-4" /> Campus Green Mobility Footprint
            </div>
            <h3 className="text-xl font-bold">College Environmental Contribution</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Shared transit drastically curbs vehicular emissions around academic zones and eases campus parking bottlenecks.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 my-6 text-center">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
              <span className="text-2xl font-extrabold text-emerald-400">{sustainability.co2SavedKg} kg</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">CO2 Reduced</span>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
              <span className="text-2xl font-extrabold text-blue-400">₹{sustainability.fuelCostSaved}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Student Fuel Saved</span>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
              <span className="text-2xl font-extrabold text-amber-400">{trips.completed}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Completed Rides</span>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              to="/admin/analytics"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              Detailed Sustainability Report →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
