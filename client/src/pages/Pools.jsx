import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  PlusCircle,
  MapPin,
  Clock,
  Car,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { poolService } from '../services/api';
import { Badge, LoadingSpinner, EmptyState } from '../components/UIPrimitives';
import { useAuth } from '../context/AuthContext';

const Pools = () => {
  const { user } = useAuth();
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'created', 'joined'
  const [searchArea, setSearchArea] = useState('');
  const [transportType, setTransportType] = useState('ALL');

  const fetchPools = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterTab === 'created') params.myPools = 'created';
      if (filterTab === 'joined') params.myPools = 'joined';
      if (searchArea) params.originArea = searchArea;
      if (transportType !== 'ALL') params.transportType = transportType;

      const res = await poolService.getPools(params);
      if (res.data?.success) {
        setPools(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching pools:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPools();
  }, [filterTab, transportType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPools();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
            <Users className="w-3.5 h-3.5" />
            Verified College Carpools
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Transport Pools Directory
          </h1>
          <p className="text-sm text-slate-500">
            Browse active campus carpools or offer empty seats in your vehicle.
          </p>
        </div>

        <Link
          to="/create-pool"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/30 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Pool
        </Link>
      </div>

      {/* Tabs and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1 self-start sm:self-auto">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterTab === 'all'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Open Pools
          </button>
          <button
            onClick={() => setFilterTab('joined')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterTab === 'joined'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Joined by Me
          </button>
          <button
            onClick={() => setFilterTab('created')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterTab === 'created'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Created by Me
          </button>
        </div>

        {/* Search & Mode selector */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search area (e.g. Miyapur)..."
              value={searchArea}
              onChange={(e) => setSearchArea(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </form>

          <select
            value={transportType}
            onChange={(e) => setTransportType(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">All Modes</option>
            <option value="CAR">Car</option>
            <option value="BIKE">Two-Wheeler</option>
            <option value="COLLEGE_BUS">College Bus</option>
          </select>
        </div>
      </div>

      {/* Pools Grid */}
      {loading ? (
        <LoadingSpinner text="Loading campus transport pools..." />
      ) : pools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pools.map((pool) => {
            const isCreator = pool.creator?._id === user?._id || pool.creator === user?._id;
            const isMember = pool.members?.some(
              (m) => (m.user?._id || m.user) === user?._id && m.status !== 'CANCELLED'
            );

            return (
              <div
                key={pool._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-card hover:shadow-elevated transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={pool.status === 'OPEN' ? 'success' : pool.status === 'FULL' ? 'warning' : 'default'}>
                      {pool.status}
                    </Badge>
                    {isCreator && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        Host Driver
                      </span>
                    )}
                    {isMember && !isCreator && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Joined Member
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-1">{pool.name}</h3>

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
                        Departure: <strong>{pool.departureTime}</strong> (Arrival ~{pool.estimatedArrival})
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
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                        {pool.driver?.name?.charAt(0) || 'D'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          {pool.driver?.name}
                          {pool.driver?.isVerified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500">{pool.driver?.department}</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">
                      {pool.members?.length || 0} Rider(s)
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Seats & Cost</span>
                    <span className="text-xs font-bold text-slate-800">
                      {pool.availableSeats} of {pool.totalSeats} seats • <span className="text-emerald-600">₹{pool.costPerPerson}/person</span>
                    </span>
                  </div>

                  <Link
                    to={`/pools/${pool._id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    Details & Join
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No transport pools matching your filter"
          description="Be the first to offer a ride from your locality or search a nearby area."
          actionText="Create a Transport Pool"
          onAction={() => (window.location.href = '/create-pool')}
        />
      )}
    </div>
  );
};

export default Pools;
