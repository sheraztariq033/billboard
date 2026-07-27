import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, MapPin, Eye, Calendar, Sparkles, Filter, ChevronRight, Award, Layers, X, RefreshCw, Loader2, Map as MapIcon, Grid, Heart, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import { AssetDetailModal } from '../components/AssetDetailModal';
import { Billboard3DSimulatorModal } from '../components/3dSimulatorModal';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface InventoryItem {
  id: string;
  title: string;
  locationCity: string;
  locationArea: string;
  category: string;
  monthlyRatePkr: number;
  dailyRatePkr: number;
  estimatedDailyImpressions: number;
  softExpiryDate: string;
  imageUrl: string;
  status: string;
  latitude?: number;
  longitude?: number;
  ratingStars?: number;
}

// Default coordinates for major Pakistan cities
const CITY_COORDS: Record<string, [number, number]> = {
  Lahore: [31.5204, 74.3587],
  Karachi: [24.8607, 67.0011],
  Islamabad: [33.6844, 73.0479],
  Rawalpindi: [33.5973, 73.0479],
  Faisalabad: [31.4504, 73.1350],
  Peshawar: [34.0151, 71.5249],
  Multan: [30.1575, 71.5249],
  Quetta: [30.1798, 66.9750],
  Sialkot: [32.4945, 74.5229],
  Gwadar: [25.1216, 62.3254],
};

export const AssetInventoryMap: React.FC = () => {
  const { showToast } = useToast();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [minTraffic, setMinTraffic] = useState(0);
  const [viewMode, setViewMode] = useState<'MAP' | 'GRID'>('GRID');
  const [inspectingAsset, setInspectingAsset] = useState<any | null>(null);
  const [simulatingTitle, setSimulatingTitle] = useState<string | null>(null);

  // Module 27: Wishlist & Shortlisting State
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareItems, setCompareItems] = useState<InventoryItem[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Fetch real assets from backend API
  useEffect(() => {
    setIsLoading(true);
    api.get<{ count: number; data: InventoryItem[] }>('/assets')
      .then((res) => {
        setInventory(res.data || []);
      })
      .catch((err) => {
        console.error('Failed to fetch assets:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Multi-Param Filtering Logic
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const city = item.locationCity || '';
      const area = item.locationArea || '';
      const cat = item.category || '';
      const title = item.title || '';

      const matchesSearch =
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCity = selectedCity === 'ALL' || city.toUpperCase() === selectedCity.toUpperCase();
      const matchesCategory = selectedCategory === 'ALL' || cat.toUpperCase().includes(selectedCategory.toUpperCase());
      const matchesTraffic = (item.estimatedDailyImpressions || 0) >= minTraffic;

      return matchesSearch && matchesCity && matchesCategory && matchesTraffic;
    });
  }, [inventory, searchQuery, selectedCity, selectedCategory, minTraffic]);

  // Leaflet Map Initialization & Marker Updates
  useEffect(() => {
    if (viewMode !== 'MAP' || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialCenter = CITY_COORDS[selectedCity] || [31.5204, 74.3587];
      const map = L.map(mapContainerRef.current).setView(initialCenter, selectedCity === 'ALL' ? 6 : 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    if (selectedCity in CITY_COORDS) {
      map.setView(CITY_COORDS[selectedCity], 12);
    }

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    filteredInventory.forEach((item) => {
      const cityCoords = CITY_COORDS[item.locationCity] || [31.5204, 74.3587];
      const lat = item.latitude || cityCoords[0] + (Math.random() * 0.04 - 0.02);
      const lng = item.longitude || cityCoords[1] + (Math.random() * 0.04 - 0.02);

      const marker = L.marker([lat, lng]).addTo(map);

      const popupHtml = `
        <div style="width: 220px; font-family: sans-serif; padding: 4px;">
          <img src="${item.imageUrl}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" />
          <h4 style="font-weight: 800; font-size: 13px; margin: 0 0 4px; color: #0f172a;">${item.title}</h4>
          <p style="font-size: 11px; margin: 0 0 6px; color: #475569;">📍 ${item.locationArea}, ${item.locationCity}</p>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="color: #059669; font-size: 12px;">PKR ${(item.dailyRatePkr || 0).toLocaleString()}/day</strong>
            <span style="font-size: 10px; background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-weight: 700;">${item.category}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      markersRef.current.push(marker);
    });
  }, [viewMode, filteredInventory, selectedCity]);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    showToast('Inventory wishlist updated', 'success');
  };

  const toggleCompare = (item: InventoryItem) => {
    setCompareItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      }
      if (prev.length >= 3) {
        showToast('You can compare a maximum of 3 items side-by-side', 'error');
        return prev;
      }
      return [...prev, item];
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              NATIONAL OOH & DOOH INVENTORY DIRECTORY
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            Pakistan Omnichannel Billboard Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Discover premium digital SMDs, unipoles, transit wraps, and karayna ambient media spots across Pakistan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {compareItems.length > 0 && (
            <button
              onClick={() => setShowCompareModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10 hover:brightness-110 transition cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Compare ({compareItems.length})
            </button>
          )}

          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('GRID')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'GRID' ? 'bg-slate-950 text-white border border-slate-800' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" /> Grid View
            </button>
            <button
              onClick={() => setViewMode('MAP')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'MAP' ? 'bg-slate-950 text-white border border-slate-800' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" /> GIS Map
            </button>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search Area, Format, or Keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
        >
          <option value="ALL">All Cities in Pakistan</option>
          <option value="LAHORE">Lahore</option>
          <option value="KARACHI">Karachi</option>
          <option value="ISLAMABAD">Islamabad</option>
          <option value="RAWALPINDI">Rawalpindi</option>
          <option value="FAISALABAD">Faisalabad</option>
          <option value="PESHAWAR">Peshawar</option>
          <option value="MULTAN">Multan</option>
          <option value="QUETTA">Quetta</option>
          <option value="SIALKOT">Sialkot</option>
          <option value="GWADAR">Gwadar</option>
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
        >
          <option value="ALL">All Media Formats</option>
          <option value="DOOH">Digital SMDs (DOOH)</option>
          <option value="OOH">Static Billboards (OOH)</option>
          <option value="TRANSIT">Transit wraps (Rickshaws/Buses)</option>
          <option value="AMBIENT">Retail Ambient Media</option>
        </select>

        <select
          value={minTraffic}
          onChange={(e) => setMinTraffic(Number(e.target.value))}
          className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
        >
          <option value={0}>Any Traffic Level</option>
          <option value={100000}>100,000+ Daily Reach</option>
          <option value={500000}>500,000+ Daily Reach</option>
          <option value={1000000}>1,000,000+ Daily Reach</option>
        </select>
      </div>

      {/* Main Content: Map or Grid */}
      {viewMode === 'MAP' ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 h-[650px]">
          <div ref={mapContainerRef} className="w-full h-full z-0" />
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-900 border border-slate-800 rounded-2xl">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
          <p className="text-xs text-slate-400 font-medium">Fetching live omnichannel inventory from edge API...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredInventory.map((item) => {
            const isWishlisted = wishlist.includes(item.id);
            const isCompared = compareItems.some((c) => c.id === item.id);

            return (
              <div key={item.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-3 space-y-2 hover:border-emerald-500/40 transition">
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover animate-fade-in" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md text-emerald-400 text-[10px] font-black rounded-lg border border-emerald-500/30">
                        {item.category}
                      </span>
                      <span className="px-2 py-1 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold rounded-lg border border-white/20">
                        {item.locationCity}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleWishlist(item.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border cursor-pointer transition ${
                        isWishlisted
                          ? 'bg-rose-500 text-white border-rose-400'
                          : 'bg-black/60 text-slate-300 border-white/20 hover:text-white'
                      }`}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-sm line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {item.locationArea}, {item.locationCity}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Daily Impressions</span>
                      <strong className="text-white font-bold">{item.estimatedDailyImpressions.toLocaleString()}+</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Soft Expiry</span>
                      <strong className="text-emerald-400 font-bold">{item.softExpiryDate || 'Late Aug 2026'}</strong>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Daily Rate</span>
                      <strong className="text-sm text-emerald-400 font-black">PKR {(item.dailyRatePkr || 0).toLocaleString()}</strong>
                    </div>

                    <button
                      onClick={() => toggleCompare(item)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border cursor-pointer transition ${
                        isCompared
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {isCompared ? '✓ Added' : '+ Compare'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setInspectingAsset(item)}
                      className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Details
                    </button>
                    <button
                      onClick={() => setSimulatingTitle(item.title)}
                      className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 shadow-md cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> 3D View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Side-by-Side Comparison Modal (Module 27) */}
      {showCompareModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setShowCompareModal(false); }}
        >
          <div className="w-full max-w-4xl p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 animate-scale-in my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-emerald-400" /> Side-by-Side Asset Comparison
              </h3>
              <button onClick={() => setShowCompareModal(false)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {compareItems.map((cItem) => (
                <div key={cItem.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <img src={cItem.imageUrl} alt={cItem.title} className="w-full h-32 object-cover rounded-lg" />
                  <h4 className="font-bold text-white text-sm line-clamp-1">{cItem.title}</h4>
                  <p className="text-slate-400">📍 {cItem.locationArea}, {cItem.locationCity}</p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    <div className="flex justify-between"><span className="text-slate-500">Category:</span><strong className="text-emerald-400">{cItem.category}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-500">Daily Impressions:</span><strong className="text-white">{cItem.estimatedDailyImpressions.toLocaleString()}+</strong></div>
                    <div className="flex justify-between"><span className="text-slate-500">Daily Rate:</span><strong className="text-emerald-400">PKR {cItem.dailyRatePkr.toLocaleString()}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-500">Monthly Rate:</span><strong className="text-white">PKR {cItem.monthlyRatePkr.toLocaleString()}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-500">Soft Expiry:</span><strong className="text-white">{cItem.softExpiryDate || 'Aug 2026'}</strong></div>
                  </div>

                  <button
                    onClick={() => setCompareItems(compareItems.filter((i) => i.id !== cItem.id))}
                    className="w-full py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg font-bold cursor-pointer hover:bg-rose-500/20"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Asset Detail Modal */}
      {inspectingAsset && (
        <AssetDetailModal asset={inspectingAsset} onClose={() => setInspectingAsset(null)} />
      )}

      {/* 3D Visualizer Modal */}
      {simulatingTitle && (
        <Billboard3DSimulatorModal title={simulatingTitle} onClose={() => setSimulatingTitle(null)} />
      )}
    </div>
  );
};
