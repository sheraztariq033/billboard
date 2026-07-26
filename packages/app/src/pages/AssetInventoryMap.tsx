import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Eye, Calendar, Sparkles, Filter, ChevronRight, Award, Layers, X, RefreshCw, Loader2 } from 'lucide-react';
import { AssetDetailModal } from '../components/AssetDetailModal';
import { Billboard3DSimulatorModal } from '../components/3dSimulatorModal';
import { api } from '../lib/api';

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
}

export const AssetInventoryMap: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [minTraffic, setMinTraffic] = useState(0);
  const [inspectingAsset, setInspectingAsset] = useState<any | null>(null);
  const [simulatingTitle, setSimulatingTitle] = useState<string | null>(null);

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
              <MapPin className="w-3.5 h-3.5" /> Pinned Ad Properties & Inventory
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">Commercial Inventory & Live Search</h2>
            <p className="text-xs text-slate-400 mt-1">Multi-param filter connected to Cloudflare Workers & D1 Database API</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Matching Properties</span>
            <span className="text-2xl font-black text-emerald-400 font-display">{filteredInventory.length} Available</span>
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

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-900 border border-slate-800 rounded-2xl">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
          <p className="text-xs text-slate-400 font-medium">Fetching live inventory from Cloudflare D1 database API...</p>
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
