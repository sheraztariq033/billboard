import React, { useState } from 'react';
import { Layers, Plus, TrendingUp, DollarSign, Calendar, MapPin, CheckCircle2, Clock, FileText, Zap, ShieldCheck, AlertTriangle, Tool, CreditCard, ChevronRight, Settings } from 'lucide-react';

interface AssetListing {
  id: string;
  title: string;
  type: string;
  location: string;
  city: string;
  monthlyRate: number;
  occupancyRate: number;
  nocStatus: 'VERIFIED' | 'PENDING' | 'RENEWAL_DUE';
  nocLicenseNo: string;
  nocExpiry: string;
  powerStatus: string;
}

export const VendorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'LISTINGS' | 'NOC_TRACKER' | 'TICKETS' | 'PAYOUTS'>('LISTINGS');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [assets, setAssets] = useState<AssetListing[]>([
    {
      id: 'ast_1',
      title: 'Main Boulevard Gulberg Digital SMD',
      type: 'DOOH SMD Screen',
      location: 'Main Boulevard, Gulberg III',
      city: 'Lahore',
      monthlyRate: 950000,
      occupancyRate: 94,
      nocStatus: 'VERIFIED',
      nocLicenseNo: 'MCL-LHR-2024-884',
      nocExpiry: 'Dec 31, 2027',
      powerStatus: 'Solar + Grid Backup (100% Uptime)',
    },
    {
      id: 'ast_2',
      title: 'DHA Phase 5 Commercial Ring Unipole',
      type: 'Static Roadside Billboard',
      location: 'DHA Phase 5 Ring Road Exit',
      city: 'Lahore',
      monthlyRate: 750000,
      occupancyRate: 88,
      nocStatus: 'VERIFIED',
      nocLicenseNo: 'CBD-DHA-2025-102',
      nocExpiry: 'Nov 15, 2026',
      powerStatus: 'Dual Halogen LED Lights',
    },
    {
      id: 'ast_3',
      title: 'Clifton Block 2 Flyover Dual Facing SMD',
      type: 'DOOH SMD Screen',
      location: 'Clifton Flyover Main Intersection',
      city: 'Karachi',
      monthlyRate: 1200000,
      occupancyRate: 100,
      nocStatus: 'VERIFIED',
      nocLicenseNo: 'KMC-KHI-2024-991',
      nocExpiry: 'Jan 30, 2028',
      powerStatus: 'Solar Grid Tie (P3.91 4K)',
    },
  ]);

  const [maintenanceTickets, setMaintenanceTickets] = useState([
    { id: 'tck_1', asset: 'Main Boulevard Gulberg Digital SMD', issue: 'SMD Module P3.91 Replacement (Tile 4B)', priority: 'HIGH', status: 'IN_PROGRESS', date: 'Yesterday' },
    { id: 'tck_2', asset: 'DHA Phase 5 Commercial Ring Unipole', issue: 'Frontlit LED Floodlight Power Fuse Trip', priority: 'MEDIUM', status: 'RESOLVED', date: '3 Days ago' },
  ]);

  // New Asset Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCity, setNewCity] = useState('Lahore');
  const [newRate, setNewRate] = useState('500000');
  const [newNoc, setNewNoc] = useState('');

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const created: AssetListing = {
      id: `ast_${Date.now()}`,
      title: newTitle,
      type: 'DOOH SMD Screen',
      location: 'Commercial District',
      city: newCity,
      monthlyRate: parseInt(newRate) || 500000,
      occupancyRate: 0,
      nocStatus: 'PENDING',
      nocLicenseNo: newNoc || 'PENDING-SUBMISSION',
      nocExpiry: 'Pending Verification',
      powerStatus: 'Grid Backup Available',
    };
    setAssets([created, ...assets]);
    setNewTitle('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="glass-panel p-6 border border-emerald-500/30 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-black mb-2">
              <Layers className="w-3.5 h-3.5" /> Asset Owner ERP & Yield Management
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">Media Owner Command ERP</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage billboards, track civic NOC permits, raise maintenance tickets & receive automated IBAN payouts</p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3.5 btn-emerald text-xs font-extrabold flex items-center justify-center gap-2 shadow-xl cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add New Ad Property
          </button>
        </div>
      </div>

      {/* Financial Yield KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 border border-white/[0.08] space-y-1">
          <span className="text-xs text-slate-400 font-semibold block">Total Monthly Yield</span>
          <p className="text-2xl font-black text-emerald-400 font-display">2,900,000 PKR</p>
          <span className="text-[11px] text-emerald-300 font-bold block">+14% Growth vs Last Month</span>
        </div>

        <div className="glass-panel p-5 border border-white/[0.08] space-y-1">
          <span className="text-xs text-slate-400 font-semibold block">Average Occupancy Rate</span>
          <p className="text-2xl font-black text-white font-display">94.2%</p>
          <span className="text-[11px] text-indigo-400 font-bold block">3 Properties Active</span>
        </div>

        <div className="glass-panel p-5 border border-white/[0.08] space-y-1">
          <span className="text-xs text-slate-400 font-semibold block">NOC Compliance Status</span>
          <p className="text-2xl font-black text-emerald-400 font-display">100% Verified</p>
          <span className="text-[11px] text-emerald-300 font-bold block">All Municipal Permits Current</span>
        </div>

        <div className="glass-panel p-5 border border-white/[0.08] space-y-1">
          <span className="text-xs text-slate-400 font-semibold block">Next Scheduled Payout</span>
          <p className="text-2xl font-black text-amber-400 font-display">Oct 1, 2026</p>
          <span className="text-[11px] text-amber-300 font-bold block">HBL Escrow Account</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="glass-panel p-1.5 flex flex-wrap gap-1 border border-white/[0.08]">
        <button
          onClick={() => setActiveTab('LISTINGS')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'LISTINGS' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" /> Active Ad Properties ({assets.length})
        </button>

        <button
          onClick={() => setActiveTab('NOC_TRACKER')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'NOC_TRACKER' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" /> Civic NOC & Permits
        </button>

        <button
          onClick={() => setActiveTab('TICKETS')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'TICKETS' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" /> Hardware & Maintenance Tickets ({maintenanceTickets.length})
        </button>

        <button
          onClick={() => setActiveTab('PAYOUTS')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'PAYOUTS' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-4 h-4" /> IBAN Bank Payout Setup
        </button>
      </div>

      {/* Tab 1: Active Listings */}
      {activeTab === 'LISTINGS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assets.map((asset) => (
              <div key={asset.id} className="glass-panel p-5 border border-white/[0.08] space-y-4 hover:border-emerald-500/40 transition">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {asset.type}
                  </span>
                  <span className="text-xs font-black text-emerald-400">{asset.occupancyRate}% Occupied</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">{asset.title}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> {asset.location}, {asset.city}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-og-bg/80 border border-white/[0.06] space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Monthly Revenue Rate:</span>
                    <strong className="text-white">{asset.monthlyRate.toLocaleString()} PKR</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>NOC License #:</span>
                    <strong className="text-emerald-400">{asset.nocLicenseNo}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Power Hardware:</span>
                    <strong className="text-slate-300 truncate">{asset.powerStatus}</strong>
                  </div>
                </div>

                <button className="w-full py-2.5 bg-white/[0.05] hover:bg-white/[0.10] text-white border border-white/[0.08] text-xs font-extrabold rounded-xl transition cursor-pointer flex items-center justify-center gap-1">
                  Manage Lease & Specs <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Civic NOC Tracker */}
      {activeTab === 'NOC_TRACKER' && (
        <div className="glass-panel p-6 border border-white/[0.08] space-y-4">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" /> Civic NOC & Municipal Authority Registry
          </h3>

          <div className="space-y-3">
            {assets.map((asset) => (
              <div key={asset.id} className="p-4 rounded-xl bg-og-bg/80 border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px] border border-emerald-500/20">
                      {asset.nocStatus}
                    </span>
                    <span className="text-xs font-bold text-slate-400">License: {asset.nocLicenseNo}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">{asset.title}</h4>
                  <p className="text-xs text-slate-400">Authority: Cantonment / Metropolitan Corp • Expiry: <strong className="text-white">{asset.nocExpiry}</strong></p>
                </div>

                <button className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.10] text-xs font-extrabold text-white rounded-xl border border-white/[0.08] cursor-pointer">
                  View Uploaded Permit PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Maintenance Tickets */}
      {activeTab === 'TICKETS' && (
        <div className="glass-panel p-6 border border-white/[0.08] space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" /> Maintenance & Repair Log
            </h3>
            <button className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-extrabold rounded-xl cursor-pointer">
              + Raise Maintenance Ticket
            </button>
          </div>

          <div className="space-y-3">
            {maintenanceTickets.map((tck) => (
              <div key={tck.id} className="p-4 rounded-xl bg-og-bg/80 border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/20">
                    Priority: {tck.priority}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1">{tck.issue}</h4>
                  <p className="text-xs text-slate-400">{tck.asset} • Reported {tck.date}</p>
                </div>
                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-extrabold rounded-lg border border-indigo-500/20 w-fit">
                  {tck.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Listing Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg glass-panel p-6 space-y-5 animate-scale-in border border-emerald-500/30">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-extrabold text-white">Add New Billboard / SMD Listing</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddAsset} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Asset Title / Name</label>
                <input
                  type="text"
                  placeholder="e.g. Liberty Roundabout P3.91 SMD Screen"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-3 bg-og-surface border border-white/[0.10] rounded-xl text-xs text-white outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">City</label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full p-3 bg-og-surface border border-white/[0.10] rounded-xl text-xs text-white outline-none"
                  >
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Multan">Multan</option>
                    <option value="Peshawar">Peshawar</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Monthly Rate (PKR)</label>
                  <input
                    type="number"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    className="w-full p-3 bg-og-surface border border-white/[0.10] rounded-xl text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Civic NOC License Number</label>
                <input
                  type="text"
                  placeholder="e.g. MCL-LHR-2026-904"
                  value={newNoc}
                  onChange={(e) => setNewNoc(e.target.value)}
                  className="w-full p-3 bg-og-surface border border-white/[0.10] rounded-xl text-xs text-white outline-none"
                />
              </div>

              <button type="submit" className="w-full py-3.5 btn-emerald text-xs font-extrabold shadow-xl cursor-pointer">
                Submit Property for Moderation Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
