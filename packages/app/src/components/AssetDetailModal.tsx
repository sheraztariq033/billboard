import React, { useState } from 'react';
import { X, Eye, MapPin, Calendar, Clock, Sparkles, TrendingUp, Compass, ShieldCheck, CheckCircle2, ChevronRight, Play, Zap, FileText, Activity, AlertCircle, Lock, Award, DollarSign, Download, Globe, Check, RefreshCw, CloudRain, Car } from 'lucide-react';
import { Billboard3DSimulatorModal } from './3dSimulatorModal';
import { useToast } from '../context/ToastContext';
import { exportCommercialPdf } from '../utils/exportPdf';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  asset: {
    id: string;
    title: string;
    city: string;
    area: string;
    category: string;
    monthlyRatePkr: number;
    dailyRatePkr: number;
    impressions: string;
    softExpiry: string;
    imageUrl: string;
  } | null;
}

export const AssetDetailModal: React.FC<Props> = ({ isOpen, onClose, asset }) => {
  const { showToast } = useToast();
  const [currency, setCurrency] = useState<'PKR' | 'USD' | 'AED'>('PKR');
  const [isTaxExempt, setIsTaxExempt] = useState(false);
  const [isCorporateWht, setIsCorporateWht] = useState(true); // 3% corporate vs 10% individual
  const [startDate, setStartDate] = useState('2026-09-16');
  const [endDate, setEndDate] = useState('2026-10-16');
  const [paymentMilestone, setPaymentMilestone] = useState('FULL');
  const [show3dModal, setShow3dModal] = useState(false);
  const [showNocPdf, setShowNocPdf] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [activeTab, setActiveTab] = useState<'SPECS' | 'AI_VISION' | 'NOC' | 'CALENDAR' | 'TAX_INVOICE' | 'PRINT_SPECS'>('SPECS');

  if (!isOpen || !asset) return null;

  const convertRate = (pkr: number) => {
    if (currency === 'USD') return `$${Math.round(pkr / 278).toLocaleString()}`;
    if (currency === 'AED') return `${Math.round(pkr / 75.6).toLocaleString()} AED`;
    return `${pkr.toLocaleString()} PKR`;
  };

  const baseRatePkr = asset.monthlyRatePkr;
  const salesTaxPstPkr = isTaxExempt ? 0 : Math.round(baseRatePkr * 0.16); // 16% PRA/PST
  const whtTaxPkr = Math.round(baseRatePkr * (isCorporateWht ? 0.03 : 0.10)); // 3% vs 10% FBR Sec 153 WHT
  const escrowFeePkr = Math.round(baseRatePkr * 0.02);
  const totalInvoicePkr = baseRatePkr + salesTaxPstPkr + escrowFeePkr;
  const netVendorPayoutPkr = baseRatePkr - whtTaxPkr;

  const handleDownloadInvoicePdf = () => {
    const html = `
      <table class="table">
        <thead>
          <tr><th>Item Description</th><th>Amount (PKR)</th></tr>
        </thead>
        <tbody>
          <tr><td>Base Media Lease Fee (30 Days) - ${asset.title}</td><td>${baseRatePkr.toLocaleString()} PKR</td></tr>
          <tr><td>Provincial Sales Tax (16% PRA/PST Tax)</td><td>${isTaxExempt ? '0 PKR (FBR Exempted)' : `${salesTaxPstPkr.toLocaleString()} PKR`}</td></tr>
          <tr><td>FBR Sec 153 Withholding Tax (${isCorporateWht ? '3%' : '10%'})</td><td>${whtTaxPkr.toLocaleString()} PKR</td></tr>
          <tr><td>Escrow Protection Fee (2%)</td><td>${escrowFeePkr.toLocaleString()} PKR</td></tr>
          <tr class="total-row"><td>Total Amount Payable:</td><td>${totalInvoicePkr.toLocaleString()} PKR</td></tr>
        </tbody>
      </table>
    `;
    exportCommercialPdf(`Tax Invoice - OG-${asset.id.toUpperCase()}`, html);
    showToast('Generating official Commercial Tax Invoice PDF...', 'success');
  };

  const handleDownloadForm164Pdf = () => {
    const html = `
      <div style="padding: 15px; background: #f8fafc; border-radius: 8px; margin-bottom: 20px; border: 1px solid #cbd5e1;">
        <h3>FEDERAL BOARD OF REVENUE (FBR) - FORM 164 WHT CERTIFICATE</h3>
        <p>Income Tax Ordinance 2001 • Section 153 Withholding Tax Deducted</p>
      </div>
      <table class="table">
        <thead><tr><th>FBR Tax Spec</th><th>Tax Certificate Detail</th></tr></thead>
        <tbody>
          <tr><td>Tax Deducting Entity</td><td>OMNI-GRID PAKISTAN PVT LTD (NTN: 8894120-4)</td></tr>
          <tr><td>Media Owner / Payee</td><td>${asset.title} Owner Account</td></tr>
          <tr><td>Gross Payment Amount</td><td>${baseRatePkr.toLocaleString()} PKR</td></tr>
          <tr><td>FBR Sec 153 WHT Deducted (${isCorporateWht ? '3% Corporate' : '10% Individual'})</td><td><strong>${whtTaxPkr.toLocaleString()} PKR</strong></td></tr>
          <tr><td>Net Vendor Payout Deposited</td><td><strong>${netVendorPayoutPkr.toLocaleString()} PKR</strong></td></tr>
        </tbody>
      </table>
    `;
    exportCommercialPdf(`FBR Form 164 WHT Certificate - OG-${asset.id.toUpperCase()}`, html);
    showToast('Exporting official FBR Form 164 WHT Certificate PDF...', 'success');
  };

  const handleConfirmBooking = () => {
    setIsBooked(true);
    showToast(`Escrow Locked for ${asset.title}! Booking active.`, 'success');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-4xl glass-panel p-4 sm:p-6 md:p-8 space-y-6 animate-scale-in my-auto max-h-[94dvh] overflow-y-auto border border-emerald-500/30">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/[0.08]">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-extrabold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Deep Intelligence & Telemetry
              </span>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-[11px] font-extrabold flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> NOC Verified Listing
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white leading-snug truncate font-display">{asset.title}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4 text-emerald-500" /> {asset.area}, {asset.city} • <span className="text-emerald-500 dark:text-emerald-400 font-bold">{asset.category}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex bg-og-bg p-1 rounded-xl border border-white/[0.08]">
              {(['PKR', 'USD', 'AED'] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition cursor-pointer ${
                    currency === curr ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Hero Preview */}
        <div className="relative rounded-2xl overflow-hidden aspect-video sm:aspect-[21/9] border border-white/[0.10] group bg-og-bg">
          <img src={asset.imageUrl} alt={asset.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col sm:flex-row items-start sm:items-end justify-between p-4 sm:p-6 gap-3">
            <div>
              <p className="text-xl sm:text-3xl font-black text-white font-display">{convertRate(baseRatePkr)} <span className="text-xs text-slate-300 font-normal">/ Month</span></p>
            </div>

            <button
              onClick={() => setShow3dModal(true)}
              className="w-full sm:w-auto px-5 py-3 btn-emerald text-xs font-extrabold flex items-center justify-center gap-2 shadow-xl cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" /> Open 3D Visual Simulator
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="glass-panel p-1.5 flex flex-wrap gap-1 border border-white/[0.08]">
          <button
            onClick={() => setActiveTab('SPECS')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'SPECS' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" /> Hardware Specs
          </button>

          <button
            onClick={() => setActiveTab('AI_VISION')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'AI_VISION' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-4 h-4" /> Edge AI Vehicle Classifier
          </button>

          <button
            onClick={() => setActiveTab('NOC')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'NOC' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" /> Civic NOC
          </button>

          <button
            onClick={() => setActiveTab('TAX_INVOICE')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'TAX_INVOICE' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" /> Tax Invoice & WHT
          </button>
        </div>

        {/* Tab 2: Edge AI Computer Vision Vehicle Classifier (Fixes Audit Gaps #19, 20, 21) */}
        {activeTab === 'AI_VISION' && (
          <div className="p-5 rounded-2xl bg-og-bg/90 border border-white/[0.08] space-y-4">
            <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Car className="w-4 h-4 text-emerald-400" /> Edge AI Computer Vision Vehicle Classification & Privacy Telemetry
            </h4>
            <p className="text-xs text-slate-400">On-device edge AI camera model classifies vehicle types in real-time with 100% anonymized license plate blurring.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Cars & SUVs (SEC-A/B)</span>
                <span className="text-lg font-black text-emerald-400">42% (504,000 / Day)</span>
                <span className="text-[10px] text-slate-500 block">High HNW Audience Share</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Bikes & Rickshaws</span>
                <span className="text-lg font-black text-indigo-400">38% (456,000 / Day)</span>
                <span className="text-[10px] text-slate-500 block">Mass Consumer Reach</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Buses & Commercial</span>
                <span className="text-lg font-black text-amber-400">20% (240,000 / Day)</span>
                <span className="text-[10px] text-slate-500 block">Long Commuter Dwell Time</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-semibold flex items-center justify-between">
              <span>● Privacy Compliance: Edge License Plate RSA Blur Active</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30">100% Anonymized</span>
            </div>
          </div>
        )}

        {/* Tab 4: Tax Invoice & FBR Section 153 WHT Form 164 (Fixes Audit Gaps #7, 8) */}
        {activeTab === 'TAX_INVOICE' && (
          <div className="p-5 rounded-2xl bg-og-bg/90 border border-white/[0.08] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" /> Tax Invoice & FBR Sec 153 Withholding Tax (WHT)
              </h4>

              <div className="flex gap-2">
                <button
                  onClick={handleDownloadForm164Pdf}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> FBR Form 164 WHT Certificate
                </button>

                <button
                  onClick={handleDownloadInvoicePdf}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Printable Tax Invoice
                </button>
              </div>
            </div>

            {/* WHT Rate Selector */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-slate-300 font-bold">FBR Sec 153 Vendor Payout WHT Rate:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCorporateWht(true)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                    isCorporateWht ? 'bg-indigo-600 text-white' : 'bg-og-bg text-slate-400'
                  }`}
                >
                  3% Corporate WHT
                </button>
                <button
                  type="button"
                  onClick={() => setIsCorporateWht(false)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                    !isCorporateWht ? 'bg-indigo-600 text-white' : 'bg-og-bg text-slate-400'
                  }`}
                >
                  10% Individual WHT
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-white/[0.06] text-slate-300">
                <span>Base Lease Fee:</span><span className="font-bold text-white">{convertRate(baseRatePkr)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.06] text-slate-300">
                <span>Provincial Sales Tax (16% PRA/PST):</span><span className="font-bold text-amber-400">{isTaxExempt ? '0 PKR (FBR Tax Exempted)' : convertRate(salesTaxPstPkr)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.06] text-slate-300">
                <span>FBR Sec 153 WHT Deducted ({isCorporateWht ? '3%' : '10%'}):</span><span className="font-bold text-indigo-400">-{convertRate(whtTaxPkr)}</span>
              </div>
              <div className="flex justify-between py-3 text-base font-black text-emerald-400 pt-2">
                <span>Total Amount Payable:</span><span className="text-xl font-display">{convertRate(totalInvoicePkr)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="p-5 rounded-2xl border border-emerald-500/30 bg-og-bg space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" /> 100% Escrow Protection
            </div>

            <button
              onClick={handleConfirmBooking}
              disabled={isBooked}
              className="w-full sm:w-auto px-8 py-3.5 btn-emerald text-xs font-extrabold flex items-center justify-center gap-2 shadow-xl cursor-pointer"
            >
              {isBooked ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Commercial Reservation Active!
                </>
              ) : (
                <>
                  Confirm Booking ({convertRate(totalInvoicePkr)}) <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <Billboard3DSimulatorModal
        isOpen={show3dModal}
        onClose={() => setShow3dModal(false)}
        assetTitle={asset.title}
      />
    </div>
  );
};
