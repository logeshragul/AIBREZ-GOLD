import React, { useEffect, useState } from 'react';
import { fetchGoldMarketData } from './services/geminiService';
import { DashboardData, FetchStatus } from './types';
import { StatsCard } from './components/StatsCard';
import { MarketChart } from './components/MarketChart';
import { AnalysisCard } from './components/AnalysisCard';
import { BankRates } from './components/BankRates';
import { Ticker } from './components/Ticker';
import { RegionalRates } from './components/RegionalRates';
import { Calculators } from './components/Calculators';
import { ChatBot } from './components/ChatBot';
import { RefreshCw, Coins, Activity, AlertTriangle, Zap } from 'lucide-react';

// Modern Abstract 'A' Logo
const AibrezLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg 
    viewBox="0 0 40 40" 
    fill="none" 
    className={`${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20 4L4 36H12L20 18L28 36H36L20 4Z" fill="currentColor" className="text-amber-500" />
    <path d="M10 30H30" stroke="currentColor" strokeWidth="2" className="text-amber-600/30" />
  </svg>
);

const App: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [status, setStatus] = useState<FetchStatus>(FetchStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setStatus(FetchStatus.LOADING);
    setError(null);
    try {
      const result = await fetchGoldMarketData();
      setData(result);
      setStatus(FetchStatus.SUCCESS);
    } catch (err: any) {
      setStatus(FetchStatus.ERROR);
      if (err.message?.includes('API key')) {
        setError('Invalid API Configuration. Please check your Gemini API key.');
      } else {
        setError('Market data currently unavailable. Please try again.');
      }
    }
  };

  useEffect(() => {
    loadData();
    // Refresh every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatINR = (val: number | string) => {
    const num = Number(val);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Loading Screen (Light Mode)
  if (!data && status === FetchStatus.LOADING) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-100/50 via-transparent to-transparent opacity-70"></div>
        <div className="relative z-10 flex flex-col items-center">
          <AibrezLogo className="w-24 h-24 mb-6 animate-pulse" />
          <h1 className="text-3xl font-light text-slate-800 tracking-[0.2em] mb-3">
            AIBREZ<span className="font-bold text-amber-500">GOLD</span>
          </h1>
          <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-widest mt-4">
             <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></div>
             Fetching Live Markets
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Live Ticker */}
      {data && <Ticker data={data.ticker} />}

      <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 space-y-8">
        
        {/* Modern Header */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-200 pb-8">
          <div className="flex items-center gap-4 group">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm group-hover:shadow-md transition-all duration-300">
              <AibrezLogo className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">
                Aibrez<span className="text-amber-500">Gold</span>
              </h1>
              <p className="text-slate-500 text-xs font-semibold tracking-[0.2em] uppercase mt-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                Premium Market Intelligence
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {data && (
                <div className="hidden md:flex flex-col items-end mr-2">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Last Update</span>
                  <span className="text-xs text-slate-700 font-mono bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm">
                    {data.lastUpdated}
                  </span>
                </div>
             )}
            <button 
              onClick={loadData}
              disabled={status === FetchStatus.LOADING}
              className="group flex items-center gap-2.5 bg-slate-900 hover:bg-amber-500 hover:text-white text-white px-5 py-2.5 rounded-xl transition-all duration-300 disabled:opacity-50 text-sm font-bold shadow-lg shadow-slate-200 hover:shadow-amber-500/20"
            >
              <RefreshCw className={`w-4 h-4 ${status === FetchStatus.LOADING ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              <span>{status === FetchStatus.LOADING ? 'Syncing...' : 'Refresh'}</span>
            </button>
          </div>
        </header>

        {/* Error Notification */}
        {status === FetchStatus.ERROR && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="font-bold text-red-700 text-sm">Connection Interrupted</p>
              <p className="text-xs text-red-600/80">{error}</p>
            </div>
            <button onClick={loadData} className="ml-auto text-xs bg-white border border-red-100 hover:bg-red-50 text-red-600 px-3 py-1.5 rounded-lg transition-colors font-bold shadow-sm">Retry Connection</button>
          </div>
        )}

        {data && (
          <>
            {/* Key Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard 
                title="Gold 24K (10g)" 
                value={formatINR(data.current.price10g24k)} 
                subValue="Pure Standard (99.9%)"
                trend="up"
                icon={<Zap className="w-5 h-5" />}
                highlight
              />
              <StatsCard 
                title="Gold 22K (10g)" 
                value={formatINR(data.current.price10g22k)} 
                subValue="Retail Jewellery"
                trend="neutral"
                icon={<Coins className="w-5 h-5" />}
              />
              <StatsCard 
                title="Gold 18K (10g)" 
                value={formatINR(data.current.price10g18k)} 
                subValue="Studded / Diamond"
                trend="neutral"
                icon={<Coins className="w-5 h-5" />}
              />
              <StatsCard 
                title="Market Sentiment" 
                value={data.analysis.sentiment} 
                trend={data.analysis.sentiment === 'Bullish' ? 'up' : data.analysis.sentiment === 'Bearish' ? 'down' : 'neutral'}
                icon={<Activity className="w-5 h-5" />}
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column (Chart & Tools) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Chart Section */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                     <AibrezLogo className="w-32 h-32 text-amber-500" />
                  </div>
                  <div className="flex justify-between items-center mb-6 relative z-10">
                    <div>
                      <h3 className="text-slate-800 text-lg font-bold tracking-tight">Price Performance</h3>
                      <p className="text-slate-500 text-xs mt-1 font-medium">Spot Price History (7 Days)</p>
                    </div>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                      Live Data
                    </span>
                  </div>
                  <MarketChart data={data.history} />
                </div>

                {/* Regional & Calc Split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <RegionalRates rates={data.regional || []} />
                   <Calculators 
                      goldPrice24k={data.current.price10g24k} 
                      goldPrice22k={data.current.price10g22k}
                      silverPriceKg={data.ticker.silverKg}
                   />
                </div>
              </div>

              {/* Right Column (Bank & Analysis) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <BankRates 
                   rates={data.bankRates || []} 
                   marketPrice10g={data.current.price10g24k} 
                />
                <AnalysisCard analysis={data.analysis} />
              </div>
            </div>
          </>
        )}

        {/* Minimal Footer */}
        <footer className="text-center pt-16 pb-8 mt-auto border-t border-slate-200">
          <div className="flex flex-col items-center justify-center gap-3">
             <AibrezLogo className="w-6 h-6 text-slate-300 hover:text-amber-500 transition-colors duration-300" />
             <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <span>Created by <span className="text-slate-700 font-bold">aibrez</span></span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span>Developed by <span className="text-slate-700 font-bold">logeshragul</span></span>
             </div>
             <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-2 font-semibold">© {new Date().getFullYear()} Aibrez Gold Inc.</p>
          </div>
        </footer>
      </div>

      {/* Chatbot Popup */}
      <ChatBot />
    </div>
  );
};

export default App;