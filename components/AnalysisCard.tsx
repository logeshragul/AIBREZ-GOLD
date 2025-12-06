import React from 'react';
import { MarketAnalysis } from '../types';
import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';

interface AnalysisCardProps {
  analysis: MarketAnalysis;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis }) => {
  const getSentimentIcon = () => {
    switch (analysis.sentiment) {
      case 'Bullish': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'Bearish': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const getSentimentStyles = () => {
    switch (analysis.sentiment) {
      case 'Bullish': return 'bg-green-50 text-green-700 border-green-200';
      case 'Bearish': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-slate-800 text-base font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          AI Intelligence
        </h3>
        <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 uppercase tracking-wide ${getSentimentStyles()}`}>
          {getSentimentIcon()}
          {analysis.sentiment}
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-200 rounded-full"></div>
          <p className="text-slate-600 text-sm leading-relaxed pl-4 font-medium">
            {analysis.summary}
          </p>
        </div>

        <div>
          <h4 className="text-slate-400 text-[10px] uppercase tracking-widest mb-3 font-bold">Key Market Drivers</h4>
          <ul className="space-y-2">
            {analysis.keyFactors.map((factor, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-600 text-xs group">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:bg-amber-500 transition-colors shrink-0" />
                <span className="group-hover:text-slate-900 transition-colors">{factor}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 border-t border-slate-100">
           <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <h4 className="text-amber-600 text-[10px] uppercase tracking-widest mb-1 font-bold">Final Verdict</h4>
            <p className="text-slate-800 font-semibold text-sm">{analysis.recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};