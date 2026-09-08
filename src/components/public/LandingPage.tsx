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

// Live Commodity Pricing Comparison Data (APMC Mandi vs Agree Direct Direct Contract)
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
    <div id="landing-page" className="max-w-7xl mx-auto px-4 py-4 sm:py-8 space-y-12">
      
      {/* Hero Section: Enterprise Demand-First Positioning with Tactile Claymorphism */}
      <div className="clay-card p-6 sm:p-12 relative overflow-hidden">
        {/* Surrealist / Neorealist Ambient Diffuse Spheres */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-bl from-[#2F5233]/15 via-[#C77B2E]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gradient-to-tr from-[#2F5233]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#EAF0E7] text-[#2F5233] text-xs font-extrabold tracking-wide shadow-xs border border-white/60">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D4F] animate-pulse" />
            <span>Agree Direct Commercial Agritech Platform</span>
            <span>•</span>
            <span className="text-[#C77B2E]">Zero Speculative Intermediaries</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#1C2321] tracking-tight leading-[1.12]">
            Direct Farmgate-to-Enterprise Agricultural Procurement.
          </h1>

          <p className="text-[#5B6660] text-sm sm:text-lg leading-relaxed">
            Eliminating mandi broker commissions and post-harvest produce waste. Institutional kitchens, hotels, and retail buyers lock verified demand contracts; Agree Direct aggregates certified local farm supply and coordinates consolidated cold freight routing.
          </p>

          {/* Tactile Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={onNavigateToApp}
                className="clay-button-primary px-7 py-3.5 flex items-center gap-2.5 cursor-pointer text-sm font-extrabold"
              >
                <span>Enter Operations Desk</span>
                <ArrowRight size={17} />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onOpenAuth('signup', 'buyer')}
                  className="clay-button-primary px-7 py-3.5 flex items-center gap-2.5 cursor-pointer text-sm font-extrabold"
                >
                  <span>Post Verified Demand</span>
                  <ArrowRight size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => onOpenAuth('signup', 'farmer')}
                  className="clay-button-secondary px-6 py-3.5 flex items-center gap-2 cursor-pointer text-sm font-bold"
                >
                  <Tractor size={17} className="text-[#2F5233]" />
                  <span>Sell Harvest as Farmer / FPO</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-3.5 text-[#5B6660] hover:text-[#1C2321] font-bold text-sm cursor-pointer hover:underline"
                >
                  Already registered? Sign In &rarr;
                </button>
              </>
            )}
          </div>

          {/* Key Metric Highlights in Tactile Sunken Clay Badges */}
          <div className="pt-6 border-t border-[#DDD9CD]/70 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="clay-sunken p-3">
              <span className="text-[10px] uppercase font-bold text-[#5B6660] block mb-0.5">Procurement Flow</span>
              <span className="font-display font-extrabold text-base text-[#1C2321] block">48.5 MT / Mo</span>
            </div>
            <div className="clay-sunken p-3">
              <span className="text-[10px] uppercase font-bold text-[#5B6660] block mb-0.5">Farmer Margin</span>
              <span className="font-display font-extrabold text-base text-[#2E7D4F] block">+19.4% Premium</span>
            </div>
            <div className="clay-sunken p-3">
              <span className="text-[10px] uppercase font-bold text-[#5B6660] block mb-0.5">Damage Buffer</span>
              <span className="font-display font-extrabold text-base text-[#C77B2E] block">±5% Tolerance</span>
            </div>
            <div className="clay-sunken p-3">
              <span className="text-[10px] uppercase font-bold text-[#5B6660] block mb-0.5">Clearing Speed</span>
              <span className="font-display font-extrabold text-base text-[#1C2321] block">4.8 Hours Avg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Visual Graph: Market Economics & Mandi Volatility Comparison */}
      <div className="clay-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="clay-badge bg-[#EAF0E7] text-[#2F5233]">LIVE MARKET ANALYTICS</span>
              <span className="text-[11px] text-[#5B6660] font-mono">APMC Mandi vs Agree Direct Contract</span>
            </div>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#1C2321]">
              Predictable Pricing Curve vs. Mandi Volatility
            </h2>
            <p className="text-xs text-[#5B6660] max-w-xl">
              While conventional wholesale mandis fluctuate up to 60% in a single week, Agree Direct locks guaranteed fair contract pricing with ±5% transit tolerance.
            </p>
          </div>

          {/* Graph Metric Tab Switcher */}
          <div className="clay-sunken p-1 flex rounded-[16px] self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveGraphMetric('price')}
              className={`px-3 py-1.5 rounded-[12px] text-xs font-bold transition-all cursor-pointer ${
                activeGraphMetric === 'price' ? 'clay-button-primary !py-1 !px-3 text-xs' : 'text-[#5B6660]'
              }`}
            >
              Price Realization (₹/kg)
            </button>
            <button
              type="button"
              onClick={() => setActiveGraphMetric('profit')}
              className={`px-3 py-1.5 rounded-[12px] text-xs font-bold transition-all cursor-pointer ${
                activeGraphMetric === 'profit' ? 'clay-button-primary !py-1 !px-3 text-xs' : 'text-[#5B6660]'
              }`}
            >
              Net Margin (%)
            </button>
            <button
              type="button"
              onClick={() => setActiveGraphMetric('volume')}
              className={`px-3 py-1.5 rounded-[12px] text-xs font-bold transition-all cursor-pointer ${
                activeGraphMetric === 'volume' ? 'clay-button-primary !py-1 !px-3 text-xs' : 'text-[#5B6660]'
              }`}
            >
              Fulfillment Volume (MT)
            </button>
          </div>
        </div>

        {/* Recharts Area Chart Container with Sunken Clay Well */}
        <div className="clay-sunken p-4 sm:p-6 rounded-[20px] bg-[#FAF9F5]">
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
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    border: '1px solid rgba(255,255,255,0.8)',
                    boxShadow: '6px 10px 20px rgba(0,0,0,0.08)',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                  formatter={(value: any, name: any) => [
                    `${value} ${activeGraphMetric === 'volume' ? 'MT' : '₹/kg'}`,
                    name === 'agreeDirectPrice' ? 'Agree Direct Contract' : name === 'apmcPrice' ? 'APMC Mandi Spot' : name
                  ]}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  formatter={(value) => (value === 'agreeDirectPrice' ? 'Agree Direct Locked Contract Price' : 'Unstable Mandi Spot Price')}
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-extrabold text-2xl text-[#1C2321]">
              Engineered for Every Agricultural Stakeholder
            </h2>
            <p className="text-xs text-[#5B6660]">
              Select your operational desk to explore specialized workflows or launch verified access
            </p>
          </div>
          <span className="text-xs font-bold text-[#2F5233] bg-[#EAF0E7] px-3 py-1 rounded-full hidden sm:inline">
            Karnataka Agricultural Network
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Farmer Card */}
          <div className="clay-card-interactive clay-card-sage p-6 flex flex-col justify-between group">
            <div className="space-y-3.5">
              <div className="w-12 h-12 rounded-[16px] bg-[#2F5233] text-white flex items-center justify-center shadow-sm">
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

            <div className="mt-6 pt-4 border-t border-[#DDD9CD]/60 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenAuth('signup', 'farmer')}
                className="clay-button-primary flex-1 py-2.5 text-xs font-bold cursor-pointer"
              >
                Join as Farmer
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('login', 'farmer')}
                className="clay-button-secondary px-3 py-2.5 text-xs font-bold cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Buyer Card */}
          <div className="clay-card-interactive clay-card-terracotta p-6 flex flex-col justify-between group">
            <div className="space-y-3.5">
              <div className="w-12 h-12 rounded-[16px] bg-[#C77B2E] text-white flex items-center justify-center shadow-sm">
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

            <div className="mt-6 pt-4 border-t border-[#DDD9CD]/60 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenAuth('signup', 'buyer')}
                className="clay-button-accent flex-1 py-2.5 text-xs font-bold cursor-pointer"
              >
                Register as Buyer
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('login', 'buyer')}
                className="clay-button-secondary px-3 py-2.5 text-xs font-bold cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Logistics Fleet Card */}
          <div className="clay-card-interactive clay-card bg-[#EBF3FA] p-6 flex flex-col justify-between group border border-white/80">
            <div className="space-y-3.5">
              <div className="w-12 h-12 rounded-[16px] bg-[#3B6FA0] text-white flex items-center justify-center shadow-sm">
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

            <div className="mt-6 pt-4 border-t border-[#DDD9CD]/60 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenAuth('signup', 'logistics')}
                className="clay-button-secondary !bg-[#3B6FA0] !text-white flex-1 py-2.5 text-xs font-bold cursor-pointer"
              >
                Onboard Fleet
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('login', 'logistics')}
                className="clay-button-secondary px-3 py-2.5 text-xs font-bold cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Public Demands Exchange Board Preview */}
      <div className="clay-card p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="font-display font-extrabold text-xl text-[#1C2321] flex items-center gap-2">
              <BarChart3 size={22} className="text-[#2F5233]" />
              <span>Live Commercial Procurement Demands Board</span>
            </h2>
            <p className="text-xs text-[#5B6660]">
              Active purchase orders posted by institutional buyers seeking immediate farmgate supply on Agree Direct
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {publicDemands.map((demand) => (
            <div
              key={demand.id}
              className="clay-sunken p-4 space-y-3 hover:scale-[1.01] transition-transform"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1C2321]">{demand.commodity}</span>
                <span className="clay-badge bg-white text-[#2F5233] text-[10px]">
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
                className="clay-button-secondary w-full mt-2 py-2 text-xs font-bold text-[#2F5233] flex items-center justify-center gap-1 cursor-pointer"
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
