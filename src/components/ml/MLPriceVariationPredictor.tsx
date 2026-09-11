import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area
} from 'recharts';
import {
  CommodityMLAnalysis,
  COMMODITY_PRICE_MODELS,
  TRENDING_PRODUCTS_LEADERBOARD,
  getMLPriceForecast,
  PriceForecastPoint
} from '../../utils/mlPriceForecast';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  DollarSign,
  ChevronRight,
  RotateCcw,
  Sliders,
  Scale,
  Cpu,
  ShieldCheck
} from 'lucide-react';

interface MLPriceVariationPredictorProps {
  initialCommodity?: string;
  onSelectCommodity?: (commodity: string) => void;
}

export const MLPriceVariationPredictor: React.FC<MLPriceVariationPredictorProps> = ({
  initialCommodity = 'Hybrid Roma Tomatoes',
  onSelectCommodity
}) => {
  const [selectedCommodity, setSelectedCommodity] = useState<string>(initialCommodity);
  const [horizonDays, setHorizonDays] = useState<number>(14);
  const [activeSubTab, setActiveSubTab] = useState<'forecast' | 'trending'>('forecast');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<CommodityMLAnalysis>(() => getMLPriceForecast(initialCommodity, 14));

  // Update whenever commodity or horizon changes
  useEffect(() => {
    setAnalysis(getMLPriceForecast(selectedCommodity, horizonDays));
  }, [selectedCommodity, horizonDays]);

  const handleRecalculate = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setAnalysis(getMLPriceForecast(selectedCommodity, horizonDays));
      setIsRefreshing(false);
    }, 250);
  };

  const chartData = useMemo(() => {
    const totalPoints = horizonDays === 7 ? 15 : 22;
    return analysis.historical_and_forecast.slice(0, totalPoints);
  }, [analysis, horizonDays]);

  const isBullish = analysis.expected_change_pct > 0;

  return (
    <div className="bg-white border border-[#DDD9CD] rounded-[16px] p-4 sm:p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#DDD9CD]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[#E4ECE0] flex items-center justify-center text-[#2F5233] shrink-0">
            <Activity size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-base sm:text-lg text-[#1C2321] font-display">
                Algorithmic Price Variation & Forecast Engine
              </h3>
              <span className="px-2 py-0.5 rounded-[6px] text-[10px] font-bold bg-[#FAF4ED] text-[#C77B2E] border border-[#C77B2E]/20 flex items-center gap-1">
                <Cpu size={11} />
                <span>Zero-Heavy-Model • 100% Algorithmic</span>
              </span>
            </div>
            <p className="text-xs text-[#5B6660] mt-0.5">
              Deterministic time-series regression, arrival elasticity, and 95% standard error confidence curves
            </p>
          </div>
        </div>

        {/* View Switcher & Recalculate */}
        <div className="flex items-center gap-2">
          <div className="bg-[#EFEDE6] p-1 rounded-[10px] flex items-center gap-1 border border-[#DDD9CD]">
            <button
              type="button"
              onClick={() => setActiveSubTab('forecast')}
              className={`px-3 py-1.5 rounded-[8px] text-xs font-bold transition-all ${
                activeSubTab === 'forecast'
                  ? 'bg-white text-[#2F5233] shadow-xs'
                  : 'text-[#5B6660] hover:text-[#1C2321]'
              }`}
            >
              Price Variation Curve
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('trending')}
              className={`px-3 py-1.5 rounded-[8px] text-xs font-bold transition-all ${
                activeSubTab === 'trending'
                  ? 'bg-white text-[#2F5233] shadow-xs'
                  : 'text-[#5B6660] hover:text-[#1C2321]'
              }`}
            >
              Trending Products ({TRENDING_PRODUCTS_LEADERBOARD.length})
            </button>
          </div>

          <button
            type="button"
            onClick={handleRecalculate}
            disabled={isRefreshing}
            className="p-2 text-[#5B6660] hover:text-[#1C2321] hover:bg-[#EFEDE6] rounded-[8px] transition-colors border border-[#DDD9CD]"
            title="Recalculate algorithmic curves"
          >
            <RotateCcw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {activeSubTab === 'forecast' ? (
        <div className="pt-4 space-y-6">
          {/* Commodity Selector Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-[#5B6660] shrink-0 mr-1">Commodity:</span>
            {Object.keys(COMMODITY_PRICE_MODELS).map((crop) => {
              const isSelected = selectedCommodity === crop;
              return (
                <button
                  key={crop}
                  type="button"
                  onClick={() => {
                    setSelectedCommodity(crop);
                    if (onSelectCommodity) onSelectCommodity(crop);
                  }}
                  className={`px-3 py-1.5 rounded-[8px] text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#2F5233] text-white shadow-xs'
                      : 'bg-[#FAF8F3] text-[#1C2321] border border-[#DDD9CD] hover:bg-[#EFEDE6]'
                  }`}
                >
                  {crop}
                </button>
              );
            })}
          </div>

          {/* Key Stat Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-[#FAF8F3] border border-[#DDD9CD] rounded-[12px]">
              <span className="text-[10px] uppercase font-bold text-[#5B6660] tracking-wider block">
                Current Spot Price
              </span>
              <div className="text-2xl font-extrabold text-[#1C2321] font-display mt-0.5">
                ₹{analysis.current_spot_price}
                <span className="text-xs font-normal text-[#5B6660]">/kg</span>
              </div>
              <span className="text-[11px] font-semibold text-[#5B6660]">
                Contract: ₹{analysis.direct_contract_price}/kg
              </span>
            </div>

            <div className="p-3.5 bg-[#FAF8F3] border border-[#DDD9CD] rounded-[12px]">
              <span className="text-[10px] uppercase font-bold text-[#5B6660] tracking-wider block">
                {horizonDays}-Day Algorithmic Forecast
              </span>
              <div className="text-2xl font-extrabold text-[#1C2321] font-display mt-0.5">
                ₹{analysis.predicted_14d_price}
                <span className="text-xs font-normal text-[#5B6660]">/kg</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                {isBullish ? (
                  <span className="text-[11px] font-bold text-[#2E7D4F] flex items-center">
                    <TrendingUp size={13} className="mr-0.5" /> +{analysis.expected_change_pct}%
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-[#B3412C] flex items-center">
                    <TrendingDown size={13} className="mr-0.5" /> {analysis.expected_change_pct}%
                  </span>
                )}
                <span className="text-[10px] text-[#5B6660]">regression slope</span>
              </div>
            </div>

            <div className="p-3.5 bg-[#FAF8F3] border border-[#DDD9CD] rounded-[12px]">
              <span className="text-[10px] uppercase font-bold text-[#5B6660] tracking-wider block">
                Volatility Index (σ)
              </span>
              <div className="text-2xl font-extrabold text-[#1C2321] font-display mt-0.5">
                {analysis.volatility_index}
                <span className="text-xs font-normal text-[#5B6660]">/100</span>
              </div>
              <span
                className={`text-[11px] font-bold ${
                  analysis.volatility_index > 50
                    ? 'text-[#B3412C]'
                    : analysis.volatility_index > 30
                    ? 'text-[#C77B2E]'
                    : 'text-[#2E7D4F]'
                }`}
              >
                {analysis.volatility_index > 50
                  ? 'High Volatility (Hedging advised)'
                  : analysis.volatility_index > 30
                  ? 'Moderate Elasticity'
                  : 'Low Risk Stable Corridor'}
              </span>
            </div>

            <div className="p-3.5 bg-[#2F5233] text-white rounded-[12px]">
              <span className="text-[10px] uppercase font-bold text-white/70 tracking-wider block">
                Peak Selling Score
              </span>
              <div className="text-2xl font-extrabold font-display mt-0.5">
                {analysis.peak_selling_score}
                <span className="text-xs font-normal text-white/70">/100</span>
              </div>
              <span className="text-[11px] font-medium text-white/90 truncate block">
                {analysis.optimal_harvest_window}
              </span>
            </div>
          </div>

          {/* Interactive Recharts Graph */}
          <div className="p-4 bg-[#FAF8F3] border border-[#DDD9CD] rounded-[12px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h4 className="font-bold text-sm text-[#1C2321]">
                  Price Variation & Forecast Curve: {selectedCommodity}
                </h4>
                <p className="text-[11px] text-[#5B6660]">
                  Historical APMC benchmark vs. deterministic regression model with ±95% confidence bands
                </p>
              </div>

              {/* Horizon switch */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-[8px] border border-[#DDD9CD] self-start">
                <button
                  type="button"
                  onClick={() => setHorizonDays(7)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-[6px] transition-all cursor-pointer ${
                    horizonDays === 7 ? 'bg-[#2F5233] text-white' : 'text-[#5B6660] hover:text-[#1C2321]'
                  }`}
                >
                  7-Day Horizon
                </button>
                <button
                  type="button"
                  onClick={() => setHorizonDays(14)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-[6px] transition-all cursor-pointer ${
                    horizonDays === 14 ? 'bg-[#2F5233] text-white' : 'text-[#5B6660] hover:text-[#1C2321]'
                  }`}
                >
                  14-Day Horizon
                </button>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D5" vertical={false} />
                  <XAxis dataKey="day_label" tick={{ fontSize: 10, fill: '#5B6660' }} axisLine={{ stroke: '#DDD9CD' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#5B6660' }} axisLine={{ stroke: '#DDD9CD' }} unit="₹" domain={['auto', 'auto']} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload as PriceForecastPoint;
                        return (
                          <div className="bg-white border border-[#DDD9CD] p-3 rounded-[8px] shadow-lg text-xs space-y-1">
                            <p className="font-bold text-[#1C2321]">{item.day_label} ({item.date})</p>
                            {item.actual_price && (
                              <p className="text-[#1C2321]">
                                Actual Spot: <strong className="font-mono">₹{item.actual_price}/kg</strong>
                              </p>
                            )}
                            <p className="text-[#2F5233]">
                              Forecast: <strong className="font-mono">₹{item.predicted_price}/kg</strong>
                            </p>
                            {item.is_projected && (
                              <p className="text-[10px] text-[#5B6660]">
                                95% Confidence: ₹{item.lower_bound} - ₹{item.upper_bound}/kg
                              </p>
                            )}
                            <p className="text-[#C77B2E]">
                              Mandi Avg: <strong className="font-mono">₹{item.mandi_average}/kg</strong>
                            </p>
                            <p className="text-[10px] text-[#5B6660]">
                              Arrivals: {item.arrival_volume_mt} MT/day
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />

                  {/* Mandi benchmark line */}
                  <Line
                    type="monotone"
                    dataKey="mandi_average"
                    name="APMC Mandi Benchmark"
                    stroke="#C77B2E"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />

                  {/* Forecast Line */}
                  <Line
                    type="monotone"
                    dataKey="predicted_price"
                    name="Algorithmic Price Trend"
                    stroke="#2F5233"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#2F5233' }}
                    activeDot={{ r: 6, fill: '#2F5233' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 text-[10px] text-[#5B6660] flex items-center justify-between flex-wrap gap-2">
              <span>Engine: {analysis.algorithm_metadata.engine} ({analysis.algorithm_metadata.confidence_interval})</span>
              <span>Benchmark Corridors: Kolar, Yeshwanthpur & Hubli APMCs</span>
            </div>
          </div>

          {/* Mathematical & Actionable Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Drivers */}
            <div className="p-4 bg-white border border-[#DDD9CD] rounded-[12px]">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#5B6660] mb-2.5 flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-[#2F5233]" />
                <span>Price Variation Factors & Regional Elasticity</span>
              </h5>
              <ul className="space-y-2 text-xs text-[#1C2321]">
                {analysis.key_drivers.map((driver, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2F5233] mt-1.5 shrink-0" />
                    <span>{driver}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Strategic Directive */}
            <div className="p-4 bg-white border border-[#DDD9CD] rounded-[12px] space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#5B6660] flex items-center gap-1.5">
                <Scale size={13} className="text-[#C77B2E]" />
                <span>Clearinghouse Strategic Directive</span>
              </h5>
              <div className="p-2.5 rounded-[8px] bg-[#E4ECE0] text-xs text-[#1C2321]">
                <strong className="text-[#2F5233] block mb-0.5">🌾 Recommendation for Farmers:</strong>
                <p className="text-[11px] text-[#1C2321]">{analysis.recommendation_for_farmer}</p>
              </div>
              <div className="p-2.5 rounded-[8px] bg-[#FAF8F3] border border-[#DDD9CD] text-xs text-[#1C2321]">
                <strong className="text-[#C77B2E] block mb-0.5">🛒 Recommendation for Buyers:</strong>
                <p className="text-[11px] text-[#5B6660]">{analysis.recommendation_for_buyer}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Trending Products Tab */
        <div className="pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#5B6660]">
              Market-Wide Trending Agricultural Products
            </h4>
            <span className="text-[11px] text-[#5B6660]">
              Algorithmic Demand-Velocity Ranking
            </span>
          </div>

          <div className="space-y-3">
            {TRENDING_PRODUCTS_LEADERBOARD.map((item, idx) => {
              const isUp = item.weekly_change_pct > 0;
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-[12px] bg-white border border-[#DDD9CD] hover:border-[#2F5233] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  onClick={() => {
                    setSelectedCommodity(item.commodity);
                    setActiveSubTab('forecast');
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EFEDE6] flex items-center justify-center text-xs font-bold text-[#5B6660] shrink-0">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-[#1C2321]">{item.commodity}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-[4px] bg-[#EFEDE6] text-[#5B6660]">
                          {item.category}
                        </span>
                        {item.is_peak_selling && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-[4px] bg-[#FAF4ED] text-[#C77B2E] border border-[#C77B2E]/20">
                            ★ PEAK SELLING POINT
                          </span>
                        )}
                        {item.is_glut_warning && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-[4px] bg-[#FBEBE8] text-[#B3412C] border border-[#B3412C]/20">
                            ⚠ SEVERE GLUT (0 BID)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#5B6660] mt-1">{item.ai_summary}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:text-right shrink-0">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#5B6660] block">Current Rate</span>
                      <span className="text-sm font-bold text-[#1C2321]">₹{item.current_rate}/kg</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#5B6660] block">Weekly Shift</span>
                      <span
                        className={`text-sm font-bold flex items-center ${
                          isUp ? 'text-[#2E7D4F]' : 'text-[#B3412C]'
                        }`}
                      >
                        {isUp ? <TrendingUp size={13} className="mr-0.5" /> : <TrendingDown size={13} className="mr-0.5" />}
                        {item.weekly_change_pct}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#5B6660] block">Velocity</span>
                      <span className="text-sm font-bold text-[#2F5233]">{item.trend_velocity_score}/100</span>
                    </div>
                    <ChevronRight size={18} className="text-[#5B6660]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
