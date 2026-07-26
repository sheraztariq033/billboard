import React, { useState, useEffect } from 'react';
import { Video, ShieldCheck, Activity, Clock, PlayCircle, Eye, AlertCircle } from 'lucide-react';

interface StreamProps {
  assetId?: string;
  assetTitle?: string;
  city?: string;
}

export const LiveDoohCameraStream: React.FC<StreamProps> = ({
  assetId = 'lhr_1',
  assetTitle = 'Main Boulevard Gulberg Digital SMD',
  city = 'Lahore',
}) => {
  const [playCount, setPlayCount] = useState<number>(14280);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isLive, setIsLive] = useState<boolean>(true);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi' }));
    };

    updateClock();
    const clockInterval = setInterval(updateClock, 1000);
    const playInterval = setInterval(() => {
      setPlayCount((prev) => prev + 1);
    }, 4000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(playInterval);
    };
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Stream Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Video className="w-5 h-5 text-rose-500 animate-pulse" />
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">LIVE WEBCAM PROOF-OF-PLAY STREAM</h4>
            <p className="text-[11px] text-slate-400 font-medium">{assetTitle} ({city})</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            LIVE FEED (PKT {currentTime})
          </span>
        </div>
      </div>

      {/* Stream Video Container */}
      <div className="relative h-[260px] bg-black overflow-hidden flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"
          alt="DOOH Live Stream"
          className="w-full h-full object-cover opacity-80"
        />

        {/* Video Overlay Watermark & Timestamps */}
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-white flex items-center gap-2 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>CAM-ID: PK-{assetId.toUpperCase()}-04</span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
          <div className="bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-slate-200 flex items-center gap-2 font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>TIMESTAMP: {new Date().toISOString()}</span>
          </div>

          <div className="bg-emerald-600/90 text-white font-extrabold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 text-xs">
            <PlayCircle className="w-4 h-4" />
            <span>{playCount.toLocaleString()} PLAYS TODAY</span>
          </div>
        </div>
      </div>

      {/* Real-time Proof Log Bar */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Blockchain Hash: <strong className="text-slate-200 font-mono">0x9f8a...3b21</strong></span>
        </div>
        <span className="text-emerald-400 font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> FBR Form 164 Tax Logged
        </span>
      </div>
    </div>
  );
};
