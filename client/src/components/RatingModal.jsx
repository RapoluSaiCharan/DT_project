import React, { useState } from 'react';
import { Star, X, Loader2, CheckCircle2 } from 'lucide-react';
import { ratingService } from '../services/api';

const RatingModal = ({ isOpen, onClose, trip, rateeUser, onRatingSubmitted }) => {
  const [score, setScore] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !trip || !rateeUser) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await ratingService.submitRating({
        tripId: trip._id,
        ratee: rateeUser._id,
        score,
        feedback,
      });
      setSubmitted(true);
      if (onRatingSubmitted) onRatingSubmitted();
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to submit rating.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl overflow-hidden border border-slate-100">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 text-base">Rate Your Co-Traveler</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h4 className="font-bold text-slate-800 text-lg">Thank You!</h4>
              <p className="text-sm text-slate-500 mt-1">Your feedback helps keep the campus pooling community safe and trustworthy.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 font-bold text-lg flex items-center justify-center mx-auto mb-2">
                  {rateeUser.name?.charAt(0)}
                </div>
                <h4 className="font-semibold text-slate-800">{rateeUser.name}</h4>
                <p className="text-xs text-slate-500">{rateeUser.department} • {rateeUser.role}</p>

                {/* Star picker */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setScore(star)}
                      className="p-1 hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= score
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-600 mt-1 block">
                  {score === 5 && 'Outstanding Experience! ⭐'}
                  {score === 4 && 'Very Good Ride! 👍'}
                  {score === 3 && 'Average Commute 👌'}
                  {score === 2 && 'Below Expectations ⚠️'}
                  {score === 1 && 'Poor Experience 👎'}
                </span>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs">
                  {error}
                </div>
              )}

              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Feedback & Comments (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Share a polite note on punctuality, driving, cleanliness, etc."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Rating'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
