import React from 'react';
import { TickerData } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerProps {
  data: TickerData | null;
}

export const Ticker: React.FC<TickerProps> = ({ data }) => {
  if (!data) return null;

  const items = [
    { label: 'SENSEX', value: data.sensex, change: data.sensexChange },
    { label: 'NIFTY 50', value: data.nifty, change: data.niftyChange },
    { label: 'SILVER (Kg)', value: data.silverKg, change: 0, isCurrency: true },
    { label: 'PETROL', value: data.petrol, change: 0, isCurrency: true },
    { label: 'DIESEL', value: data.diesel, change: 0, isCurrency: true },
  ];

  const formatVal = (val: number, isCurrency?: boolean) => {
    if (isCurrency) {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
    }
    return val.toLocaleString('en-IN');
  };

  return (
    <div className="bg-white border-b border-slate-200 py-3 relative z-20 shadow-sm">
      <div className="ticker-wrap">
        <div className="ticker">
          {[...items, ...items, ...items].map((item, i) => (
            <span key={i} className="inline-flex items-center mx-8 text-xs font-semibold tracking-wide">
              <span className="text-slate-500 mr-2">{item.label}</span>
              <span className="text-slate-900 font-mono mr-2">{formatVal(item.value, item.isCurrency)}</span>
              {item.change !== 0 && (
                <span className={`flex items-center text-[10px] ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {Math.abs(item.change)}%
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};