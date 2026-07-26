import React from 'react';
import { Layers, Store, Users, Tv, Shield } from 'lucide-react';

interface Props {
  activeRole: string;
  setActiveRole: (role: string) => void;
}

export const Header: React.FC<Props> = ({ activeRole, setActiveRole }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 font-black text-xl">
            OG
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-1.5">
              OMNI-GRID <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">PAKISTAN</span>
            </h1>
            <p className="text-xs text-slate-400">Omnichannel Ad-Tech Marketplace</p>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setActiveRole('advertiser')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeRole === 'advertiser' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Advertiser Marketplace
          </button>

          <button
            onClick={() => setActiveRole('vendor')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeRole === 'vendor' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tv className="w-3.5 h-3.5" /> Billboard Owner
          </button>

          <button
            onClick={() => setActiveRole('shopkeeper')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeRole === 'shopkeeper' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" /> Shopkeeper/Rider PWA
          </button>

          <button
            onClick={() => setActiveRole('creator')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeRole === 'creator' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Social Creator
          </button>
        </div>
      </div>
    </header>
  );
};
