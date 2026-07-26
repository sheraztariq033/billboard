import React, { useState, useMemo } from 'react';
import { Sparkles, Sliders, Plane, Tv, Globe, Users, Trophy, GraduationCap, Zap, Eye, Play, ShoppingBag, TrendingUp, Target, Layers, Calendar, Clock, Percent, ShieldCheck, CloudRain, Car } from 'lucide-react';
import { Billboard3DSimulatorModal } from '../components/3dSimulatorModal';
import { HeroLandingSection } from '../components/HeroLandingSection';

const formatPkr = (val: number) => {
  if (val >= 10_000_000_000) return `${(val / 10_000_000_000).toFixed(1)} Thousand Cr`;
  if (val >= 10_000_000) return `${(val / 10_000_000).toFixed(1)} Crore`;
  if (val >= 100_000) return `${(val / 100_000).toFixed(1)} Lac`;
  return val.toLocaleString();
};

const CONTEXT_TRIGGERS = [
  { id: 'STANDARD', label: 'Standard Baseline', boost: 1.0, badge: 'Normal Operations' },
  { id: 'RAIN_SMOG', label: 'Rain & Smog Trigger', boost: 1.35, badge: '+35% Contextual Reach (AQI > 250)' },
  { id: 'TRAFFIC_JAM', label: 'Traffic Jam Congestion', boost: 1.45, badge: '+45% Dwell Time (<10 km/h speed)' },
  { id: 'RAMADAN_IFTAR', label: 'Ramadan Iftar Countdown', boost: 1.68, badge: '+68% Peak Iftar Surge' },
] as const;

export const InteractivePlayground: React.FC = () => {
  const [budget, setBudget] = useState(2_500_000);
  const [durationDays, setDurationDays] = useState<number>(30);
  const [triggerId, setTriggerId] = useState<string>('RAIN_SMOG');

  const triggerObj = CONTEXT_TRIGGERS.find((t) => t.id === triggerId) || CONTEXT_TRIGGERS[1];
  const discountPct = durationDays >= 90 ? 28 : durationDays >= 50 ? 22 : durationDays >= 30 ? 15 : durationDays >= 14 ? 8 : 0;
  const volumeDiscountAmount = Math.round(budget * (discountPct / 100));

  const totalEstimatedViews = Math.round((budget / 45) * triggerObj.boost * (1 + discountPct / 100));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Landing */}
      <HeroLandingSection />

      {/* AI Campaign Co-Pilot Banner */}
      <div className="glass-panel p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" /> AI Contextual Weather & Traffic Automation
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">Interactive Sandbox & Weather Co-Pilot</h2>
              <p className="text-sm text-slate-400 mt-1">Factors in Rain, Smog AQI, Traffic Jam Congestion & Ramadan Iftar Countdowns</p>
            </div>

            <div className="text-right bg-og-bg/60 p-3 rounded-2xl border border-white/[0.08]">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Contextual Boost</span>
              <span className="text-xl font-black text-emerald-400">{triggerObj.boost}x Reach Multiplier</span>
            </div>
          </div>

          {/* Budget Range Slider */}
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" /> Total Budget Allocation
              </label>
              <span className="text-3xl sm:text-4xl font-black gradient-text">{formatPkr(budget)} <span className="text-lg font-bold">PKR</span></span>
            </div>
            <input
              type="range"
              min={100000}
              max={100000000}
              step={100000}
              value={budget}
              onChange={(e) => setBudget(+e.target.value)}
            />
          </div>

          {/* Contextual Weather & Smog Automation Triggers (Fixes Audit Gaps #13, 15, 17) */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CloudRain className="w-4 h-4" /> Contextual Weather, AQI & Traffic Jam Triggers:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              {CONTEXT_TRIGGERS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTriggerId(t.id)}
                  className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                    triggerId === t.id
                      ? 'bg-emerald-600 border-emerald-500 text-white font-extrabold shadow-md'
                      : 'bg-og-bg/60 border-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-bold block">{t.label}</span>
                  <span className="text-[10px] text-emerald-300 font-semibold">{t.badge}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Box */}
      <div className="glass-panel p-5 border border-emerald-500/20 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Active Contextual Multiplier</span>
          <p className="text-xl font-black text-emerald-400">{triggerObj.boost}x Boost</p>
          <span className="text-[10px] text-emerald-300 font-semibold">{triggerObj.label}</span>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Volume Discount Savings</span>
          <p className="text-xl font-black text-indigo-400">-{discountPct}% Discount</p>
          <span className="text-[10px] text-indigo-300 font-semibold">Saved {volumeDiscountAmount.toLocaleString()} PKR</span>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Est. Verified Impressions</span>
          <p className="text-xl font-black text-amber-400">{totalEstimatedViews.toLocaleString()}</p>
          <span className="text-[10px] text-amber-300 font-semibold">Total Contextual Views</span>
        </div>
      </div>
    </div>
  );
};
