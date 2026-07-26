import React, { useState, useEffect } from 'react';
import { Video, Image as ImageIcon, Upload, FileText, CheckCircle2, AlertCircle, Download, Sparkles, Loader2, Plus, X, Eye } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { exportCommercialPdf } from '../utils/exportPdf';
import { Billboard3dSimulator } from '../components/Billboard3dSimulator';
import { LiveDoohCameraStream } from '../components/LiveDoohCameraStream';

interface CreativeItem {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  format: string;
  dimensions: string;
  fileSizeMb: number;
  status: string;
}

export const CreativeStudio: React.FC = () => {
  const { showToast } = useToast();
  const [creatives, setCreatives] = useState<CreativeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewingCreative, setPreviewingCreative] = useState<CreativeItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [format, setFormat] = useState('PNG');
  const [dimensions, setDimensions] = useState('5760x1920');
  const [fileUrl, setFileUrl] = useState('');

  useEffect(() => {
    setIsLoading(true);
    api.get<{ data: CreativeItem[] }>('/creatives')
      .then((res) => {
        setCreatives(res.data || []);
        if (res.data && res.data.length > 0) {
          setPreviewingCreative(res.data[0]);
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleUploadCreative = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter creative title', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post<{ data: CreativeItem }>('/creatives', {
        title: title.trim(),
        fileName: `${title.toLowerCase().replace(/\s+/g, '_')}.${format.toLowerCase()}`,
        format,
        dimensions,
        fileUrl: fileUrl.trim() || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
        mimeType: format === 'MP4' ? 'video/mp4' : 'image/png',
        fileSizeMb: 6.2,
      });

      setCreatives((prev) => [res.data, ...prev]);
      setPreviewingCreative(res.data);
      setShowUploadModal(false);
      setTitle('');
      setFileUrl('');
      showToast('Creative uploaded to Cloudflare R2 Media Vault & Approved!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload creative', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportSpecSheet = (item: CreativeItem) => {
    exportCommercialPdf({
      title: `CREATIVE SPECIFICATION SHEET — ${item.title.toUpperCase()}`,
      campaignName: item.title,
      clientName: 'OMNI-GRID PAKISTAN Certified Brand',
      totalCostPkr: 0,
      breakdown: [
        { label: 'Creative Title', value: item.title },
        { label: 'File Name', value: item.fileName },
        { label: 'Asset Format', value: item.format },
        { label: 'Target Resolution', value: item.dimensions },
        { label: 'File Size', value: `${item.fileSizeMb} MB` },
        { label: 'MIME Type', value: item.mimeType },
        { label: 'Approval Status', value: item.status },
        { label: 'Cloudflare R2 Storage Bucket', value: 'r2-omnigrid-creatives-vault' },
      ],
    });
    showToast(`PDF Spec Sheet generated for '${item.title}'`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              MODULE 6 & 24 — CREATIVE STUDIO & LIVE VISION
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            Creative Studio & Live DOOH Camera Feeds
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload 4K artwork specs, simulate 3D billboard renders, and monitor real-time webcam feeds.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-emerald-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Upload New Artwork
        </button>
      </div>

      {/* 3D Visualizer & Live Stream Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Billboard3dSimulator
          creativeTitle={previewingCreative?.title}
          creativeUrl={previewingCreative?.fileUrl}
          locationName="Main Boulevard Gulberg III, Lahore"
        />

        <LiveDoohCameraStream
          assetId="lhr_1"
          assetTitle={previewingCreative?.title || 'Main Boulevard Gulberg SMD'}
          city="Lahore"
        />
      </div>

      {/* Media Library */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-emerald-400" />
            Media Library ({creatives.length} Assets)
          </h2>
        </div>

        {isLoading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {creatives.map((item) => (
              <div
                key={item.id}
                onClick={() => setPreviewingCreative(item)}
                className={`bg-slate-950 border rounded-xl overflow-hidden p-4 space-y-3 cursor-pointer transition ${
                  previewingCreative?.id === item.id ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="relative h-36 bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
                  <img src={item.fileUrl} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950/80 text-white border border-slate-700">
                    {item.format}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white truncate">{item.title}</h3>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{item.dimensions}</span>
                    <span>{item.fileSizeMb} MB</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExportSpecSheet(item);
                    }}
                    className="flex items-center gap-1 text-slate-400 hover:text-white transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Spec PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-400" />
                Upload New Artwork
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadCreative} className="space-y-4 text-sm">
              <div>
                <label className="block text-slate-300 text-xs font-semibold mb-1">Creative Title</label>
                <input
                  type="text"
                  placeholder="e.g. Ramadan Beverage 60x20 High Res Spot"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1">Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="PNG">PNG Image</option>
                    <option value="JPG">JPG Image</option>
                    <option value="MP4">MP4 Video Spot</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold mb-1">Artwork Image / Video URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload to Cloudflare R2'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
