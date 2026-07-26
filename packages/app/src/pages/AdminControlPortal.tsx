import React, { useState } from 'react';
import { ShieldAlert, Award, FileText, CheckCircle2, XCircle, Users, BarChart2, Search, Eye, AlertCircle, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const AdminControlPortal: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'NOC_APPROVALS' | 'AUDIT_LOGS' | 'COMMISSIONS'>('NOC_APPROVALS');
  const [searchAudit, setSearchAudit] = useState('');

  const [pendingAssets, setPendingAssets] = useState([
    { id: 'lhr_3', title: 'Liberty Chowk Quad Face SMD', owner: 'Lahore Digital Media Pvt Ltd', city: 'Lahore', noc: 'MCL-LHR-2024-991', status: 'PENDING' },
    { id: 'khi_2', title: 'Shahrah-e-Faisal Unipole', owner: 'Karachi OOH Network', city: 'Karachi', noc: 'KMC-KHI-2024-442', status: 'PENDING' },
  ]);

  const auditLogs = [
    { id: 'log_1', action: 'NOC_VERIFIED', user: 'Admin (System)', details: 'MCL NOC MCL-LHR-2024-884 verified & approved', time: '10 mins ago' },
    { id: 'log_2', action: 'ESCROW_RELEASED', user: 'System Escrow Bot', details: 'Released 950,000 PKR to Media Owner IBAN PK88...91', time: '45 mins ago' },
    { id: 'log_3', action: 'PROOF_APPROVED', user: 'Verification Engine', details: 'WebRTC photo proof #proof_9912 verified with RSA EXIF', time: '2 hours ago' },
  ];

  const handleApprove = (id: string, title: string) => {
    setPendingAssets((prev) => prev.filter((a) => a.id !== id));
    showToast(`Listing "${title}" Approved & Municipal NOC Verified!`, 'success');
  };

  const handleReject = (id: string, title: string) => {
    setPendingAssets((prev) => prev.filter((a) => a.id !== id));
    showToast(`Listing "${title}" Rejected. Notification sent to owner.`, 'info');
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
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">Platform Control & NOC Compliance</h2>
            <p className="text-xs text-slate-400 mt-1">Review pending asset listings, inspect municipal NOC permits & inspect real-time system audit logs</p>
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
          <Award className="w-4 h-4" /> Pending NOC Approvals ({pendingAssets.length})
        </button>

        <button
          onClick={() => setActiveTab('AUDIT_LOGS')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'AUDIT_LOGS' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" /> System Audit Logs
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
                    className="flex-1 sm:flex-none px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1"
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
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
          <h4 className="font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-rose-400" /> Real-Time System Operations Audit Trail
          </h4>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-slate-300">
                <div>
                  <span className="font-bold text-emerald-400 mr-2">[{log.action}]</span>
                  <span>{log.details}</span>
                </div>
                <span className="text-[10px] text-slate-500">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
