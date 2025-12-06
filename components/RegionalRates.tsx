import React from 'react';
import { RegionalRate } from '../types';
import { MapPin } from 'lucide-react';

interface RegionalRatesProps {
  rates: RegionalRate[];
}

export const RegionalRates: React.FC<RegionalRatesProps> = ({ rates }) => {
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-1.5 bg-amber-50 rounded-lg">
          <MapPin className="text-amber-600 w-4 h-4" />
        </div>
        <h3 className="text-slate-800 font-semibold">Regional Prices</h3>
      </div>
      
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-sm text-left">
          <thead className="text-[10px] text-slate-500 uppercase bg-slate-50">
            <tr>
              <th className="px-4 py-3 font-bold tracking-wider">City</th>
              <th className="px-4 py-3 text-right font-bold tracking-wider">22K <span className="text-slate-400 normal-case font-normal">(10g)</span></th>
              <th className="px-4 py-3 text-right font-bold tracking-wider text-amber-600">24K <span className="text-amber-600/50 normal-case font-normal">(10g)</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rates.map((rate, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-4 py-3 font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{rate.location}</td>
                <td className="px-4 py-3 text-right font-mono text-slate-600 group-hover:text-slate-800 font-medium">{formatINR(rate.price22k)}</td>
                <td className="px-4 py-3 text-right font-mono text-amber-600 group-hover:text-amber-700 font-bold">{formatINR(rate.price24k)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};