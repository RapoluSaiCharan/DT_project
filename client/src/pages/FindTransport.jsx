import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Clock,
  Car,
  Users,
  ShieldCheck,
  Star,
  DollarSign,
  Filter,
  ArrowRight,
  AlertCircle,
  Building,
} from 'lucide-react';
import { matchService, pickupService } from '../services/api';
import { Badge, LoadingSpinner, EmptyState } from '../components/UIPrimitives';

const FindTransport = () => {
  const [form, setForm] = useState({
    originArea: 'Miyapur',
    destinationCampus: 'Main Campus',
    departureTime: '08:15',
    returnTime: '17:00',
    transportType: 'CAR',
    seatsRequired: 1,
  });

  const [pickupPoints, setPickupPoints] = useState([]);
  const [pools, setPools] = useState([]);
  const [peers, setPeers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load pickup point areas for suggestions
    const loadPickupPoints = async () => {
      try {
        const res = await pickupService.getPickupPoints();
        if (res.data?.success) {
          setPickupPoints(res.data.data || []);
        }
      } catch (err) {
        console.warn('Could not load pickup points:', err);
      }
    };
    loadPickupPoints();

    // Auto-search on page load with defaults
    handleSearch();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSearched(true);
      const res = await matchService.searchMatches({
        originArea: form.originArea,
        destinationCampus: form.destinationCampus,
        departureTime: form.departureTime,
        seatsRequired: parseInt(form.seatsRequired, 10),
        transportType: form.transportType,
      });

      if (res.data?.success) {
        setPools(res.data.data.pools || []);
        setPeers(res.data.data.peers || []);
      }
    } catch (err) {
      setError(err.message || 'Error searching for route matches.');
    } finally {
      setLoading(false);
    }
  };

  const areaSuggestions = ['Miyapur', 'Kukatpally', 'Hitec City', 'Gachibowli', 'Secunderabad', 'Madhapur', 'Balanagar'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
          <Search className="w-3.5 h-3.5" />
          Smart Route Matching
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Find Compatible Rides & Transport Pools
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl mt-1">
          Enter your neighborhood and routine timings to find open pools hosted by verified college students and faculty.
        </p>
      </div>

      {/* Search Criteria Form */}
      <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-200">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Origin Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Starting Location / Neighborhood
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="originArea"
                  value={form.originArea}
                  onChange={handleChange}
                  placeholder="e.g. Miyapur, Kukatpally"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {areaSuggestions.slice(0, 4).map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, originArea: area }))}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md"
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                College Campus / Block
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="destinationCampus"
                  value={form.destinationCampus}
                  onChange={handleChange}
                  placeholder="Main Campus Gate"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Departure Time */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Morning Departure Time (Tolerance ±30m)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="departureTime"
                  value={form.departureTime}
                  onChange={handleChange}
                  placeholder="08:15"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Transport Preference */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Transport Preference
              </label>
              <select
                name="transportType"
                value={form.transportType}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
              >
                <option value="ALL">All Modes (Car, Bike, Bus)</option>
                <option value="CAR">Car Pool Only</option>
                <option value="BIKE">Two-Wheeler Pool</option>
                <option value="COLLEGE_BUS">College Bus Connections</option>
              </select>
            </div>

            {/* Seats Required */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Seats Needed
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  name="seatsRequired"
                  value={form.seatsRequired}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                >
                  <option value={1}>1 Seat</option>
                  <option value={2}>2 Seats</option>
                  <option value={3}>3 Seats</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <Search className="w-4 h-4" />
                {loading ? 'Searching Algorithm...' : 'Find Matches'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            Available Transport Pools ({pools.length})
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Time Tolerance Window: ±30 minutes
          </span>
        </div>

        {loading ? (
          <LoadingSpinner text="Searching compatible campus routes..." />
        ) : pools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pools.map((pool) => (
              <div
                key={pool._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-card hover:shadow-elevated transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Match Score & Transport Type */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {pool.matchScore ? `${pool.matchScore}% Match` : 'Compatible'}
                    </span>
                    <Badge variant={pool.status === 'OPEN' ? 'success' : 'default'} size="sm">
                      {pool.status}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-1">{pool.name}</h3>

                  {/* Route & Time */}
                  <div className="space-y-2 text-xs text-slate-600 my-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-medium text-slate-800">
                        {pool.origin?.area} ➔ {pool.destination?.campusName || 'College'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-600 shrink-0" />
                      <span>
                        Leaves at <strong>{pool.departureTime}</strong> (Arrival ~{pool.estimatedArrival})
                      </span>
                    </div>

                    {pool.pickupPoint && (
                      <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">Pickup: {pool.pickupPoint.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Driver Card */}
                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between mb-4 border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                        {pool.driver?.name?.charAt(0) || 'D'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          {pool.driver?.name || 'Driver'}
                          {pool.driver?.isVerified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" title="Verified Identity" />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {pool.driver?.department || 'College Member'} • {pool.driver?.role}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      4.9
                    </div>
                  </div>
                </div>

                {/* Footer Info & View Pool Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Seats & Cost</span>
                    <span className="text-xs font-bold text-slate-800">
                      {pool.availableSeats} seat(s) • <span className="text-emerald-600">₹{pool.costPerPerson}/person</span>
                    </span>
                  </div>

                  <Link
                    to={`/pools/${pool._id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    View Pool
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : searched ? (
          <EmptyState
            icon={Car}
            title="No transport matches found in this window."
            description="Try changing your departure time (±15-30 mins) or adjusting your pickup neighborhood."
            actionText="Create a New Pool Instead"
            onAction={() => (window.location.href = '/create-pool')}
          />
        ) : null}

        {/* Matching Peers Section */}
        {peers.length > 0 && (
          <div className="pt-6 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Commuters Traveling Along Similar Timings ({peers.length})
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Students and faculty heading the same way who may be open to forming a new pool.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {peers.map((peer, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-sm">
                      {peer.user?.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        {peer.user?.name}
                        {peer.user?.isVerified && (
                          <ShieldCheck className="w-3 h-3 text-blue-600" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {peer.user?.department} • {peer.profile?.homeLocation?.area}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Departs ~{peer.profile?.travelTime}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {peer.matchScore}% Match
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindTransport;
