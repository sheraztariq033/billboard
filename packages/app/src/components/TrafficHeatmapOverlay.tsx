import React, { useState } from 'react';
import { Flame, MapPin, TrendingUp, Users, Car, Zap } from 'lucide-react';

interface HeatmapProps {
  cityName?: string;
}

export const TrafficHeatmapOverlay: React.FC<HeatmapProps> = ({ cityName = 'Lahore' }) => {
  const [selectedZone, setSelectedZone] = useState<'Gulberg' | 'Clifton' | 'BlueArea'>('Gulberg');

  const zones = {
    Gulberg: {
      city: 'Lahore',
      area: 'Main Boulevard Gulberg III',
      hourlyDensity: [40, 30, 20, 15, 10, 25, 65, 95, 90, 75, 80, 85, 90, 85, 80, 85, 95, 100, 95, 85, 75, 60, 50, 45],
      peakTime: '6:00 PM - 9:00 PM',
      avgSpeedKm: '18 km/h (High Dwell Time)',
      dailyImpressions: '1,200,000+',
      color: '#f59e0b',
    },
    Clifton: {
      city: 'Karachi',
      area: 'Clifton Block 2 Flyover',
      hourlyDensity: [35, 25, 15, 10, 15, 30, 70, 100, 95, 80, 85, 90, 95, 90, 85, 90, 100, 100, 90, 80, 70, 55, 45, 40],
      peakTime: '5:30 PM - 8:30 PM',
      avgSpeedKm: '12 km/h (Maximum Dwell Time)',
      dailyImpressions: '2,100,000+',
      color: '#ef4444',
    },
    BlueArea: {
      city: 'Islamabad',
      area: 'Blue Area Jinnah Avenue',
      hourlyDensity: [20, 15, 10, 5, 10, 20, 55, 85, 80, 70, 75, 80, 85, 80, 75, 80, 85, 90, 75, 65, 50, 35, 25, 20],
      peakTime: '8:00 AM - 10:00 AM & 5:00 PM - 7:00 PM',
      avgSpeedKm: '35 km/h (Moderate Dwell Time)',
      dailyImpressions: '850,000+',
      color: '#10b981',
    },
  };

  const active = zones[selectedZone];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">
              Traffic & Impression Heatmap Analytics
            </h3>
            <p className="text-xs text-slate-400">
              Hourly vehicular density & dwell time heatmaps for OOH/DOOH screens.
            </p>
          </div>
        </div>

        {/* Zone Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          {(['Gulberg', 'Clifton', 'BlueArea'] as const).map((z) => (
            <button
              key={z}
              onClick={() => setSelectedZone(z)}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                selectedZone === z ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              {z === 'BlueArea' ? 'Blue Area (ISB)' : z + (z === 'Gulberg' ? ' (LHR)' : ' (KHI)')}
            </button>
          ))}
        </div>
      </div>

      {/* Hourly Density Bar Chart */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300">HOURLY TRAFFIC DENSITY PROFILE (24-HOUR)</span>
          <span className="text-amber-400 font-bold">Peak: {active.peakTime}</span>
        </div>

        <div className="h-32 flex items-end gap-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
          {active.hourlyDensity.map((val, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
              <div
                className="w-full rounded-t transition-all duration-500 hover:brightness-125"
                style={{
                  height: `${val}%`,
                  backgroundColor: val > 85 ? '#ef4444' : val > 65 ? '#f59e0b' : '#10b981',
                }}
              />
              <span className="text-[9px] text-slate-500 font-mono">{idx}h</span>

              {/* Tooltip */}
              <div className="absolute -top-10 hidden group-hover:flex bg-slate-900 border border-slate-700 px-2 py-1 rounded text-[10px] text-white font-bold whitespace-nowrap z-20 shadow-lg">
                {idx}:00 — {val}% Congestion
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 block text-[10px] font-semibold">LOCATION AREA</span>
          <span className="text-white font-bold text-sm truncate block mt-0.5">{active.area}</span>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 block text-[10px] font-semibold">AVERAGE TRAFFIC SPEED</span>
          <span className="text-emerald-400 font-bold text-sm truncate block mt-0.5">{active.avgSpeedKm}</span>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 block text-[10px] font-semibold">DAILY IMPRESSIONS</span>
          <span className="text-amber-400 font-bold text-sm truncate block mt-0.5">{active.dailyImpressions}</span>
        </div>
      </div>
    </div>
  );
};
