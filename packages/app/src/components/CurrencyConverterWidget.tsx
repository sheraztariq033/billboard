import React, { useState, useEffect } from 'react';
import { RefreshCw, Coins, DollarSign, Globe, Check } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

interface RateFeed {
  baseCurrency: string;
  timestamp: string;
  rates: Record<string, number>;
}

export const CurrencyConverterWidget: React.FC = () => {
  const { showToast } = useToast();
  const [rates, setRates] = useState<Record<string, number>>({
    PKR: 1.0,
    USD: 0.0036,
    AED: 0.0132,
    GBP: 0.0028,
  });
  const [baseValue, setBaseValue] = useState<number>(1000000); // Default 1 Million PKR
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchRates = () => {
    setIsLoading(true);
    api.get<RateFeed>('/currency/rates')
      .then((res) => {
        if (res && res.rates) {
          setRates(res.rates);
          showToast('Live currency rates updated successfully!', 'success');
        }
      })
      .catch(() => {
        showToast('Using cached currency feed', 'info');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const convertedValue = Math.round(baseValue * (rates[selectedCurrency] || 1));

  const currencySymbols: Record<string, string> = {
    PKR: 'Rs.',
    USD: '$',
    AED: 'د.إ',
    GBP: '£',
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Multi-Currency Exchange Switcher</h3>
            <p className="text-xs text-slate-400">Live edge rates for PKR, USD, AED, and GBP conversions.</p>
          </div>
        </div>

        <button
          onClick={fetchRates}
          disabled={isLoading}
          className="p-2 rounded-lg bg-slate-950 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-400">Base Amount (PKR)</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Rs.</span>
            <input
              type="number"
              value={baseValue}
              onChange={(e) => setBaseValue(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-semibold"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-400">Target Currency</label>
          <div className="grid grid-cols-4 gap-2">
            {['PKR', 'USD', 'AED', 'GBP'].map((cur) => (
              <button
                key={cur}
                onClick={() => setSelectedCurrency(cur)}
                className={`py-2.5 rounded-xl font-bold border transition cursor-pointer text-center ${
                  selectedCurrency === cur
                    ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-850 hover:text-white hover:border-slate-700'
                }`}
              >
                {cur}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">CONVERTED PRICE</span>
          <span className="text-xl font-black text-white mt-1 block">
            {currencySymbols[selectedCurrency] || ''} {convertedValue.toLocaleString()} <span className="text-xs text-slate-500 font-bold">{selectedCurrency}</span>
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">LIVE CONVERSION RATE</span>
          <span className="text-xs font-bold text-slate-300 mt-1 block">
            1 PKR = {rates[selectedCurrency]} {selectedCurrency}
          </span>
        </div>
      </div>
    </div>
  );
};
