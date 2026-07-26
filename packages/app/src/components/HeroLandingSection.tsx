import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, MapPin, Layers, Users, Zap, CheckCircle2 } from 'lucide-react';

export const HeroLandingSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="glass-panel p-8 sm:p-12 relative overflow-hidden border border-emerald-500/30 text-center space-y-8 animate-fade-in">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-to-b from-emerald-500/15 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Top Live Badge (Reference App Match) */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          NOW LIVE IN KARACHI • LAHORE • ISLAMABAD • PESHAWAR • MULTAN
        </div>

        {/* Massive Stretched Headline (Space Grotesk Font with Dark & Light theme contrast) */}
        <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-slate-900 dark:text-white leading-none">
          Pakistan's First <span className="gradient-text">Omnichannel</span> Ad Network
        </h1>

        <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          One unified platform connecting roadside billboards, digital SMDs, airport lounges, content creators, and micro-earners — delivering measurable impact for every rupee you spend.
        </p>

        {/* Primary CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('/explore')}
            className="w-full sm:w-auto px-8 py-4 btn-emerald text-sm font-extrabold flex items-center justify-center gap-2 shadow-xl cursor-pointer"
          >
            Explore Ad Inventory <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/owner')}
            className="w-full sm:w-auto px-8 py-4 bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.10] text-slate-900 dark:text-white border border-slate-300 dark:border-white/[0.12] text-sm font-bold rounded-2xl transition cursor-pointer"
          >
            List Your Space (Owner Portal)
          </button>
        </div>

        {/* Metrics Ticker */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-0.5">
            <span className="text-2xl font-black font-display text-slate-900 dark:text-white">20,000+</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">Ad Spaces Pinned</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-2xl font-black font-display text-emerald-500 dark:text-emerald-400">5,000+</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">Verified Creators</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-2xl font-black font-display text-purple-600 dark:text-purple-400">100%</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">Escrow Protected</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-2xl font-black font-display text-amber-500 dark:text-amber-400">12</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">Ad Tiers Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};
