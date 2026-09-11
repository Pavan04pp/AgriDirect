import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  X,
  Sparkles,
  BarChart3,
  DollarSign,
  Package,
  Layers,
  ArrowUpRight,
  Filter,
  Info,
  Sprout,
  ShieldCheck,
  Calendar,
  Compass,
  Building2,
  HelpCircle,
  Clock,
  Droplets,
  Award,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  CartesianGrid
} from 'recharts';
import { MarketTrendProduct, MLCropSuggestion, DemandRequirementLevel } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  INITIAL_MARKET_TRENDS,
  ML_CROP_SUGGESTIONS,
  calculateCustomCropRecommendation
} from '../../data/marketTrendsData';
import { MLPriceVariationPredictor } from '../ml/MLPriceVariationPredictor';

interface MarketTrendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'trends' | 'ml_suggestions';
  onPreBookDemand?: (crop: MLCropSuggestion, acres: number) => void;
}

export const MarketTrendsModal: React.FC<MarketTrendsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'trends',
  onPreBookDemand
}) => {
  const { currentUser } = useApp();
  const isLogistics = currentUser?.role === 'logistics';
  const isBuyer = currentUser?.role === 'buyer';
  const isFarmer = currentUser?.role === 'farmer' || currentUser?.role === 'admin';

  const safeInitialTab = isLogistics ? 'trends' : initialTab;
  const [activeTab, setActiveTab] = useState<'trends' | 'ml_suggestions' | 'price_forecast'>(safeInitialTab);
  const [trendMetric, setTrendMetric] = useState<'demand' | 'prices' | 'selling_point'>('demand');
  const [requirementFilter, setRequirementFilter] = useState<'all' | 'high' | 'not_at_peak' | 'no_demand'>('all');
  const [selectedProduct, setSelectedProduct] = useState<MarketTrendProduct | null>(null);

  // ML Advisory interactive simulator inputs
  const [simSoilType, setSimSoilType] = useState<string>('Red Loamy Soil');
  const [simWaterSource, setSimWaterSource] = useState<string>('Borewell / Drip');
  const [simLandAcre, setSimLandAcre] = useState<number>(1);
  const [bookingSuccessCrop, setBookingSuccessCrop] = useState<string | null>(null);

  // Compute ML recommendations dynamically based on simulation inputs
  const mlResults = useMemo(() => {
    return calculateCustomCropRecommendation(simSoilType, simWaterSource, simLandAcre);
  }, [simSoilType, simWaterSource, simLandAcre]);

  // Filtered market trends list
  const filteredTrends = useMemo(() => {
    return INITIAL_MARKET_TRENDS.filter((item) => {
      if (requirementFilter === 'high') {
        return item.requirementLevel === 'CRITICAL_HIGH' || item.isPeakSellingPoint;
      }
      if (requirementFilter === 'not_at_peak') {
        return item.requirementLevel === 'NOT_AT_PEAK' || item.requirementLevel === 'STABLE_REQUIRED';
      }
      if (requirementFilter === 'no_demand') {
        return item.requirementLevel === 'NO_DEMAND_GLUT' || item.currentDemandKg === 0;
      }
      return true;
    });
  }, [requirementFilter]);

  // Prepare recharts dataset
  const chartData = useMemo(() => {
    return INITIAL_MARKET_TRENDS.map((p) => {
      // Short name for chart axis readability
      const shortName = p.commodity.split(' ')[0] + (p.commodity.includes('Chillies') ? ' Chillies' : p.commodity.includes('Cucumber') ? ' Cucumber' : '');
      return {
        id: p.id,
        fullName: p.commodity,
        shortName,
        demandKg: p.currentDemandKg,
        demandTonnes: Number((p.currentDemandKg / 1000).toFixed(1)),
        spotPrice: p.tradeMarketSpotPrice,
        directPrice: p.directContractPrice,
        peakPrice: p.peakTimePrice,
        sellingPointScore: p.sellingPointScore,
        requirementLevel: p.requirementLevel,
        isZeroDemand: p.currentDemandKg === 0,
        isPeak: p.isPeakSellingPoint,
        category: p.category
      };
    });
  }, []);

  if (!isOpen) return null;

  // Key stats
  const highestSellingProduct = [...INITIAL_MARKET_TRENDS].sort((a, b) => b.sellingPointScore - a.sellingPointScore)[0];
  const mostDemandedProduct = [...INITIAL_MARKET_TRENDS].sort((a, b) => b.currentDemandKg - a.currentDemandKg)[0];
  const zeroDemandProducts = INITIAL_MARKET_TRENDS.filter((p) => p.currentDemandKg === 0);
  const notAtPeakProducts = INITIAL_MARKET_TRENDS.filter((p) => p.requirementLevel === 'NOT_AT_PEAK');

  const handleCommitSowing = (crop: MLCropSuggestion) => {
    if (onPreBookDemand) {
      onPreBookDemand(crop, simLandAcre);
    }
    setBookingSuccessCrop(crop.cropName);
    setTimeout(() => {
      setBookingSuccessCrop(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div
        id="market-trends-modal"
        className="relative w-full max-w-5xl bg-[#FAF9F5] border border-[#DDD9CD] rounded-[20px] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-left"
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 bg-white border-b border-[#DDD9CD] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center shadow-2xs ${
              isLogistics
                ? 'bg-[#EBF3FA] border border-[#3B6FA0]/30 text-[#3B6FA0]'
                : isBuyer
                ? 'bg-[#F6E7D3] border border-[#C77B2E]/30 text-[#C77B2E]'
                : 'bg-[#E4ECE0] border border-[#2F5233]/30 text-[#2F5233]'
            }`}>
              <BarChart3 size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base sm:text-lg text-[#1C2321]">
                  {isLogistics
                    ? 'Freight Volume & Market Commodity Trends'
                    : isBuyer
                    ? 'Commercial Procurement Trends & Mandi Benchmarks'
                    : 'Current Agricultural Trends & ML Crop Advisory'}
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E4ECE0] text-[#2F5233]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live APMC & Agridirect Data
                </span>
              </div>
              <p className="text-xs text-[#5B6660]">
                {isLogistics
                  ? 'Real-time mandi benchmark rates, peak pricing, and active trade demand volumes across agricultural freight corridors.'
                  : isBuyer
                  ? 'Compare real-time mandi prices with Agridirect contracts, monitor peak thresholds and volume availability.'
                  : 'Compare peak prices, real-time demand volumes, market gluts, and AI-predicted profitable crops.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 min-h-[44px] min-w-[44px] rounded-full bg-[#EFEDE6] hover:bg-[#DDD9CD] text-[#5B6660] hover:text-[#1C2321] flex items-center justify-center transition-colors cursor-pointer"
              title="Close modal"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Top Navigation Tabs */}
        <div className="px-4 sm:px-6 pt-2.5 bg-white border-b border-[#DDD9CD] flex items-center justify-between flex-wrap gap-2 overflow-x-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
            <button
              type="button"
              onClick={() => setActiveTab('trends')}
              className={`min-h-[44px] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'trends'
                  ? 'border-[#2F5233] text-[#2F5233] bg-[#FAF9F5] rounded-t-[10px]'
                  : 'border-transparent text-[#5B6660] hover:text-[#1C2321]'
              }`}
            >
              <BarChart3 size={16} />
              <span>{isLogistics ? 'Freight & Market Trends' : 'Current Market Trends & Graphs'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('price_forecast')}
              className={`min-h-[44px] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'price_forecast'
                  ? 'border-[#2F5233] text-[#2F5233] bg-[#FAF9F5] rounded-t-[10px]'
                  : 'border-transparent text-[#5B6660] hover:text-[#1C2321]'
              }`}
            >
              <Activity size={16} className="text-[#2F5233]" />
              <span>Algorithmic Price Forecast & Curves</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-[#E4ECE0] text-[#2F5233] rounded-full font-extrabold uppercase">
                Regression
              </span>
            </button>

            {!isLogistics && (
              <button
                type="button"
                onClick={() => setActiveTab('ml_suggestions')}
                className={`min-h-[44px] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'ml_suggestions'
                    ? 'border-[#2F5233] text-[#2F5233] bg-[#FAF9F5] rounded-t-[10px]'
                    : 'border-transparent text-[#5B6660] hover:text-[#1C2321]'
                }`}
              >
                <Sprout size={16} className="text-[#2F5233]" />
                <span>
                  {isBuyer
                    ? 'Agricultural Supply Forecast'
                    : 'Farmer Suggestions (ML Demand)'}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 bg-[#F6E7D3] text-[#C77B2E] rounded-full font-extrabold uppercase">
                  AI Model
                </span>
              </button>
            )}
          </div>

          <div className="pb-2 text-[11px] text-[#5B6660] hidden md:block">
            Mandi Benchmark: <strong className="text-[#1C2321]">Kolar, Yeshwanthpur & Hassan Hubs</strong>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* =========================================================================
              TAB 1: CURRENT MARKET TRENDS & BAR GRAPHS
             ========================================================================= */}
          {activeTab === 'trends' && (
            <div className="space-y-6">
              {/* Quick Highlight Cards (Highest Selling, Most Demanded, Zero Demand, Not at Peak) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. Highest Selling Point */}
                <div className="bg-white border border-[#DDD9CD] rounded-[14px] p-3.5 shadow-2xs hover:border-[#2F5233] transition-colors">
                  <div className="flex items-center justify-between text-[#5B6660] mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F5233]">
                      🏆 Highest Selling Point
                    </span>
                    <TrendingUp size={15} className="text-[#2F5233]" />
                  </div>
                  <div className="font-display font-bold text-base text-[#1C2321]">
                    {highestSellingProduct.commodity}
                  </div>
                  <div className="text-xs font-bold text-[#2F5233] mt-0.5">
                    ₹{highestSellingProduct.directContractPrice}/kg{' '}
                    <span className="text-[11px] text-[#5B6660] font-normal">
                      (Peak: ₹{highestSellingProduct.peakTimePrice})
                    </span>
                  </div>
                  <div className="text-[10px] text-[#5B6660] mt-1 bg-[#E4ECE0] px-2 py-0.5 rounded font-semibold text-[#2F5233] inline-block">
                    {highestSellingProduct.sellingPointScore}% of Peak Record
                  </div>
                </div>

                {/* 2. Most Demanded Product */}
                <div className="bg-white border border-[#DDD9CD] rounded-[14px] p-3.5 shadow-2xs hover:border-[#C77B2E] transition-colors">
                  <div className="flex items-center justify-between text-[#5B6660] mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C77B2E]">
                      📦 Most Demanded Item
                    </span>
                    <Package size={15} className="text-[#C77B2E]" />
                  </div>
                  <div className="font-display font-bold text-base text-[#1C2321]">
                    {mostDemandedProduct.commodity}
                  </div>
                  <div className="text-xs font-bold text-[#C77B2E] mt-0.5">
                    {mostDemandedProduct.currentDemandKg.toLocaleString()} kg{' '}
                    <span className="text-[11px] text-[#5B6660] font-normal">
                      ({mostDemandedProduct.buyerCount} active buyers)
                    </span>
                  </div>
                  <div className="text-[10px] text-[#2E7D4F] font-bold mt-1">
                    +{mostDemandedProduct.demandGrowthPct}% Growth this month
                  </div>
                </div>

                {/* 3. Not at Peak Products */}
                <div className="bg-white border border-[#DDD9CD] rounded-[14px] p-3.5 shadow-2xs hover:border-[#3B6FA0] transition-colors">
                  <div className="flex items-center justify-between text-[#5B6660] mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#3B6FA0]">
                      📉 Not At Peak ({notAtPeakProducts.length} items)
                    </span>
                    <TrendingDown size={15} className="text-[#3B6FA0]" />
                  </div>
                  <div className="font-display font-bold text-base text-[#1C2321]">
                    Red Onions, Potatoes, Cabbage
                  </div>
                  <div className="text-xs text-[#5B6660] mt-0.5">
                    Spot rates down 30%–55% from peak
                  </div>
                  <div className="text-[10px] text-[#5B6660] mt-1 bg-[#EFEDE6] px-2 py-0.5 rounded font-semibold inline-block">
                    Hold or Phased Sale Advised
                  </div>
                </div>

                {/* 4. Zero Demand Alert (Glut) */}
                <div className="bg-[#FFF5F5] border border-[#B3412C]/30 rounded-[14px] p-3.5 shadow-2xs">
                  <div className="flex items-center justify-between text-[#B3412C] mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B3412C]">
                      ⚠️ Zero Demand Alert ({zeroDemandProducts.length})
                    </span>
                    <AlertTriangle size={15} className="text-[#B3412C]" />
                  </div>
                  <div className="font-display font-bold text-base text-[#B3412C]">
                    Bottle Gourd, Cauliflower
                  </div>
                  <div className="text-xs font-bold text-[#B3412C] mt-0.5">
                    0 kg Buyer Demand (Glut)
                  </div>
                  <div className="text-[10px] text-[#B3412C] mt-1 bg-[#B3412C]/10 px-2 py-0.5 rounded font-bold inline-block">
                    ⛔ Avoid Harvesting / Sowing
                  </div>
                </div>
              </div>

              {/* Main Visual Graph Section */}
              <div className="bg-white border border-[#DDD9CD] rounded-[16px] p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDD9CD] pb-4">
                  <div>
                    <h3 className="font-display font-bold text-sm sm:text-base text-[#1C2321] flex items-center gap-2">
                      <BarChart3 size={18} className="text-[#2F5233]" />
                      <span>Comparative Product Analytics: Demand, Trade Market & Peak Selling Point</span>
                    </h3>
                    <p className="text-xs text-[#5B6660] mt-0.5">
                      Visualizing where every commodity stands in current market trade cycles.
                    </p>
                  </div>

                  {/* Graph Metric Toggle */}
                  <div className="flex flex-wrap items-center gap-1 p-1 rounded-[12px] bg-[#EFEDE6] border border-[#DDD9CD]">
                    <button
                      type="button"
                      onClick={() => setTrendMetric('demand')}
                      className={`min-h-[38px] px-3 py-1.5 rounded-[8px] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        trendMetric === 'demand'
                          ? 'bg-[#2F5233] text-white shadow-xs'
                          : 'text-[#5B6660] hover:text-[#1C2321]'
                      }`}
                    >
                      📦 Demand Volume (kg)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTrendMetric('prices')}
                      className={`min-h-[38px] px-3 py-1.5 rounded-[8px] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        trendMetric === 'prices'
                          ? 'bg-[#2F5233] text-white shadow-xs'
                          : 'text-[#5B6660] hover:text-[#1C2321]'
                      }`}
                    >
                      💰 Trade vs Peak vs Direct
                    </button>
                    <button
                      type="button"
                      onClick={() => setTrendMetric('selling_point')}
                      className={`min-h-[38px] px-3 py-1.5 rounded-[8px] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        trendMetric === 'selling_point'
                          ? 'bg-[#2F5233] text-white shadow-xs'
                          : 'text-[#5B6660] hover:text-[#1C2321]'
                      }`}
                    >
                      🎯 Peak Selling Index (%)
                    </button>
                  </div>
                </div>

                {/* Graph Legend & Insights Summary */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-4 flex-wrap">
                    {trendMetric === 'demand' && (
                      <>
                        <span className="flex items-center gap-1.5 text-xs text-[#1C2321] font-semibold">
                          <span className="w-3 h-3 rounded-full bg-[#2F5233]" />
                          High Demand / Urgent
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-[#1C2321] font-semibold">
                          <span className="w-3 h-3 rounded-full bg-[#C77B2E]" />
                          Stable / Not at Peak
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-[#B3412C] font-bold">
                          <span className="w-3 h-3 rounded-full bg-[#B3412C]" />
                          0 kg (NO DEMAND AT ALL)
                        </span>
                      </>
                    )}
                    {trendMetric === 'prices' && (
                      <>
                        <span className="flex items-center gap-1.5 text-xs text-[#5B6660] font-semibold">
                          <span className="w-3 h-3 rounded-sm bg-[#9AA8A4]" />
                          APMC Mandi Spot Rate
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-[#2F5233] font-bold">
                          <span className="w-3 h-3 rounded-sm bg-[#2F5233]" />
                          Direct Contract Price
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-[#C77B2E] font-bold">
                          <span className="w-3 h-3 rounded-sm bg-[#C77B2E]" />
                          Historical Peak Price
                        </span>
                      </>
                    )}
                    {trendMetric === 'selling_point' && (
                      <span className="text-xs text-[#5B6660]">
                        Shows current price as a percentage of all-time peak selling point. (100% = At Historic Peak)
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-[#5B6660]">
                    Click any bar or row below to view full details
                  </span>
                </div>

                {/* Recharts Canvas */}
                <div className="h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    {trendMetric === 'demand' ? (
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#EFEFEA" vertical={false} />
                        <XAxis
                          dataKey="shortName"
                          stroke="#7A8882"
                          fontSize={11}
                          tickLine={false}
                          interval={0}
                          angle={-18}
                          textAnchor="end"
                        />
                        <YAxis stroke="#7A8882" fontSize={11} tickLine={false} unit=" kg" />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="p-3 bg-white border border-[#DDD9CD] rounded-[10px] shadow-xl text-xs space-y-1 z-50">
                                  <div className="font-bold text-[#1C2321] text-sm">{data.fullName}</div>
                                  <div className="text-[#5B6660]">Category: {data.category}</div>
                                  <div className="font-mono font-bold text-sm">
                                    Demand:{' '}
                                    <span
                                      className={
                                        data.demandKg === 0 ? 'text-[#B3412C] font-extrabold' : 'text-[#2F5233]'
                                      }
                                    >
                                      {data.demandKg === 0 ? '0 kg (NO DEMAND)' : `${data.demandKg.toLocaleString()} kg`}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-[#5B6660]">
                                    Direct Price: ₹{data.directPrice}/kg • Peak Price: ₹{data.peakPrice}/kg
                                  </div>
                                  <div className="pt-1">
                                    <span
                                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                        data.demandKg === 0
                                          ? 'bg-[#B3412C]/15 text-[#B3412C]'
                                          : data.isPeak
                                          ? 'bg-[#E4ECE0] text-[#2F5233]'
                                          : 'bg-[#EFEDE6] text-[#5B6660]'
                                      }`}
                                    >
                                      {data.demandKg === 0
                                        ? '⚠️ Zero Demand Glut'
                                        : data.isPeak
                                        ? '🔥 Peak Selling Point'
                                        : 'Not at Peak'}
                                    </span>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="demandKg" radius={[6, 6, 0, 0]}>
                          {chartData.map((entry, index) => {
                            let fillColor = '#2F5233'; // Default high demand
                            if (entry.demandKg === 0) fillColor = '#B3412C';
                            else if (entry.requirementLevel === 'NOT_AT_PEAK') fillColor = '#C77B2E';
                            return <Cell key={`cell-${index}`} fill={fillColor} />;
                          })}
                        </Bar>
                      </BarChart>
                    ) : trendMetric === 'prices' ? (
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#EFEFEA" vertical={false} />
                        <XAxis
                          dataKey="shortName"
                          stroke="#7A8882"
                          fontSize={11}
                          tickLine={false}
                          interval={0}
                          angle={-18}
                          textAnchor="end"
                        />
                        <YAxis stroke="#7A8882" fontSize={11} tickLine={false} unit=" ₹" />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="p-3 bg-white border border-[#DDD9CD] rounded-[10px] shadow-xl text-xs space-y-1">
                                  <div className="font-bold text-[#1C2321] text-sm">{data.fullName}</div>
                                  <div className="text-[#5B6660]">
                                    Mandi Spot Rate: <strong className="text-[#1C2321]">₹{data.spotPrice}/kg</strong>
                                  </div>
                                  <div className="text-[#2F5233] font-bold">
                                    KrishiLink Direct: ₹{data.directPrice}/kg
                                  </div>
                                  <div className="text-[#C77B2E] font-bold">
                                    All-Time Peak Price: ₹{data.peakPrice}/kg
                                  </div>
                                  <div className="text-[11px] text-[#5B6660]">
                                    Status: {data.isZeroDemand ? 'Zero Demand Glut' : data.isPeak ? 'Near Peak Price' : 'Off-Peak'}
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="spotPrice" fill="#9AA8A4" name="Mandi Spot" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="directPrice" fill="#2F5233" name="Direct Contract" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="peakPrice" fill="#C77B2E" name="Peak Time Price" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    ) : (
                      /* Peak Selling Point Index (%) */
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#EFEFEA" vertical={false} />
                        <XAxis
                          dataKey="shortName"
                          stroke="#7A8882"
                          fontSize={11}
                          tickLine={false}
                          interval={0}
                          angle={-18}
                          textAnchor="end"
                        />
                        <YAxis stroke="#7A8882" fontSize={11} tickLine={false} domain={[0, 100]} unit="%" />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="p-3 bg-white border border-[#DDD9CD] rounded-[10px] shadow-xl text-xs space-y-1">
                                  <div className="font-bold text-[#1C2321] text-sm">{data.fullName}</div>
                                  <div className="text-[#2F5233] font-bold text-sm">
                                    Peak Index: {data.sellingPointScore}%
                                  </div>
                                  <div className="text-[11px] text-[#5B6660]">
                                    Current Direct: ₹{data.directPrice}/kg vs Peak: ₹{data.peakPrice}/kg
                                  </div>
                                  <div className="text-[11px]">
                                    {data.sellingPointScore > 85
                                      ? '🔥 AT HIGHEST SELLING POINT: Superb time to sell!'
                                      : data.sellingPointScore < 30
                                      ? '⛔ SEVERE GLUT: Prices crashed. Do not sell at loss.'
                                      : '⚠️ NOT AT PEAK: Moderate pricing.'}
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="sellingPointScore" radius={[6, 6, 0, 0]}>
                          {chartData.map((entry, index) => {
                            const color =
                              entry.sellingPointScore >= 85
                                ? '#2F5233'
                                : entry.sellingPointScore >= 45
                                ? '#C77B2E'
                                : '#B3412C';
                            return <Cell key={`sp-${index}`} fill={color} />;
                          })}
                        </Bar>
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Requirement Filters & Detailed Table of Products */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-[#1C2321] flex items-center gap-1.5">
                      <Filter size={14} className="text-[#2F5233]" />
                      <span>Filter Products by Status:</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => setRequirementFilter('all')}
                      className={`px-3 py-1 rounded-[8px] text-xs font-bold transition-all ${
                        requirementFilter === 'all'
                          ? 'bg-[#2F5233] text-white shadow-2xs'
                          : 'bg-white border border-[#DDD9CD] text-[#5B6660] hover:text-[#1C2321]'
                      }`}
                    >
                      All Items ({INITIAL_MARKET_TRENDS.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setRequirementFilter('high')}
                      className={`px-3 py-1 rounded-[8px] text-xs font-bold transition-all ${
                        requirementFilter === 'high'
                          ? 'bg-[#2F5233] text-white shadow-2xs'
                          : 'bg-white border border-[#DDD9CD] text-[#2F5233] hover:bg-[#E4ECE0]'
                      }`}
                    >
                      🔥 Highest Selling & High Demand
                    </button>

                    <button
                      type="button"
                      onClick={() => setRequirementFilter('not_at_peak')}
                      className={`px-3 py-1 rounded-[8px] text-xs font-bold transition-all ${
                        requirementFilter === 'not_at_peak'
                          ? 'bg-[#C77B2E] text-white shadow-2xs'
                          : 'bg-white border border-[#DDD9CD] text-[#C77B2E] hover:bg-[#F6E7D3]'
                      }`}
                    >
                      📉 Not at Peak
                    </button>

                    <button
                      type="button"
                      onClick={() => setRequirementFilter('no_demand')}
                      className={`px-3 py-1 rounded-[8px] text-xs font-bold transition-all ${
                        requirementFilter === 'no_demand'
                          ? 'bg-[#B3412C] text-white shadow-2xs'
                          : 'bg-white border border-[#B3412C]/40 text-[#B3412C] hover:bg-[#FFF5F5]'
                      }`}
                    >
                      ⚠️ No Demand at All ({zeroDemandProducts.length})
                    </button>
                  </div>

                  <span className="text-xs text-[#5B6660]">
                    Showing <strong className="text-[#1C2321]">{filteredTrends.length}</strong> items
                  </span>
                </div>

                {/* Products List Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredTrends.map((item) => {
                    const isZeroDemand = item.currentDemandKg === 0;
                    const isPeak = item.isPeakSellingPoint;

                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-[16px] border transition-all text-left bg-white ${
                          isZeroDemand
                            ? 'border-[#B3412C]/40 bg-[#FFFDFD] hover:border-[#B3412C]'
                            : isPeak
                            ? 'border-[#2F5233]/40 hover:border-[#2F5233]'
                            : 'border-[#DDD9CD] hover:border-[#C77B2E]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#DDD9CD]/70">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-display font-bold text-sm sm:text-base text-[#1C2321]">
                                {item.commodity}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EFEDE6] text-[#5B6660]">
                                {item.category}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#5B6660] mt-0.5">
                              Variety: {item.variety} • Mandi: {item.primaryMandi}
                            </div>
                          </div>

                          {/* Requirement Badge */}
                          <div>
                            {isZeroDemand ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-[8px] bg-[#B3412C]/15 text-[#B3412C] border border-[#B3412C]/30">
                                <AlertTriangle size={12} />
                                <span>NO DEMAND AT ALL</span>
                              </span>
                            ) : isPeak ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-[8px] bg-[#E4ECE0] text-[#2F5233] border border-[#2F5233]/30">
                                <TrendingUp size={12} />
                                <span>PEAK SELLING POINT</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-[8px] bg-[#EFEDE6] text-[#5B6660] border border-[#DDD9CD]">
                                <Clock size={12} />
                                <span>NOT AT PEAK</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price & Demand Metrics Grid */}
                        <div className="grid grid-cols-3 gap-2 py-2.5 border-b border-[#DDD9CD]/60 text-xs">
                          {/* Col 1: Current Direct vs Mandi */}
                          <div>
                            <span className="text-[10px] text-[#5B6660] block">Direct Contract</span>
                            <span className="font-mono font-bold text-sm text-[#2F5233]">
                              ₹{item.directContractPrice.toFixed(1)}/kg
                            </span>
                            <span className="text-[10px] text-[#5B6660] block">
                              Mandi: ₹{item.tradeMarketSpotPrice.toFixed(1)}
                            </span>
                          </div>

                          {/* Col 2: Peak Time Price */}
                          <div>
                            <span className="text-[10px] text-[#5B6660] block">Peak Time Price</span>
                            <span className="font-mono font-bold text-sm text-[#C77B2E]">
                              ₹{item.peakTimePrice.toFixed(1)}/kg
                            </span>
                            <span className="text-[10px] text-[#5B6660] block">
                              Selling Score: {item.sellingPointScore}%
                            </span>
                          </div>

                          {/* Col 3: Demand Volume */}
                          <div>
                            <span className="text-[10px] text-[#5B6660] block">Market Demand</span>
                            <span
                              className={`font-mono font-bold text-sm ${
                                isZeroDemand ? 'text-[#B3412C]' : 'text-[#1C2321]'
                              }`}
                            >
                              {isZeroDemand ? '0 kg (None)' : `${item.currentDemandKg.toLocaleString()} kg`}
                            </span>
                            <span className="text-[10px] text-[#5B6660] block">
                              {item.buyerCount > 0 ? `${item.buyerCount} Buyers Bidding` : '0 Buyers'}
                            </span>
                          </div>
                        </div>

                        {/* Market Context & Farmer Advisory */}
                        <div className="pt-2.5 space-y-1.5 text-xs">
                          <p className="text-[11px] text-[#5B6660] leading-snug">
                            {item.marketDescription}
                          </p>
                          <div
                            className={`p-2 rounded-[8px] text-[11px] font-medium leading-tight ${
                              isZeroDemand
                                ? 'bg-[#B3412C]/10 text-[#B3412C] border border-[#B3412C]/20'
                                : isPeak
                                ? 'bg-[#E4ECE0] text-[#2F5233]'
                                : 'bg-[#EFEDE6] text-[#1C2321]'
                            }`}
                          >
                            <strong>Advisory:</strong> {item.farmerActionAdvisory}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: ALGORITHMIC PRICE VARIATION & FORECAST
             ========================================================================= */}
          {activeTab === 'price_forecast' && (
            <div className="space-y-6">
              <MLPriceVariationPredictor />
            </div>
          )}

          {/* =========================================================================
              TAB 2: FARMER SUGGESTIONS (ML WHAT-TO-GROW ADVISORY)
             ========================================================================= */}
          {activeTab === 'ml_suggestions' && (
            <div className="space-y-6">
              {/* Introduction Banner explaining how Machine Learning learns from demand */}
              <div className="bg-[#E4ECE0] border border-[#2F5233]/30 rounded-[16px] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-[#2F5233]" />
                    <h3 className="font-display font-bold text-base text-[#1C2321]">
                      Machine Learning Crop Selection Engine
                    </h3>
                  </div>
                  <p className="text-xs text-[#2F5233] leading-relaxed max-w-2xl">
                    Our predictive model continuously digests live commercial buyer purchase orders, forward institutional kitchen commitments, and APMC seasonal shortage cycles to recommend <strong>exactly what to plant</strong> for maximum profit and guaranteed procurement.
                  </p>
                </div>

                <div className="bg-white px-3.5 py-2 rounded-[12px] border border-[#2F5233]/20 shrink-0 text-center">
                  <span className="text-[10px] font-bold uppercase text-[#5B6660] block">
                    Unmet Forward Demand
                  </span>
                  <span className="font-display font-extrabold text-xl text-[#2F5233]">
                    {mlResults.totalUnmetDemandTonnes} <span className="text-xs font-normal">Tonnes</span>
                  </span>
                </div>
              </div>

              {/* Interactive Simulator: Soil, Water, Land inputs */}
              <div className="bg-white border border-[#DDD9CD] rounded-[16px] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#DDD9CD] pb-3">
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#1C2321] flex items-center gap-2">
                      <Compass size={16} className="text-[#2F5233]" />
                      <span>Custom Farm Match Simulator</span>
                    </h4>
                    <p className="text-xs text-[#5B6660]">
                      Adjust your farm conditions to let the model re-rank the best crops for your parcel.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#2F5233] bg-[#E4ECE0] px-2.5 py-1 rounded-[6px]">
                    Auto-Learning Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Input 1: Soil Type */}
                  <div>
                    <label className="block text-xs font-bold text-[#1C2321] mb-1.5">
                      Soil Type on Your Farm:
                    </label>
                    <select
                      value={simSoilType}
                      onChange={(e) => setSimSoilType(e.target.value)}
                      className="w-full h-10 px-3 rounded-[8px] border border-[#DDD9CD] bg-white text-xs font-semibold text-[#1C2321] focus:border-[#2F5233]"
                    >
                      <option value="Red Loamy Soil">Red Loamy Soil (Hoskote / Kolar)</option>
                      <option value="Sandy Loam">Sandy Loam (Well-Drained)</option>
                      <option value="Black Cotton Soil">Black Cotton Soil (Deccan / Bellary)</option>
                      <option value="Clay Loam">Clay Loam (Water Retentive)</option>
                      <option value="Polyhouse / Coco-peat">Polyhouse / Naturally Ventilated</option>
                    </select>
                  </div>

                  {/* Input 2: Water Source */}
                  <div>
                    <label className="block text-xs font-bold text-[#1C2321] mb-1.5">
                      Water Availability:
                    </label>
                    <select
                      value={simWaterSource}
                      onChange={(e) => setSimWaterSource(e.target.value)}
                      className="w-full h-10 px-3 rounded-[8px] border border-[#DDD9CD] bg-white text-xs font-semibold text-[#1C2321] focus:border-[#2F5233]"
                    >
                      <option value="Borewell / Drip">Borewell + Drip Irrigation (High Reliability)</option>
                      <option value="Canal / Tank Irrigation">Canal / Tank Irrigation (Seasonal)</option>
                      <option value="Low / Rainfed">Rainfed / Limited Water</option>
                    </select>
                  </div>

                  {/* Input 3: Land Acreage */}
                  <div>
                    <label className="block text-xs font-bold text-[#1C2321] mb-1.5">
                      Target Planned Sowing Area:
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[0.5, 1, 2, 5].map((acre) => (
                        <button
                          key={acre}
                          type="button"
                          onClick={() => setSimLandAcre(acre)}
                          className={`py-2 rounded-[8px] text-xs font-bold border transition-all ${
                            simLandAcre === acre
                              ? 'bg-[#2F5233] text-white border-[#2F5233]'
                              : 'bg-[#F7F6F2] text-[#5B6660] border-[#DDD9CD] hover:text-[#1C2321]'
                          }`}
                        >
                          {acre} Ac
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Revenue Projection Banner */}
                <div className="p-3.5 rounded-[12px] bg-[#F7F6F2] border border-[#DDD9CD] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[#5B6660]">Projected Net Farm Profit for {simLandAcre} Acre(s):</span>
                    <span className="font-display font-bold text-base text-[#2F5233] ml-2">
                      ₹{mlResults.totalProjectedProfit.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#5B6660]">
                    Calculated from top crop (<strong>{mlResults.topSuggestions[0].cropName}</strong>) with forward contract buyback.
                  </div>
                </div>
              </div>

              {/* Booking Success Toast */}
              {bookingSuccessCrop && (
                <div className="p-4 rounded-[12px] bg-[#E4ECE0] border border-[#2F5233] text-xs font-bold text-[#2F5233] flex items-center justify-between animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    <span>
                      Success! Planned harvest commitment registered for <strong>{bookingSuccessCrop}</strong> ({simLandAcre} Acres). Commercial buyers notified.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBookingSuccessCrop(null)}
                    className="text-[#2F5233] hover:underline"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Recommended Crops Cards List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-sm text-[#1C2321]">
                    Top AI-Recommended Crops to SOW (Ranked by Demand & Profit Margin)
                  </h4>
                  <span className="text-xs text-[#5B6660]">
                    Trained on <strong>240+ procurement contracts</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {mlResults.topSuggestions.map((crop, idx) => {
                    const isTopPick = idx === 0;

                    return (
                      <div
                        key={crop.id}
                        className={`p-5 rounded-[18px] border text-left bg-white transition-all shadow-2xs ${
                          isTopPick
                            ? 'border-2 border-[#2F5233] shadow-md bg-gradient-to-br from-white to-[#F4F8F3]'
                            : 'border-[#DDD9CD] hover:border-[#2F5233]/60'
                        }`}
                      >
                        {/* Crop Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DDD9CD]">
                          <div>
                            <div className="flex items-center gap-2">
                              {isTopPick && (
                                <span className="px-2 py-0.5 rounded-full bg-[#2F5233] text-white text-[10px] font-extrabold uppercase flex items-center gap-1">
                                  <Award size={11} />
                                  #1 Top Pick
                                </span>
                              )}
                              <h3 className="font-display font-bold text-base sm:text-lg text-[#1C2321]">
                                {crop.cropName}
                              </h3>
                              <span className="text-xs font-semibold text-[#5B6660] bg-[#EFEDE6] px-2 py-0.5 rounded">
                                {crop.category}
                              </span>
                            </div>
                            <div className="text-xs text-[#5B6660] mt-0.5">
                              Variety: <strong className="text-[#1C2321]">{crop.variety}</strong> • Harvest Cycle: {crop.expectedHarvestWindowDays} Days
                            </div>
                          </div>

                          {/* ML Score Badge */}
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className="text-[10px] font-bold text-[#5B6660] uppercase block">
                                ML Demand Score
                              </span>
                              <span className="text-xl font-display font-extrabold text-[#2F5233]">
                                {crop.mlDemandScore}/100
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Metrics Breakdown Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-b border-[#DDD9CD]/70 text-xs">
                          {/* Metric 1 */}
                          <div>
                            <span className="text-[10px] text-[#5B6660] block">Unmet Buyer Demand</span>
                            <span className="font-mono font-bold text-sm text-[#2F5233]">
                              {crop.unmetDemandKg.toLocaleString()} kg
                            </span>
                            <span className="text-[10px] text-[#5B6660] block">
                              {crop.buyersWaitingCount} Waiting Buyers
                            </span>
                          </div>

                          {/* Metric 2 */}
                          <div>
                            <span className="text-[10px] text-[#5B6660] block">Projected Harvest Price</span>
                            <span className="font-mono font-bold text-sm text-[#1C2321]">
                              ₹{crop.projectedHarvestPriceMin} - ₹{crop.projectedHarvestPriceMax}/kg
                            </span>
                            <span className="text-[10px] text-[#2E7D4F] font-bold block">
                              +{crop.profitRoiPct}% Estimated ROI
                            </span>
                          </div>

                          {/* Metric 3 */}
                          <div>
                            <span className="text-[10px] text-[#5B6660] block">Net Profit / Acre</span>
                            <span className="font-mono font-bold text-sm text-[#2F5233]">
                              ₹{crop.projectedNetProfitPerAcre.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-[#5B6660] block">
                              Cost: ₹{crop.estimatedCostOfCultivationPerAcre.toLocaleString()}
                            </span>
                          </div>

                          {/* Metric 4 */}
                          <div>
                            <span className="text-[10px] text-[#5B6660] block">Water & Risk Level</span>
                            <span className="font-bold text-[#1C2321] block">
                              {crop.waterRequirement} Water
                            </span>
                            <span className="text-[10px] font-bold text-[#2E7D4F]">
                              Risk: {crop.riskLevel}
                            </span>
                          </div>
                        </div>

                        {/* AI Demand Learning Reason */}
                        <div className="pt-3 space-y-2 text-xs">
                          <div className="p-3 rounded-[10px] bg-[#FAF9F5] border border-[#DDD9CD] text-left">
                            <span className="text-[11px] font-bold text-[#2F5233] flex items-center gap-1.5 mb-1">
                              <Sparkles size={13} />
                              <span>Why Machine Learning Suggests This:</span>
                            </span>
                            <p className="text-xs text-[#1C2321] leading-relaxed">
                              {crop.demandDriver}
                            </p>
                          </div>

                          {/* Avoid Alternate Warning */}
                          {crop.avoidAlternateCropWarning && (
                            <div className="p-2.5 rounded-[8px] bg-[#F6E7D3]/60 border border-[#C77B2E]/30 text-[11px] text-[#C77B2E] font-bold flex items-center gap-2">
                              <Info size={14} className="shrink-0" />
                              <span>{crop.avoidAlternateCropWarning}</span>
                            </div>
                          )}

                          {/* Growing Tips & Commitment Action */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                            <div className="text-[11px] text-[#5B6660] max-w-xl">
                              <strong>Key Advice:</strong> {crop.keyGrowingTips}
                            </div>

                            {isFarmer ? (
                              <button
                                type="button"
                                onClick={() => handleCommitSowing(crop)}
                                className="px-5 py-2.5 rounded-[10px] bg-[#2F5233] hover:bg-[#25401F] text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                              >
                                <Sprout size={15} />
                                <span>Pre-Book {simLandAcre} Acre Sowing</span>
                              </button>
                            ) : (
                              <span className="px-3.5 py-2 rounded-[8px] bg-[#E4ECE0] text-[#2F5233] text-xs font-bold shrink-0">
                                Sourcing Pipeline Active
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Glut Crops to Avoid Section */}
              <div className="p-5 rounded-[16px] bg-[#FFF5F5] border border-[#B3412C]/30 space-y-2">
                <div className="flex items-center gap-2 text-[#B3412C]">
                  <AlertTriangle size={18} />
                  <h4 className="font-display font-bold text-sm">
                    Machine Learning Caution: Crops with Zero Demand & Severe Gluts
                  </h4>
                </div>
                <p className="text-xs text-[#B3412C] leading-relaxed">
                  The model strongly advises <strong>pausing production of Bottle Gourd (Lauki) and White Cauliflower</strong> for this sowing window. Over 420% regional oversupply has resulted in zero buyer contracts on Agridirect and wholesale prices collapsing below ₹6/kg in nearby APMC mandis.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3 bg-white border-t border-[#DDD9CD] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-[#5B6660]">
            Agridirect Data Intelligence • Model v3.4 • Updated Hourly from APMC Mandi Ingress & Buyer Bids
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-[10px] bg-[#EFEDE6] hover:bg-[#DDD9CD] text-[#1C2321] font-bold transition-colors cursor-pointer self-end sm:self-auto"
          >
            Done / Close Intelligence View
          </button>
        </div>
      </div>
    </div>
  );
};
