import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { LayoutDashboard, MapPin, ShoppingCart, BarChart2, Users, Loader2, CheckCircle2, XCircle, Sparkles, Send, Zap, CloudRain, Sun, ShieldAlert, FileText, Calculator } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { exportCommercialPdf } from '../utils/exportPdf';

export const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiConsulting, setIsAiConsulting] = useState(false);
  const [aiResponse, setAiResponse] = useState<any | null>(null);

  // Module 22: Tax Compliance Calculator State
  const [taxGross, setTaxGross] = useState(2500000);
  const [userType, setUserType] = useState<'CORPORATE' | 'INDIVIDUAL'>('CORPORATE');

  const pstTaxPkr = Math.round(taxGross * 0.16); // 16% PRA/PST
  const whtPct = userType === 'CORPORATE' ? 3 : 10; // FBR Section 153 WHT
  const whtTaxPkr = Math.round(taxGross * (whtPct / 100));
  const netInvoicePkr = taxGross + pstTaxPkr;
  const netPayablePkr = netInvoicePkr - whtTaxPkr;

  useEffect(() => {
    api.get('/health')
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('offline'));
  }, []);

  const handleConsultAi = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const promptText = aiPrompt.trim() || 'Optimize my Lahore billboard campaign for maximum reach';

    setIsAiConsulting(true);
    try {
      const res = await api.post<{ data: any }>('/ai/copilot', { prompt: promptText });
      setAiResponse(res.data);
      showToast('AI Co-Pilot analysis complete!', 'success');
    } catch (err: any) {
      showToast(err.message || 'AI Co-Pilot error', 'error');
    } finally {
      setIsAiConsulting(false);
    }
  };

  const handleExportForm164Cert = () => {
    const html = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #059669;">FBR FORM 164 WITHHOLDING TAX CERTIFICATE</h2>
        <p>Federal Board of Revenue • Section 153 Income Tax Deduction Proof</p>
        <hr/>
        <table class="table">
          <tr><td>Taxpayer / Business Title:</td><td><strong>${user?.name || 'OMNI-GRID Client'}</strong></td></tr>
          <tr><td>FBR NTN Number:</td><td><strong>7912405-9</strong></td></tr>
          <tr><td>Gross Campaign Value:</td><td><strong>${taxGross.toLocaleString()} PKR</strong></td></tr>
          <tr><td>PST / Sales Tax (16% PRA):</td><td><strong>+${pstTaxPkr.toLocaleString()} PKR</strong></td></tr>
          <tr><td>Withholding Tax Rate:</td><td><strong>${whtPct}% (${userType})</strong></td></tr>
          <tr><td>WHT Deducted (FBR Sec 153):</td><td><strong>-${whtTaxPkr.toLocaleString()} PKR</strong></td></tr>
          <tr class="total-row"><td>Net Remitted Payment:</td><td><strong>${netPayablePkr.toLocaleString()} PKR</strong></td></tr>
        </table>
      </div>
    `;
    exportCommercialPdf(`FBR Form 164 WHT Cert - ${taxGross}`, html);
    showToast('FBR Form 164 Tax Certificate PDF exported!', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-600/10 border border-emerald-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {user?.name || 'User'}
          </h1>
          <p className="text-slate-400 mt-1 text-xs">
            Authenticated as <strong className="text-emerald-400">{user?.email}</strong> • Active Role: <strong className="text-white capitalize">{user?.role}</strong>
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
          {apiStatus === 'checking' && <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />}
          {apiStatus === 'online' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          {apiStatus === 'offline' && <XCircle className="w-4 h-4 text-rose-400" />}
          <span className="text-xs font-bold text-white uppercase">API Status: {apiStatus}</span>
        </div>
      </div>

      {/* AI Campaign Co-Pilot Terminal */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" /> AI Campaign Co-Pilot Terminal
          </h3>
          <span className="text-[10px] px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-400 font-extrabold border border-emerald-500/20">
            Cloudflare Workers AI Engine
          </span>
        </div>

        <form onSubmit={handleConsultAi} className="flex gap-2">
          <input
            type="text"
            placeholder="Ask AI Co-Pilot (e.g. 'Optimize 5M PKR budget for Karachi & Lahore FMCG launch')..."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={isAiConsulting}
            className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
          >
            {isAiConsulting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Consult AI
          </button>
        </form>

        {/* AI Co-Pilot Recommendation Box */}
        {aiResponse && (
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3 text-xs animate-fade-in">
            <p className="text-slate-300 font-medium">{aiResponse.summaryText}</p>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <CloudRain className="w-3.5 h-3.5" /> Weather & AQI Contextual Triggers:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {aiResponse.weatherContextualTriggers?.map((tr: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-white font-bold block">{tr.trigger}</span>
                    <span className="text-[10px] text-slate-400 block">{tr.action}</span>
                    <span className="text-[10px] text-emerald-400 font-bold block">Multiplier: {tr.multiplier}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Module 22: Tax Compliance Calculator & FBR Form 164 Certificate Engine */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-400" /> FBR Tax Compliance & Form 164 Certificate Engine
            </h3>
            <p className="text-xs text-slate-400">Calculate PRA 16% PST sales tax & FBR Section 153 Withholding Tax deductions</p>
          </div>

          <button
            onClick={handleExportForm164Cert}
            className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" /> Form 164 PDF Cert
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Campaign Gross Value (PKR)</label>
            <input
              type="number"
              step={100000}
              value={taxGross}
              onChange={(e) => setTaxGross(Number(e.target.value))}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Taxpayer Entity Type</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value as any)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"
            >
              <option value="CORPORATE">Corporate Company (3% WHT)</option>
              <option value="INDIVIDUAL">Individual / Sole Proprietor (10% WHT)</option>
            </select>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Net Payable After WHT</span>
            <p className="text-lg font-black text-emerald-400 font-display">{netPayablePkr.toLocaleString()} PKR</p>
            <span className="text-[10px] text-slate-500 block">WHT: -{whtTaxPkr.toLocaleString()} PKR ({whtPct}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
