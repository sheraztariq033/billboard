import React, { useState } from 'react';
import { Users, BarChart3, PieChart, Sparkles, TrendingUp } from 'lucide-react';

export const AudienceDemographicsCard: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<'Lahore' | 'Karachi' | 'Islamabad'>('Lahore');

  const demoData = {
    Lahore: {
      gender: { male: 58, female: 42 },
      age: { '18-24': 35, '25-34': 45, '35+': 20 },
      secGroup: { 'SEC A': 40, 'SEC B': 45, 'SEC C': 15 },
      topInterests: 'FMCG, Dining, Fashion, Automotives',
    },
    Karachi: {
      gender: { male: 62, female: 38 },
      age: { '18-24': 30, '25-34': 50, '35+': 20 },
      secGroup: { 'SEC A': 35, 'SEC B': 50, 'SEC C': 15 },
      topInterests: 'Finance, Food Delivery, Tech, Logistics',
    },
    Islamabad: {
      gender: { male: 54, female: 46 },
      age: { '18-24': 40, '25-34': 40, '35+': 20 },
      secGroup: { 'SEC A': 55, 'SEC B': 35, 'SEC C': 10 },
      topInterests: 'Real Estate, Government, Coffee, Telecom',
    },
  };

  const active = demoData[selectedCity];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Audience & Demographic Intelligence</h3>
            <p className="text-xs text-slate-400">Real-time target audience breakdowns for prime DOOH hotspots.</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          {(['Lahore', 'Karachi', 'Islamabad'] as const).map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                selectedCity === city ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        {/* Gender Break */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
          <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Gender Split</span>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between font-bold text-white mb-1">
                <span>Male</span>
                <span className="text-emerald-400">{active.gender.male}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full" style={{ width: `${active.gender.male}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between font-bold text-white mb-1">
                <span>Female</span>
                <span className="text-indigo-400">{active.gender.female}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-400 h-full" style={{ width: `${active.gender.female}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Age Groups */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
          <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Age Distribution</span>
          <div className="space-y-2">
            {Object.entries(active.age).map(([grp, val]) => (
              <div key={grp}>
                <div className="flex justify-between font-bold text-white mb-1">
                  <span>{grp} yrs</span>
                  <span className="text-amber-400">{val}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full" style={{ width: `${val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SEC Group */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
          <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Socioeconomic Class (SEC)</span>
          <div className="space-y-2">
            {Object.entries(active.secGroup).map(([sec, val]) => (
              <div key={sec}>
                <div className="flex justify-between font-bold text-white mb-1">
                  <span>{sec}</span>
                  <span className="text-rose-400">{val}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-400 h-full" style={{ width: `${val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-855 p-3.5 rounded-xl flex items-center justify-between text-xs">
        <span className="text-slate-400 font-semibold">Top Targeted Interests:</span>
        <span className="font-extrabold text-white">{active.topInterests}</span>
      </div>
    </div>
  );
};
