import React, { useState } from 'react';
import { Video, Sliders, DollarSign, CheckCircle2, ChevronRight, Sparkles, Award, TrendingUp, Users, Eye, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

export const CreatorDashboard: React.FC = () => {
  const { showToast } = useToast();
  const [followers, setFollowers] = useState(125000);
  const [avgViews, setAvgViews] = useState(45000);
  const [engagementRate, setEngagementRate] = useState(6.4);
  const [niche, setNiche] = useState('FOOD');
  const [platform, setPlatform] = useState('INSTAGRAM');
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculatedRatePkr, setCalculatedRatePkr] = useState<number | null>(32000);

  const handleCalculateRate = async () => {
    setIsCalculating(true);
    try {
      const res = await api.post<{ data: { calculatedRatePerPostPkr: number } }>('/creators/calculate-rate', {
        followerCount: followers,
        avgViews,
        engagementRatePct: engagementRate,
        niche,
        platform,
      });

      setCalculatedRatePkr(res.data.calculatedRatePerPostPkr);
      showToast(`Algorithmic Commercial Rate updated: ${res.data.calculatedRatePerPostPkr.toLocaleString()} PKR / Reel!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Rate calculation failed', 'error');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/20 text-purple-400 text-xs font-black mb-2">
              <Video className="w-3.5 h-3.5" /> Organic Creator Marketplace & Rate Builder
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">Creator Monetization Hub</h2>
            <p className="text-xs text-slate-400 mt-1">Calculate commercial rate cards & negotiate brand briefs connected to Cloudflare Workers API</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-right min-w-[180px]">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Commercial Rate Card</span>
            <p className="text-2xl font-black text-purple-400 font-display">
              {calculatedRatePkr ? `${calculatedRatePkr.toLocaleString()} PKR` : 'Calculating...'}
            </p>
            <span className="text-[10px] text-emerald-300 font-bold block mt-0.5">Per Verified Sponsored Reel</span>
          </div>
        </div>
      </div>

      {/* Algorithmic Commercial Rate Builder */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-400" /> Algorithmic Rate Builder Engine
          </h3>

          <button
            onClick={handleCalculateRate}
            disabled={isCalculating}
            className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
          >
            {isCalculating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Calculating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Recalculate Rate Card
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"
            >
              <option value="INSTAGRAM">Instagram Reels</option>
              <option value="TIKTOK">TikTok Video</option>
              <option value="YOUTUBE">YouTube Shorts</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Niche / Industry</label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"
            >
              <option value="FOOD">Food & Dining</option>
              <option value="TECH">Tech & Gadgets</option>
              <option value="FASHION">Fashion & Apparel</option>
              <option value="FINANCE">Finance & Fintech</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Followers Count</label>
            <input
              type="number"
              value={followers}
              onChange={(e) => setFollowers(Number(e.target.value))}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Avg. Reel Views</label>
            <input
              type="number"
              value={avgViews}
              onChange={(e) => setAvgViews(Number(e.target.value))}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
