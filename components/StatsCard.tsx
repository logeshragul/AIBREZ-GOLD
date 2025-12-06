import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
  highlight?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  subValue, 
  trend, 
  icon,
  className = "",
  highlight = false
}) => {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-slate-500';
  
  return (
    <div className={`
      relative overflow-hidden rounded-2xl p-5 border transition-all duration-300
      ${highlight 
        ? 'bg-amber-50 border-amber-200 shadow-md shadow-amber-500/10' 
        : 'bg-white border-slate-200 hover:border-amber-500/30 hover:shadow-lg hover:shadow-slate-200/50'
      } 
      ${className}
    `}>
      {highlight && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-3xl rounded-full -mr-8 -mt-8"></div>
      )}
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</h3>
        {icon && <div className={`${highlight ? 'text-amber-500' : 'text-slate-400'}`}>{icon}</div>}
      </div>
      
      <div className="relative z-10">
        <div className={`text-2xl font-bold tracking-tight mb-1 ${highlight ? 'text-amber-900' : 'text-slate-900'}`}>
          {value}
        </div>
        {subValue && (
          <div className={`text-xs font-semibold flex items-center gap-1 ${trendColor}`}>
            {subValue}
          </div>
        )}
      </div>
    </div>
  );
};