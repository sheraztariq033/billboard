import React from 'react';
import { FileText, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { exportCommercialPdf } from '../utils/exportPdf';
import { useToast } from '../context/ToastContext';

interface ContractProps {
  campaignName?: string;
  clientName?: string;
  totalCostPkr?: number;
}

export const ContractPdfGenerator: React.FC<ContractProps> = ({
  campaignName = 'Q4 Omnichannel Brand Takeover',
  clientName = 'PepsiCo Pakistan / Advertising Agency',
  totalCostPkr = 4850000,
}) => {
  const { showToast } = useToast();

  const handleDownloadContract = () => {
    const pstPkr = Math.round(totalCostPkr * 0.16);
    const whtPkr = Math.round(totalCostPkr * 0.03);
    const netPayablePkr = totalCostPkr + pstPkr - whtPkr;

    exportCommercialPdf({
      title: 'OMNI-GRID PAKISTAN — OFFICIAL OOH/DOOH MEDIA LEASE CONTRACT',
      campaignName,
      clientName,
      totalCostPkr: netPayablePkr,
      breakdown: [
        { label: 'Gross Billboard Rental Cost', value: `PKR ${totalCostPkr.toLocaleString()}` },
        { label: 'PRA Provincial Sales Tax (16% PST)', value: `PKR ${pstPkr.toLocaleString()}` },
        { label: 'FBR Withholding Tax Deducted (3% WHT)', value: `- PKR ${whtPkr.toLocaleString()}` },
        { label: 'Net Payable via Escrow Account', value: `PKR ${netPayablePkr.toLocaleString()}` },
        { label: 'Escrow Guarantee Status', value: 'LOCKED & VERIFIED BY OMNI-GRID' },
        { label: 'Governing Law', value: 'Courts of Lahore / Karachi, Islamic Republic of Pakistan' },
        { label: 'Proof-of-Play Camera Verification', value: 'Geotagged Real-time Stream Enabled' },
      ],
    });

    showToast('Legal OOH/DOOH Media Contract PDF downloaded!', 'success');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-white">Automated OOH Media Contract & FBR Invoice</h4>
          <p className="text-xs text-slate-400 mt-0.5">Generate legally binding PDF contracts with PRA 16% PST & FBR Section 153 WHT calculations.</p>
        </div>
      </div>

      <button
        onClick={handleDownloadContract}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-950 text-white border border-slate-800 hover:border-emerald-500/50 hover:text-emerald-400 transition cursor-pointer"
      >
        <Download className="w-4 h-4 text-emerald-400" />
        Export Legal Contract PDF
      </button>
    </div>
  );
};
