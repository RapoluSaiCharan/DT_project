import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Car,
  MapPin,
  Clock,
  Users,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Play,
  LogOut,
  XCircle,
  ArrowLeft,
  DollarSign,
  Phone,
  Mail,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { poolService, tripService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Badge, LoadingSpinner, Alert } from '../components/UIPrimitives';

const PoolDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, isVerified } = useAuth();

  const [pool, setPool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchPool = async () => {
    try {
      setLoading(true);
      const res = await poolService.getPoolById(id);
      if (res.data?.success) {
        setPool(res.data.data);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load pool details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPool();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <LoadingSpinner text="Fetching pool details..." />
      </div>
    );
  }

  if (!pool) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800">Transport Pool Not Found</h2>
        <Link to="/pools" className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:underline">
          Return to Pools Directory
        </Link>
      </div>
    );
  }

  // Permissions
  const isDriverOrCreator =
    pool.driver?._id === user?._id ||
    pool.creator?._id === user?._id ||
    pool.driver === user?._id;

  const isMember = pool.members?.some(
    (m) => (m.user?._id || m.user) === user?._id && m.status !== 'CANCELLED'
  );

  const canJoin =
    !isDriverOrCreator &&
    !isMember &&
    pool.status === 'OPEN' &&
    pool.availableSeats > 0;

  const canStartTrip = (isDriverOrCreator || isAdmin) && (pool.status === 'OPEN' || pool.status === 'FULL');
  const canCancelPool = (isDriverOrCreator || isAdmin) && pool.status !== 'CANCELLED' && pool.status !== 'COMPLETED';

  // Join Pool Action
  const handleJoin = async () => {
    if (!isVerified && !isAdmin) {
      setErrorMessage('Your college ID is pending administrative verification. Verified members can join pools.');
      return;
    }

    try {
      setActionLoading(true);
      setErrorMessage(null);
      const res = await poolService.joinPool(pool._id, { seatsRequested: 1 });
      if (res.data?.success) {
        setFeedbackMessage('You have successfully joined this transport pool!');
        setPool(res.data.data);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to join pool.');
    } finally {
      setActionLoading(false);
    }
  };

  // Leave Pool Action
  const handleLeave = async () => {
    if (!window.confirm('Are you sure you want to leave this pool? Your seat will be made available to others.')) {
      return;
    }

    try {
      setActionLoading(true);
      setErrorMessage(null);
      const res = await poolService.leavePool(pool._id);
      if (res.data?.success) {
        setFeedbackMessage('You have left the transport pool.');
        await fetchPool();
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to leave pool.');
    } finally {
      setActionLoading(false);
    }
  };

  // Start Trip Action
  const handleStartTrip = async () => {
    try {
      setActionLoading(true);
      setErrorMessage(null);
      const res = await tripService.startTrip(pool._id);
      if (res.data?.success) {
        navigate(`/trips/${res.data.data._id}`);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to start trip.');
    } finally {
      setActionLoading(false);
    }
  };

  // Cancel Pool Action
  const handleCancelPool = async () => {
    if (!window.confirm('Are you sure you want to cancel this pool? All confirmed members will be notified.')) {
      return;
    }

    try {
      setActionLoading(true);
      setErrorMessage(null);
      const res = await poolService.cancelPool(pool._id);
      if (res.data?.success) {
        setFeedbackMessage('Pool has been cancelled.');
        setPool(res.data.data);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to cancel pool.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to="/pools"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Pools
      </Link>

      {/* Alert Notices */}
      {feedbackMessage && (
        <Alert type="success" message={feedbackMessage} onClose={() => setFeedbackMessage(null)} />
      )}
      {errorMessage && (
        <Alert type="error" message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}

      {/* Main Pool Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={pool.status === 'OPEN' ? 'success' : pool.status === 'FULL' ? 'warning' : 'default'} size="md">
                Status: {pool.status}
              </Badge>
              <Badge variant="primary" size="md">
                {pool.transportType} POOL
              </Badge>
              {pool.recurring && (
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" /> Mon–Fri Regular
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{pool.name}</h1>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
              {pool.notes || 'Routine college carpool. Please assemble at pickup point 5 minutes before scheduled departure.'}
            </p>
          </div>

          {/* Quick Stats Pillar */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-right sm:text-right shrink-0">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Shared Cost</div>
            <div className="text-2xl font-extrabold text-emerald-600">₹{pool.costPerPerson}</div>
            <div className="text-[10px] text-slate-500">per person / trip</div>
          </div>
        </div>

        {/* Route & Timings Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
            <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" /> Commute Route
            </h3>
            <div className="text-xs space-y-2 text-slate-700">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">ORIGIN NEIGHBORHOOD</span>
                <span className="font-bold text-slate-900 text-sm">{pool.origin?.area}</span>
                <p className="text-slate-500 text-[11px]">{pool.origin?.address}</p>
              </div>
              <div className="pt-2 border-t border-blue-100">
                <span className="text-[11px] text-slate-400 block font-medium">DESTINATION</span>
                <span className="font-bold text-slate-900 text-sm">{pool.destination?.campusName || 'Main Campus'}</span>
                <p className="text-slate-500 text-[11px]">{pool.destination?.address}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
            <h3 className="text-xs font-bold text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-600" /> Schedule & Capacity
            </h3>
            <div className="text-xs space-y-2 text-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Departure Time</span>
                <span className="font-bold text-slate-900 text-sm">{pool.departureTime} AM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Estimated Arrival</span>
                <span className="font-bold text-slate-900">{pool.estimatedArrival} AM</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-purple-100">
                <span className="text-slate-500">Available / Total Seats</span>
                <span className="font-bold text-emerald-700">
                  {pool.availableSeats} of {pool.totalSeats} seats open
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Designated Pickup Point */}
        {pool.pickupPoint && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Designated Pickup Point</h4>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">{pool.pickupPoint.name}</p>
              <p className="text-xs text-slate-500">{pool.pickupPoint.address} • Landmark: {pool.pickupPoint.landmark || 'Near Main Gate'}</p>
            </div>
          </div>
        )}

        {/* Driver Profile */}
        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Host Driver Profile</h3>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold text-base flex items-center justify-center border border-blue-200">
                {pool.driver?.name?.charAt(0) || 'D'}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  {pool.driver?.name}
                  {pool.driver?.isVerified && (
                    <ShieldCheck className="w-4 h-4 text-blue-600" title="College Verified Driver" />
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  {pool.driver?.department} • {pool.driver?.role === 'STUDENT' ? 'Student' : 'Faculty Member'}
                </p>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {pool.driver?.phone || 'Confidential'}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {pool.driver?.email}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Verified Driver ✓
              </span>
            </div>
          </div>
        </div>

        {/* Confirmed Members List */}
        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Confirmed Pool Members ({pool.members?.length || 0})
          </h3>

          {pool.members && pool.members.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pool.members.map((member, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                      {member.user?.name?.charAt(0) || 'M'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{member.user?.name}</div>
                      <div className="text-[10px] text-slate-500">{member.user?.department}</div>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">
                    {member.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No passengers joined yet. Empty seats are open for reservation.</p>
          )}
        </div>

        {/* Action Buttons Section */}
        <div className="border-t border-slate-100 pt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {isMember && <span className="font-semibold text-emerald-600">✓ You are a member of this pool.</span>}
            {isDriverOrCreator && <span className="font-semibold text-blue-600">★ You are hosting this pool.</span>}
          </div>

          <div className="flex items-center gap-3">
            {/* Join Button */}
            {canJoin && (
              <button
                type="button"
                onClick={handleJoin}
                disabled={actionLoading}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/30 flex items-center gap-2 transition-all"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
                Join Pool
              </button>
            )}

            {/* Leave Button */}
            {isMember && !isDriverOrCreator && (
              <button
                type="button"
                onClick={handleLeave}
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 font-semibold text-xs flex items-center gap-2 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Leave Pool
              </button>
            )}

            {/* Start Trip Button (Driver / Admin) */}
            {canStartTrip && (
              <button
                type="button"
                onClick={handleStartTrip}
                disabled={actionLoading}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-2 transition-all"
              >
                <Play className="w-4 h-4" />
                Start Trip
              </button>
            )}

            {/* Cancel Pool Button (Driver / Admin) */}
            {canCancelPool && (
              <button
                type="button"
                onClick={handleCancelPool}
                disabled={actionLoading}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-medium text-xs flex items-center gap-1.5 transition-all"
              >
                <XCircle className="w-4 h-4" />
                Cancel Pool
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolDetails;
