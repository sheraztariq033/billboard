import React, { useState } from 'react';
import { ShieldAlert, Award, FileText, CheckCircle2, XCircle, Users, BarChart2, Search, Eye, AlertCircle, Sparkles, Code, Key, Copy } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const AdminControlPortal: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'NOC_APPROVALS' | 'AUDIT_LOGS' | 'DEVELOPER_PORTAL'>('NOC_APPROVALS');
  const [searchAudit, setSearchAudit] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);

  const [pendingAssets, setPendingAssets] = useState([
    { id: 'lhr_3', title: 'Liberty Chowk Quad Face SMD', owner: 'Lahore Digital Media Pvt Ltd', city: 'Lahore', noc: 'MCL-LHR-2024-991', status: 'PENDING' },
    { id: 'khi_2', title: 'Shahrah-e-Faisal Unipole', owner: 'Karachi OOH Network', city: 'Karachi', noc: 'KMC-KHI-2024-442', status: 'PENDING' },
  ]);

  const auditLogs = [
    { id: 'log_1', action: 'NOC_VERIFIED', user: 'Admin (System)', details: 'MCL NOC MCL-LHR-2024-884 verified & approved', time: '10 mins ago' },
    { id: 'log_2', action: 'ESCROW_RELEASED', user: 'System Escrow Bot', details: 'Released 950,000 PKR to Media Owner IBAN PK88...91', time: '45 mins ago' },
    { id: 'log_3', action: 'PROOF_APPROVED', user: 'Verification Engine', details: 'WebRTC photo proof #proof_9912 verified with RSA EXIF', time: '2 hours ago' },
  ];

  const apiEndpoints = [
    { method: 'GET', path: '/api/health', desc: 'Edge Engine Status Check', rate: '100 req/min' },
    { method: 'GET', path: '/api/assets', desc: 'List Omnichannel Ad Inventory', rate: '100 req/min' },
    { method: 'POST', path: '/api/campaigns/bookings', desc: 'Create Campaign Booking & Escrow Lock', rate: '50 req/min' },
    { method: 'POST', path: '/api/creators/calculate-rate', desc: 'Calculate Creator CPM Rate Card', rate: '50 req/min' },
    { method: 'POST', path: '/api/verification/upload', desc: 'Upload Geotagged Proof Photo', rate: '30 req/min' },
    { method: 'GET', path: '/api/docs/openapi.json', desc: 'OpenAPI 3.0 JSON Specification', rate: 'Unlimited' },
  ];

  const handleApprove = (id: string, title: string) => {
    setPendingAssets((prev) => prev.filter((a) => a.id !== id));
    showToast(`Listing "${title}" Approved & Municipal NOC Verified!`, 'success');
  };

  const handleReject = (id: string, title: string) => {
    setPendingAssets((prev) => prev.filter((a) => a.id !== id));
    showToast(`Listing "${title}" Rejected. Notification sent to owner.`, 'info');
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText('og_live_pk_8f93a1194b284e9a01b2394');
    setCopiedKey(true);
    showToast('API Production Key copied to clipboard!', 'success');
    setTimeout(() => setCopiedKey(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-rose-500/30 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/20 text-rose-400 text-xs font-black mb-2">
              <ShieldAlert className="w-3.5 h-3.5" /> Super-Admin Operations Portal
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">Platform Control & Developer Portal</h2>
            <p className="text-xs text-slate-400 mt-1">Review pending asset listings, inspect municipal NOC permits & access Developer API keys</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-right min-w-[180px]">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Pending Approvals</span>
            <p className="text-2xl font-black text-rose-400 font-display">{pendingAssets.length} Listings</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800">
        <button
          onClick={() => setActiveTab('NOC_APPROVALS')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'NOC_APPROVALS' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" /> Pending NOC ({pendingAssets.length})
        </button>

        <button
          onClick={() => setActiveTab('AUDIT_LOGS')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'AUDIT_LOGS' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" /> Audit Logs
        </button>

        <button
          onClick={() => setActiveTab('DEVELOPER_PORTAL')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'DEVELOPER_PORTAL' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code className="w-4 h-4" /> Developer API & Keys
        </button>
      </div>

      {/* Tab 1: NOC Approvals */}
      {activeTab === 'NOC_APPROVALS' && (
        <div className="space-y-4">
          {pendingAssets.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              All pending asset listings and municipal NOC permits have been verified!
            </div>
          ) : (
            pendingAssets.map((asset) => (
              <div key={asset.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white">{asset.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{asset.owner} • {asset.city}</p>
                  <span className="inline-block mt-2 px-2.5 py-1 rounded bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold">
                    NOC Permit: {asset.noc}
                  </span>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleApprove(asset.id, asset.title)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve Listing
                  </button>

                  <button
                    onClick={() => handleReject(asset.id, asset.title)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Audit Logs */}
      {activeTab === 'AUDIT_LOGS' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">System Operations Audit Trail</h3>
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Filter logs..."
                value={searchAudit}
                onChange={(e) => setSearchAudit(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold">
                      {log.action}
                    </span>
                    <strong className="text-white">{log.user}</strong>
                  </div>
                  <p className="text-slate-400 mt-1">{log.details}</p>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Module 31: Tab 3: Developer Portal & API Explorer */}
      {activeTab === 'DEVELOPER_PORTAL' && (
        <div className="space-y-5">
          {/* API Key Box */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-400" /> Production API Secret Key
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Use this bearer key to authenticate third-party programmatic campaign integrations</p>
              </div>

              <button
                onClick={handleCopyKey}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" /> {copiedKey ? 'Copied!' : 'Copy Secret Key'}
              </button>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 flex items-center justify-between">
              <span>og_live_pk_8f93a1194b284e9a01b2394</span>
              <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">Active • 100 req/min</span>
            </div>
          </div>

          {/* Interactive Endpoint Explorer */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-400" /> Interactive OpenAPI 3.0 Endpoints
              </h3>
              <a
                href="/api/docs/openapi.json"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-400 font-bold hover:underline"
              >
                Open Raw OpenAPI JSON
              </a>
            </div>

            <div className="space-y-2.5">
              {apiEndpoints.map((ep, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded font-mono font-black text-[10px] ${
                      ep.method === 'GET' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                    }`}>
                      {ep.method}
                    </span>
                    <code className="text-white font-mono font-bold">{ep.path}</code>
                    <span className="text-slate-400 hidden md:inline">• {ep.desc}</span>
                  </div>

                  <span className="text-[10px] text-slate-500 font-mono self-end sm:self-auto">Rate Limit: {ep.rate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
