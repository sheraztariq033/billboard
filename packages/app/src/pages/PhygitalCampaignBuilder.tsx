import React, { useState } from 'react';
import { ShoppingBag, Sliders, CheckCircle2, ChevronRight, Sparkles, Building2, Layers, Tv, Video, Car, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

export const PhygitalCampaignBuilder: React.FC = () => {
  const { showToast } = useToast();
  const [totalBudgetPkr, setTotalBudgetPkr] = useState(5000000);
  const [targetCity, setTargetCity] = useState('Lahore');
  const [campaignTitle, setCampaignTitle] = useState('Omnichannel Q4 Brand Launch');
  const [isPackaging, setIsPackaging] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [packagedData, setPackagedData] = useState<any | null>(null);

  const handleGeneratePackage = async () => {
    setIsPackaging(true);
    try {
      const res = await api.post<{ data: any }>('/campaigns/package', {
        totalBudgetPkr,
        targetCity,
      });

      setPackagedData(res.data);
      showToast(`AI Campaign Package generated for ${totalBudgetPkr.toLocaleString()} PKR!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Packaging failed', 'error');
    } finally {
      setIsPackaging(false);
    }
  };

  const handleExecuteCampaign = async () => {
    setIsExecuting(true);
    try {
      await api.post('/campaigns', {
        title: campaignTitle,
        totalBudgetPkr,
        targetCity,
      });

      showToast(`Omnichannel Campaign "${campaignTitle}" executed & active in D1 database!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Execution failed', 'error');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-black mb-2">
              <ShoppingBag className="w-3.5 h-3.5" /> AI Omnichannel Packager & Builder
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">Multi-Asset Campaign Builder</h2>
            <p className="text-xs text-slate-400 mt-1">Package budget across Roadside OOH, TV spots, social creators & retail shelf displays connected to Cloudflare Workers</p>
          </div>

          <button
            onClick={handleGeneratePackage}
            disabled={isPackaging}
            className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer text-xs"
          >
            {isPackaging ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generating AI Package...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Generate AI Budget Package
              </>
            )}
          </button>
        </div>
      </div>

      {/* Budget Controls */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Campaign Title</label>
            <input
              type="text"
              value={campaignTitle}
              onChange={(e) => setCampaignTitle(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Target City</label>
            <select
              value={targetCity}
              onChange={(e) => setTargetCity(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
            >
              <option value="Lahore">Lahore</option>
              <option value="Karachi">Karachi</option>
              <option value="Islamabad">Islamabad</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Total Budget (PKR)</label>
            <input
              type="number"
              value={totalBudgetPkr}
              onChange={(e) => setTotalBudgetPkr(Number(e.target.value))}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
            />
          </div>
        </div>
      </div>

      {/* Package Breakdown Cards */}
      {packagedData && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center justify-between">
            <span>AI Budget Allocation Package</span>
            <span className="text-xs text-emerald-400 font-extrabold">{packagedData.totalEstimatedImpressions} Est. Reach</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {packagedData.allocations?.map((alloc: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between font-bold text-white">
                  <span>{alloc.channel} ({alloc.percentage}%)</span>
                  <span className="text-emerald-400">{alloc.budgetPkr.toLocaleString()} PKR</span>
                </div>
                {alloc.suggestedAssets?.map((ass: any, aIdx: number) => (
                  <p key={aIdx} className="text-[11px] text-slate-400">
                    • {ass.name} ({ass.estImpressions || ass.estViews} impressions)
                  </p>
                ))}
              </div>
            ))}
          </div>

          <button
            onClick={handleExecuteCampaign}
            disabled={isExecuting}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-extrabold rounded-xl shadow-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            {isExecuting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Executing & Deploying Campaign...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" /> Execute Omnichannel Campaign & Deploy to D1
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
