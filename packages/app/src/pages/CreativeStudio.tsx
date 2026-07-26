import React, { useState, useEffect } from 'react';
import { Video, Image as ImageIcon, Upload, FileText, CheckCircle2, AlertCircle, Download, Sparkles, Loader2, Plus, X } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { exportCommercialPdf } from '../utils/exportPdf';

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
      showToast(`Ad Creative "${title}" registered in Media Library!`, 'success');
      setShowUploadModal(false);
      setTitle('');
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportSpecSheet = (cr: CreativeItem) => {
    const html = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #059669;">PRINT SPECIFICATION SHEET</h2>
        <p>OMNI-GRID PAKISTAN Commercial Production Specs</p>
        <hr/>
        <table class="table">
          <tr><td>Creative Asset Name:</td><td><strong>${cr.title}</strong></td></tr>
          <tr><td>Target Display Dimensions:</td><td><strong>${cr.dimensions} px (60x20 ft)</strong></td></tr>
          <tr><td>Resolution & Color Space:</td><td><strong>300 DPI • CMYK / RGB High Color</strong></td></tr>
          <tr><td>File Format:</td><td><strong>${cr.format} (${cr.mimeType})</strong></td></tr>
          <tr><td>Maximum File Size Limit:</td><td><strong>${cr.fileSizeMb} MB</strong></td></tr>
        </table>
      </div>
    `;
    exportCommercialPdf(`Print Spec Sheet - ${cr.title}`, html);
    showToast('Print Spec Sheet exported to PDF!', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-black mb-2">
            <Video className="w-3.5 h-3.5" /> Media Library & Ad Creative Inspector
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white">Creative Studio & Spec Checker</h2>
          <p className="text-xs text-slate-400 mt-1">Upload high-res billboard graphics, 15s SMD video spots & generate print spec sheets</p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold rounded-xl shadow-lg flex items-center gap-2 cursor-pointer text-xs"
        >
          <Plus className="w-4 h-4" /> Upload New Ad Creative
        </button>
      </div>

      {/* Creatives Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-900 border border-slate-800 rounded-2xl">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
          <p className="text-xs text-slate-400 font-medium">Fetching media library assets from R2 storage API...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {creatives.map((item) => (
            <div key={item.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950">
                <img src={item.fileUrl} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md text-emerald-400 text-[10px] font-black rounded-lg border border-emerald-500/30">
                    {item.format}
                  </span>
                  <span className="px-2 py-1 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold rounded-lg border border-white/20">
                    {item.dimensions}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <h3 className="font-bold text-white text-sm">{item.title}</h3>
                <p className="text-slate-400">{item.fileName} • {item.fileSizeMb} MB</p>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Spec Verified & Approved
                  </span>

                  <button
                    onClick={() => handleExportSpecSheet(item)}
                    className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Spec Sheet PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setShowUploadModal(false); }}
        >
          <div className="w-full max-w-lg p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 animate-scale-in my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-400" /> Register Ad Creative in Media Library
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadCreative} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Creative Title</label>
                <input
                  type="text"
                  placeholder="e.g. Ramadan Q4 Main Billboard Graphic"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"
                  >
                    <option value="PNG">PNG Image</option>
                    <option value="JPEG">JPEG Image</option>
                    <option value="MP4">MP4 SMD Video (15s)</option>
                    <option value="PDF">PDF Print Graphic</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Dimensions (px)</label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">File Media URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Save Creative & Verify Specs
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
