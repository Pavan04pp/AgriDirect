import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Building2,
  Tractor,
  Truck,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Package,
  Clock,
  Sparkles,
  MapPin,
  Lock,
  HeartHandshake,
  BarChart3,
  Layers,
  Activity,
  Shield,
  Zap,
  TrendingDown
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

interface LandingPageProps {
  onNavigateToApp: () => void;
  onOpenAuth: (mode: 'login' | 'signup', role?: UserRole) => void;
}

// Live Commodity Pricing Comparison Data (APMC Mandi vs Agridirect Direct Contract)
const MARKET_TREND_DATA = [
  { day: 'Mon', apmcPrice: 28, agreeDirectPrice: 38, farmerCost: 21, volumeMT: 12 },
  { day: 'Tue', apmcPrice: 24, agreeDirectPrice: 38, farmerCost: 21, volumeMT: 18 },
  { day: 'Wed', apmcPrice: 19, agreeDirectPrice: 38, farmerCost: 21, volumeMT: 26 },
  { day: 'Thu', apmcPrice: 31, agreeDirectPrice: 39, farmerCost: 22, volumeMT: 31 },
  { day: 'Fri', apmcPrice: 22, agreeDirectPrice: 39, farmerCost: 22, volumeMT: 42 },
  { day: 'Sat', apmcPrice: 27, agreeDirectPrice: 39, farmerCost: 22, volumeMT: 48 },
  { day: 'Sun', apmcPrice: 25, agreeDirectPrice: 40, farmerCost: 23, volumeMT: 54 },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToApp,
  onOpenAuth
}) => {
  const { demands, isAuthenticated } = useApp();
  const [activeGraphMetric, setActiveGraphMetric] = useState<'price' | 'profit' | 'volume'>('price');

  const publicDemands = demands.slice(0, 4);

  return (
    <div id="landing-page" className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-8 space-y-8 sm:space-y-12">
      
      {/* Hero Section: Enterprise Demand-First Positioning with Modern Glassmorphism */}
      <div className="glass-card p-5 sm:p-8 lg:p-12 relative overflow-hidden rounded-[24px] sm:rounded-[32px] border border-white/85 shadow-xl">
        {/* Atmospheric Ambient Diffuse Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-bl from-[#2F5233]/20 via-[#C77B2E]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gradient-to-tr from-[#2F5233]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Balanced 2-Column Grid: Left Content + Right Live Terminal Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center relative z-10">
          
          {/* Left Column (7 cols): Main Value Proposition & Actions */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#EAF0E7]/80 backdrop-blur-sm text-[#2F5233] text-[11px] sm:text-xs font-extrabold tracking-wide shadow-xs border border-[#2F5233]/25">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D4F] animate-pulse" />
              <span>Agridirect Agritech Network</span>
              <span>•</span>
              <span className="text-[#C77B2E]">Zero Broker Deductions</span>
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-[52px] text-[#1C2321] tracking-tight leading-[1.14]">
              Direct Farmgate-to-Enterprise Agricultural Procurement.
            </h1>

            <p className="text-[#5B6660] text-xs sm:text-base lg:text-lg leading-relaxed max-w-2xl">
              Eliminating mandi broker commissions and post-harvest produce waste. Institutional kitchens, hotels, and retail buyers lock verified demand contracts; Agridirect aggregates certified local farm supply and coordinates consolidated cold freight routing.
            </p>

            {/* Action Buttons Cluster */}
            <div className="pt-1 flex flex-wrap items-center gap-2.5 sm:gap-3">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={onNavigateToApp}
                  className="clay-button-primary min-h-[44px] px-6 sm:px-7 py-3 sm:py-3.5 flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm font-extrabold rounded-[16px]"
                >
                  <span>Enter Operations Desk</span>
                  <ArrowRight size={17} />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onOpenAuth('signup', 'buyer')}
                    className="clay-button-primary min-h-[44px] px-5 sm:px-6 py-3 sm:py-3.5 flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-extrabold rounded-[16px] shadow-sm"
                  >
                    <span>Post Verified Demand</span>
                    <ArrowRight size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenAuth('signup', 'farmer')}
                    className="clay-button-secondary min-h-[44px] px-4 sm:px-5 py-3 sm:py-3.5 flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-bold rounded-[16px]"
                  >
                    <Tractor size={17} className="text-[#2F5233]" />
                    <span>Sell Harvest as Farmer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenAuth('login')}
                    className="min-h-[44px] px-3.5 py-3 text-[#5B6660] hover:text-[#1C2321] font-bold text-xs sm:text-sm cursor-pointer hover:underline flex items-center"
                  >
                    Sign In &rarr;
                  </button>
                </>
              )}
            </div>

            {/* Key Metric Highlights in Translucent Frosted Glass Badges */}
            <div className="pt-4 border-t border-[#DDD9CD]/70 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="glass-pill bg-white/70 p-3 rounded-[16px] border border-white/80 flex flex-col justify-center">
                <span className="text-[10px] uppercase font-bold text-[#5B6660] block mb-0.5">Procurement Flow</span>
                <span className="font-display font-extrabold text-base text-[#1C2321] block">48.5 MT / Mo</span>
              </div>
              <div className="glass-pill bg-white/70 p-3 rounded-[16px] border border-white/80 flex flex-col justify-center">
                <span className="text-[10px] uppercase font-bold text-[#5B6660] block mb-0.5">Farmer Margin</span>
                <span className="font-display font-extrabold text-base text-[#2E7D4F] block">+19.4% Premium</span>
              </div>
              <div className="glass-pill bg-white/70 p-3 rounded-[16px] border border-white/80 flex flex-col justify-center">
                <span className="text-[10px] uppercase font-bold text-[#5B6660] block mb-0.5">Damage Buffer</span>
                <span className="font-display font-extrabold text-base text-[#C77B2E] block">±5% Tolerance</span>
              </div>
              <div className="glass-pill bg-white/70 p-3 rounded-[16px] border border-white/80 flex flex-col justify-center">
                <span className="text-[10px] uppercase font-bold text-[#5B6660] block mb-0.5">Clearing Speed</span>
                <span className="font-display font-extrabold text-base text-[#1C2321] block">4.8 Hours Avg</span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Live Agritech Terminal & Direct Quick Connect */}
          <div className="lg:col-span-5 w-full">
            <div className="glass-card-dark p-6 sm:p-7 rounded-[28px] space-y-5 relative overflow-hidden border border-emerald-400/30">
              
              {/* Header with Live Status Tag */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80] animate-ping" />
                  <span className="text-xs font-bold text-[#4ADE80] uppercase tracking-wider font-mono">
                    Live Clearing Corridor
                  </span>
                </div>
                <span className="text-[11px] text-white/60 font-mono">
                  Kolar ⇄ Bengaluru
                </span>
              </div>

              {/* Trade Spotlight */}
              <div className="bg-white/5 border border-white/10 p-4 rounded-[20px] backdrop-blur-md space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold block">
                      Active Contract Escrow
                    </span>
                    <h3 className="font-display font-bold text-base text-white">
                      Hybrid Roma Tomatoes (Grade A)
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                    2,500 kg
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="bg-black/30 p-2.5 rounded-[14px] border border-white/5">
                    <span className="text-[10px] text-white/60 block">Agridirect Fixed</span>
                    <span className="font-bold text-base text-[#4ADE80]">₹38.00 / kg</span>
                  </div>
                  <div className="bg-black/30 p-2.5 rounded-[14px] border border-white/5">
                    <span className="text-[10px] text-white/60 block">Mandi Spot Rate</span>
                    <span className="font-bold text-base text-[#F87171] line-through opacity-85">₹24.50 / kg</span>
                  </div>
                </div>

                {/* 30-min window progress indicator */}
                <div className="pt-1">
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="text-white/70 flex items-center gap-1">
                      <Clock size={12} className="text-amber-400" />
                      Locked Acceptance Window:
                    </span>
                    <span className="font-mono font-bold text-amber-400 animate-pulse">
                      00:24:18 left
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full w-4/5" />
                  </div>
                </div>
              </div>

              {/* Direct 1-Click Google Sign-In Callout */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="w-full h-12 rounded-[18px] bg-white hover:bg-gray-100 text-[#1C2321] font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-md cursor-pointer hover:scale-[1.01]"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Quick Connect with Google</span>
                </button>

                {/* 3 Quick Role Selection Pills */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <button
                    type="button"
                    onClick={() => onOpenAuth('login', 'farmer')}
                    className="p-2 rounded-[14px] bg-white/10 hover:bg-white/20 border border-white/10 text-[11px] font-bold text-white transition-colors cursor-pointer"
                  >
                    🌾 Farmer
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenAuth('login', 'buyer')}
                    className="p-2 rounded-[14px] bg-white/10 hover:bg-white/20 border border-white/10 text-[11px] font-bold text-white transition-colors cursor-pointer"
                  >
                    🏢 Buyer
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenAuth('login', 'logistics')}
                    className="p-2 rounded-[14px] bg-white/10 hover:bg-white/20 border border-white/10 text-[11px] font-bold text-white transition-colors cursor-pointer"
                  >
                    🚚 Fleet
                  </button>
                </div>
              </div>

              {/* Trust Subtext */}
              <div className="text-[11px] text-white/60 flex items-center justify-between pt-1 border-t border-white/10">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  AES-256 Escrow Protected
                </span>
                <span>±5% Damage Buffer</span>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Interactive Visual Graph: Market Economics & Mandi Volatility Comparison */}
      <div className="glass-card p-6 sm:p-8 space-y-6 rounded-[28px] border border-white/85 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="glass-pill bg-[#EAF0E7] text-[#2F5233] px-3 py-1 rounded-full text-[11px] font-extrabold border border-[#2F5233]/20">
                LIVE MARKET ANALYTICS
              </span>
              <span className="text-[11px] text-[#5B6660] font-mono">APMC Mandi vs Agridirect Contract</span>
            </div>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#1C2321]">
              Predictable Pricing Curve vs. Mandi Volatility
            </h2>
            <p className="text-xs sm:text-sm text-[#5B6660] max-w-xl">
              While conventional wholesale mandis fluctuate up to 60% in a single week, Agridirect locks guaranteed fair contract pricing with ±5% transit tolerance.
            </p>
          </div>

          {/* Graph Metric Tab Switcher */}
          <div className="bg-white/80 backdrop-blur-sm border border-white/90 p-1 flex rounded-[18px] self-start sm:self-auto shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveGraphMetric('price')}
              className={`px-3 py-1.5 rounded-[14px] text-xs font-bold transition-all cursor-pointer ${
                activeGraphMetric === 'price' ? 'bg-[#2F5233] text-white shadow-sm' : 'text-[#5B6660] hover:text-[#1C2321]'
              }`}
            >
              Price Realization (₹/kg)
            </button>
            <button
              type="button"
              onClick={() => setActiveGraphMetric('profit')}
              className={`px-3 py-1.5 rounded-[14px] text-xs font-bold transition-all cursor-pointer ${
                activeGraphMetric === 'profit' ? 'bg-[#2F5233] text-white shadow-sm' : 'text-[#5B6660] hover:text-[#1C2321]'
              }`}
            >
              Net Margin (%)
            </button>
            <button
              type="button"
              onClick={() => setActiveGraphMetric('volume')}
              className={`px-3 py-1.5 rounded-[14px] text-xs font-bold transition-all cursor-pointer ${
                activeGraphMetric === 'volume' ? 'bg-[#2F5233] text-white shadow-sm' : 'text-[#5B6660] hover:text-[#1C2321]'
              }`}
            >
              Fulfillment Volume (MT)
            </button>
          </div>
        </div>

        {/* Recharts Area Chart Container with Frosted Well */}
        <div className="p-4 sm:p-6 rounded-[24px] bg-white/60 backdrop-blur-md border border-white/90 shadow-2xs">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MARKET_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="agreeDirectGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2F5233" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2F5233" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="mandiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B3412C" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#B3412C" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#DDD9CD" vertical={false} opacity={0.6} />
                <XAxis dataKey="day" stroke="#5B6660" fontSize={12} tickLine={false} />
                <YAxis stroke="#5B6660" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                  formatter={(value: any, name: any) => [
                    `${value} ${activeGraphMetric === 'volume' ? 'MT' : '₹/kg'}`,
                    name === 'agreeDirectPrice' ? 'Agridirect Contract' : name === 'apmcPrice' ? 'APMC Mandi Spot' : name
                  ]}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  formatter={(value) => (value === 'agreeDirectPrice' ? 'Agridirect Locked Contract Price' : 'Unstable Mandi Spot Price')}
                />
                <Area
                  type="monotone"
                  dataKey="agreeDirectPrice"
                  stroke="#2F5233"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#agreeDirectGrad)"
                  name="agreeDirectPrice"
                />
                <Area
                  type="monotone"
                  dataKey="apmcPrice"
                  stroke="#B3412C"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#mandiGrad)"
                  name="apmcPrice"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#DDD9CD]/60 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-[#2F5233]" />
              <span className="text-[#1C2321] font-bold">Stable ₹38-₹40/kg Direct Escrow</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-[#B3412C]" />
              <span className="text-[#5B6660]">Mandi Drop to ₹19/kg on Surplus Days</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Sparkles size={14} className="text-[#C77B2E]" />
              <span className="text-[#2F5233] font-bold">Farmers Earn +₹18,000/Batch Extra</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stakeholder Onboarding Cards: For all 3 roles (Farmer, Buyer, Logistics) */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-extrabold text-2xl text-[#1C2321]">
              Engineered for Every Agricultural Stakeholder
            </h2>
            <p className="text-xs sm:text-sm text-[#5B6660]">
              Select your operational desk to explore specialized workflows or launch verified access
            </p>
          </div>
          <span className="text-xs font-bold text-[#2F5233] bg-[#EAF0E7] px-3.5 py-1.5 rounded-full hidden sm:inline border border-[#2F5233]/20">
            Karnataka Agricultural Corridor
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Farmer Card */}
          <div className="glass-card-sage p-6 sm:p-7 rounded-[26px] flex flex-col justify-between group border border-emerald-300/40 shadow-md hover:shadow-lg transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-[18px] bg-[#2F5233] text-white flex items-center justify-center shadow-md">
                <Tractor size={24} />
              </div>
              <h3 className="font-display font-extrabold text-xl text-[#1C2321] group-hover:text-[#2F5233] transition-colors">
                For Farmers & FPOs
              </h3>
              <p className="text-xs text-[#5B6660] leading-relaxed">
                Sell directly to verified commercial kitchens at transparent negotiated prices. No broker deduction, 30-minute locked demand commitment, and ±5% transit tolerance buffer.
              </p>
              <ul className="text-xs text-[#1C2321] space-y-2 pt-1 font-semibold">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#2F5233] shrink-0" />
                  <span>Kannada-first interface (ಕನ್ನಡ ಬೆಂಬಲ)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#2F5233] shrink-0" />
                  <span>AI optical produce quality assessment</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#2F5233] shrink-0" />
                  <span>Instant direct bank escrow payout</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-[#2F5233]/20 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenAuth('signup', 'farmer')}
                className="clay-button-primary flex-1 py-2.5 text-xs font-bold cursor-pointer rounded-[14px]"
              >
                Join as Farmer
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('login', 'farmer')}
                className="clay-button-secondary px-3.5 py-2.5 text-xs font-bold cursor-pointer rounded-[14px]"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Buyer Card */}
          <div className="glass-card-terracotta p-6 sm:p-7 rounded-[26px] flex flex-col justify-between group border border-amber-300/40 shadow-md hover:shadow-lg transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-[18px] bg-[#C77B2E] text-white flex items-center justify-center shadow-md">
                <Building2 size={24} />
              </div>
              <h3 className="font-display font-extrabold text-xl text-[#1C2321] group-hover:text-[#C77B2E] transition-colors">
                For Commercial Buyers
              </h3>
              <p className="text-xs text-[#5B6660] leading-relaxed">
                Hotels, cloud kitchens, caterers, and supermarkets. Post verified demand specifications, review AI-aggregated farmer supply bundles, and enjoy scheduled farmgate delivery.
              </p>
              <ul className="text-xs text-[#1C2321] space-y-2 pt-1 font-semibold">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#C77B2E] shrink-0" />
                  <span>30-minute owner acceptance control</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#C77B2E] shrink-0" />
                  <span>Deterministic multi-farmer pooling</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#C77B2E] shrink-0" />
                  <span>GST invoice & audit trail generation</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-[#C77B2E]/20 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenAuth('signup', 'buyer')}
                className="clay-button-accent flex-1 py-2.5 text-xs font-bold cursor-pointer rounded-[14px]"
              >
                Register as Buyer
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('login', 'buyer')}
                className="clay-button-secondary px-3.5 py-2.5 text-xs font-bold cursor-pointer rounded-[14px]"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Logistics Fleet Card */}
          <div className="glass-card-sapphire p-6 sm:p-7 rounded-[26px] flex flex-col justify-between group border border-sky-300/40 shadow-md hover:shadow-lg transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-[18px] bg-[#3B6FA0] text-white flex items-center justify-center shadow-md">
                <Truck size={24} />
              </div>
              <h3 className="font-display font-extrabold text-xl text-[#1C2321] group-hover:text-[#3B6FA0] transition-colors">
                For Logistics Carriers
              </h3>
              <p className="text-xs text-[#5B6660] leading-relaxed">
                Truck operators and transport fleets. Receive consolidated multi-stop farm pickup batches with pre-calculated optimal route sequencing and guaranteed load factor.
              </p>
              <ul className="text-xs text-[#1C2321] space-y-2 pt-1 font-semibold">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#3B6FA0] shrink-0" />
                  <span>Optimal multi-stop route sequencing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#3B6FA0] shrink-0" />
                  <span>QR code pickup verification scanning</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#3B6FA0] shrink-0" />
                  <span>Guaranteed minimum trip payout</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-[#3B6FA0]/20 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenAuth('signup', 'logistics')}
                className="clay-button-secondary !bg-[#3B6FA0] !text-white flex-1 py-2.5 text-xs font-bold cursor-pointer rounded-[14px]"
              >
                Onboard Fleet
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('login', 'logistics')}
                className="clay-button-secondary px-3.5 py-2.5 text-xs font-bold cursor-pointer rounded-[14px]"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Public Demands Exchange Board Preview */}
      <div className="glass-card p-6 sm:p-8 space-y-5 rounded-[28px] border border-white/85 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="font-display font-extrabold text-xl text-[#1C2321] flex items-center gap-2">
              <BarChart3 size={22} className="text-[#2F5233]" />
              <span>Live Commercial Procurement Demands Board</span>
            </h2>
            <p className="text-xs text-[#5B6660]">
              Active purchase orders posted by institutional buyers seeking immediate farmgate supply on Agridirect
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToApp}
            className="text-xs font-bold text-[#2F5233] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Demands in Dashboard</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {publicDemands.map((demand) => (
            <div
              key={demand.id}
              className="bg-white/75 backdrop-blur-md border border-white/90 p-4 rounded-[20px] space-y-3 hover:shadow-md hover:scale-[1.01] transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1C2321]">{demand.commodity}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#EAF0E7] text-[#2F5233] text-[10px] font-bold border border-[#2F5233]/20">
                  {demand.quality_requirement}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#5B6660]">
                  <span>Buyer:</span>
                  <span className="font-bold text-[#1C2321]">{demand.buyer_name}</span>
                </div>
                <div className="flex justify-between text-[#5B6660]">
                  <span>Volume:</span>
                  <span className="font-bold text-[#1C2321]">{demand.quantity_required} kg</span>
                </div>
                <div className="flex justify-between text-[#5B6660]">
                  <span>Target Range:</span>
                  <span className="font-extrabold text-[#2E7D4F]">
                    ₹{demand.target_price_min || Math.round(demand.target_price * 0.95)} - ₹{demand.target_price_max || Math.round(demand.target_price * 1.05)}/kg
                  </span>
                </div>
                <div className="flex justify-between text-[#5B6660]">
                  <span>Tolerance:</span>
                  <span className="font-semibold text-[#C77B2E]">±{demand.quantity_tolerance_pct || 5}% (~{demand.damage_transit_buffer_kg || 25} kg)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onOpenAuth('login', 'farmer')}
                className="clay-button-secondary w-full mt-2 py-2 text-xs font-bold text-[#2F5233] flex items-center justify-center gap-1 cursor-pointer rounded-[14px]"
              >
                <span>Sign In to Respond &rarr;</span>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
