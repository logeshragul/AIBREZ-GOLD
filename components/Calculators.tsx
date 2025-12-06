import React, { useState } from 'react';
import { Calculator, ArrowRightLeft } from 'lucide-react';

interface CalculatorProps {
  goldPrice24k: number;
  goldPrice22k: number;
  silverPriceKg: number;
}

type Tab = 'GOLD' | 'SILVER' | 'GST' | 'FX' | 'EMI';

export const Calculators: React.FC<CalculatorProps> = ({ goldPrice24k, goldPrice22k, silverPriceKg }) => {
  const [activeTab, setActiveTab] = useState<Tab>('GOLD');
  
  // Gold State
  const [weight, setWeight] = useState<string>('1');
  const [purity, setPurity] = useState<'24' | '22' | '18'>('22');
  
  // Silver State
  const [silverWeight, setSilverWeight] = useState<string>('10'); // grams

  // GST State
  const [gstAmount, setGstAmount] = useState<string>('50000');

  // FX State
  const [fxAmount, setFxAmount] = useState<string>('1000');
  const [fromCurrency, setFromCurrency] = useState<string>('INR');
  const [toCurrency, setToCurrency] = useState<string>('USD');

  // EMI State
  const [loanAmount, setLoanAmount] = useState<string>('100000');
  const [interestRate, setInterestRate] = useState<string>('10.5'); // Annual Rate
  const [tenure, setTenure] = useState<string>('2'); // Years

  // Approximate rates relative to INR (How many INR is 1 unit of Currency)
  const rates: Record<string, number> = {
    'INR': 1,
    'USD': 84.50,
    'EUR': 92.10,
    'GBP': 108.50,
    'AED': 23.01,
    'SGD': 63.50,
    'AUD': 55.20,
    'CAD': 61.80,
    'SAR': 22.50,
    'KWD': 275.00
  };

  const formatINR = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  
  const formatCurrency = (val: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: currency,
      maximumFractionDigits: 2 
    }).format(val);
  };

  const calculateGold = () => {
    const w = parseFloat(weight) || 0;
    let basePrice = 0;
    if (purity === '24') basePrice = goldPrice24k / 10;
    if (purity === '22') basePrice = goldPrice22k / 10;
    if (purity === '18') basePrice = (goldPrice24k / 10) * 0.75;
    
    const itemPrice = basePrice * w;
    const gst = itemPrice * 0.03; // 3% GST standard
    const total = itemPrice + gst;
    
    return { itemPrice, gst, total };
  };

  const calculateSilver = () => {
    const w = parseFloat(silverWeight) || 0;
    const pricePerGram = silverPriceKg / 1000;
    const itemPrice = pricePerGram * w;
    const gst = itemPrice * 0.03;
    const total = itemPrice + gst;
    return { itemPrice, gst, total };
  };

  const calculateGST = () => {
    const amt = parseFloat(gstAmount) || 0;
    return {
      gst3: amt * 0.03,
      total: amt * 1.03
    };
  };

  const calculateFX = () => {
    const amt = parseFloat(fxAmount) || 0;
    const rateFrom = rates[fromCurrency];
    const rateTo = rates[toCurrency];
    
    // Convert to INR first (Base), then to Target
    const valInINR = amt * rateFrom;
    const finalVal = valInINR / rateTo;
    
    return {
        result: finalVal,
        rate: rateFrom / rateTo
    };
  };

  const calculateEMI = () => {
    const P = parseFloat(loanAmount) || 0;
    const R = (parseFloat(interestRate) || 0) / 12 / 100; // Monthly Rate
    const N = (parseFloat(tenure) || 0) * 12; // Months

    if (P === 0 || R === 0 || N === 0) return { emi: 0, totalInterest: 0, totalAmount: 0 };

    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalAmount = emi * N;
    const totalInterest = totalAmount - P;

    return { emi, totalInterest, totalAmount };
  };

  const renderContent = () => {
    if (activeTab === 'GOLD') {
      const { itemPrice, gst, total } = calculateGold();
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 block font-bold">Weight (grams)</label>
               <input 
                 type="number" 
                 value={weight} 
                 onChange={(e) => setWeight(e.target.value)}
                 className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm font-medium"
               />
             </div>
             <div>
               <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 block font-bold">Purity</label>
               <select 
                 value={purity} 
                 onChange={(e) => setPurity(e.target.value as any)}
                 className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm appearance-none font-medium cursor-pointer"
               >
                 <option value="24">24K (Pure)</option>
                 <option value="22">22K (Std)</option>
                 <option value="18">18K (Light)</option>
               </select>
             </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-200">
            <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Base Cost</span> <span className="text-slate-900 font-mono">{formatINR(itemPrice)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">GST (3%)</span> <span className="text-slate-900 font-mono">{formatINR(gst)}</span></div>
            <div className="flex justify-between items-center border-t border-slate-200 pt-3">
               <span className="text-amber-600 text-xs uppercase font-bold tracking-wider">Estimate</span> 
               <span className="text-amber-600 text-lg font-bold font-mono">{formatINR(total)}</span>
            </div>
          </div>
        </div>
      );
    }
    
    if (activeTab === 'SILVER') {
      const { itemPrice, gst, total } = calculateSilver();
      return (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 block font-bold">Weight (grams)</label>
            <input 
                 type="number" 
                 value={silverWeight} 
                 onChange={(e) => setSilverWeight(e.target.value)}
                 className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm font-medium"
            />
          </div>
          <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-200">
            <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Base Cost</span> <span className="text-slate-900 font-mono">{formatINR(itemPrice)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">GST (3%)</span> <span className="text-slate-900 font-mono">{formatINR(gst)}</span></div>
            <div className="flex justify-between items-center border-t border-slate-200 pt-3">
               <span className="text-amber-600 text-xs uppercase font-bold tracking-wider">Estimate</span> 
               <span className="text-amber-600 text-lg font-bold font-mono">{formatINR(total)}</span>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'GST') {
      const { gst3, total } = calculateGST();
       return (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 block font-bold">Purchase Amount (INR)</label>
            <input 
                 type="number" 
                 value={gstAmount} 
                 onChange={(e) => setGstAmount(e.target.value)}
                 className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm font-medium"
            />
          </div>
          <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-200">
            <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Tax (3%)</span> <span className="text-slate-900 font-mono">{formatINR(gst3)}</span></div>
            <div className="flex justify-between items-center border-t border-slate-200 pt-3">
               <span className="text-amber-600 text-xs uppercase font-bold tracking-wider">Final Price</span> 
               <span className="text-amber-600 text-lg font-bold font-mono">{formatINR(total)}</span>
            </div>
          </div>
        </div>
       );
    }

    if (activeTab === 'FX') {
        const { result, rate } = calculateFX();
        return (
            <div className="space-y-4">
               <div>
                 <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 block font-bold">Amount</label>
                 <input 
                   type="number" 
                   value={fxAmount} 
                   onChange={(e) => setFxAmount(e.target.value)}
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm font-medium"
                 />
               </div>
               
               <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-end">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 block font-bold">From</label>
                    <select 
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm appearance-none cursor-pointer font-medium"
                    >
                        {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  
                  <div className="pb-3 text-slate-400 flex justify-center">
                    <ArrowRightLeft className="w-4 h-4" />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 block font-bold">To</label>
                    <select 
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm appearance-none cursor-pointer font-medium"
                    >
                        {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
               </div>

               <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-200 mt-2">
                 <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-xs font-medium">Rate (Est)</span>
                    <span className="text-slate-600 text-xs font-mono">1 {fromCurrency} ≈ {rate.toFixed(4)} {toCurrency}</span>
                 </div>
                 <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                    <span className="text-amber-600 text-xs uppercase font-bold tracking-wider">Converted</span> 
                    <span className="text-amber-600 text-lg font-bold font-mono">{formatCurrency(result, toCurrency)}</span>
                 </div>
               </div>
            </div>
        );
    }

    if (activeTab === 'EMI') {
      const { emi, totalInterest, totalAmount } = calculateEMI();
      return (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 block font-bold">Loan Amount</label>
            <input 
                 type="number" 
                 value={loanAmount} 
                 onChange={(e) => setLoanAmount(e.target.value)}
                 className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm font-medium"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 block font-bold">Rate (%)</label>
              <input 
                   type="number" 
                   value={interestRate} 
                   onChange={(e) => setInterestRate(e.target.value)}
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm font-medium"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 block font-bold">Years</label>
              <input 
                   type="number" 
                   value={tenure} 
                   onChange={(e) => setTenure(e.target.value)}
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-200">
            <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Principal</span> <span className="text-slate-900 font-mono">{formatINR(parseFloat(loanAmount) || 0)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Interest</span> <span className="text-slate-900 font-mono">{formatINR(totalInterest)}</span></div>
            <div className="flex justify-between items-center border-t border-slate-200 pt-3">
               <span className="text-amber-600 text-xs uppercase font-bold tracking-wider">Monthly EMI</span> 
               <span className="text-amber-600 text-lg font-bold font-mono">{formatINR(emi)}</span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-1.5 bg-amber-50 rounded-lg">
          <Calculator className="text-amber-600 w-4 h-4" />
        </div>
        <h3 className="text-slate-800 font-semibold">Quick Tools</h3>
      </div>
      
      <div className="flex gap-1 mb-6 p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar">
        {(['GOLD', 'SILVER', 'GST', 'FX', 'EMI'] as Tab[]).map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)} 
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
};