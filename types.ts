export interface GoldData {
  price: number; // Price per Ounce
  price10g24k: number;
  price10g22k: number;
  price10g18k: number;
  currency: string;
  changeAmount: number;
  changePercent: number;
  timestamp: string;
}

export interface BankRate {
  name: string;
  price: number;
  unit: string;
  timestamp?: string;
}

export interface RegionalRate {
  location: string;
  price24k: number;
  price22k: number;
}

export interface TickerData {
  sensex: number;
  sensexChange: number;
  nifty: number;
  niftyChange: number;
  silverKg: number;
  petrol: number;
  diesel: number;
}

export interface MarketAnalysis {
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  summary: string;
  keyFactors: string[];
  recommendation: string;
}

export interface HistoryPoint {
  date: string;
  price: number;
}

export interface DashboardData {
  current: GoldData;
  ticker: TickerData;
  regional: RegionalRate[];
  analysis: MarketAnalysis;
  history: HistoryPoint[];
  bankRates: BankRate[];
  lastUpdated: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export enum FetchStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}