import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  TrendingUp,
  TrendingDown,
  Building2,
  Tractor,
  Truck,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  Package,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
  Camera,
  Layers,
  ChevronRight,
  DollarSign,
  BarChart3,
  Calendar,
  Activity,
  HeartHandshake,
  Sprout
} from 'lucide-react';
import { CreateDemandModal } from '../buyer/CreateDemandModal';
import { MatchingReviewModal } from '../buyer/MatchingReviewModal';
import { FarmerApplicationModal } from '../farmer/FarmerApplicationModal';
import { QualityScanModal } from '../farmer/QualityScanModal';
import { MarketTrendsModal } from '../trends/MarketTrendsModal';
import { INITIAL_MARKET_TRENDS } from '../../data/marketTrendsData';

interface ExecutiveDashboardProps {
  onNavigateTab?: (tab: 'app' | 'how-it-works' | 'landing') => void;
  onSwitchRole?: (role: UserRole) => void;
  onNavigateToRole?: (role: UserRole) => void;
  onOpenAuth?: (mode: 'login' | 'signup', role?: UserRole) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  onNavigateTab,
  onSwitchRole,
  onNavigateToRole,
  onOpenAuth,
}) => {
  const handleRoleSwitch = (role: UserRole) => {
    if (onNavigateToRole) {
      onNavigateToRole(role);
    } else if (onSwitchRole) {
      onSwitchRole(role);
    }
  };
  const {
    currentUser,
    setCurrentUser,
    demands,
    orders,
    logisticsJobs,
    transactions,
    getDemandMatchResult,
    getDemandTimer,
    language,
    t
  } = useApp();

  // Modals
  const [createDemandOpen, setCreateDemandOpen] = useState(false);
  const [selectedDemandForReview, setSelectedDemandForReview] = useState<any | null>(null);
  const [selectedDemandToSell, setSelectedDemandToSell] = useState<any | null>(null);
  const [qualityModalOpen, setQualityModalOpen] = useState(false);
  const [trendsModalOpen, setTrendsModalOpen] = useState(false);
  const [trendsModalTab, setTrendsModalTab] = useState<'trends' | 'ml_suggestions'>('trends');

  // Filters & Search
  const [commodityFilter, setCommodityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample Mandi Spot Price Data
  const mandiRates = [
    { commodity: 'Tomatoes', mandi: 'Kolar APMC', spotPrice: 28.5, agreePrice: 32.0, change: '+4.8%', arrivalTons: 142, trend: 'up' },
    { commodity: 'Onions', mandi: 'Yeshwanthpur', spotPrice: 24.0, agreePrice: 27.5, change: '-1.2%', arrivalTons: 310, trend: 'down' },
    { commodity: 'Potatoes', mandi: 'Nashik Market', spotPrice: 19.5, agreePrice: 22.0, change: '+2.1%', arrivalTons: 260, trend: 'up' },
    { commodity: 'Capsicum', mandi: 'Bengaluru City', spotPrice: 42.0, agreePrice: 48.0, change: '+6.5%', arrivalTons: 85, trend: 'up' },
    { commodity: 'Green Chillies', mandi: 'Chintamani Hub', spotPrice: 50.0, agreePrice: 56.0, change: '+3.2%', arrivalTons: 64, trend: 'up' },
  ];

  const filteredDemands = demands.filter((d) => {
    const matchesCommodity = commodityFilter === 'all' || d.commodity.toLowerCase() === commodityFilter.toLowerCase();
    const matchesSearch =
      d.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.buyer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCommodity && matchesSearch;
  });

  const activeDemandCount = demands.filter((d) => d.status === 'OPEN' || d.status === 'RESPONSE_CLOSED').length;
  const activeOrdersCount = orders.filter((o) => o.status === 'IN_FULFILMENT' || o.status === 'MATCH_CONFIRMED').length;

  return (
    <div id="executive-dashboard" className="space-y-8 pb-12">
      {/* Top Banner: Greeting & Quick Action Triggers */}
      <div className="bg-white border border-[#DDD9CD] rounded-[18px] p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#E4ECE0] text-[#2F5233] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#2F5233] animate-pulse" />
              <span>Live Procurement Exchange</span>
              <span>•</span>
              <span>Direct Farmgate-to-Kitchen</span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#1C2321] tracking-tight">
              Agricultural Demand & Logistics Command Center
            </h1>
            <p className="text-xs sm:text-sm text-[#5B6660] leading-relaxed">
              Real-time aggregation engine synchronizing commercial requirements with verified farmgate supplies, multi-stop transport consolidation, and 30-minute locked acceptance.
            </p>
          </div>

          {/* Quick Launchpad Buttons based on active role */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Universal Current Trends & Bar Graphs Button */}
            <button
              id="view-current-trends-btn"
              type="button"
              onClick={() => {
                setTrendsModalTab('trends');
                setTrendsModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-[10px] bg-[#2F5233] hover:bg-[#25401F] text-white font-semibold text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer hover:scale-[1.01]"
              title="Open real-time agricultural trend graphs and peak price analysis"
            >
              <BarChart3 size={16} />
              <span>Current Trends & Graphs</span>
            </button>

            {/* Farmer Suggestions (ML): STRICTLY FOR FARMER OR ADMIN */}
            {(currentUser.role === 'farmer' || currentUser.role === 'admin') && (
              <button
                id="view-ml-suggestions-btn"
                type="button"
                onClick={() => {
                  setTrendsModalTab('ml_suggestions');
                  setTrendsModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-[10px] bg-[#F6E7D3] hover:bg-[#EDD4B8] text-[#C77B2E] border border-[#C77B2E]/40 font-bold text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer hover:scale-[1.01]"
                title="View machine learning crop recommendations based on buyer demand"
              >
                <Sparkles size={16} />
                <span>Farmer Suggestions (ML)</span>
              </button>
            )}

            {currentUser.role === 'buyer' && (
              <>
                <button
                  type="button"
                  onClick={() => setCreateDemandOpen(true)}
                  className="px-4 py-2.5 rounded-[10px] bg-white border border-[#DDD9CD] hover:bg-[#EFEDE6] text-[#1C2321] font-semibold text-xs transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Post New Demand</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateTab && onNavigateTab('app')}
                  className="px-4 py-2.5 rounded-[10px] bg-white border border-[#DDD9CD] hover:bg-[#EFEDE6] text-[#1C2321] font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Building2 size={15} className="text-[#C77B2E]" />
                  <span>My Procurement Desk</span>
                </button>
              </>
            )}

            {currentUser.role === 'farmer' && (
              <>
                <button
                  type="button"
                  onClick={() => onNavigateTab && onNavigateTab('app')}
                  className="px-4 py-2.5 rounded-[10px] bg-[#2F5233] hover:bg-[#25401F] text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Tractor size={15} className="text-white" />
                  <span>Farmer Produce Desk</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQualityModalOpen(true)}
                  className="px-4 py-2.5 rounded-[10px] bg-[#F6E7D3] hover:bg-[#EDD4B8] text-[#C77B2E] border border-[#C77B2E]/30 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Camera size={15} />
                  <span>Optical Quality Scan</span>
                </button>
              </>
            )}

            {currentUser.role === 'logistics' && (
              <button
                type="button"
                onClick={() => onNavigateTab && onNavigateTab('app')}
                className="px-4 py-2.5 rounded-[10px] bg-[#3B6FA0] hover:bg-[#2F5980] text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Truck size={15} className="text-white" />
                <span>Logistics Fleet Console</span>
              </button>
            )}

            {currentUser.role === 'admin' && (
              <button
                type="button"
                onClick={() => onNavigateTab && onNavigateTab('app')}
                className="px-4 py-2.5 rounded-[10px] bg-[#1C2321] hover:bg-black text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <ShieldCheck size={15} className="text-emerald-400" />
                <span>Admin Operations Center</span>
              </button>
            )}
          </div>
        </div>

        {/* Live System Ticker Strip */}
        <div className="mt-6 pt-5 border-t border-[#DDD9CD] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#5B6660] tracking-wider block">
              Market Operations
            </span>
            <span className="text-xs font-bold text-[#2E7D4F] flex items-center gap-1 mt-0.5">
              <CheckCircle2 size={12} /> Live Clearing & Settlement
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-[#5B6660] tracking-wider block">
              Active Commodities
            </span>
            <span className="text-xs font-bold text-[#1C2321] mt-0.5 block">
              Tomatoes, Onions, Potatoes, Peppers
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-[#5B6660] tracking-wider block">
              Transit Loss Allowance
            </span>
            <span className="text-xs font-bold text-[#C77B2E] mt-0.5 block">
              ±5% Standard (10–25 kg buffer)
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-[#5B6660] tracking-wider block">
              Logged in Profile
            </span>
            <span className="text-xs font-bold text-[#1C2321] mt-0.5 flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-[#2F5233]" />
              {currentUser.name} ({currentUser.role})
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid (6 High-Contrast Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-[#DDD9CD] rounded-[14px] p-4 shadow-2xs hover:border-[#2F5233] transition-colors">
          <div className="flex items-center justify-between text-[#5B6660] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Procured Volume</span>
            <Package size={16} className="text-[#2F5233]" />
          </div>
          <div className="font-display font-extrabold text-xl sm:text-2xl text-[#1C2321]">
            48,500 <span className="text-xs font-medium text-[#5B6660]">kg</span>
          </div>
          <div className="text-[11px] font-semibold text-[#2E7D4F] flex items-center gap-1 mt-1">
            <ArrowUpRight size={13} />
            <span>+14.2% this month</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-[#DDD9CD] rounded-[14px] p-4 shadow-2xs hover:border-[#C77B2E] transition-colors">
          <div className="flex items-center justify-between text-[#5B6660] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Pipeline</span>
            <DollarSign size={16} className="text-[#C77B2E]" />
          </div>
          <div className="font-display font-extrabold text-xl sm:text-2xl text-[#1C2321]">
            ₹3.24 <span className="text-xs font-medium text-[#5B6660]">M</span>
          </div>
          <div className="text-[11px] font-semibold text-[#5B6660] mt-1">
            {activeDemandCount} Demands open
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-[#DDD9CD] rounded-[14px] p-4 shadow-2xs hover:border-[#2F5233] transition-colors">
          <div className="flex items-center justify-between text-[#5B6660] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Farmer Premium</span>
            <TrendingUp size={16} className="text-[#2E7D4F]" />
          </div>
          <div className="font-display font-extrabold text-xl sm:text-2xl text-[#2F5233]">
            +19.4%
          </div>
          <div className="text-[11px] font-semibold text-[#5B6660] mt-1">
            Above APMC net payout
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-[#DDD9CD] rounded-[14px] p-4 shadow-2xs hover:border-[#3B6FA0] transition-colors">
          <div className="flex items-center justify-between text-[#5B6660] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Transit Speed</span>
            <Truck size={16} className="text-[#3B6FA0]" />
          </div>
          <div className="font-display font-extrabold text-xl sm:text-2xl text-[#1C2321]">
            4.8 <span className="text-xs font-medium text-[#5B6660]">Hrs</span>
          </div>
          <div className="text-[11px] font-semibold text-[#2E7D4F] mt-1">
            Direct door-to-kitchen
          </div>
        </div>

        {/* Metric 5 */}
        <div className="bg-white border border-[#DDD9CD] rounded-[14px] p-4 shadow-2xs hover:border-[#2F5233] transition-colors">
          <div className="flex items-center justify-between text-[#5B6660] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Quality Pass</span>
            <ShieldCheck size={16} className="text-[#2F5233]" />
          </div>
          <div className="font-display font-extrabold text-xl sm:text-2xl text-[#1C2321]">
            96.4%
          </div>
          <div className="text-[11px] font-semibold text-[#5B6660] mt-1">
            Grade A/B CV Verified
          </div>
        </div>

        {/* Metric 6 */}
        <div className="bg-white border border-[#DDD9CD] rounded-[14px] p-4 shadow-2xs hover:border-[#C77B2E] transition-colors">
          <div className="flex items-center justify-between text-[#5B6660] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Transit Damage</span>
            <HeartHandshake size={16} className="text-[#C77B2E]" />
          </div>
          <div className="font-display font-extrabold text-xl sm:text-2xl text-[#1C2321]">
            0.8%
          </div>
          <div className="text-[11px] font-semibold text-[#2E7D4F] mt-1">
            Safe within ±5% buffer
          </div>
        </div>
      </div>

      {/* Interactive Mandi Spot Rates Strip & Current Trend Intelligence Bar */}
      <div className="bg-white border border-[#DDD9CD] rounded-[16px] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#E4ECE0] text-[#2F5233] text-[10px] font-extrabold uppercase tracking-wide">
                Live Trade Intelligence
              </span>
              <span className="text-xs text-[#5B6660]">• Updated 5 mins ago</span>
            </div>
            <h2 className="font-display font-bold text-base sm:text-lg text-[#1C2321] flex items-center gap-2 mt-1">
              <BarChart3 size={19} className="text-[#2F5233]" />
              <span>Current Market Trends, Peak Selling Points & Glut Alerts</span>
            </h2>
            <p className="text-xs text-[#5B6660] mt-0.5">
              Live price behaviour across trade mandis, historical peak thresholds, and active vs zero demand tracking.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="dashboard-open-trends-btn"
              type="button"
              onClick={() => {
                setTrendsModalTab('trends');
                setTrendsModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-[10px] bg-[#2F5233] hover:bg-[#25401F] text-white font-bold text-xs transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <BarChart3 size={15} />
              <span>Interactive Bar Graphs</span>
            </button>
            {(currentUser.role === 'farmer' || currentUser.role === 'admin') && (
              <button
                id="dashboard-open-ml-btn"
                type="button"
                onClick={() => {
                  setTrendsModalTab('ml_suggestions');
                  setTrendsModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-[10px] bg-[#F6E7D3] hover:bg-[#EDD4B8] text-[#C77B2E] border border-[#C77B2E]/30 font-bold text-xs transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles size={15} />
                <span>ML Crop Suggestions</span>
              </button>
            )}
            {currentUser.role === 'logistics' && (
              <button
                id="dashboard-open-freight-btn"
                type="button"
                onClick={() => onNavigateTab && onNavigateTab('app')}
                className="px-3.5 py-2 rounded-[10px] bg-[#EBF3FA] hover:bg-[#D7E8F7] text-[#3B6FA0] border border-[#3B6FA0]/30 font-bold text-xs transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Truck size={15} />
                <span>Fleet Dispatch Console</span>
              </button>
            )}
            {currentUser.role === 'buyer' && (
              <button
                id="dashboard-open-buyer-desk-btn"
                type="button"
                onClick={() => onNavigateTab && onNavigateTab('app')}
                className="px-3.5 py-2 rounded-[10px] bg-[#F6E7D3] hover:bg-[#EDD4B8] text-[#C77B2E] border border-[#C77B2E]/30 font-bold text-xs transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Building2 size={15} />
                <span>Procurement Pipeline</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Critical Market Intelligence Status Banners */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* 1. Highest Selling Point */}
          <div
            onClick={() => {
              setTrendsModalTab('trends');
              setTrendsModalOpen(true);
            }}
            className="p-3.5 rounded-[12px] bg-[#F4F8F3] border border-[#2F5233]/30 hover:border-[#2F5233] cursor-pointer transition-all hover:shadow-xs group"
          >
            <div className="flex items-center justify-between text-[10px] font-bold text-[#2F5233] uppercase mb-1">
              <span>🏆 Highest Selling Point</span>
              <TrendingUp size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="font-display font-bold text-sm text-[#1C2321]">
              G4 Green Chillies
            </div>
            <div className="text-xs font-bold text-[#2F5233] mt-0.5">
              ₹62.0/kg <span className="text-[#5B6660] font-normal">(94% of ₹68 Peak)</span>
            </div>
            <span className="text-[10px] text-[#2E7D4F] font-semibold block mt-1">
              Click to view price graph &rarr;
            </span>
          </div>

          {/* 2. Highest Demand Volume */}
          <div
            onClick={() => {
              setTrendsModalTab('trends');
              setTrendsModalOpen(true);
            }}
            className="p-3.5 rounded-[12px] bg-white border border-[#DDD9CD] hover:border-[#C77B2E] cursor-pointer transition-all hover:shadow-xs group"
          >
            <div className="flex items-center justify-between text-[10px] font-bold text-[#C77B2E] uppercase mb-1">
              <span>📦 Most In-Demand</span>
              <Package size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="font-display font-bold text-sm text-[#1C2321]">
              Hybrid Roma Tomatoes
            </div>
            <div className="text-xs font-bold text-[#C77B2E] mt-0.5">
              18,500 kg <span className="text-[#5B6660] font-normal">(+48.2% surge)</span>
            </div>
            <span className="text-[10px] text-[#C77B2E] font-semibold block mt-1">
              14 buyers actively bidding &rarr;
            </span>
          </div>

          {/* 3. Items Not At Peak */}
          <div
            onClick={() => {
              setTrendsModalTab('trends');
              setTrendsModalOpen(true);
            }}
            className="p-3.5 rounded-[12px] bg-white border border-[#DDD9CD] hover:border-[#3B6FA0] cursor-pointer transition-all hover:shadow-xs group"
          >
            <div className="flex items-center justify-between text-[10px] font-bold text-[#3B6FA0] uppercase mb-1">
              <span>📉 Not at Peak (Off-Peak)</span>
              <TrendingDown size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="font-display font-bold text-sm text-[#1C2321]">
              Red Onions & Potatoes
            </div>
            <div className="text-xs font-bold text-[#5B6660] mt-0.5">
              Onions: ₹27.5 vs ₹55 Peak
            </div>
            <span className="text-[10px] text-[#3B6FA0] font-semibold block mt-1">
              Phased sale / storage advised &rarr;
            </span>
          </div>

          {/* 4. Zero Demand Alert */}
          <div
            onClick={() => {
              setTrendsModalTab('trends');
              setTrendsModalOpen(true);
            }}
            className="p-3.5 rounded-[12px] bg-[#FFF5F5] border border-[#B3412C]/40 hover:border-[#B3412C] cursor-pointer transition-all hover:shadow-xs group"
          >
            <div className="flex items-center justify-between text-[10px] font-bold text-[#B3412C] uppercase mb-1">
              <span>⚠️ Zero Demand Alert</span>
              <AlertCircle size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="font-display font-bold text-sm text-[#B3412C]">
              Bottle Gourd & Cauliflower
            </div>
            <div className="text-xs font-bold text-[#B3412C] mt-0.5">
              0 kg Buyer Demand (Glut)
            </div>
            <span className="text-[10px] text-[#B3412C] font-semibold block mt-1">
              ⛔ Avoid harvesting/sowing &rarr;
            </span>
          </div>
        </div>

        {/* Live APMC Spot Rates Strip */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {mandiRates.map((item) => {
            const farmerGain = item.agreePrice - item.spotPrice;
            return (
              <div
                key={item.commodity}
                onClick={() => {
                  setTrendsModalTab('trends');
                  setTrendsModalOpen(true);
                }}
                className="clay-sunken p-3.5 space-y-2 hover:scale-[1.01] transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1C2321]">{item.commodity}</span>
                  <span
                    className={`text-[10px] font-bold flex items-center gap-0.5 ${
                      item.trend === 'up' ? 'text-[#2E7D4F]' : 'text-[#B3412C]'
                    }`}
                  >
                    {item.trend === 'up' ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {item.change}
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1 border-t border-[#DDD9CD]/60">
                  <div>
                    <span className="text-[10px] text-[#5B6660] block">Mandi Spot</span>
                    <span className="text-xs font-mono font-semibold text-[#5B6660]">
                      ₹{item.spotPrice.toFixed(1)}/kg
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#2F5233] font-semibold block">Agree Direct Contract</span>
                    <span className="text-sm font-mono font-extrabold text-[#2F5233]">
                      ₹{item.agreePrice.toFixed(1)}/kg
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-[#2E7D4F] font-bold bg-[#E4ECE0] px-2 py-1 rounded-[6px] flex items-center justify-between">
                  <span>Farmer Gain:</span>
                  <span>+₹{farmerGain.toFixed(1)}/kg</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Operational Split: Demands Pipeline + Logistics Fleet Track */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Live Commercial Procurement Demands */}
        <div className="lg:col-span-2 bg-white border border-[#DDD9CD] rounded-[16px] p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="font-display font-bold text-base text-[#1C2321] flex items-center gap-2">
                <Building2 size={18} className="text-[#C77B2E]" />
                <span>Active Commercial Demands & Response Windows</span>
              </h2>
              <p className="text-xs text-[#5B6660]">
                Live procurement requirements with 30-minute owner confirmation timer (§12)
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {['all', 'Tomatoes', 'Onions', 'Potatoes'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCommodityFilter(c)}
                  className={`px-2.5 py-1 rounded-[6px] text-xs font-semibold capitalize transition-colors ${
                    commodityFilter === c
                      ? 'bg-[#2F5233] text-white'
                      : 'bg-[#EFEDE6] text-[#5B6660] hover:bg-[#DDD9CD]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Demands List Table / Cards */}
          <div className="space-y-3">
            {filteredDemands.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#5B6660]">
                No demands matching your filter.
              </div>
            ) : (
              filteredDemands.map((demand) => {
                const timer = getDemandTimer(demand.id);
                const timerMins = timer ? Math.floor(timer.remainingSeconds / 60) : 30;
                const timerSecs = timer ? timer.remainingSeconds % 60 : 0;
                const formattedTimer = `${timerMins.toString().padStart(2, '0')}:${timerSecs.toString().padStart(2, '0')}`;
                const matchResult = getDemandMatchResult(demand.id);

                return (
                  <div
                    key={demand.id}
                    className="p-4 rounded-[12px] border border-[#DDD9CD] hover:border-[#2F5233] bg-[#FDFDFD] transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-[8px] bg-[#F6E7D3] text-[#C77B2E] flex items-center justify-center font-bold text-xs">
                          {demand.commodity.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#1C2321]">{demand.commodity}</span>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-[4px] bg-[#EFEDE6] text-[#5B6660]">
                              {demand.quality_requirement}
                            </span>
                          </div>
                          <span className="text-xs text-[#5B6660]">
                            {demand.buyer_name} • {demand.delivery_location.split(',')[0]}
                          </span>
                        </div>
                      </div>

                      {/* Status & Timer Badges */}
                      <div className="flex items-center gap-2">
                        {demand.status === 'RESPONSE_CLOSED' && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#F6E7D3] border border-[#C77B2E]/40 text-[#C77B2E] text-xs font-mono font-bold">
                            <Clock size={13} className={timer.isRunning ? 'animate-pulse' : ''} />
                            <span>{timer.isExpired ? 'Auto-Rejected (00:00)' : `${formattedTimer} Left`}</span>
                          </div>
                        )}
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-[6px] ${
                            demand.status === 'CONFIRMED' || demand.status === 'IN_FULFILMENT'
                              ? 'bg-[#E4ECE0] text-[#2F5233]'
                              : demand.status === 'RESPONSE_CLOSED'
                              ? 'bg-[#F6E7D3] text-[#C77B2E]'
                              : demand.status === 'OPEN'
                              ? 'bg-[#EBF3FA] text-[#3B6FA0]'
                              : 'bg-[#EFEDE6] text-[#5B6660]'
                          }`}
                        >
                          {demand.status}
                        </span>
                      </div>
                    </div>

                    {/* Quantity, Price Range, Transit Buffer */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#DDD9CD]/60 text-xs">
                      <div>
                        <span className="text-[10px] text-[#5B6660] block font-medium">Quantity Needed</span>
                        <span className="font-bold text-[#1C2321]">{demand.quantity_required} kg</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#5B6660] block font-medium">Price Range (₹/kg)</span>
                        <span className="font-bold text-[#2F5233]">
                          ₹{demand.target_price_min || Math.round(demand.target_price * 0.95)} - ₹{demand.target_price_max || Math.round(demand.target_price * 1.05)}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#5B6660] block font-medium">Transit Buffer</span>
                        <span className="font-bold text-[#C77B2E]">
                          ±{demand.quantity_tolerance_pct || 5}% (~{demand.damage_transit_buffer_kg || Math.round(demand.quantity_required * 0.05)} kg)
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-2">
                        {/* ROLE-BASED ACCESS ACTIONS */}
                        {currentUser.role === 'farmer' && (
                          <>
                            {demand.status === 'OPEN' && (
                              <button
                                type="button"
                                onClick={() => setSelectedDemandToSell(demand)}
                                className="px-3.5 py-1.5 rounded-[8px] bg-[#2F5233] text-white text-xs font-bold hover:bg-[#25401F] transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                              >
                                <Sprout size={13} />
                                <span>Sell Harvest / Offer</span>
                              </button>
                            )}
                            {demand.status === 'RESPONSE_CLOSED' && (
                              <span className="px-2.5 py-1 rounded-[6px] bg-[#EFEDE6] text-[#5B6660] text-xs font-semibold">
                                Sourcing Concluded
                              </span>
                            )}
                            {(demand.status === 'CONFIRMED' || demand.status === 'IN_FULFILMENT') && (
                              <span className="px-2.5 py-1 rounded-[6px] bg-[#E4ECE0] text-[#2F5233] text-xs font-bold flex items-center gap-1">
                                <CheckCircle2 size={12} />
                                <span>Batch Allocated</span>
                              </span>
                            )}
                          </>
                        )}

                        {currentUser.role === 'buyer' && (
                          <>
                            {demand.status === 'RESPONSE_CLOSED' && (
                              <button
                                type="button"
                                onClick={() => setSelectedDemandForReview(demand)}
                                className="px-3.5 py-1.5 rounded-[8px] bg-[#2F5233] text-white text-xs font-bold hover:bg-[#25401F] transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                              >
                                <span>Review Aggregation (30m)</span>
                              </button>
                            )}
                            {demand.status === 'OPEN' && (
                              <span className="px-2.5 py-1 rounded-[6px] bg-[#F6E7D3] text-[#C77B2E] text-xs font-semibold">
                                Collecting Farm Bids
                              </span>
                            )}
                            {(demand.status === 'CONFIRMED' || demand.status === 'IN_FULFILMENT') && (
                              <button
                                type="button"
                                onClick={() => onNavigateTab && onNavigateTab('app')}
                                className="px-3 py-1.5 rounded-[8px] bg-[#E4ECE0] hover:bg-[#D5E1CF] text-[#2F5233] text-xs font-bold transition-colors cursor-pointer"
                              >
                                Track Order →
                              </button>
                            )}
                          </>
                        )}

                        {currentUser.role === 'logistics' && (
                          <>
                            {demand.status === 'OPEN' && (
                              <span className="px-2.5 py-1 rounded-[6px] bg-[#EFEDE6] text-[#5B6660] text-xs font-semibold">
                                Awaiting Aggregation
                              </span>
                            )}
                            {demand.status === 'RESPONSE_CLOSED' && (
                              <span className="px-2.5 py-1 rounded-[6px] bg-[#F6E7D3] text-[#C77B2E] text-xs font-semibold">
                                Buyer Acceptance Stage
                              </span>
                            )}
                            {(demand.status === 'CONFIRMED' || demand.status === 'IN_FULFILMENT') && (
                              <button
                                type="button"
                                onClick={() => onNavigateTab && onNavigateTab('app')}
                                className="px-3.5 py-1.5 rounded-[8px] bg-[#3B6FA0] hover:bg-[#2F5980] text-white text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                              >
                                <Truck size={13} />
                                <span>View Freight Routing →</span>
                              </button>
                            )}
                          </>
                        )}

                        {currentUser.role === 'admin' && (
                          <>
                            {demand.status === 'RESPONSE_CLOSED' && (
                              <button
                                type="button"
                                onClick={() => setSelectedDemandForReview(demand)}
                                className="px-3 py-1.5 rounded-[8px] bg-[#2F5233] text-white text-xs font-bold hover:bg-[#25401F] transition-colors"
                              >
                                Review Aggregation
                              </button>
                            )}
                            {demand.status === 'OPEN' && (
                              <span className="px-2.5 py-1 rounded-[6px] bg-[#EFEDE6] text-[#5B6660] text-xs font-semibold">
                                Open Sourcing
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: Logistics Multi-Stop Route Consolidation */}
        <div className="bg-white border border-[#DDD9CD] rounded-[16px] p-6 shadow-xs space-y-4">
          <div>
            <h2 className="font-display font-bold text-base text-[#1C2321] flex items-center gap-2">
              <Truck size={18} className="text-[#3B6FA0]" />
              <span>Consolidated Freight Sequencing</span>
            </h2>
            <p className="text-xs text-[#5B6660]">
              Multi-point farmgate pickups consolidated into optimal delivery batches
            </p>
          </div>

          {/* Active Job Tracker */}
          <div className="space-y-3">
            {logisticsJobs.map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-[12px] bg-[#F7F6F2] border border-[#DDD9CD] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1C2321] font-mono">{job.id}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-[4px] bg-[#EBF3FA] text-[#3B6FA0]">
                    {job.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#5B6660]">Vehicle:</span>
                    <span className="font-semibold">{job.vehicle_number} (14ft Eicher)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5B6660]">Cargo Weight:</span>
                    <span className="font-semibold">{job.total_weight_kg} kg / 1,500 kg capacity</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5B6660]">Temperature:</span>
                    <span className="font-semibold text-[#2E7D4F]">14.2°C (Ventilated)</span>
                  </div>
                </div>

                {/* Route Milestones */}
                <div className="pt-2 border-t border-[#DDD9CD] space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#5B6660] tracking-wider block">
                    Pickups & Hub Sequence
                  </span>
                  <div className="space-y-1.5">
                    {job.stops.map((stop, i) => (
                      <div key={stop.stop_id} className="flex items-center gap-2 text-xs">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            stop.status === 'COMPLETED'
                              ? 'bg-[#2E7D4F] text-white'
                              : stop.status === 'IN_PROGRESS'
                              ? 'bg-[#C77B2E] text-white animate-pulse'
                              : 'bg-[#DDD9CD] text-[#5B6660]'
                          }`}
                        >
                          {i + 1}
                        </div>
                        <span className="truncate font-medium text-[#1C2321]">
                          {stop.location_name} ({stop.quantity_kg} kg)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (currentUser.role === 'logistics' && onNavigateTab) {
                      onNavigateTab('app');
                    }
                  }}
                  className={`w-full mt-2 py-2 rounded-[8px] border text-xs font-bold transition-colors ${
                    currentUser.role === 'logistics'
                      ? 'bg-[#3B6FA0] text-white hover:bg-[#2B5480] border-[#3B6FA0]'
                      : 'bg-[#F7F6F2] text-[#5B6660] border-[#DDD9CD]'
                  }`}
                >
                  {currentUser.role === 'logistics'
                    ? 'Inspect Full Route Map & Manifest in Console →'
                    : 'Logistics Fleet Dispatch Active'}
                </button>
              </div>
            ))}
          </div>

          {/* Direct Escrow Settlements Feed */}
          <div className="pt-4 border-t border-[#DDD9CD] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1C2321] flex items-center gap-1">
                <ShieldCheck size={14} className="text-[#2F5233]" />
                Recent Escrow Settlements
              </span>
              <span className="text-[10px] text-[#2F5233] font-bold">100% Direct</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="p-2 rounded-[8px] bg-[#E4ECE0]/40 border border-[#2F5233]/20 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#1C2321]">₹6,200 to Ramesh Gowda</div>
                  <div className="text-[10px] text-[#5B6660]">200 kg Tomatoes • Hosakote</div>
                </div>
                <span className="text-[10px] font-bold text-[#2E7D4F] px-1.5 py-0.5 rounded-[4px] bg-white">
                  Paid
                </span>
              </div>

              <div className="p-2 rounded-[8px] bg-[#E4ECE0]/40 border border-[#2F5233]/20 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#1C2321]">₹4,500 to Suresh Patel</div>
                  <div className="text-[10px] text-[#5B6660]">150 kg Tomatoes • Kolar</div>
                </div>
                <span className="text-[10px] font-bold text-[#2E7D4F] px-1.5 py-0.5 rounded-[4px] bg-white">
                  Paid
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Embedded Modals */}
      <CreateDemandModal
        isOpen={createDemandOpen}
        onClose={() => setCreateDemandOpen(false)}
      />

      {selectedDemandForReview && (
        <MatchingReviewModal
          isOpen={true}
          onClose={() => setSelectedDemandForReview(null)}
          demand={selectedDemandForReview}
        />
      )}

      {selectedDemandToSell && (
        <FarmerApplicationModal
          isOpen={true}
          onClose={() => setSelectedDemandToSell(null)}
          demand={selectedDemandToSell}
        />
      )}

      <QualityScanModal
        isOpen={qualityModalOpen}
        onClose={() => setQualityModalOpen(false)}
        commodity="Tomatoes"
        farmerId={currentUser.id}
      />

      {/* Real-time Agricultural Trends & ML Crop Advisory Modal */}
      <MarketTrendsModal
        isOpen={trendsModalOpen}
        onClose={() => setTrendsModalOpen(false)}
        initialTab={trendsModalTab}
      />
    </div>
  );
};
