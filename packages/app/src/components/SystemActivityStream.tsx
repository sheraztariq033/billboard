import React, { useState, useEffect } from 'react';
import { Activity, Clock, ShieldCheck, DollarSign, Image, Heart } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'BOOKING' | 'VERIFICATION' | 'TAX_COMPLIANCE' | 'PAYOUT';
  message: string;
  timestamp: string;
  amount?: string;
}

export const SystemActivityStream: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([
    { id: 'act_1', type: 'BOOKING', message: 'Main Boulevard Gulberg III Digital SMD booked by advertiser@omnigrid.pk', timestamp: '2 mins ago', amount: 'Rs. 950,000' },
    { id: 'act_2', type: 'VERIFICATION', message: 'Geotagged photographic verification upload approved for Clifton block 2 Flyover', timestamp: '5 mins ago' },
    { id: 'act_3', type: 'TAX_COMPLIANCE', message: 'FBR Form 164 Tax Certificate generated successfully for advertiser', timestamp: '12 mins ago' },
    { id: 'act_4', type: 'PAYOUT', message: 'Waterfall commission payout released to owner_default (Rs. 875,000)', timestamp: '24 mins ago', amount: 'Rs. 875,000' },
  ]);

  useEffect(() => {
    const generator = setInterval(() => {
      const types = ['BOOKING', 'VERIFICATION', 'TAX_COMPLIANCE', 'PAYOUT'] as const;
      const randType = types[Math.floor(Math.random() * types.length)];
      
      let msg = 'System transaction registered';
      let amt = undefined;
      
      if (randType === 'BOOKING') {
        msg = 'Blue Area Jinnah Avenue Unipole spot booked for commercial campaign';
        amt = 'Rs. 280,000';
      } else if (randType === 'VERIFICATION') {
        msg = 'Geotagged proof photo upload verified in Gulberg Lahore';
      } else if (randType === 'TAX_COMPLIANCE') {
        msg = 'PRA 16% Provincial Sales Tax invoice dispatched to FBR portal';
      } else if (randType === 'PAYOUT') {
        msg = 'Platform waterfall share split completed and escrow cleared';
        amt = 'Rs. 18,500';
      }

      const newItem: ActivityItem = {
        id: `act_${Date.now()}`,
        type: randType,
        message: msg,
        timestamp: 'Just now',
        amount: amt,
      };

      setActivities((prev) => [newItem, ...prev.slice(0, 4)]);
    }, 9000);

    return () => clearInterval(generator);
  }, []);

  const badgeColors = {
    BOOKING: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    VERIFICATION: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    TAX_COMPLIANCE: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    PAYOUT: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col h-[380px]">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <Activity className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-white">Live Platform Activity Stream</h3>
          <p className="text-xs text-slate-400">Continuous transactional events on the OMNI-GRID Pakistan Edge network.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
        {activities.map((item) => (
          <div key={item.id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-start justify-between gap-4 transition hover:border-slate-700">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${badgeColors[item.type]}`}>
                  {item.type}
                </span>
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {item.timestamp}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-300 leading-relaxed">{item.message}</p>
            </div>

            {item.amount && (
              <span className="font-extrabold text-xs text-amber-400 whitespace-nowrap bg-amber-500/5 px-2 py-1 rounded border border-amber-500/10">
                {item.amount}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
