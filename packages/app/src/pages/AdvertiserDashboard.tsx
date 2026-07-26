import React, { useState } from 'react';
import { Sliders, Calendar, Clock, Lock, ShieldCheck, DollarSign, CheckCircle2, ChevronRight, Sparkles, Building2, ShoppingCart, Percent } from 'lucide-react';
import { AssetDetailModal } from '../components/AssetDetailModal';

export const AdvertiserDashboard: React.FC = () => {
  const [budget, setBudget] = useState(3500000);
  const [durationDays, setDurationDays] = useState(30);
  const [dayparting, setDayparting] = useState('FULL'); // 'FULL' | 'MORNING_RUSH' | 'EVENING_RUSH' | 'NIGHT_PEAK'
  const [isCategoryExclusive, setIsCategoryExclusive] = useState(false);
  const [paymentMilestone, setPaymentMilestone] = useState<'FULL' | 'MILESTONE_30_70'>('FULL');
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);

  // Discount Math
  const discountPct = durationDays >= 90 ? 28 : durationDays >= 50 ? 22 : durationDays >= 30 ? 15 : durationDays >= 14 ? 8 : 0;
  const discountAmount = Math.round(budget * (discountPct / 100));
  const exclusivityFee = isCategoryExclusive ? Math.round(budget * 0.15) : 0;
  const grossSubtotal = budget - discountAmount + exclusivityFee;
  const pstTax = Math.round(grossSubtotal * 0.16); // 16% PRA/PST
  const netInvoice = grossSubtotal + pstTax;

  const deposit30Amount = Math.round(netInvoice * 0.30);

  const handleCheckout = () => {
    setIsCheckoutSuccess(true);
    setTimeout(() => setIsCheckoutSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="glass-panel p-6 border border-indigo-500/30 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 text-xs font-black mb-2">
              <Building2 className="w-3.5 h-3.5" /> Advertiser Media Buying Command
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">Media Buying & Dayparting Planner</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure campaign duration, hourly dayparting flighting, category exclusivity & milestone escrow</p>
          </div>

          <div className="bg-og-bg/80 p-4 rounded-2xl border border-white/[0.08] text-right min-w-[200px]">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Net Tax Inclusive Invoice</span>
            <p className="text-2xl font-black text-emerald-400 font-display">{netInvoice.toLocaleString()} PKR</p>
            <span className="text-[10px] text-indigo-300 font-bold block mt-0.5">Includes 16% PRA/PST Sales Tax</span>
          </div>
        </div>
      </div>

      {/* Campaign Budget & Duration Engine */}
      <div className="glass-panel p-6 border border-white/[0.08] space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" /> Campaign Budget Allocation
            </label>
            <span className="text-2xl font-black text-emerald-400 font-display">{budget.toLocaleString()} PKR</span>
          </div>
          <input
            type="range"
            min={100000}
            max={50000000}
            step={100000}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
          />
        </div>

        {/* Duration Factors */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold uppercase text-indigo-400 flex items-center gap-1.5">
            <Calendar className="w-4 h-4" /> Select Display Duration Factor:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { days: 7, label: '7 Days', disc: 'Standard' },
              { days: 14, label: '14 Days', disc: '-8% Disc.' },
              { days: 30, label: '30 Days (1 Mo)', disc: '-15% Disc.' },
              { days: 50, label: '50 Days', disc: '-22% Disc.' },
              { days: 90, label: '90 Days (3 Mo)', disc: '-28% Disc.' },
            ].map((d) => (
              <button
                key={d.days}
                type="button"
                onClick={() => setDurationDays(d.days)}
                className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                  durationDays === d.days
                    ? 'bg-emerald-600 border-emerald-500 text-white font-extrabold shadow-md'
                    : 'bg-og-bg border-white/[0.06] text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xs font-bold block">{d.label}</span>
                <span className="text-[10px] text-emerald-300 font-semibold">{d.disc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Hourly Dayparting Selector (Fixes Audit Problem #48) */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold uppercase text-purple-400 flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> Hourly Dayparting & Flight Schedule:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            {[
              { id: 'FULL', title: '24/7 Full Loop', sub: 'Continuous 24-Hour Rotation' },
              { id: 'MORNING_RUSH', title: 'Morning Peak (7-11 AM)', sub: 'Office & School Commute' },
              { id: 'EVENING_RUSH', title: 'Evening Peak (5-10 PM)', sub: 'Dinner & Shopping Traffic' },
              { id: 'NIGHT_PEAK', title: 'Night Life (7 PM - 1 AM)', sub: 'High Gen-Z Lounge Hours' },
            ].map((part) => (
              <button
                key={part.id}
                type="button"
                onClick={() => setDayparting(part.id)}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  dayparting === part.id
                    ? 'bg-purple-600/30 border-purple-500 text-white font-bold'
                    : 'bg-og-bg border-white/[0.06] text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xs font-bold block">{part.title}</span>
                <span className="text-[10px] text-purple-300 block">{part.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Competitor Exclusivity Lock (Fixes Audit Problem #55) */}
        <div className="p-4 rounded-xl bg-og-bg/80 border border-white/[0.08] flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-400" /> Category Exclusivity Lock (+15% Premium Fee)
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">Locks adjacent billboards from displaying direct competitor brand ads during your campaign flight.</p>
          </div>

          <input
            type="checkbox"
            checked={isCategoryExclusive}
            onChange={(e) => setIsCategoryExclusive(e.target.checked)}
            className="w-5 h-5 rounded border-slate-600 text-emerald-500 focus:ring-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Commercial Tax Invoice & Checkout Box */}
      <div className="glass-panel p-6 border border-emerald-500/30 space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-emerald-400" /> Phygital Campaign Tax Invoice & Milestone Escrow
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-slate-300 py-1.5 border-b border-white/[0.06]">
            <span>Base Media Budget ({durationDays} Days Display):</span>
            <strong className="text-white">{budget.toLocaleString()} PKR</strong>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-400 py-1.5 border-b border-white/[0.06]">
              <span>Volume Discount Savings (-{discountPct}%):</span>
              <strong>-{discountAmount.toLocaleString()} PKR</strong>
            </div>
          )}
          {exclusivityFee > 0 && (
            <div className="flex justify-between text-amber-400 py-1.5 border-b border-white/[0.06]">
              <span>Category Exclusivity Fee (+15% Premium):</span>
              <strong>+{exclusivityFee.toLocaleString()} PKR</strong>
            </div>
          )}
          <div className="flex justify-between text-slate-300 py-1.5 border-b border-white/[0.06]">
            <span>Provincial Sales Tax (16% PRA/PST Tax):</span>
            <strong className="text-amber-400">+{pstTax.toLocaleString()} PKR</strong>
          </div>
          <div className="flex justify-between text-base font-black text-emerald-400 py-2">
            <span>Total Payable Amount:</span>
            <span className="text-xl font-display">{netInvoice.toLocaleString()} PKR</span>
          </div>
        </div>

        {/* Milestone Schedule Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => setPaymentMilestone('FULL')}
            className={`p-3.5 rounded-xl border text-left text-xs font-bold transition cursor-pointer ${
              paymentMilestone === 'FULL' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-og-bg border-white/[0.06] text-slate-400'
            }`}
          >
            <span>100% Full Upfront Escrow</span>
            <span className="block text-[10px] text-emerald-200 mt-0.5">{netInvoice.toLocaleString()} PKR Deposit</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMilestone('MILESTONE_30_70')}
            className={`p-3.5 rounded-xl border text-left text-xs font-bold transition cursor-pointer ${
              paymentMilestone === 'MILESTONE_30_70' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-og-bg border-white/[0.06] text-slate-400'
            }`}
          >
            <span>30% Deposit + 70% Post-Proof Launch</span>
            <span className="block text-[10px] text-emerald-200 mt-0.5">Pay {deposit30Amount.toLocaleString()} PKR Now</span>
          </button>
        </div>

        <button
          onClick={handleCheckout}
          disabled={isCheckoutSuccess}
          className="w-full py-4 btn-emerald text-sm font-extrabold flex items-center justify-center gap-2 shadow-xl cursor-pointer"
        >
          {isCheckoutSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5" /> Campaign Escrow Locked & Order Transmitted!
            </>
          ) : (
            <>
              Lock Escrow & Deploy Campaign ({paymentMilestone === 'MILESTONE_30_70' ? deposit30Amount.toLocaleString() : netInvoice.toLocaleString()} PKR) <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
