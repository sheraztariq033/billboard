import React, { useState } from 'react';
import { Eye, Layers, Sun, Moon, Maximize2, Sparkles, CheckCircle2, RotateCw } from 'lucide-react';

interface SimulatorProps {
  creativeTitle?: string;
  creativeUrl?: string;
  locationName?: string;
}

export const Billboard3dSimulator: React.FC<SimulatorProps> = ({
  creativeTitle = 'Ramadan Premium Beverage 60x20',
  creativeUrl = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
  locationName = 'Main Boulevard Gulberg III, Lahore',
}) => {
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'night'>('night');
  const [lightingGlow, setLightingGlow] = useState<number>(85);
  const [viewAngle, setViewAngle] = useState<'front' | 'perspective'>('perspective');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header Controls */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-extrabold text-white tracking-tight">
            Interactive 3D Billboard Visualizer & Simulator
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            3D REAL-TIME RENDER
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTimeOfDay(timeOfDay === 'day' ? 'night' : 'day')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
          >
            {timeOfDay === 'day' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
            {timeOfDay === 'day' ? 'Daylight Mode' : 'Night Neon Glow'}
          </button>

          <button
            onClick={() => setViewAngle(viewAngle === 'front' ? 'perspective' : 'front')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            {viewAngle === 'perspective' ? 'Perspective 3D' : 'Frontal Orthographic'}
          </button>
        </div>
      </div>

      {/* 3D Render Canvas Container */}
      <div
        className={`relative h-[340px] w-full flex items-center justify-center transition-all duration-700 overflow-hidden ${
          timeOfDay === 'night'
            ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950'
            : 'bg-gradient-to-b from-sky-400 via-sky-200 to-slate-100'
        }`}
      >
        {/* City Skyline Background Graphic */}
        <div className="absolute inset-0 opacity-25 pointer-events-none flex items-end justify-around px-10">
          <div className="w-16 h-48 bg-slate-800 rounded-t-lg" />
          <div className="w-24 h-64 bg-slate-700 rounded-t-lg" />
          <div className="w-20 h-52 bg-slate-800 rounded-t-lg" />
          <div className="w-32 h-72 bg-slate-700 rounded-t-lg" />
          <div className="w-28 h-40 bg-slate-800 rounded-t-lg" />
        </div>

        {/* 3D Billboard Structure */}
        <div
          className={`relative transition-all duration-700 transform ${
            viewAngle === 'perspective' ? 'rotate-y-12 rotate-x-6 scale-95 perspective-1000' : 'scale-100'
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Billboard Frame */}
          <div
            className="relative p-3 bg-slate-900 border-4 border-slate-700 rounded-xl shadow-2xl"
            style={{
              boxShadow: timeOfDay === 'night' ? `0 0 ${lightingGlow}px rgba(16, 185, 129, 0.4)` : '0 20px 40px rgba(0,0,0,0.3)',
            }}
          >
            {/* LED Screen */}
            <div className="relative w-[480px] h-[200px] rounded-lg overflow-hidden border border-slate-800 bg-black">
              <img
                src={creativeUrl}
                alt={creativeTitle}
                className={`w-full h-full object-cover transition-opacity duration-300 ${isSimulating ? 'opacity-100' : 'opacity-20'}`}
              />

              {/* Dynamic Scanlines Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent bg-[length:100%_4px] pointer-events-none" />

              {/* Overlay Badge */}
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm border border-emerald-500/30 px-2.5 py-1 rounded-md text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                LIVE 4K SMD STREAM
              </div>

              <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-sm border border-slate-700 px-2.5 py-1 rounded-md text-[10px] font-semibold text-slate-300">
                60ft x 20ft (3840x1280)
              </div>
            </div>

            {/* Support Steel Poles */}
            <div className="absolute -bottom-20 left-1/3 w-6 h-20 bg-gradient-to-r from-slate-700 to-slate-900 rounded-b-md" />
            <div className="absolute -bottom-20 right-1/3 w-6 h-20 bg-gradient-to-r from-slate-700 to-slate-900 rounded-b-md" />
          </div>
        </div>

        {/* Ambient Ground Lights */}
        {timeOfDay === 'night' && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-96 h-12 bg-emerald-500/20 blur-2xl rounded-full pointer-events-none" />
        )}
      </div>

      {/* Control Bar */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-slate-500 block text-[10px]">CURRENT CREATIVE</span>
            <span className="font-semibold text-white truncate max-w-[200px] block">{creativeTitle}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">LOCATION</span>
            <span className="font-semibold text-emerald-400 truncate max-w-[220px] block">{locationName}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[10px]">LED Brightness:</span>
            <input
              type="range"
              min="20"
              max="100"
              value={lightingGlow}
              onChange={(e) => setLightingGlow(Number(e.target.value))}
              className="w-24 accent-emerald-500 cursor-pointer"
            />
            <span className="text-emerald-400 font-bold w-8">{lightingGlow}%</span>
          </div>

          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="px-3 py-1.5 rounded-lg font-bold bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            {isSimulating ? 'Playing Loop' : 'Paused'}
          </button>
        </div>
      </div>
    </div>
  );
};
