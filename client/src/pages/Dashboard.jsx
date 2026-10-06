import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  PlusCircle,
  Route,
  AlertTriangle,
  Users,
  Car,
  Clock,
  MapPin,
  TrendingDown,
  Leaf,
  ShieldCheck,
  ArrowRight,
  Bell,
  Star,
  Bus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { poolService, tripService, matchService } from '../services/api';
import { Badge, LoadingSpinner } from '../components/UIPrimitives';
import EmergencyModal from '../components/EmergencyModal';

const Dashboard = () => {
  const { user, isFaculty, isAdmin } = useAuth();
  const [activePool, setActivePool] = useState(null);
  const [nextTrip, setNextTrip] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sosModalOpen, setSosModalOpen] = useState(false);

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [joinedPoolsRes, createdPoolsRes, tripsRes, matchRes] = await Promise.all([
          poolService.getPools({ myPools: 'joined' }).catch(() => ({ data: { data: [] } })),
          poolService.getPools({ myPools: 'created' }).catch(() => ({ data: { data: [] } })),
          tripService.getTrips().catch(() => ({ data: { data: [] } })),
          matchService.getRecommendations().catch(() => ({ data: { data: { pools: [] } } })),
        ]);

        // Active pool
        const allMyPools = [
          ...(createdPoolsRes.data?.data || []),
          ...(joinedPoolsRes.data?.data || []),
        ];
        const openOrActive = allMyPools.find((p) => p.status === 'OPEN' || p.status === 'ACTIVE');
        setActivePool(openOrActive || null);

        // Next Trip
        const trips = tripsRes.data?.data || [];
        const upcoming = trips.find((t) => t.status === 'SCHEDULED' || t.status === 'STARTED');
        setNextTrip(upcoming || null);

        // Matches
        setMatches(matchRes.data?.data?.pools || []);
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <LoadingSpinner text="Loading campus transit dashboard..." />
      </div>
    );
  }

  // Savings calculation (Avg pool saves ₹80 vs solo auto/cab per commute)
  const estimatedSavings = 480; // monthly approx ₹
  const greenTripsCount = 6;
  const co2SavedKg = Math.round(greenTripsCount * 3.2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {user?.department}
              </span>
              {user?.isVerified && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Campus Identity
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {getGreeting()}, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              {isFaculty
                ? 'Welcome to your faculty mobility hub. Coordinate shared campus transit and review route options.'
                : 'Your daily college commute is optimized for safety, lower carbon emissions, and maximum fuel savings.'}
            </p>
          </div>

          {/* Quick Actions Panel */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            <Link
              to="/find-transport"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all hover:scale-105"
            >
              <Compass className="w-4 h-4" />
              Find Transport
            </Link>
            <Link
              to="/create-pool"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-semibold transition-all"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              Create Pool
            </Link>
            <Link
              to="/trips"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-semibold transition-all"
            >
              <Route className="w-4 h-4 text-purple-400" />
              My Trips
            </Link>
            <button
              onClick={() => setSosModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all active:scale-95"
            >
              <AlertTriangle className="w-4 h-4" />
              Emergency
            </button>
          </div>
        </div>

        {/* Subtle decorative background shapes */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Primary KPI & Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Saved Cost */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Saved Transport Cost
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">₹{estimatedSavings}</div>
            <p className="text-[11px] text-emerald-600 font-medium">Estimated 68% savings</p>
          </div>
        </div>

        {/* Card 2: Green Trips */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Green Trips
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">{greenTripsCount} Trips</div>
            <p className="text-[11px] text-slate-500">~{co2SavedKg} kg CO2 reduced</p>
          </div>
        </div>

        {/* Card 3: Next Trip Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Next Trip
            </span>
            <div className="text-base font-bold text-slate-900 mt-0.5">
              {nextTrip ? nextTrip.status : 'None Scheduled'}
            </div>
            <p className="text-[11px] text-slate-500 truncate max-w-[140px]">
              {nextTrip ? nextTrip.origin : 'Plan your next commute'}
            </p>
          </div>
        </div>

        {/* Card 4: Compatible Matches */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Available Matches
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">
              {matches.length} Compatible
            </div>
            <p className="text-[11px] text-slate-500">In your commute area</p>
          </div>
        </div>
      </div>

      {/* Main Grid: My Active Pool & Next Trip vs Quick Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Active Pool & Next Trip */}
        <div className="lg:col-span-7 space-y-6">
          {/* My Active Pool Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-base">My Active Pool</h3>
              </div>
              {activePool ? (
                <Badge variant={activePool.status === 'OPEN' ? 'success' : 'primary'}>
                  {activePool.status}
                </Badge>
              ) : (
                <span className="text-xs text-slate-400">Not in a pool currently</span>
              )}
            </div>

            {activePool ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-slate-900 text-lg">{activePool.name}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {activePool.origin?.area} ➔ {activePool.destination?.campusName || 'Campus'}
                    </p>
                  </div>
                  <div className="text-right sm:text-right">
                    <span className="text-xs text-slate-400">Departure</span>
                    <div className="text-sm font-bold text-slate-800">{activePool.departureTime} AM</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl text-center text-xs">
                  <div>
                    <span className="text-slate-400 block">Total Seats</span>
                    <span className="font-bold text-slate-800">{activePool.totalSeats}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Available</span>
                    <span className="font-bold text-emerald-600">{activePool.availableSeats}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Split Cost</span>
                    <span className="font-bold text-blue-600">₹{activePool.costPerPerson}/person</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                      {activePool.driver?.name?.charAt(0) || 'D'}
                    </div>
                    <span>Driver: {activePool.driver?.name || 'Assigned Driver'}</span>
                  </div>

                  <Link
                    to={`/pools/${activePool._id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
                  >
                    View Pool Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Car className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700">No active transport pool</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Search compatible student & faculty rides or create your own pool to start saving on daily travel.
                </p>
                <div className="mt-4 flex justify-center gap-3">
                  <Link
                    to="/find-transport"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
                  >
                    Find Transport
                  </Link>
                  <Link
                    to="/create-pool"
                    className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium rounded-xl"
                  >
                    Create Pool
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* College Bus Quick Schedule Banner */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
                <Bus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Official College Buses Active</h4>
                <p className="text-xs text-slate-600">3 Designated campus transit routes running today.</p>
              </div>
            </div>
            <Link
              to="/buses"
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              View Timetables
            </Link>
          </div>
        </div>

        {/* Right Column (5 cols): Available Matches & Peer Commuters */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-800 text-base">Recommended Matches</h3>
              </div>
              <Link to="/find-transport" className="text-xs font-semibold text-blue-600 hover:underline">
                View All
              </Link>
            </div>

            {matches.length > 0 ? (
              <div className="space-y-3">
                {matches.slice(0, 3).map((match) => (
                  <div
                    key={match._id}
                    className="p-3.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{match.name}</h4>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{match.origin?.area}</span>
                          <span>•</span>
                          <span>{match.departureTime}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                        {match.matchScore ? `${match.matchScore}% Match` : 'Match'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                      <span className="text-slate-500 font-medium">
                        {match.availableSeats} seat{match.availableSeats > 1 ? 's' : ''} left
                      </span>
                      <Link
                        to={`/pools/${match._id}`}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        View Pool →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No automatic matches for your current route yet.</p>
                <Link
                  to="/transport-profile"
                  className="mt-2 inline-block text-xs font-bold text-blue-600 hover:underline"
                >
                  Update Commute Route Preferences
                </Link>
              </div>
            )}
          </div>

          {/* Campus Safety Quick Notice */}
          <div className="bg-slate-900 text-slate-300 rounded-2xl p-5 text-xs space-y-2 border border-slate-800">
            <div className="flex items-center gap-2 text-white font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Safety Guarantee
            </div>
            <p className="text-slate-400 leading-relaxed">
              Every ride is tracked with emergency contacts. Exact home addresses are concealed; only broad neighborhoods and pickup points are shared.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
        activeTripId={nextTrip?._id}
      />
    </div>
  );
};

export default Dashboard;
