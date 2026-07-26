import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Eye, CheckCircle, RotateCw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  assetTitle: string;
  assetImage?: string;
}

export const Billboard3DSimulatorModal: React.FC<Props> = ({ isOpen, onClose, assetTitle, assetImage }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const defaultBackground = assetImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setUploadedImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const bgImg = new Image();
    bgImg.crossOrigin = 'anonymous';
    bgImg.src = defaultBackground;

    bgImg.onload = () => {
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      // Darken edges for depth
      const edgeGrad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.width * 0.3, canvas.width / 2, canvas.height / 2, canvas.width * 0.7);
      edgeGrad.addColorStop(0, 'rgba(0,0,0,0)');
      edgeGrad.addColorStop(1, 'rgba(0,0,0,0.4)');
      ctx.fillStyle = edgeGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (uploadedImage) {
        const adImg = new Image();
        adImg.src = uploadedImage;
        adImg.onload = () => {
          ctx.save();
          // Perspective transform area (billboard zone)
          const bx = canvas.width * 0.12;
          const by = canvas.height * 0.12;
          const bw = canvas.width * 0.76;
          const bh = canvas.height * 0.50;

          // Drop shadow under the ad
          ctx.shadowColor = 'rgba(0,0,0,0.5)';
          ctx.shadowBlur = 20;
          ctx.shadowOffsetY = 8;
          ctx.drawImage(adImg, bx, by, bw, bh);
          ctx.shadowColor = 'transparent';

          // Glass reflection on top third
          const reflGrad = ctx.createLinearGradient(bx, by, bx, by + bh * 0.35);
          reflGrad.addColorStop(0, 'rgba(255,255,255,0.18)');
          reflGrad.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = reflGrad;
          ctx.fillRect(bx, by, bw, bh * 0.35);

          // Border frame
          ctx.strokeStyle = 'rgba(255,255,255,0.15)';
          ctx.lineWidth = 2;
          ctx.strokeRect(bx, by, bw, bh);

          ctx.restore();
        };
      }
    };
  }, [isOpen, uploadedImage, defaultBackground]);

  // Reset uploaded image on close
  useEffect(() => {
    if (!isOpen) setUploadedImage(null);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-2xl glass-panel p-6 space-y-5 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">3D Visual Simulator</h3>
              <p className="text-xs text-slate-400 truncate max-w-xs">{assetTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Preview */}
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-white/[0.08]">
          <canvas ref={canvasRef} width={960} height={540} className="w-full h-full" />
          {!uploadedImage && (
            <label className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center cursor-pointer group">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border-2 border-dashed border-indigo-500/40 flex items-center justify-center mb-3 group-hover:border-indigo-400 group-hover:bg-indigo-600/30 transition">
                <Upload className="w-7 h-7 text-indigo-400" />
              </div>
              <p className="text-sm font-semibold text-white">Drop or click to upload your ad design</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG, or WebP — see live overlay on {assetTitle}</p>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition">
            <Upload className="w-4 h-4" />
            {uploadedImage ? 'Change Design' : 'Upload Graphic'}
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>

          {uploadedImage && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setUploadedImage(null)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 text-slate-300 text-xs font-medium hover:bg-white/10 transition"
              >
                <RotateCw className="w-3.5 h-3.5" /> Reset
              </button>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Overlay Applied
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
