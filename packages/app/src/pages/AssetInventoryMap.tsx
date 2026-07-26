import React, { useState, useMemo } from 'react';
import { Search, MapPin, Eye, Calendar, Sparkles, Filter, ChevronRight, Award, Layers, X, RefreshCw } from 'lucide-react';
import { AssetDetailModal } from '../components/AssetDetailModal';
import { Billboard3DSimulatorModal } from '../components/3dSimulatorModal';

interface InventoryItem {
  id: string;
  title: string;
  city: string;
  area: string;
  category: string;
  monthlyRatePkr: number;
  dailyRatePkr: number;
  impressions: string;
  dailyTrafficNum: number;
  softExpiry: string;
  nocStatus: 'VERIFIED' | 'PENDING';
  imageUrl: string;
}

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'lhr_1',
    title: 'Main Boulevard Gulberg Digital SMD',
    city: 'Lahore',
    area: 'Gulberg III Main Boulevard',
    category: 'DOOH SMD Screen',
    monthlyRatePkr: 950000,
    dailyRatePkr: 35000,
    impressions: '1.2M / day',
    dailyTrafficNum: 1200000,
    softExpiry: 'Sep 15, 2026',
    nocStatus: 'VERIFIED',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'khi_1',
    title: 'Clifton Block 2 Flyover Dual Facing SMD',
    city: 'Karachi',
    area: 'Clifton Block 2 Main Flyover',
    category: 'DOOH SMD Screen',
    monthlyRatePkr: 1200000,
    dailyRatePkr: 45000,
    impressions: '2.1M / day',
    dailyTrafficNum: 2100000,
    softExpiry: 'Oct 01, 2026',
    nocStatus: 'VERIFIED',
    imageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'isb_1',
    title: 'Blue Area Jinnah Avenue Unipole',
    city: 'Islamabad',
    area: 'Blue Area Jinnah Avenue Junction',
    category: 'Roadside OOH',
    monthlyRatePkr: 750000,
    dailyRatePkr: 28000,
    impressions: '850K / day',
    dailyTrafficNum: 850000,
    softExpiry: 'Sep 28, 2026',
    nocStatus: 'VERIFIED',
    imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'lhr_2',
    title: 'DHA Phase 5 Commercial Ring SMD',
    city: 'Lahore',
    area: 'DHA Phase 5 Commercial Ring Exit',
    category: 'DOOH SMD Screen',
    monthlyRatePkr: 850000,
    dailyRatePkr: 31000,
    impressions: '1.4M / day',
    dailyTrafficNum: 1400000,
    softExpiry: 'Sep 20, 2026',
    nocStatus: 'VERIFIED',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'skp_1',
    title: 'Allama Iqbal International Airport Lounge Screen',
    city: 'Lahore',
    area: 'International Departures Lounge',
    category: 'Airport Media',
    monthlyRatePkr: 600000,
    dailyRatePkr: 22000,
    impressions: '180K / day',
    dailyTrafficNum: 180000,
    softExpiry: 'Oct 10, 2026',
    nocStatus: 'VERIFIED',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
  },
];

export const AssetInventoryMap: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [minTraffic, setMinTraffic] = useState(0);
  const [inspectingAsset, setInspectingAsset] = useState<InventoryItem | null>(null);
  const [simulatingTitle, setSimulatingTitle] = useState<string | null>(null);

  // Multi-Param Filtering Logic (Fixes Audit Problems #11, 14, 18, 43)
  const filteredInventory = useMemo(() => {
    return INITIAL_INVENTORY.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCity = selectedCity === 'ALL' || item.city.toUpperCase() === selectedCity.toUpperCase();
      const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchesTraffic = item.dailyTrafficNum >= minTraffic;

      return matchesSearch && matchesCity && matchesCategory && matchesTraffic;
    });
  }, [searchQuery, selectedCity, selectedCategory, minTraffic]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCity('ALL');
    setSelectedCategory('ALL');
    setMinTraffic(0);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="glass-panel p-6 border border-emerald-500/30 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-black mb-2">
              <MapPin className="w-3.5 h-3.5" /> Pinned Ad Properties & Inventory
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">Commercial Inventory & Live Search</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Multi-param filter across billboards, digital SMDs, airport lounges & retail displays</p>
          </div>

          <div className="bg-og-bg/80 p-3 rounded-2xl border border-white/[0.08] text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Matching Ad Properties</span>
            <span className="text-2xl font-black text-emerald-400 font-display">{filteredInventory.length} Available</span>
          </div>
        </div>
      </div>

      {/* Multi-Param Search & Filter Controls */}
      <div className="glass-panel p-5 border border-white/[0.08] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Search Query Input */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search location, area, title or ID (e.g. Gulberg, Clifton, DOOH)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-og-surface border border-white/[0.10] rounded-xl text-xs text-white outline-none focus:border-emerald-500"
            />
          </div>

          {/* City Selector */}
          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full p-3 bg-og-surface border border-white/[0.10] rounded-xl text-xs text-white outline-none cursor-pointer"
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
              className="w-full p-3 bg-og-surface border border-white/[0.10] rounded-xl text-xs text-white outline-none cursor-pointer"
            >
              <option value={0}>Any Daily Traffic</option>
              <option value={500000}>500K+ Vehicles / Day</option>
              <option value={1000000}>1.0M+ Vehicles / Day</option>
              <option value={2000000}>2.0M+ Vehicles / Day</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Active Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.06]">
          <div className="flex flex-wrap gap-1.5">
            {['ALL', 'DOOH SMD Screen', 'Roadside OOH', 'Airport Media'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  selectedCategory === cat ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white/[0.04] text-slate-400 hover:text-white'
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

      {/* Inventory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filteredInventory.map((item) => (
          <div
            key={item.id}
            className="glass-panel overflow-hidden border border-white/[0.08] hover:border-emerald-500/40 transition group flex flex-col justify-between"
          >
            <div className="relative aspect-video overflow-hidden bg-og-bg">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md text-emerald-400 text-[10px] font-black rounded-lg border border-emerald-500/30">
                  {item.category}
                </span>
                <span className="px-2 py-1 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold rounded-lg border border-white/20">
                  {item.city}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-display group-hover:text-emerald-400 transition">{item.title}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" /> {item.area}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-og-bg/80 border border-white/[0.06] space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Daily Traffic:</span>
                  <strong className="text-white">{item.impressions}</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Soft Expiry Date:</span>
                  <strong className="text-amber-400">{item.softExpiry}</strong>
                </div>
                <div className="flex justify-between text-slate-400"><span>Civic NOC Permit:</span><strong className="text-emerald-400 flex items-center gap-1"><Award className="w-3 h-3" /> {item.nocStatus}</strong></div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2 border-t border-white/[0.06]">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Monthly Rate</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white font-display">{item.monthlyRatePkr.toLocaleString()} <span className="text-xs font-normal">PKR</span></span>
                </div>

                <button
                  onClick={() => setInspectingAsset(item)}
                  className="px-4 py-2.5 btn-emerald text-xs font-extrabold flex items-center gap-1 shadow-md cursor-pointer"
                >
                  Deep Inspector <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
