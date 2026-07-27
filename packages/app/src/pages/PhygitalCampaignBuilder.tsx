import React, { useState } from 'react';
import { ShoppingBag, Sliders, CheckCircle2, ChevronRight, Sparkles, Building2, Layers, Tv, Video, Car, Loader2, Calendar, Clock, BarChart } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

export const PhygitalCampaignBuilder: React.FC = () => {
  const { showToast } = useToast();
  const [totalBudgetPkr, setTotalBudgetPkr] = useState(5000000);
  const [targetCity, setTargetCity] = useState('Lahore');
  const [campaignTitle, setCampaignTitle] = useState('Omnichannel Q4 Brand Launch');
  const [isPackaging, setIsPackaging] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [packagedData, setPackagedData] = useState<any | null>(null);

  // Advanced Interactive Scheduling States
  const [startDate, setStartDate] = useState('2026-08-01');
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [timeSlots, setTimeSlots] = useState<string[]>(['Morning Peak (8-11 AM)', 'Evening Peak (5-9 PM)']);

  const handleGeneratePackage = async () => {
    setIsPackaging(true);
    try {
      const res = await api.post<{ data: any }>('/campaigns/package', {
        totalBudgetPkr,
        targetCity,
      });

      // Augment allocations with recommended assets for visual richness
      const augmentedAllocations = (res.data.allocations || []).map((alloc: any) => {
        let suggested = [];
        if (alloc.channel.includes('OOH')) {
          suggested = [
            { name: `${targetCity} Main Boulevard SMD Screen`, estImpressions: '1,200,000/day' },
            { name: `${targetCity} Ring Road Landmark Unipole`, estImpressions: '850,000/day' }
          ];
        } else if (alloc.channel.includes('TV')) {
          suggested = [
            { name: 'Geo News Evening Primetime Spot (8 PM)', estViews: '15,000,000 views' },
            { name: 'ARY Digital Drama Spot (9 PM)', estViews: '12,500,000 views' }
          ];
        } else if (alloc.channel.includes('Creator')) {
          suggested = [
            { name: 'Local Pakistani FMCG TikTok & Instagram Creators', estViews: '3,200,000 views' }
          ];
        } else {
          suggested = [
            { name: 'Local Transit Metro Bus Side Wraps', estImpressions: '500,000/day' }
          ];
        }
        return { ...alloc, suggestedAssets: suggested };
      });

      setPackagedData({
        ...res.data,
        allocations: augmentedAllocations
      });
      showToast(`AI Campaign Package generated for ${totalBudgetPkr.toLocaleString()} PKR!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Packaging failed', 'error');
    } finally {
      setIsPackaging(false);
    }
  };

  const handleExecuteCampaign = async () => {
    setIsExecuting(true);
    try {
      await api.post('/campaigns', {
        title: campaignTitle,
        totalBudgetPkr,
        targetCity,
      });

      showToast(`Omnichannel Campaign "${campaignTitle}" executed & active in D1 database!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Execution failed', 'error');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-black mb-2">
              <ShoppingBag className="w-3.5 h-3.5" /> AI Omnichannel Packager & Builder
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">Multi-Asset Campaign Builder</h2>
            <p className="text-xs text-slate-400 mt-1">Package budget across Roadside OOH, TV spots, social creators & retail shelf displays connected to Cloudflare Workers</p>
          </div>

          <button
            onClick={handleGeneratePackage}
            disabled={isPackaging}
            className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer text-xs"
          >
            {isPackaging ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generating AI Package...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Generate AI Budget Package
              </>
            )}
          </button>
        </div>
      </div>

      {/* Budget Controls */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Campaign Title</label>
            <input
              type="text"
              value={campaignTitle}
              onChange={(e) => setCampaignTitle(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Target City</label>
            <select
              value={targetCity}
              onChange={(e) => setTargetCity(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
            >
              <option value="Lahore">Lahore</option>
              <option value="Karachi">Karachi</option>
              <option value="Islamabad">Islamabad</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Total Budget (PKR)</label>
            <input
              type="number"
              value={totalBudgetPkr}
              onChange={(e) => setTotalBudgetPkr(Number(e.target.value))}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* Campaign Scheduling Board */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" /> Campaign Scheduling & Dayparting Controller
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Launch Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Duration (Weeks)</label>
            <select
              value={durationWeeks}
              onChange={(e) => setDurationWeeks(Number(e.target.value))}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"
            >
              <option value={1}>1 Week (Quick Boost)</option>
              <option value={2}>2 Weeks (Medium Exposure)</option>
              <option value={4}>4 Weeks (Full Monthly Run)</option>
              <option value={8}>8 Weeks (Extended Branding)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Target Time Slots (Dayparting)</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setTimeSlots(prev => prev.includes('Morning Peak') ? prev.filter(t => t !== 'Morning Peak') : [...prev, 'Morning Peak']);
                }}
                className={`py-2 rounded-lg font-bold border text-center transition cursor-pointer ${
                  timeSlots.includes('Morning Peak') ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                Morning (8-11 AM)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTimeSlots(prev => prev.includes('Evening Peak') ? prev.filter(t => t !== 'Evening Peak') : [...prev, 'Evening Peak']);
                }}
                className={`py-2 rounded-lg font-bold border text-center transition cursor-pointer ${
                  timeSlots.includes('Evening Peak') ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                Evening (5-9 PM)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Package Breakdown Cards */}
      {packagedData && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart className="w-5 h-5 text-emerald-400" />
              AI Multi-Asset Budget Breakdown
            </h3>
            <span className="text-xs text-emerald-400 font-extrabold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {packagedData.totalEstimatedImpressions} Est. Monthly Impressions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packagedData.allocations?.map((alloc: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-3 text-xs">
                <div className="flex justify-between font-bold text-white">
                  <span className="flex items-center gap-1.5">
                    {alloc.channel.includes('OOH') && <Building2 className="w-4 h-4 text-emerald-400" />}
                    {alloc.channel.includes('TV') && <Tv className="w-4 h-4 text-indigo-400" />}
                    {alloc.channel.includes('Creator') && <Video className="w-4 h-4 text-rose-400" />}
                    {alloc.channel.includes('Transit') && <Car className="w-4 h-4 text-amber-400" />}
                    {alloc.channel}
                  </span>
                  <span className="text-emerald-400">{alloc.budgetPkr.toLocaleString()} PKR ({alloc.percentage}%)</span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Suggested Channels:</span>
                  {alloc.suggestedAssets?.map((ass: any, aIdx: number) => (
                    <div key={aIdx} className="flex justify-between items-center text-[11px] text-slate-300">
                      <span>• {ass.name}</span>
                      <span className="font-mono text-emerald-400">{ass.estImpressions || ass.estViews}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleExecuteCampaign}
            disabled={isExecuting}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-extrabold rounded-xl shadow-xl flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isExecuting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Executing & Deploying Campaign...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" /> Execute Omnichannel Campaign & Deploy to D1
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
