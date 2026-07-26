import React, { useState } from 'react';
import { Camera, Bike, Store, DollarSign, CheckCircle2, ShieldCheck, QrCode, ArrowUpRight, Zap, RefreshCw, Smartphone, Lock, AlertCircle } from 'lucide-react';

export const ShopkeeperPwaDashboard: React.FC = () => {
  const [walletBalance, setWalletBalance] = useState(38500);
  const [photoSubmissions, setPhotoSubmissions] = useState([
    { id: 'sub_1', date: 'Today, 10:14 AM', location: 'Ichhra Market, Lahore', status: 'VERIFIED', rewardPkr: 1500, gps: '31.5204° N, 74.3587° E', exifHash: 'RSA-SIG-9912048' },
    { id: 'sub_2', date: 'Yesterday, 04:30 PM', location: 'Liberty Roundabout, Lahore', status: 'VERIFIED', rewardPkr: 1500, gps: '31.5126° N, 74.3436° E', exifHash: 'RSA-SIG-8812033' },
  ]);

  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [raastId, setRaastId] = useState('03001234567');
  const [cnicMatchStatus, setCnicMatchStatus] = useState<string | null>(null);
  const [isWithdrawSuccess, setIsWithdrawSuccess] = useState(false);

  const handleSimulateCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setCapturedPhoto('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80');
      setIsCapturing(false);
      const newSub = {
        id: `sub_${Date.now()}`,
        date: 'Just Now',
        location: 'Gulberg Main Market, Lahore',
        status: 'VERIFIED',
        rewardPkr: 1500,
        gps: '31.5192° N, 74.3481° E (GPS Watermarked)',
        exifHash: 'RSA-SIG-EXIF-2026-X99',
      };
      setPhotoSubmissions([newSub, ...photoSubmissions]);
      setWalletBalance((prev) => prev + 1500);
    }, 1500);
  };

  const handleVerifyRaastAccount = () => {
    setCnicMatchStatus('CNIC Matched: Muhammad Tariq (Raast Verified)');
  };

  const handleWithdraw = () => {
    if (walletBalance <= 0) return;
    setIsWithdrawSuccess(true);
    setWalletBalance(0);
    setTimeout(() => setIsWithdrawSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-3xl mx-auto">
      {/* Micro-Earner Header Banner */}
      <div className="glass-panel p-6 border border-amber-500/30 relative overflow-hidden text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/20 text-amber-400 text-xs font-black mb-2">
              <Bike className="w-3.5 h-3.5" /> PWA Micro-Earner & Rider Wallet
            </div>
            <h2 className="text-2xl font-black font-display text-slate-900 dark:text-white">Earner Mobile Command</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Capture geofenced photos, scan QR code audits & cash out via Raast / Easypaisa</p>
          </div>

          <div className="bg-og-bg/80 p-4 rounded-2xl border border-white/[0.08] text-center min-w-[180px]">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Available Wallet Balance</span>
            <p className="text-2xl font-black text-amber-400 font-display">{walletBalance.toLocaleString()} PKR</p>
            <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">● Ready for Instant Cash-Out</span>
          </div>
        </div>
      </div>

      {/* Camera Capture Card */}
      <div className="glass-panel p-6 border border-emerald-500/30 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
          <Camera className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">Capture Geofenced EXIF Watermarked Photo</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">AI locks WebRTC stream & embeds EXIF RSA cryptographic signature watermark (+1,500 PKR reward).</p>
        </div>

        <button
          onClick={handleSimulateCapture}
          disabled={isCapturing}
          className="w-full sm:w-auto px-8 py-4 btn-emerald text-sm font-extrabold flex items-center justify-center gap-2 shadow-xl mx-auto cursor-pointer"
        >
          {isCapturing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Embedding EXIF RSA Signature...
            </>
          ) : (
            <>
              <Camera className="w-4 h-4" /> Snap EXIF Photo Proof (+1,500 PKR)
            </>
          )}
        </button>

        {capturedPhoto && (
          <div className="p-3 rounded-xl bg-og-bg/80 border border-emerald-500/30 max-w-xs mx-auto text-left space-y-2 animate-scale-in">
            <img src={capturedPhoto} alt="Proof" className="w-full h-32 object-cover rounded-lg" />
            <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> EXIF Signature: RSA-SIG-EXIF-2026-X99
            </div>
          </div>
        )}
      </div>

      {/* Raast / Easypaisa Instant Withdrawal & Name Match Check */}
      <div className="glass-panel p-6 border border-white/[0.08] space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-indigo-400" /> Raast Account & CNIC Verification
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Raast ID / Mobile Number</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={raastId}
                onChange={(e) => setRaastId(e.target.value)}
                className="w-full p-3 bg-og-surface border border-white/[0.10] rounded-xl text-xs text-white outline-none"
              />
              <button
                type="button"
                onClick={handleVerifyRaastAccount}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer shrink-0"
              >
                Verify CNIC
              </button>
            </div>
            {cnicMatchStatus && (
              <span className="text-[10px] text-emerald-400 font-bold block mt-1">{cnicMatchStatus}</span>
            )}
          </div>

          <div className="flex items-end">
            <button
              onClick={handleWithdraw}
              disabled={walletBalance <= 0}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-extrabold rounded-xl shadow-md cursor-pointer disabled:opacity-50"
            >
              {isWithdrawSuccess ? '✓ Transferred to Raast!' : `Withdraw ${walletBalance.toLocaleString()} PKR`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
