import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, MapPin, Eye, Calendar, Sparkles, Filter, ChevronRight, Award, Layers, X, RefreshCw, Loader2, Map as MapIcon, Grid } from 'lucide-react';
import { AssetDetailModal } from '../components/AssetDetailModal';
import { Billboard3DSimulatorModal } from '../components/3dSimulatorModal';
import { api } from '../lib/api';
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
}

// Default coordinates for Pakistan cities
const CITY_COORDS: Record<string, [number, number]> = {
  Lahore: [31.5204, 74.3587],
  Karachi: [24.8607, 67.0011],
  Islamabad: [33.6844, 73.0479],
  Peshawar: [34.0151, 71.5249],
  Multan: [30.1575, 71.5249],
};

export const AssetInventoryMap: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [minTraffic, setMinTraffic] = useState(0);
  const [viewMode, setViewMode] = useState<'MAP' | 'GRID'>('GRID');
  const [inspectingAsset, setInspectingAsset] = useState<any | null>(null);
  const [simulatingTitle, setSimulatingTitle] = useState<string | null>(null);

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

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add markers for filtered inventory
    filteredInventory.forEach((item) => {
      const lat = item.latitude || (CITY_COORDS[item.locationCity] ? CITY_COORDS[item.locationCity][0] : 31.5204);
      const lng = item.longitude || (CITY_COORDS[item.locationCity] ? CITY_COORDS[item.locationCity][1] : 74.3587);

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="background: #10b981; color: white; padding: 4px 8px; border-radius: 8px; font-weight: 800; font-size: 11px; border: 2px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.4); white-space: nowrap;">
            📍 ${(item.monthlyRatePkr / 1000).toFixed(0)}k PKR
          </div>
        `,
        iconSize: [60, 24],
        iconAnchor: [30, 12],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(mapInstanceRef.current!);

      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; min-width: 180px;">
          <strong style="font-size: 13px; color: #0f172a;">${item.title}</strong>
          <p style="font-size: 11px; color: #64748b; margin: 4px 0;">${item.locationArea}, ${item.locationCity}</p>
          <p style="font-size: 12px; font-weight: 800; color: #059669; margin-bottom: 6px;">${item.monthlyRatePkr.toLocaleString()} PKR / Month</p>
        </div>
      `);

      markersRef.current.push(marker);
    });

    if (selectedCity !== 'ALL' && CITY_COORDS[selectedCity] && mapInstanceRef.current) {
      mapInstanceRef.current.setView(CITY_COORDS[selectedCity], 12);
    }
  }, [viewMode, filteredInventory, selectedCity]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCity('ALL');
    setSelectedCategory('ALL');
    setMinTraffic(0);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-black mb-2">
              <MapPin className="w-3.5 h-3.5" /> OpenStreetMap & GIS Inventory Engine
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">Commercial Inventory & Map Explorer</h2>
            <p className="text-xs text-slate-400 mt-1">Multi-param search connected to Leaflet GIS map and Cloudflare Workers API</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('GRID')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1 transition cursor-pointer ${
                  viewMode === 'GRID' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" /> Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('MAP')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1 transition cursor-pointer ${
                  viewMode === 'MAP' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" /> Live Map
              </button>
            </div>

            <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Matching</span>
              <span className="text-lg font-black text-emerald-400 font-display">{filteredInventory.length} Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Param Search & Filter Controls */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Search Query Input */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search location, area, title or ID (e.g. Gulberg, Clifton, DOOH)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
            />
          </div>

          {/* City Selector */}
          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none cursor-pointer"
            >
              <option value="ALL">All Cities in Pakistan</option>
              <option value="Lahore">Lahore</option>
              <option value="Karachi">Karachi</option>
              <option value="Islamabad">Islamabad</option>
              <option value="Peshawar">Peshawar</option>
              <option value="Multan">Multan</option>
            </select>
          </div>

          {/* Traffic Filter */}
          <div>
            <select
              value={minTraffic}
              onChange={(e) => setMinTraffic(Number(e.target.value))}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none cursor-pointer"
            >
              <option value={0}>Any Daily Traffic</option>
              <option value={500000}>500K+ Vehicles / Day</option>
              <option value={1000000}>1.0M+ Vehicles / Day</option>
              <option value={2000000}>2.0M+ Vehicles / Day</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Active Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
          <div className="flex flex-wrap gap-1.5">
            {['ALL', 'DOOH', 'OOH', 'RETAIL_SHELF'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  selectedCategory === cat ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'ALL' ? 'All Tiers' : cat}
              </button>
            ))}
          </div>

          {(searchQuery || selectedCity !== 'ALL' || selectedCategory !== 'ALL' || minTraffic > 0) && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-rose-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Clear Active Filters
            </button>
          )}
        </div>
      </div>

      {/* View Modes */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-900 border border-slate-800 rounded-2xl">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
          <p className="text-xs text-slate-400 font-medium">Fetching live inventory from Cloudflare D1 database API...</p>
        </div>
      ) : viewMode === 'MAP' ? (
        /* Leaflet Map Container */
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 h-[500px] z-0">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>
      ) : (
        /* Inventory Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredInventory.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition group flex flex-col justify-between"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 mb-4">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md text-emerald-400 text-[10px] font-black rounded-lg border border-emerald-500/30">
                    {item.category}
                  </span>
                  <span className="px-2 py-1 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold rounded-lg border border-white/20">
                    {item.locationCity}
                  </span>
                </div>
              </div>

              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white font-display group-hover:text-emerald-400 transition">{item.title}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" /> {item.locationArea}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Daily Traffic:</span>
                    <strong className="text-white">{(item.estimatedDailyImpressions || 0).toLocaleString()} / day</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Soft Expiry Date:</span>
                    <strong className="text-amber-400">{item.softExpiryDate || 'Available Now'}</strong>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Monthly Rate</span>
                    <span className="text-lg font-black text-white font-display">{(item.monthlyRatePkr || 0).toLocaleString()} <span className="text-xs font-normal">PKR</span></span>
                  </div>

                  <button
                    onClick={() => setInspectingAsset({
                      ...item,
                      city: item.locationCity,
                      area: item.locationArea,
                      impressions: `${(item.estimatedDailyImpressions || 0).toLocaleString()} / day`,
                      softExpiry: item.softExpiryDate || 'Available Now',
                    })}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-extrabold flex items-center gap-1 shadow-md cursor-pointer"
                  >
                    Deep Inspector <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deep Asset Intelligence Modal */}
      <AssetDetailModal
        isOpen={!!inspectingAsset}
        onClose={() => setInspectingAsset(null)}
        asset={inspectingAsset}
      />

      {/* 3D Simulator Modal */}
      <Billboard3DSimulatorModal
        isOpen={!!simulatingTitle}
        onClose={() => setSimulatingTitle(null)}
        assetTitle={simulatingTitle || ''}
      />
    </div>
  );
};
