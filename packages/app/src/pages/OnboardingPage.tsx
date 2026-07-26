import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { Building2, Landmark, Bike, Video, Zap, ShieldAlert, ChevronRight, Sparkles } from 'lucide-react';

const roles: { id: UserRole; icon: React.ReactNode; title: string; subtitle: string; description: string; gradient: string; border: string }[] = [
  {
    id: 'advertiser',
    icon: <Building2 className="w-7 h-7" />,
    title: 'Advertiser / Brand',
    subtitle: 'Agencies, SMEs & Enterprises',
    description: 'Browse 20,000+ ad spaces. Plan budgets from 1K to 1,000 Crore PKR. Book billboards, digital ads, creator campaigns & TV slots.',
    gradient: 'from-indigo-600 to-purple-600',
    border: 'border-indigo-500/40 hover:border-indigo-400',
  },
  {
    id: 'owner',
    icon: <Landmark className="w-7 h-7" />,
    title: 'Asset Owner',
    subtitle: 'Billboard Owners, Venues & Civic Partners',
    description: 'List your billboards, SMDs, shop spaces, civic kiosks & campus displays. Manage leases, set soft-expiry windows & collect escrow payments.',
    gradient: 'from-emerald-600 to-teal-600',
    border: 'border-emerald-500/40 hover:border-emerald-400',
  },
  {
    id: 'earner',
    icon: <Bike className="w-7 h-7" />,
    title: 'Micro-Earner',
    subtitle: 'Riders, Shopkeepers & Student Ambassadors',
    description: 'Earn 10K-50K PKR/month by displaying ads on your vehicle, shop counter, or campus. Snap photo proofs, get paid via Easypaisa/JazzCash.',
    gradient: 'from-amber-500 to-orange-600',
    border: 'border-amber-500/40 hover:border-amber-400',
  },
  {
    id: 'creator',
    icon: <Video className="w-7 h-7" />,
    title: 'Content Creator',
    subtitle: 'Influencers, Pages & Video Creators',
    description: 'Connect your social accounts. Get matched with brands based on your niche. Accept briefs, post stories/reels, and get algorithmically-fair pay.',
    gradient: 'from-pink-500 to-rose-600',
    border: 'border-pink-500/40 hover:border-pink-400',
  },
  {
    id: 'enterprise',
    icon: <Zap className="w-7 h-7" />,
    title: 'Enterprise & TV',
    subtitle: 'Broadcast Networks & Holding Companies',
    description: 'Full analytics suite, TV slot scheduling (Geo, ARY, Hum), programmatic buying, campaign attribution & white-label reporting.',
    gradient: 'from-cyan-500 to-blue-600',
    border: 'border-cyan-500/40 hover:border-cyan-400',
  },
  {
    id: 'admin',
    icon: <ShieldAlert className="w-7 h-7" />,
    title: 'Super-Admin & Operations',
    subtitle: 'Master Platform Control & Sales Agents',
    description: 'Approve new billboard listings, verify users, manage sales team commission tiers, and configure enterprise sub-accounts & permissions.',
    gradient: 'from-rose-600 to-red-600',
    border: 'border-rose-500/40 hover:border-rose-400',
  },
];

export const OnboardingPage: React.FC = () => {
  const { setRole } = useAuth();
  const navigate = useNavigate();

  const handleSelect = (role: UserRole) => {
    setRole(role);
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-dvh bg-og-bg flex flex-col items-center justify-center px-4 py-12">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl space-y-8">
        <div className="text-center space-y-3 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Pakistan's First Omnichannel Ad-Tech Network
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            Welcome to <span className="gradient-text">OMNI-GRID</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-md mx-auto">
            Choose how you'll use the platform. You can switch your persona anytime.
          </p>
        </div>

        <div className="space-y-3 stagger-children">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleSelect(role.id)}
              className={`w-full text-left p-5 rounded-2xl border ${role.border} bg-og-surface/60 backdrop-blur-sm transition-all duration-200 group cursor-pointer hover:bg-og-surface`}
            >
              <div className="flex items-start gap-4">
                <div className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center text-white shadow-lg`}>
                  {role.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{role.title}</h3>
                      <p className="text-xs text-slate-500 font-medium">{role.subtitle}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{role.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
