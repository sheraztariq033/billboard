import React, { useState } from 'react';
import { Sparkles, Calculator, ShieldCheck, TrendingUp, Send, CheckCircle2, Loader2, AlertTriangle, FileText, DollarSign, Upload, Percent } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface Bid {
  id: string;
  vendorName: string;
  pkrBidAmount: number;
  pitchNotes: string;
  deliveryDays: number;
}

export const AdTechOperationsSuite: React.FC = () => {
  const { showToast } = useToast();

  // Widget 1: ROI Campaign Planner
  const [roiBudget, setRoiBudget] = useState(1000000);
  const [roiFormat, setRoiFormat] = useState<'DOOH' | 'Transit' | 'Static'>('DOOH');
  const estCpm = roiFormat === 'DOOH' ? 85 : roiFormat === 'Transit' ? 45 : 60;
  const totalReach = Math.round((roiBudget / estCpm) * 1000);
  const conversionRate = 0.012; // 1.2% typical conversion rate
  const targetConversions = Math.round(totalReach * conversionRate);

  // Widget 2: AI Brand Safety Compliance
  const [analyzingSafety, setAnalyzingSafety] = useState(false);
  const [safetyResult, setSafetyResult] = useState<any | null>(null);

  // Widget 3: Surge Pricing Simulator
  const [baseDailyRate, setBaseDailyRate] = useState(25000);
  const [surgeEvent, setSurgeEvent] = useState<'REGULAR' | 'PSL_MATCH' | 'EID_RUSH' | 'RAIN_PEAK'>('REGULAR');
  const surgeMultipliers = {
    REGULAR: 1.0,
    PSL_MATCH: 1.85,
    EID_RUSH: 1.5,
    RAIN_PEAK: 1.25,
  };
  const activeMultiplier = surgeMultipliers[surgeEvent];
  const finalDailyRate = Math.round(baseDailyRate * activeMultiplier);

  // Widget 4: RFP Proposals Engine
  const [rfpTitle, setRfpTitle] = useState('Brand Activation Q4 Lahore DHA');
  const [rfpBudget, setRfpBudget] = useState(2500000);
  const [bids, setBids] = useState<Bid[]>([
    { id: 'bid_1', vendorName: 'Apex Media Corp', pkrBidAmount: 2200000, pitchNotes: 'Includes prime curved screen placements and free transit bus decals.', deliveryDays: 30 },
    { id: 'bid_2', vendorName: 'Visionary DOOH Networks', pkrBidAmount: 2450000, pitchNotes: 'Guaranteed 1.8M daily views with verified Proof-of-Play stream.', deliveryDays: 25 },
  ]);
  const [newPitch, setNewPitch] = useState('');
  const [newBidAmount, setNewBidAmount] = useState(2300000);

  const triggerSafetyAnalysis = () => {
    setAnalyzingSafety(true);
    setTimeout(() => {
      setSafetyResult({
        ocrText: 'GRAND RAMADAN SPECIAL SALE - 50% OFF COLA & DRINKS',
        isSafe: true,
        pemraCompliance: '100% PASSED',
        religiousAlignment: 'PASSED (Ramadan respectful)',
        competitorOverlap: 'None detected in 500m radius',
      });
      setAnalyzingSafety(false);
      showToast('AI Creative Brand Safety Audit complete!', 'success');
    }, 1500);
  };

  const handlePostBid = () => {
    if (!newPitch) return;
    const bid: Bid = {
      id: `bid_${Date.now()}`,
      vendorName: 'Local Elite Media Group (You)',
      pkrBidAmount: newBidAmount,
      pitchNotes: newPitch,
      deliveryDays: 14,
    };
    setBids([bid, ...bids]);
    setNewPitch('');
    showToast('RFP Proposal Bid Submitted successfully!', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <h2 className="text-2xl sm:text-3xl font-black font-display text-white">Ad-Tech Advanced Operations Suite</h2>
        <p className="text-xs text-slate-400 mt-1">Simulate ROI margins, run Pemra Brand Safety OCR audits, calculate real-time PSL/Eid traffic surge pricing, and submit RFPs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Widget 1: ROI Campaign Planner & Budget Optimizer */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" />
            ROI Campaign Planner & CPM Optimizer
          </h3>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Campaign Budget (PKR)</label>
                <input
                  type="number"
                  value={roiBudget}
                  onChange={(e) => setRoiBudget(Number(e.target.value))}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Media Format Target</label>
                <select
                  value={roiFormat}
                  onChange={(e) => setRoiFormat(e.target.value as any)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"
                >
                  <option value="DOOH">Digital SMDs (DOOH)</option>
                  <option value="Transit">Transit wraps (Buses/Cabs)</option>
                  <option value="Static">Static Unipole Billboard</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800/60 text-center">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                <span className="text-[10px] text-slate-500 block">Est. CPM Rate</span>
                <span className="text-base font-black text-white">{estCpm} PKR</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                <span className="text-[10px] text-slate-500 block">Calculated Reach</span>
                <span className="text-base font-black text-emerald-400">{totalReach.toLocaleString()}+</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                <span className="text-[10px] text-slate-500 block">Est. Conversions</span>
                <span className="text-base font-black text-indigo-400">{targetConversions.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Widget 2: AI Brand Safety Compliance OCR Analyzer */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            AI PEMRA & Brand Safety Compliance OCR Analyzer
          </h3>

          <div className="space-y-4 text-xs">
            <div className="border-2 border-dashed border-slate-850 rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <Upload className="w-8 h-8 text-indigo-400 mb-2" />
              <button
                type="button"
                onClick={triggerSafetyAnalysis}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold cursor-pointer"
              >
                Upload & Run Audit
              </button>
              <span className="text-[10px] text-slate-500 mt-1">Runs simulated OCR text and flags prohibited categories</span>
            </div>

            {analyzingSafety && (
              <div className="flex justify-center py-2">
                <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
              </div>
            )}

            {safetyResult && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Detected Headline Text:</span>
                  <span className="font-bold text-white font-mono">{safetyResult.ocrText}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">PEMRA Regulatory Status:</span>
                  <span className="font-bold text-emerald-400">{safetyResult.pemraCompliance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ramadan Ad Compliance:</span>
                  <span className="font-bold text-emerald-400">{safetyResult.religiousAlignment}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Widget 3: Surge Pricing Simulator */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            Smart Surge Pricing & Demand Estimator
          </h3>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Base Daily Rate (PKR)</label>
                <input
                  type="number"
                  value={baseDailyRate}
                  onChange={(e) => setBaseDailyRate(Number(e.target.value))}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Surge Multiplier Context</label>
                <select
                  value={surgeEvent}
                  onChange={(e) => setSurgeEvent(e.target.value as any)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"
                >
                  <option value="REGULAR">Regular Traffic Profile (1.0x)</option>
                  <option value="PSL_MATCH">PSL Cricket Match Night (1.85x)</option>
                  <option value="EID_RUSH">Chaand Raat / Eid Shopping (1.5x)</option>
                  <option value="RAIN_PEAK">Monsoon Rain Dwell Surge (1.25x)</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Dynamic Price Adjusted</span>
                <span className="text-xl font-black text-amber-400 font-mono">{finalDailyRate.toLocaleString()} PKR <span className="text-xs text-slate-500 font-normal">/ day</span></span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Active Multiplier</span>
                <span className="text-base font-bold text-white">{activeMultiplier}x</span>
              </div>
            </div>
          </div>
        </div>

        {/* Widget 4: RFP Proposals & Bidding Engine */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-rose-400" />
            Media Owner RFP Proposal & Bidding Engine
          </h3>

          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-1">
              <div className="flex justify-between font-bold text-white">
                <span>RFP Target: {rfpTitle}</span>
                <span className="text-emerald-400">PKR {rfpBudget.toLocaleString()} Budget</span>
              </div>
              <p className="text-[11px] text-slate-500">Post bids and submit creative specifications directly for client review.</p>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-slate-300">Submit Your Pitch Proposal</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Pitch notes (e.g. includes prime curved screen placements...)"
                  value={newPitch}
                  onChange={(e) => setNewPitch(e.target.value)}
                  className="flex-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"
                />
                <button
                  type="button"
                  onClick={handlePostBid}
                  className="px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold cursor-pointer"
                >
                  Post Bid
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-400 block">Submitted Vendor Proposals:</span>
              <div className="space-y-2">
                {bids.map((b) => (
                  <div key={b.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <div>
                      <strong className="text-white block">{b.vendorName}</strong>
                      <span className="text-slate-400 text-[11px] block mt-0.5">{b.pitchNotes}</span>
                    </div>
                    <div className="text-right">
                      <strong className="text-emerald-400 block">PKR {b.pkrBidAmount.toLocaleString()}</strong>
                      <span className="text-[10px] text-slate-500 block">ETA: {b.deliveryDays} Days</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
