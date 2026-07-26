import React, { useState } from 'react';
import { Layers, Plus, Building2, ShieldCheck, DollarSign, Award, Wrench, CheckCircle2, ChevronRight, MapPin, Eye, FileText, AlertCircle, Loader2, X } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

export const VendorDashboard: React.FC = () => {
  const { showToast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State for New Asset
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('DOOH');
  const [locationCity, setLocationCity] = useState('Lahore');
  const [locationArea, setLocationArea] = useState('');
  const [monthlyRatePkr, setMonthlyRatePkr] = useState('850000');
  const [dailyRatePkr, setDailyRatePkr] = useState('31000');
  const [estimatedDailyImpressions, setEstimatedDailyImpressions] = useState('1200000');
  const [dimensions, setDimensions] = useState('60x20 ft');
  const [imageUrl, setImageUrl] = useState('');

  const handleRegisterAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !locationArea.trim()) {
      showToast('Please enter title and area location', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/assets', {
        title: title.trim(),
        category,
        locationCity,
        locationArea: locationArea.trim(),
        monthlyRatePkr: Number(monthlyRatePkr),
        dailyRatePkr: Number(dailyRatePkr),
        estimatedDailyImpressions: Number(estimatedDailyImpressions),
        dimensions,
        imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      });

      showToast(`Ad Property "${title}" successfully registered in D1 database!`, 'success');
      setShowAddModal(false);
      setTitle('');
      setLocationArea('');
    } catch (err: any) {
      showToast(err.message || 'Failed to register asset', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-black mb-2">
            <Building2 className="w-3.5 h-3.5" /> Media Owner ERP & Yield Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white">Media Owner ERP Command</h2>
          <p className="text-xs text-slate-400 mt-1">Manage billboards, digital SMDs, civic NOC compliance & cash payouts</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition flex items-center gap-2 cursor-pointer text-xs"
        >
          <Plus className="w-4 h-4" /> Register New Ad Property
        </button>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold block">Monthly Portfolio Yield</span>
          <p className="text-2xl font-black text-emerald-400 font-display">2,900,000 PKR</p>
          <span className="text-[10px] text-emerald-300 font-bold block">+14.2% Month-over-Month</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold block">Portfolio Occupancy</span>
          <p className="text-2xl font-black text-indigo-400 font-display">94.2% Occupied</p>
          <span className="text-[10px] text-indigo-300 font-bold block">18 of 19 Displays Active</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold block">Civic NOC Compliance</span>
          <p className="text-2xl font-black text-amber-400 font-display">100% Compliant</p>
          <span className="text-[10px] text-amber-300 font-bold block">All Permits Active (MCL / CBD)</span>
        </div>
      </div>

      {/* Asset Registration Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}
        >
          <div className="w-full max-w-xl p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 animate-scale-in my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" /> Register New Commercial Ad Property
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterAsset} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Property Title / Location Name</label>
                <input
                  type="text"
                  placeholder="e.g. Liberty Chowk Dual Facing Digital SMD"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Ad Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"
                  >
                    <option value="DOOH">Digital SMD Screen (DOOH)</option>
                    <option value="OOH">Static Billboard (OOH)</option>
                    <option value="RETAIL_SHELF">Retail Shelf Display</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">City</label>
                  <select
                    value={locationCity}
                    onChange={(e) => setLocationCity(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"
                  >
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Multan">Multan</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Area Location & Junction</label>
                <input
                  type="text"
                  placeholder="e.g. Gulberg Main Boulevard Junction"
                  value={locationArea}
                  onChange={(e) => setLocationArea(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Monthly Rate (PKR)</label>
                  <input
                    type="number"
                    value={monthlyRatePkr}
                    onChange={(e) => setMonthlyRatePkr(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Daily Traffic Impressions</label>
                  <input
                    type="number"
                    value={estimatedDailyImpressions}
                    onChange={(e) => setEstimatedDailyImpressions(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Display Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Register & Publish Listing to D1 Database
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
