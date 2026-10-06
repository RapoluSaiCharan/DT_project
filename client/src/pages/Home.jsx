import React from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  ShieldCheck,
  Users,
  Leaf,
  Clock,
  MapPin,
  ArrowRight,
  Bus,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-slate-50 py-16 sm:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 text-blue-800 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Official College Mobility Network
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Smart, Safe & Shared <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  College Commuting
                </span>
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                Connect with verified classmates and faculty on your exact route. Cut travel costs by up to 75%, reduce campus parking congestion, and lower your carbon footprint with CampusPool.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/30 transition-all text-base"
                  >
                    Go to My Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/30 transition-all text-base"
                    >
                      Join Campus Network
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium transition-colors text-base"
                    >
                      Sign In with College ID
                    </Link>
                  </>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl font-bold text-slate-900">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Verified Campus IDs</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600">₹60–₹90</div>
                  <div className="text-xs text-slate-500 font-medium">Avg. Cost / Ride</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">Zero</div>
                  <div className="text-xs text-slate-500 font-medium">Strangers or Outsiders</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Preview Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Active Pool Example</h4>
                      <p className="text-xs text-slate-500">Miyapur Metro ➔ Main Campus</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    Open • 3 Seats
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> Departure</span>
                    <span className="font-semibold text-slate-800">08:15 AM (Strict)</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> Pickup Point</span>
                    <span className="font-semibold text-slate-800">Miyapur Metro Gate A</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-slate-400" /> Shared Cost</span>
                    <span className="font-bold text-emerald-600">₹40 / person</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                    R
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                      Rahul Sharma (3rd Year CSE)
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div className="text-[11px] text-slate-500">4.9 ★ Rating • Honda City (AC)</div>
                  </div>
                </div>

                <Link
                  to="/find-transport"
                  className="w-full block text-center py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                >
                  Explore Route Matches
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">Designed For Campus Life</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Why Students & Faculty Choose CampusPool</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-card transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">100% College Verified</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Only verified college ID holders with institutional emails can view or join transport pools. Zero strangers on your commute.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-card transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Fair Cost Splitting</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Server-side calculated fuel sharing. No commercial surcharges or surge pricing. Travel for a fraction of cab fares.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-card transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <Bus className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">College Bus + Carpool Hub</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Check official college bus routes alongside peer carpools. Never miss your commute even on rainy or busy exam days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">Simple 4-Step Process</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">How CampusPool Works</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 relative">
              <span className="text-4xl font-extrabold text-blue-100 absolute right-4 top-4">01</span>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Register College ID</h4>
              <p className="text-xs text-slate-500">Sign up with your college email and ID to get verified instantly.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 relative">
              <span className="text-4xl font-extrabold text-blue-100 absolute right-4 top-4">02</span>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Set Route & Timing</h4>
              <p className="text-xs text-slate-500">Enter your neighborhood and daily departure/return schedule.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 relative">
              <span className="text-4xl font-extrabold text-blue-100 absolute right-4 top-4">03</span>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Match & Join Pools</h4>
              <p className="text-xs text-slate-500">Our algorithm matches you with peers travelling in the same direction.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 relative">
              <span className="text-4xl font-extrabold text-blue-100 absolute right-4 top-4">04</span>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Commute & Share Cost</h4>
              <p className="text-xs text-slate-500">Board at designated campus pickup points and share split costs.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
