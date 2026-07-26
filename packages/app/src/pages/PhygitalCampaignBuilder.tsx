import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Check, ChevronRight, Layers, CreditCard, ShieldCheck } from 'lucide-react';

export const PhygitalCampaignBuilder: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([
    'Main Boulevard Johar Town SMD (30 Days)',
    '15x Food Creator Instagram Stories',
    'Faisal Movers Bus Wraps (20 Buses)',
  ]);

  const totalCost = 1325000;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-panel p-6 border border-indigo-500/20 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-2">
              <ShoppingBag className="w-3.5 h-3.5" /> Phygital Cart & Ledger
            </div>
            <h2 className="text-2xl font-black text-white">Unified Campaign Builder</h2>
            <p className="text-xs text-slate-400 mt-1">Combine roadside billboards, creators, and transit into a single contract</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Cart Estimate</span>
            <span className="text-2xl font-black text-indigo-300">{totalCost.toLocaleString()} PKR</span>
          </div>
        </div>
      </div>

      {/* Cart Ledger */}
      <div className="glass-panel p-6 border border-white/[0.08] space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" /> Selected Campaign Channels ({selectedItems.length})
        </h3>

        <div className="space-y-2">
          {selectedItems.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-og-bg/80 border border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                  {idx + 1}
                </div>
                <span className="text-xs font-bold text-white">{item}</span>
              </div>
              <span className="text-xs font-bold text-emerald-400">Included</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Escrow Deposit Protected by SparrowBase Bank Gateway
          </div>
          <button className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition cursor-pointer">
            <CreditCard className="w-4 h-4" /> Deposit Escrow & Launch <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
