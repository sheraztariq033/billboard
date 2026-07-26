import React, { useState } from 'react';
import { Tv, BarChart2, Download, CheckCircle2, Calendar, Clock, ShieldCheck, Zap, Award, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { exportCommercialPdf } from '../utils/exportPdf';

export const AnalyticsAdminEnterprise: React.FC = () => {
  const { showToast } = useToast();
  const [selectedChannel, setSelectedChannel] = useState('GEO_NEWS');
  const [selectedSlot, setSelectedSlot] = useState('BULLETIN_9PM');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCertificate = () => {
    setIsExporting(true);
    const html = `
      <div style="padding: 15px; background: #ecfdf5; border-radius: 8px; margin-bottom: 20px;">
        <h3>OFFICIAL CERTIFICATE OF BROADCAST PLAYBACK</h3>
        <p>Broadcast Channel: <strong>GEO NEWS HD</strong> • Verification Audit ID: <strong>CERT-TV-991204</strong></p>
      </div>
      <table class="table">
        <thead><tr><th>Broadcaster Spot</th><th>Air Timestamp</th><th>Verified Impressions</th></tr></thead>
        <tbody>
          <tr><td>9 PM Prime News Bulletin Commercial Break</td><td>Sep 15, 2026 • 21:14:05 PKT</td><td>4.8 Million Viewers</td></tr>
          <tr><td>Talkshow L-Banner Graphic Overlay</td><td>Sep 15, 2026 • 22:30:12 PKT</td><td>2.1 Million Viewers</td></tr>
        </tbody>
      </table>
    `;
    exportCommercialPdf('Official Certificate of Broadcast Playback', html);
    showToast('Exporting Verified Certificate of Playback PDF...', 'success');
    setTimeout(() => setIsExporting(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Enterprise Header */}
      <div className="glass-panel p-6 border border-cyan-500/30 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/20 text-cyan-400 text-xs font-black mb-2">
              <Tv className="w-3.5 h-3.5" /> Enterprise TV & Attribution Suite
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">TV Commercial Broadcast & Attribution</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Schedule broadcast spots across Geo, ARY & Hum TV, measure location SDK footfall lift & export verified Certificate of Playback</p>
          </div>

          <button
            onClick={handleExportCertificate}
            disabled={isExporting}
            className="px-6 py-3.5 btn-emerald text-xs font-extrabold flex items-center justify-center gap-2 shadow-xl cursor-pointer"
          >
            {isExporting ? (
              <>
                <Award className="w-4 h-4 animate-spin" /> Generating Certificate...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> Download Certificate of Playback (PDF)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Scheduler Grid */}
      <div className="glass-panel p-6 border border-white/[0.08] space-y-5">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Tv className="w-5 h-5 text-cyan-400" /> Broadcast TV Network Commercial Spot Scheduler
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'GEO_NEWS', name: 'Geo News HD', badge: '9 PM Bulletin Peak' },
            { id: 'ARY_DIGITAL', name: 'ARY Digital', badge: 'Prime Drama Slot' },
            { id: 'HUM_TV', name: 'Hum TV', badge: 'Family Entertainment' },
            { id: 'PTV_SPORTS', name: 'PTV Sports HD', badge: 'PSL Cricket Tickering' },
          ].map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => setSelectedChannel(ch.id)}
              className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                selectedChannel === ch.id
                  ? 'bg-cyan-600/30 border-cyan-500 text-white font-extrabold shadow-md'
                  : 'bg-og-bg border-white/[0.06] text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-sm font-bold block text-white">{ch.name}</span>
              <span className="text-[10px] text-cyan-300 font-semibold">{ch.badge}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
