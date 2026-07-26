import React, { useState } from 'react';
import { Video, Sparkles, DollarSign, Users, CheckCircle2, MessageSquare, ShieldCheck, ChevronRight, TrendingUp, Sliders } from 'lucide-react';

export const CreatorDashboard: React.FC = () => {
  const [followers, setFollowers] = useState(125000);
  const [engagementRate, setEngagementRate] = useState(4.8);

  const calculatedStoryRate = Math.round((followers * 0.15 * (engagementRate / 3.0)));
  const calculatedReelRate = Math.round((followers * 0.45 * (engagementRate / 3.0)));

  const [briefs, setBriefs] = useState([
    {
      id: 'brf_1',
      brand: 'PepsiCo Pakistan',
      campaign: 'Sting Energy PSL Stadium Buzz',
      deliverables: '1x Instagram Reel + 2x Stories',
      budgetOffered: 180000,
      status: 'PENDING_REVIEW',
    },
    {
      id: 'brf_2',
      brand: 'KFC Pakistan',
      campaign: 'Zinger Crunch Ramadan Feast',
      deliverables: '2x TikTok Videos',
      budgetOffered: 150000,
      status: 'ACCEPTED',
    },
  ]);

  const handleAcceptBrief = (id: string) => {
    setBriefs(briefs.map((b) => (b.id === id ? { ...b, status: 'ACCEPTED' } : b)));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Creator Banner */}
      <div className="glass-panel p-6 border border-pink-500/30 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/20 text-pink-400 text-xs font-black mb-2">
              <Video className="w-3.5 h-3.5" /> Verified Creator Marketplace
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">Creator Hub & Brief Negotiator</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Algorithmic rate calculator based on verified audience demographics & brand brief inbox</p>
          </div>

          <div className="bg-og-bg/80 p-4 rounded-2xl border border-white/[0.08] text-center min-w-[180px]">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Recommended Reel Rate</span>
            <p className="text-2xl font-black text-pink-400 font-display">{calculatedReelRate.toLocaleString()} PKR</p>
            <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">Based on {followers.toLocaleString()} Followers</span>
          </div>
        </div>
      </div>

      {/* Algorithmic Rate Builder */}
      <div className="glass-panel p-6 border border-white/[0.08] space-y-5">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-pink-400" /> Algorithmic Commercial Rate Calculator
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span>Verified Followers:</span>
              <span className="text-pink-400 font-black">{followers.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={10000}
              max={1000000}
              step={5000}
              value={followers}
              onChange={(e) => setFollowers(+e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span>Engagement Rate (%):</span>
              <span className="text-emerald-400 font-black">{engagementRate}%</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={12.0}
              step={0.1}
              value={engagementRate}
              onChange={(e) => setEngagementRate(+e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-og-bg/80 border border-white/[0.06]">
            <span className="text-xs text-slate-400 block font-semibold">1x Instagram Story</span>
            <p className="text-xl font-black text-white font-display mt-1">{calculatedStoryRate.toLocaleString()} PKR</p>
          </div>

          <div className="p-4 rounded-xl bg-og-bg/80 border border-white/[0.06]">
            <span className="text-xs text-slate-400 block font-semibold">1x Instagram Reel / TikTok</span>
            <p className="text-xl font-black text-pink-400 font-display mt-1">{calculatedReelRate.toLocaleString()} PKR</p>
          </div>

          <div className="p-4 rounded-xl bg-og-bg/80 border border-white/[0.06]">
            <span className="text-xs text-slate-400 block font-semibold">Brand Usage Licensing (30d)</span>
            <p className="text-xl font-black text-indigo-400 font-display mt-1">{Math.round(calculatedReelRate * 0.5).toLocaleString()} PKR</p>
          </div>
        </div>
      </div>

      {/* Brand Brief Inbox */}
      <div className="glass-panel p-6 border border-white/[0.08] space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-400" /> Brand Campaign Brief Inbox
        </h3>

        <div className="space-y-3">
          {briefs.map((b) => (
            <div key={b.id} className="p-4 rounded-xl bg-og-bg/80 border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-400 border border-pink-500/20">
                  {b.brand}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">{b.campaign}</h4>
                <p className="text-xs text-slate-400">Deliverables: <strong className="text-slate-300">{b.deliverables}</strong> • Budget: <strong className="text-emerald-400">{b.budgetOffered.toLocaleString()} PKR</strong></p>
              </div>

              {b.status === 'ACCEPTED' ? (
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Brief Accepted & Escrow Locked
                </span>
              ) : (
                <button
                  onClick={() => handleAcceptBrief(b.id)}
                  className="px-5 py-2.5 btn-emerald text-xs font-extrabold shadow-md cursor-pointer"
                >
                  Accept Brief ({b.budgetOffered.toLocaleString()} PKR)
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
