import React, { useState } from 'react';
import { Camera, CheckCircle2, ShieldCheck, DollarSign, MapPin, Award, ArrowUpRight, Zap, RefreshCw, Upload, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

export const ShopkeeperPwaDashboard: React.FC = () => {
  const { showToast } = useToast();
  const [balance, setBalance] = useState(14500);
  const [tasksCompleted, setTasksCompleted] = useState(9);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const handleCaptureAndVerify = async () => {
    setIsVerifying(true);
    try {
      const currentLat = 31.5204 + (Math.random() - 0.5) * 0.01;
      const currentLng = 74.3587 + (Math.random() - 0.5) * 0.01;

      await api.post('/verification/upload', {
        allocationId: `alloc_${Date.now()}`,
        submittedByUserId: 'user_earner_1',
        photoUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
        latitude: currentLat,
        longitude: currentLng,
      });

      setBalance((prev) => prev + 1500);
      setTasksCompleted((prev) => prev + 1);
      setVerificationSuccess(true);
      showToast('Geotagged Photo Proof Verified! +1,500 PKR added to your wallet.', 'success');

      setTimeout(() => setVerificationSuccess(false), 4000);
    } catch (err: any) {
      showToast(err.message || 'Verification upload failed', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-black mb-2">
              <Camera className="w-3.5 h-3.5" /> WebRTC Geotagged Proof Verification PWA
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">Micro-Earner Verification Terminal</h2>
            <p className="text-xs text-slate-400 mt-1">Capture EXIF RSA signed geotagged photos to verify active billboard display ads & earn instant PKR rewards</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-right min-w-[180px]">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Wallet Balance</span>
            <p className="text-2xl font-black text-emerald-400 font-display">{balance.toLocaleString()} PKR</p>
            <span className="text-[10px] text-indigo-300 font-bold block mt-0.5">Raast / JazzCash Ready</span>
          </div>
        </div>
      </div>

      {/* Verification Camera Viewfinder Box */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-center">
        <div className="relative aspect-video max-w-md mx-auto rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-950 group">
          <img
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"
            alt="Camera Viewfinder"
            className="w-full h-full object-cover"
          />

          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] text-emerald-400 font-mono font-bold border border-emerald-500/30">
            ● GPS: 31.5204° N, 74.3587° E • EXIF RSA SIGNED
          </div>

          <div className="absolute inset-0 border-2 border-dashed border-emerald-500/40 rounded-2xl pointer-events-none" />
        </div>

        <button
          onClick={handleCaptureAndVerify}
          disabled={isVerifying || verificationSuccess}
          className="w-full max-w-md mx-auto py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold rounded-xl shadow-xl flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Verifying EXIF Watermark & Transmitting...
            </>
          ) : verificationSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5" /> Proof Approved! +1,500 PKR Credited
            </>
          ) : (
            <>
              <Camera className="w-5 h-5" /> Capture Geotagged Proof (+1,500 PKR Reward)
            </>
          )}
        </button>
      </div>
    </div>
  );
};
