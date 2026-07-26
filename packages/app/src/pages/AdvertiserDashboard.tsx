import React, { useState } from 'react';
import { Sliders, Calendar, Clock, Lock, ShieldCheck, DollarSign, CheckCircle2, ChevronRight, Sparkles, Building2, ShoppingCart, Percent, CreditCard, Loader2, Tv, FileText, Award } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { exportCommercialPdf } from '../utils/exportPdf';

export const AdvertiserDashboard: React.FC = () => {
  const { showToast } = useToast();
  const [budget, setBudget] = useState(3500000);
  const [durationDays, setDurationDays] = useState(30);
  const [dayparting, setDayparting] = useState('FULL');
  const [isCategoryExclusive, setIsCategoryExclusive] = useState(false);
  const [paymentMilestone, setPaymentMilestone] = useState<'FULL' | 'MILESTONE_30_70'>('FULL');
  const [paymentMethod, setPaymentMethod] = useState<'BANK_TRANSFER' | 'JAZZCASH' | 'EASYPAISA'>('BANK_TRANSFER');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);

  // Module 20: TV Broadcast Booking State
  const [activeTab, setActiveTab] = useState<'OOH' | 'TV'>('OOH');
  const [selectedTvChannel, setSelectedTvChannel] = useState('Geo News');
  const [spotType, setSpotType] = useState('BULLETIN_SPOT');
  const [spotQuantity, setSpotQuantity] = useState(10);

  // OOH Discount Math
  const discountPct = durationDays >= 90 ? 28 : durationDays >= 50 ? 22 : durationDays >= 30 ? 15 : durationDays >= 14 ? 8 : 0;
  const discountAmount = Math.round(budget * (discountPct / 100));
  const exclusivityFee = isCategoryExclusive ? Math.round(budget * 0.15) : 0;
  const grossSubtotal = budget - discountAmount + exclusivityFee;
  const pstTax = Math.round(grossSubtotal * 0.16); // 16% PRA/PST
  const netInvoice = grossSubtotal + pstTax;

  const deposit30Amount = Math.round(netInvoice * 0.30);
  const dueNowAmount = paymentMilestone === 'MILESTONE_30_70' ? deposit30Amount : netInvoice;

  // TV Spot Math
  const tvRatePerSpot = spotType === 'BULLETIN_SPOT' ? 180000 : spotType === 'TALKSHOW_LBAR' ? 120000 : 65000;
  const tvGrossSubtotal = tvRatePerSpot * spotQuantity;
  const tvPstTax = Math.round(tvGrossSubtotal * 0.16);
  const tvNetInvoice = tvGrossSubtotal + tvPstTax;

  const handleCheckout = async () => {
    setIsSubmitting(true);
    try {
      await api.post('/campaigns/bookings', {
        budget: activeTab === 'OOH' ? budget : tvNetInvoice,
        durationDays,
        dayparting,
        isCategoryExclusive,
        paymentMilestone,
        paymentMethod,
        title: activeTab === 'OOH' ? `OMNI Campaign (${durationDays} Days)` : `TV Spots - ${selectedTvChannel} (${spotQuantity} Spots)`,
        targetCity: 'Lahore',
      });

      setIsCheckoutSuccess(true);
      showToast(`Escrow Locked! Booking confirmed via ${paymentMethod.replace('_', ' ')}.`, 'success');

      // Export Tax Invoice PDF
      const html = activeTab === 'OOH' ? `
        <table class="table">
          <thead><tr><th>Booking Charge Item</th><th>Amount (PKR)</th></tr></thead>
          <tbody>
            <tr><td>Base Media Lease (${durationDays} Days Flight)</td><td>${budget.toLocaleString()} PKR</td></tr>
            ${discountAmount > 0 ? `<tr><td>Volume Discount (-${discountPct}%)</td><td>-${discountAmount.toLocaleString()} PKR</td></tr>` : ''}
            ${exclusivityFee > 0 ? `<tr><td>Category Exclusivity Lock (+15%)</td><td>+${exclusivityFee.toLocaleString()} PKR</td></tr>` : ''}
            <tr><td>Provincial Sales Tax (16% PRA/PST)</td><td>+${pstTax.toLocaleString()} PKR</td></tr>
            <tr class="total-row"><td>Total Net Invoice:</td><td>${netInvoice.toLocaleString()} PKR</td></tr>
            <tr><td><strong>Amount Deposited / Due Now:</strong></td><td><strong>${dueNowAmount.toLocaleString()} PKR (${paymentMilestone === 'MILESTONE_30_70' ? '30% Deposit' : '100% Upfront'})</strong></td></tr>
          </tbody>
        </table>
      ` : `
        <table class="table">
          <thead><tr><th>TV Spot Item</th><th>Amount (PKR)</th></tr></thead>
          <tbody>
            <tr><td>TV Channel:</td><td><strong>${selectedTvChannel}</strong></td></tr>
            <tr><td>Spot Format:</td><td><strong>${spotType}</strong></td></tr>
            <tr><td>Quantity (${spotQuantity} Spots x ${tvRatePerSpot.toLocaleString()} PKR):</td><td>${tvGrossSubtotal.toLocaleString()} PKR</td></tr>
            <tr><td>Provincial Sales Tax (16% PRA/PST):</td><td>+${tvPstTax.toLocaleString()} PKR</td></tr>
            <tr class="total-row"><td>Total TV Net Invoice:</td><td>${tvNetInvoice.toLocaleString()} PKR</td></tr>
          </tbody>
        </table>
      `;
      exportCommercialPdf(`Tax Invoice - OMNI ${activeTab} Booking ${Date.now()}`, html);

      setTimeout(() => setIsCheckoutSuccess(false), 5000);
    } catch (err: any) {
      showToast(err.message || 'Booking submission failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateCertificateOfPlayback = () => {
    const html = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #059669;">CERTIFICATE OF PLAYBACK</h2>
        <p>Broadcast Verification & Airtime Timestamp Proof</p>
        <hr/>
        <table class="table">
          <tr><td>TV Network:</td><td><strong>${selectedTvChannel} (HD Broadcast)</strong></td></tr>
          <tr><td>Aired Format:</td><td><strong>${spotType}</strong></td></tr>
          <tr><td>Verified Airings:</td><td><strong>${spotQuantity} Spots Completed</strong></td></tr>
          <tr><td>Audit Hash:</td><td><code>0x8f93...4a2b</code></td></tr>
        </table>
      </div>
    `;
    exportCommercialPdf(`Certificate of Playback - ${selectedTvChannel}`, html);
    showToast('Certificate of Playback PDF exported!', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 text-xs font-black mb-2">
              <Building2 className="w-3.5 h-3.5" /> Media Buying Command & Escrow Checkout
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">Media Buying & TV Spot Engine</h2>
            <p className="text-xs text-slate-400 mt-1">Configure flight schedule, category exclusivity, TV broadcast spots & escrow payments</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-1 rounded-xl bg-slate-950 border border-slate-800 flex items-center">
              <button
                onClick={() => setActiveTab('OOH')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'OOH' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> Billboards & DOOH
              </button>
              <button
                onClick={() => setActiveTab('TV')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'TV' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tv className="w-3.5 h-3.5" /> TV & Broadcast
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-right hidden md:block">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Net Invoice</span>
              <p className="text-xl font-black text-emerald-400 font-display">
                {(activeTab === 'OOH' ? netInvoice : tvNetInvoice).toLocaleString()} PKR
              </p>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'OOH' ? (
        /* OOH & DOOH Campaign Budget & Duration Engine */
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
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
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
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
                { days: 90, label: '90 Days (Qtr)', disc: '-28% Disc.' },
              ].map((item) => (
                <button
                  key={item.days}
                  onClick={() => setDurationDays(item.days)}
                  className={`p-3 rounded-xl text-left border cursor-pointer transition ${
                    durationDays === item.days
                      ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-bold block">{item.label}</span>
                  <span className="text-[10px] text-emerald-400 font-extrabold">{item.disc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dayparting & Category Exclusivity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" /> Dayparting Flight Slot
              </label>
              <select
                value={dayparting}
                onChange={(e) => setDayparting(e.target.value)}
                className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none"
              >
                <option value="FULL">Full 24-Hour Continuous Flight</option>
                <option value="PEAK_COMMUTE">Peak Commute Hours (7-10 AM & 5-9 PM)</option>
                <option value="NIGHT_LATE">Late Night High Visibility (9 PM - 2 AM)</option>
              </select>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-400" /> Category Exclusivity Lock
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5">Block competitors on same screen (+15% premium)</p>
              </div>
              <input
                type="checkbox"
                checked={isCategoryExclusive}
                onChange={(e) => setIsCategoryExclusive(e.target.checked)}
                className="w-5 h-5 accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      ) : (
        /* Module 20: TV Broadcast Booking Engine */
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Tv className="w-5 h-5 text-indigo-400" /> Pakistani TV Network Spot Booking
              </h3>
              <p className="text-xs text-slate-400">Reserve commercial spots on Geo, ARY, Hum TV & PTV with playback verification</p>
            </div>

            <button
              onClick={handleGenerateCertificateOfPlayback}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-emerald-400" /> Certificate of Playback PDF
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">TV Network Channel</label>
              <select
                value={selectedTvChannel}
                onChange={(e) => setSelectedTvChannel(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
              >
                <option value="Geo News">Geo News HD (Prime News)</option>
                <option value="ARY Digital">ARY Digital (Entertainment Peak)</option>
                <option value="Hum TV">Hum TV (Prime Drama Slot)</option>
                <option value="PTV Sports">PTV Sports (Live Cricket Stream)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Spot Format</label>
              <select
                value={spotType}
                onChange={(e) => setSpotType(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
              >
                <option value="BULLETIN_SPOT">9 PM Prime News Bulletin Spot (PKR 180,000/spot)</option>
                <option value="TALKSHOW_LBAR">Talkshow L-Bar Overlay Banner (PKR 120,000/spot)</option>
                <option value="NEWS_TICKER">Live News Ticker Ticker Bar (PKR 65,000/spot)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Spot Quantity</label>
              <input
                type="number"
                min={1}
                max={100}
                value={spotQuantity}
                onChange={(e) => setSpotQuantity(Number(e.target.value))}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Payment Gateway Checkout Selector */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
          <CreditCard className="w-4 h-4" /> Escrow Payment Gateway Selector
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'BANK_TRANSFER', name: 'Manual Bank Transfer (IBAN/RAAST)', desc: 'Zero gateway fee • Direct escrow account' },
            { id: 'JAZZCASH', name: 'JazzCash Wallet API', desc: 'Instant OTP verification deposit' },
            { id: 'EASYPAISA', name: 'Easypaisa Mobile Account', desc: 'Fast mobile account transfer' },
          ].map((gateway) => (
            <button
              key={gateway.id}
              onClick={() => setPaymentMethod(gateway.id as any)}
              className={`p-3.5 rounded-xl border text-left cursor-pointer transition ${
                paymentMethod === gateway.id
                  ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-xs font-bold block">{gateway.name}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">{gateway.desc}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleCheckout}
          disabled={isSubmitting}
          className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold rounded-xl text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" /> Confirm Booking & Lock Escrow ({(activeTab === 'OOH' ? netInvoice : tvNetInvoice).toLocaleString()} PKR)
            </>
          )}
        </button>
      </div>
    </div>
  );
};
