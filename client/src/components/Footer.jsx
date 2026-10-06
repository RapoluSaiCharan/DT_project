import React from 'react';
import { Car, Shield, Leaf, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <Car className="w-4 h-4 text-white" />
              </div>
              Campus<span className="text-blue-400">Pool</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Safe, verified, and eco-friendly daily commute sharing platform exclusively for verified college students and faculty.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Quick Navigation</h4>
            <ul className="space-y-2">
              <li><a href="/find-transport" className="hover:text-white transition-colors">Find Route Matches</a></li>
              <li><a href="/pools" className="hover:text-white transition-colors">Open Transport Pools</a></li>
              <li><a href="/buses" className="hover:text-white transition-colors">College Bus Timetables</a></li>
              <li><a href="/pickup-points" className="hover:text-white transition-colors">Designated Pickup Points</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Safety & Verification</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-blue-400" /> College Email Verification</li>
              <li className="flex items-center gap-1.5"><Leaf className="w-3.5 h-3.5 text-emerald-400" /> Green Commute Footprint</li>
              <li>Emergency Security: +91 40 2345 6789</li>
              <li>Transport Desk: +91 98765 43210</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Campus Sustainability</h4>
            <p className="leading-relaxed">
              Every shared carpool saves approximately 3.2 kg of CO2 and saves students hundreds in monthly transport costs.
            </p>
            <div className="mt-3 inline-flex items-center gap-1 text-emerald-400 font-medium">
              <Leaf className="w-4 h-4" /> 100% Student Powered
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CampusPool. All rights reserved. Smart College Transport Pooling Management System.</p>
          <p className="flex items-center gap-1">Built with pairs of students & faculty in mind <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
