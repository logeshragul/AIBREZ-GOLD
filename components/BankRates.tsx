import React from 'react';
import { BankRate } from '../types';
import { Building2, TrendingUp } from 'lucide-react';

interface BankRatesProps {
  rates: BankRate[];
  marketPrice10g: number;
}

export const BankRates: React.FC<BankRatesProps> = ({ rates, marketPrice10g }) => {
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
           <div className="p-2 bg-amber-50 rounded-lg">
             <Building2 className="w-4 h-4 text-amber-600" />
           </div>
           <div>
             <h3 className="text-slate-800 text-base font-semibold leading-tight">Bank & Retail</h3>
             <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Live Comparison</p>
           </div>
        </div>
      </div>

      <div className="space-y-3 flex-1">
        {/* Market Benchmark Row */}
        <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200 mb-4 relative overflow-hidden">
           <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
           <div className="flex flex-col z-10 pl-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Spot Market</span>
              <span className="text-[10px] text-slate-500 font-medium">Benchmark Base</span>
           </div>
           <span className="text-slate-800 font-mono font-bold text-sm bg-white border border-slate-200 px-2 py-1 rounded shadow-sm">
              {formatINR(marketPrice10g)}
           </span>
        </div>

        {/* Bank Rows */}
        <div className="space-y-2">
        {rates.map((rate, index) => {
          const diff = rate.price - marketPrice10g;
          const diffPercent = ((diff / marketPrice10g) * 100).toFixed(1);
          
          return (
            <div key={index} className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200 group">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{rate.name}</span>
                <span className="text-[10px] text-slate-500">24K Coin</span>
              </div>
              <div className="text-right">
                <div className="text-amber-600 font-mono font-bold text-sm">{formatINR(rate.price)}</div>
                <div className="text-[10px] text-slate-500 flex items-center justify-end gap-1 font-medium">
                  <TrendingUp className="w-2.5 h-2.5 text-slate-400" />
                  +{diffPercent}%
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
};