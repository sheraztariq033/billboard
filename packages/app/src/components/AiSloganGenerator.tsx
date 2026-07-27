import React, { useState } from 'react';
import { Sparkles, Copy, Check, RefreshCw, Wand2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const AiSloganGenerator: React.FC = () => {
  const { showToast } = useToast();
  const [category, setCategory] = useState<'Ramadan' | 'Telecom' | 'RealEstate' | 'Beverage'>('Ramadan');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const slogans = {
    Ramadan: [
      { urdu: 'ہر افطار کے ساتھ، ذائقہ اور محبت!', english: 'With Every Iftar, Taste & Pure Love!' },
      { urdu: 'اس رمضان، اپنوں کے لیے بہترین انتخاب!', english: 'This Ramadan, Choose The Best For Your Family!' },
      { urdu: 'برکتوں والا مہینہ، برکتوں والی لائف!', english: 'Month of Blessings, Lifetime of Happiness!' },
    ],
    Telecom: [
      { urdu: 'پورے پاکستان میں سب سے تیز 5G سپیڈ!', english: 'Fastest 5G Network Across All Pakistan!' },
      { urdu: 'ہر لمحہ جڑیں، بنا کسی رکاوٹ کے!', english: 'Stay Connected Seamlessly Everywhere!' },
    ],
    RealEstate: [
      { urdu: 'گلبرگ کا سب سے شاندار رہائشی منصوبہ!', english: 'Gulberg’s Most Luxurious Residential Project!' },
      { urdu: 'اپنا خوابوں کا گھر، آج ہی بک کروائیں!', english: 'Book Your Dream Home in Prime Location Today!' },
    ],
    Beverage: [
      { urdu: 'تازگی کا حقیقی احساس، ہر گھونٹ میں!', english: 'True Refreshment in Every Single Sip!' },
      { urdu: 'گرمی کا توڑ، پاکستان کا پسندیدہ برانڈ!', english: 'Beat The Heat With Pakistan’s Favorite Drink!' },
    ],
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    showToast('Slogan copied to clipboard!', 'success');
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">AI Ad Copy & Slogan Generator</h3>
            <p className="text-xs text-slate-400">Generate high-converting bilingual slogans for DOOH billboard creatives.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {(['Ramadan', 'Telecom', 'RealEstate', 'Beverage'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                category === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {slogans[category].map((item, idx) => (
          <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <p className="text-base font-extrabold text-amber-400 leading-snug">{item.urdu}</p>
              <p className="text-xs font-semibold text-slate-300">{item.english}</p>
            </div>

            <button
              onClick={() => handleCopy(`${item.urdu} | ${item.english}`, idx)}
              className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 hover:text-white transition"
            >
              <span className="text-[10px] font-semibold text-indigo-400">AI Generated Copy</span>
              <span className="flex items-center gap-1 font-bold">
                {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedIdx === idx ? 'Copied' : 'Copy'}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
