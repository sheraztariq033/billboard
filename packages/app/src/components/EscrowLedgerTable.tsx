import React, { useState } from 'react';
import { DollarSign, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface LedgerItem {
  id: string;
  advertiser: string;
  owner: string;
  campaign: string;
  lockedAmount: string;
  status: 'LOCKED' | 'RELEASED' | 'REFUNDED';
  date: string;
}

export const EscrowLedgerTable: React.FC = () => {
  const [ledger, setLedger] = useState<LedgerItem[]>([
    { id: 'esc_101', advertiser: 'PepsiCo Pakistan', owner: 'default_owner', campaign: 'Ramadan Beverage Launch', lockedAmount: 'Rs. 950,000', status: 'RELEASED', date: '2026-07-26' },
    { id: 'esc_102', advertiser: 'Telenor PK Office', owner: 'default_owner', campaign: '5G Freedom Campaign', lockedAmount: 'Rs. 1,200,000', status: 'LOCKED', date: '2026-07-27' },
    { id: 'esc_103', advertiser: 'Emaar Properties PK', owner: 'default_owner', campaign: 'Luxury Res Block B Launch', lockedAmount: 'Rs. 750,000', status: 'LOCKED', date: '2026-07-27' },
  ]);

  const badgeColors = {
    LOCKED: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    RELEASED: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    REFUNDED: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Escrow Payment & Payout Ledger</h3>
            <p className="text-xs text-slate-400">Track locked commercial booking deposits and platform commission waterfalls.</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto text-xs">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-bold">
              <th className="py-2.5 px-3">ESCROW ID</th>
              <th className="py-2.5 px-3">CLIENT</th>
              <th className="py-2.5 px-3">CAMPAIGN</th>
              <th className="py-2.5 px-3">DEPOSIT</th>
              <th className="py-2.5 px-3">STATUS</th>
              <th className="py-2.5 px-3">DATE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {ledger.map((row) => (
              <tr key={row.id} className="hover:bg-slate-950/40 transition">
                <td className="py-3 px-3 font-mono font-bold text-white">{row.id}</td>
                <td className="py-3 px-3 font-semibold">{row.advertiser}</td>
                <td className="py-3 px-3 truncate max-w-[150px]">{row.campaign}</td>
                <td className="py-3 px-3 font-bold text-emerald-400">{row.lockedAmount}</td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${badgeColors[row.status]}`}>
                    {row.status}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono text-[10px] text-slate-500">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
