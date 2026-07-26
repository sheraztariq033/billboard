import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, Users, Layers, DollarSign, Building2, UserPlus, ShieldCheck, Search, Filter, Plus, ArrowUpRight, Lock, Key, FileText, Activity } from 'lucide-react';

export const AdminControlPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'APPROVALS' | 'USERS' | 'SALES' | 'SUB_ACCOUNTS' | 'AUDIT_LOGS'>('APPROVALS');
  const [inspectingNocId, setInspectingNocId] = useState<string | null>(null);

  // Sample Pending Billboard Listings for Approval
  const [pendingAssets, setPendingAssets] = useState([
    {
      id: 'appr_1',
      title: 'DHA Phase 5 Main Commercial Ring SMD',
      city: 'Lahore',
      owner: 'Naseer Billboard Group',
      monthlyRate: 850000,
      dailyTraffic: '1.4M Vehicles',
      category: 'DOOH SMD',
      nocNumber: 'CBD-LHR-2024-8894',
      submittedDate: '2 Hours ago',
    },
    {
      id: 'appr_2',
      title: 'Clifton Block 2 Dual Facing Billboard',
      city: 'Karachi',
      owner: 'Sindh Media Pvt Ltd',
      monthlyRate: 1200000,
      dailyTraffic: '2.1M Vehicles',
      category: 'Roadside OOH',
      nocNumber: 'KMC-KHI-2025-1021',
      submittedDate: '5 Hours ago',
    },
  ]);

  // System Audit Logs (Fixes Audit Problem #96)
  const [auditLogs] = useState([
    { id: 'log_1', timestamp: '10:14 AM', actor: 'Super-Admin (Zainab)', action: 'Approved Asset Listing OG-AST-901', ip: '192.168.100.96' },
    { id: 'log_2', timestamp: '09:45 AM', actor: 'System Auto Escrow', action: 'Released 450,000 PKR to Media Owner #881', ip: 'System Cron' },
    { id: 'log_3', timestamp: 'Yesterday', actor: 'Sales Exec (Ali Raza)', action: 'Onboarded Client PepsiCo Sub-Account', ip: '39.42.18.11' },
  ]);

  // Sales Agents
  const [salesAgents] = useState([
    { id: 'agent_1', name: 'Ali Raza', territory: 'Lahore & Central Punjab', commissionTier: '5.0%', closedDealsPkr: 14500000, activeClients: 18, status: 'Top Performer' },
    { id: 'agent_2', name: 'Usman Farooq', territory: 'Karachi & South Hub', commissionTier: '6.0%', closedDealsPkr: 22000000, activeClients: 24, status: 'Senior Executive' },
  ]);

  // Sub-Accounts
  const [subAccounts] = useState([
    { id: 'sub_1', orgName: 'PepsiCo Pakistan Brand Team', masterAccount: 'brand_admin@pepsi.pk', memberCount: 6, assignedRole: 'Enterprise Brand Manager', permissions: ['Campaign Launch', 'Escrow Deposit', 'Attribution Analytics'] },
    { id: 'sub_2', orgName: 'Ogilvy Pakistan Media Agency', masterAccount: 'planning@ogilvy.pk', memberCount: 14, assignedRole: 'Media Buyer Agency', permissions: ['Inventory Hold', 'Multi-Client Billing', 'Export PDF'] },
  ]);

  const handleApproveAsset = (id: string) => {
    setPendingAssets(pendingAssets.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Super-Admin Header Banner */}
      <div className="glass-panel p-6 border border-rose-500/30 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/20 text-rose-400 text-xs font-black mb-2">
              <ShieldAlert className="w-3.5 h-3.5" /> Super-Admin Operations & System Audit
            </div>
            <h2 className="text-2xl font-black font-display text-slate-900 dark:text-white">Platform Master Control</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Audit civic NOC documents, approve listings, track sales team commissions & review system audit logs</p>
          </div>

          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold w-fit">
            ● Network Operational
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="glass-panel p-1.5 flex flex-wrap gap-1 border border-white/[0.08]">
        <button
          onClick={() => setActiveTab('APPROVALS')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'APPROVALS' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" /> Asset Approval Queue ({pendingAssets.length})
        </button>

        <button
          onClick={() => setActiveTab('AUDIT_LOGS')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'AUDIT_LOGS' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" /> System Audit Logs
        </button>

        <button
          onClick={() => setActiveTab('SALES')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'SALES' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" /> Sales Team & Commissions
        </button>

        <button
          onClick={() => setActiveTab('SUB_ACCOUNTS')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'SUB_ACCOUNTS' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" /> Enterprise Sub-Accounts
        </button>
      </div>

      {/* Tab 1: Asset Approval Queue & NOC Inspector */}
      {activeTab === 'APPROVALS' && (
        <div className="glass-panel p-6 border border-white/[0.08] space-y-4">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-rose-400" /> Pending Asset Submissions & NOC Inspector
          </h3>

          {pendingAssets.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">All asset submissions have been reviewed!</p>
          ) : (
            <div className="space-y-3">
              {pendingAssets.map((asset) => (
                <div key={asset.id} className="p-4 rounded-xl bg-og-bg/80 border border-white/[0.06] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {asset.category} • Submitted {asset.submittedDate}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">{asset.title}</h4>
                      <p className="text-xs text-slate-400">
                        Owner: <strong className="text-slate-300">{asset.owner}</strong> • NOC Permit #: <strong className="text-emerald-400">{asset.nocNumber}</strong> • Rate: <strong className="text-emerald-400">{asset.monthlyRate.toLocaleString()} PKR/mo</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setInspectingNocId(inspectingNocId === asset.id ? null : asset.id)}
                        className="px-3 py-2 bg-white/[0.05] hover:bg-white/[0.10] text-xs font-bold text-slate-300 rounded-xl cursor-pointer flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5 text-indigo-400" /> {inspectingNocId === asset.id ? 'Close NOC' : 'Inspect NOC PDF'}
                      </button>

                      <button
                        onClick={() => handleApproveAsset(asset.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl flex items-center gap-1 shadow-md cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve & Publish
                      </button>
                    </div>
                  </div>

                  {/* NOC Document Inspector Box (Fixes Audit Problem #93) */}
                  {inspectingNocId === asset.id && (
                    <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 text-xs space-y-2 animate-fade-in">
                      <div className="flex justify-between items-center text-emerald-400 font-bold border-b border-white/10 pb-1.5">
                        <span>CIVIC MUNICIPAL CORPORATION OFFICIAL NOC RECORD</span>
                        <span>PERMIT NO: {asset.nocNumber}</span>
                      </div>
                      <p className="text-slate-300">Property <strong className="text-white">{asset.title}</strong> has passed civic structural safety tests and Cantonment Board commercial zoning bylaws for 2026–2027.</p>
                      <span className="text-[10px] text-slate-400 block">Verified Escrow Auditor: System Automated Compliance Engine</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: System Operations Audit Logs (Fixes Audit Problem #96) */}
      {activeTab === 'AUDIT_LOGS' && (
        <div className="glass-panel p-6 border border-white/[0.08] space-y-4">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" /> Immutable System Operations Audit Trail
          </h3>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-xl bg-og-bg/80 border border-white/[0.06] flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white">{log.actor}</span>
                  <p className="text-slate-400 mt-0.5">{log.action}</p>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold block">{log.timestamp}</span>
                  <span className="text-[10px] text-slate-500 font-mono">IP: {log.ip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Sales Team & Commissions */}
      {activeTab === 'SALES' && (
        <div className="glass-panel p-6 border border-white/[0.08] space-y-4">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" /> Sales Representatives & Commission Ledger
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-og-bg/80 text-slate-400 uppercase font-bold tracking-wider border-b border-white/[0.06]">
                <tr>
                  <th className="p-3.5">Agent Name</th>
                  <th className="p-3.5">Territory</th>
                  <th className="p-3.5">Commission</th>
                  <th className="p-3.5">Closed Volume</th>
                  <th className="p-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {salesAgents.map((agent) => (
                  <tr key={agent.id}>
                    <td className="p-3.5 font-bold text-white">{agent.name}</td>
                    <td className="p-3.5 text-slate-400">{agent.territory}</td>
                    <td className="p-3.5 font-black text-emerald-400">{agent.commissionTier}</td>
                    <td className="p-3.5 font-black text-white">{agent.closedDealsPkr.toLocaleString()} PKR</td>
                    <td className="p-3.5 text-right"><span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-bold">{agent.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
