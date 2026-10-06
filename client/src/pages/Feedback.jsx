import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, ShieldCheck } from 'lucide-react';
import { ratingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner, EmptyState } from '../components/UIPrimitives';

const Feedback = () => {
  const { user } = useAuth();
  const [data, setData] = useState({ totalRatings: 0, averageScore: 5.0, ratings: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        const res = await ratingService.getUserRatings(user._id);
        if (res.data?.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load ratings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRatings();
  }, [user?._id]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-1">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          Community Trust & Reputation
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          My Ratings & Feedback
        </h1>
        <p className="text-sm text-slate-500">
          Reviews submitted by fellow students and faculty after completed commute trips.
        </p>
      </div>

      {/* Score Summary Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-amber-50 text-amber-600 flex flex-col items-center justify-center border border-amber-200 shadow-sm shrink-0">
            <span className="text-3xl font-black">{data.averageScore.toFixed(1)}</span>
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-2.5 h-2.5 ${i < Math.round(data.averageScore) ? 'fill-amber-500' : 'text-slate-200'}`}
                />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Campus Commuter Reputation</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Based on {data.totalRatings} verified trip rating{data.totalRatings === 1 ? '' : 's'}.
            </p>
            <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> High Trust Standing
            </div>
          </div>
        </div>

        <div className="text-right sm:text-right text-xs text-slate-500 space-y-1">
          <p>• Punctual Boarding & Departures</p>
          <p>• Polite College Community Decorum</p>
          <p>• Clean Shared Vehicles</p>
        </div>
      </div>

      {/* Reviews Feed */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
          Recent Trip Reviews
        </h3>

        {loading ? (
          <LoadingSpinner text="Fetching trip ratings..." />
        ) : data.ratings?.length > 0 ? (
          <div className="space-y-3">
            {data.ratings.map((rev) => (
              <div
                key={rev._id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">
                  {rev.rater?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800">{rev.rater?.name}</span>
                      <span className="text-[10px] text-slate-400">({rev.rater?.role})</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < rev.score ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{rev.feedback || 'Great ride experience, friendly and punctual.'}"
                  </p>
                  <span className="text-[10px] text-slate-400 block">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Star}
            title="No ratings received yet"
            description="Complete a ride with campus peers to build your rating score."
          />
        )}
      </div>
    </div>
  );
};

export default Feedback;
