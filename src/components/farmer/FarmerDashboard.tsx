import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Demand, FarmerApplication } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { QuantityLockBar } from './QuantityLockBar';
import { QualityAssessmentView } from './QualityAssessmentView';
import { FarmerApplicationModal } from './FarmerApplicationModal';
import { MarketTrendsModal } from '../trends/MarketTrendsModal';
import { ML_CROP_SUGGESTIONS, INITIAL_MARKET_TRENDS } from '../../data/marketTrendsData';
import {
  Sparkles,
  Layers,
  Camera,
  CheckCircle2,
  Clock,
  Lock,
  ArrowRight,
  TrendingUp,
  MapPin,
  DollarSign,
  ShieldCheck,
  Globe,
  SlidersHorizontal,
  PackageCheck,
  Truck,
  HeartHandshake,
  BarChart3,
  Sprout,
  AlertTriangle,
  Award
} from 'lucide-react';

export const FarmerDashboard: React.FC = () => {
  const {
    demands,
    applications,
    orders,
    farmerProfiles,
    currentUser,
    transactions,
    language,
    setLanguage,
    t
  } = useApp();

  const [activeTab, setActiveTab] = useState<'demands' | 'applications' | 'qa' | 'orders' | 'transactions'>('demands');
  const [selectedDemandForApply, setSelectedDemandForApply] = useState<Demand | null>(null);
  const [isSimpleMode, setIsSimpleMode] = useState<boolean>(true);
  const [trendsModalOpen, setTrendsModalOpen] = useState<boolean>(false);
  const [trendsModalTab, setTrendsModalTab] = useState<'trends' | 'ml_suggestions'>('ml_suggestions');

  const profile = farmerProfiles[currentUser.id] || {
    id: currentUser.id,
    name: currentUser.name,
    phone: '+91 98450 12345',
    location: currentUser.location,
    coordinates: { lat: 13.07, lng: 77.79 },
    commodities: ['Tomatoes'],
    total_capacity_kg: 500,
    available_quantity_kg: 300,
    locked_quantity_kg: 200,
    reliability_score: 94,
    fpo_member: true,
  };

  // Farmer's own applications
  const myApplications = applications.filter((a) => a.farmer_id === currentUser.id);

  // Farmer's confirmed orders
  const myOrders = orders.filter((o) =>
    o.farmers.some((f) => f.farmer_id === currentUser.id)
  );

  // Farmer's transactions
  const myTransactions = transactions.filter((t) => t.recipient_id === currentUser.id);

  return (
    <div id="farmer-workspace" className="max-w-4xl mx-auto space-y-5">
      {/* Top Banner: Farmer Friendly Language & Mode Bar */}
      <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Globe size={18} className="text-[#2F5233]" />
          <span className="text-xs font-bold text-[#1C2321]">
            {language === 'kn' ? 'ಭಾಷೆ / Language:' : 'Language:'}
          </span>
          <div className="inline-flex rounded-[8px] bg-[#EFEDE6] p-0.5 border border-[#DDD9CD]">
            <button
              type="button"
              onClick={() => setLanguage('kn')}
              className={`px-3 py-1 rounded-[6px] text-xs font-bold transition-colors ${
                language === 'kn'
                  ? 'bg-[#2F5233] text-white shadow-xs'
                  : 'text-[#5B6660] hover:text-[#1C2321]'
              }`}
            >
              ಕನ್ನಡ
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-[6px] text-xs font-bold transition-colors ${
                language === 'en'
                  ? 'bg-[#2F5233] text-white shadow-xs'
                  : 'text-[#5B6660] hover:text-[#1C2321]'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1 rounded-[6px] text-xs font-bold transition-colors ${
                language === 'hi'
                  ? 'bg-[#2F5233] text-white shadow-xs'
                  : 'text-[#5B6660] hover:text-[#1C2321]'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>

        {/* Toggle between Minimal Farmer View & Technical View */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSimpleMode(!isSimpleMode)}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-bold border transition-colors flex items-center gap-1.5 ${
              isSimpleMode
                ? 'bg-[#E4ECE0] text-[#2F5233] border-[#2F5233]/40'
                : 'bg-[#EFEDE6] text-[#5B6660] border-[#DDD9CD] hover:text-[#1C2321]'
            }`}
          >
            <SlidersHorizontal size={14} />
            <span>
              {isSimpleMode
                ? (language === 'kn' ? '✓ ಸುಲಭ ರೈತ ನೋಟ (ಸಕ್ರಿಯ)' : '✓ Simple Farmer Mode')
                : (language === 'kn' ? 'ತಾಂತ್ರಿಕ ನೋಟ (ವಿಸ್ತೃತ)' : 'Detailed Technical View')}
            </span>
          </button>
        </div>
      </div>

      {/* Greeting & Produce Overview Card */}
      <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#2E7D4F] animate-pulse" />
              <h1 className="font-display font-bold text-xl sm:text-2xl text-[#1C2321]">
                {language === 'kn' ? `ನಮಸ್ಕಾರ, ${profile.name}!` : `Welcome, ${profile.name}!`}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#5B6660] mt-1 flex items-center gap-1.5">
              <MapPin size={13} className="text-[#5B6660]" />
              <span>{profile.location}</span>
              <span>•</span>
              <span>
                {language === 'kn' ? 'ವಿಶ್ವಾಸಾರ್ಹತೆ ರೇಟಿಂಗ್:' : 'Reliability:'}{' '}
                <strong className="text-[#2F5233]">{profile.reliability_score}%</strong>
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsSimpleMode(false);
              setActiveTab('qa');
            }}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#2F5233] hover:bg-[#25401F] text-white text-xs font-bold rounded-[10px] transition-colors shadow-sm self-start sm:self-center"
          >
            <Camera size={16} />
            <span>{t('quality_check')}</span>
          </button>
        </div>

        {/* 3 Large, Clean Metric Cards for Farmer Clarity */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Card 1: Available */}
          <div className="bg-[#E4ECE0]/50 border border-[#2F5233]/20 rounded-[12px] p-4">
            <span className="text-xs font-semibold text-[#2F5233] block">
              {t('available_stock')}
            </span>
            <div className="text-2xl font-bold font-mono text-[#2F5233] mt-1">
              {profile.available_quantity_kg} <span className="text-sm font-sans">{t('unit_kg')}</span>
            </div>
            <span className="text-[11px] text-[#5B6660] mt-1 block">
              {language === 'kn' ? 'ಮಾರಾಟಕ್ಕೆ ತಕ್ಷಣ ಸಿದ್ಧವಿದೆ' : 'Ready to sell immediately'}
            </span>
          </div>

          {/* Card 2: Booked / Locked */}
          <div className="bg-[#EFEDE6] border border-[#DDD9CD] rounded-[12px] p-4">
            <span className="text-xs font-semibold text-[#5B6660] block">
              {t('locked_stock')}
            </span>
            <div className="text-2xl font-bold font-mono text-[#1C2321] mt-1">
              {profile.locked_quantity_kg} <span className="text-sm font-sans">{t('unit_kg')}</span>
            </div>
            <span className="text-[11px] text-[#5B6660] mt-1 block">
              {language === 'kn' ? 'ಖರೀದಿದಾರರಿಗೆ ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ' : 'Committed for buyer fulfillment'}
            </span>
          </div>

          {/* Card 3: Quality Grade */}
          <div className="bg-[#F6E7D3]/40 border border-[#C77B2E]/30 rounded-[12px] p-4">
            <span className="text-xs font-semibold text-[#C77B2E] block">
              {language === 'kn' ? 'ಬೆಳೆ ಗುಣಮಟ್ಟ ದರ್ಜೆ' : 'Assessed Grade'}
            </span>
            <div className="text-2xl font-bold text-[#1C2321] mt-1 flex items-center gap-1.5">
              <span>Grade A</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#E4ECE0] text-[#2F5233]">
                94%
              </span>
            </div>
            <span className="text-[11px] text-[#5B6660] mt-1 block">
              {language === 'kn' ? 'ಕ್ಯಾಮರಾ ಸ್ಕ್ಯಾನ್ ಮೂಲಕ ದೃಢಪಟ್ಟಿದೆ' : 'AI prototype verified'}
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================================
          MACHINE LEARNING CROP ADVISORY & CURRENT MARKET TRENDS CARD
         ===================================================================== */}
      <div className="bg-[#FFFFFF] border-2 border-[#2F5233]/30 rounded-[18px] p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDD9CD] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#E4ECE0] text-[#2F5233] text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1">
                <Sparkles size={11} />
                ML Crop Advisory
              </span>
              <span className="text-xs text-[#5B6660]">
                {language === 'kn' ? 'ಖರೀದಿದಾರರ ಬೇಡಿಕೆ ಆಧಾರಿತ AI ಶಿಫಾರಸು' : 'Trained on Real Buyer Demand & Mandi Arrivals'}
              </span>
            </div>
            <h2 className="font-display font-bold text-base sm:text-lg text-[#1C2321] flex items-center gap-2">
              <Sprout size={20} className="text-[#2F5233]" />
              <span>
                {language === 'kn' ? 'ಮುಂದಿನ ಬೆಳೆಗೆ AI ಶಿಫಾರಸು (ಹೆಚ್ಚಿನ ಬೇಡಿಕೆಯ ಬೆಳೆಗಳು)' : 'What to Grow Next: AI High-Demand Crop Suggestions'}
              </span>
            </h2>
            <p className="text-xs text-[#5B6660]">
              {language === 'kn'
                ? 'ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಗರಿಷ್ಠ ಬೇಡಿಕೆ ಇರುವ ಮತ್ತು ಮುಂದಿನ ತಿಂಗಳಲ್ಲಿ ಉತ್ತಮ ಬೆಲೆ ತರುವ ಬೆಳೆಗಳನ್ನು ಆರಿಸಿ.'
                : 'The ML model learns from real-time buyer forward orders to recommend crops with guaranteed procurement and zero market gluts.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="farmer-view-trends-btn"
              type="button"
              onClick={() => {
                setTrendsModalTab('trends');
                setTrendsModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-[10px] bg-[#EFEDE6] hover:bg-[#DDD9CD] text-[#1C2321] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <BarChart3 size={15} className="text-[#2F5233]" />
              <span>Market Trends Graph</span>
            </button>
            <button
              id="farmer-open-ml-btn"
              type="button"
              onClick={() => {
                setTrendsModalTab('ml_suggestions');
                setTrendsModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-[10px] bg-[#2F5233] hover:bg-[#25401F] text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Sparkles size={15} />
              <span>Full ML Simulator</span>
            </button>
          </div>
        </div>

        {/* 3 Featured ML Recommendations */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ML_CROP_SUGGESTIONS.slice(0, 3).map((crop, idx) => (
            <div
              key={crop.id}
              onClick={() => {
                setTrendsModalTab('ml_suggestions');
                setTrendsModalOpen(true);
              }}
              className="p-3.5 rounded-[12px] bg-[#FAF9F5] border border-[#DDD9CD] hover:border-[#2F5233] cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1C2321] group-hover:text-[#2F5233] transition-colors">
                  {crop.cropName}
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-[#E4ECE0] text-[#2F5233]">
                  {crop.mlDemandScore}/100 Score
                </span>
              </div>

              <div className="text-[11px] text-[#5B6660]">
                Variety: {crop.variety} • {crop.expectedHarvestWindowDays} Days Cycle
              </div>

              <div className="pt-1.5 border-t border-[#DDD9CD]/70 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-[#5B6660] block">Expected Price</span>
                  <span className="font-mono font-bold text-[#2F5233]">
                    ₹{crop.projectedHarvestPriceMin} - ₹{crop.projectedHarvestPriceMax}/kg
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#5B6660] block">Est. Profit/Acre</span>
                  <span className="font-mono font-bold text-[#1C2321]">
                    ₹{(crop.projectedNetProfitPerAcre / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-[#2E7D4F] font-bold bg-[#E4ECE0]/70 p-1.5 rounded-[6px] line-clamp-1">
                {crop.demandDriver}
              </div>
            </div>
          ))}
        </div>

        {/* Glut Alert Strip */}
        <div className="p-3 rounded-[10px] bg-[#FFF5F5] border border-[#B3412C]/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#B3412C]">
            <AlertTriangle size={16} className="shrink-0" />
            <span>
              <strong>Market Glut Warning:</strong> Zero buyer demand for Bottle Gourd (Lauki) & Cauliflower. Wholesale prices down 72%. Avoid planting this week.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setTrendsModalTab('trends');
              setTrendsModalOpen(true);
            }}
            className="text-[11px] font-bold text-[#B3412C] underline hover:no-underline shrink-0 cursor-pointer"
          >
            View Glut Data &rarr;
          </button>
        </div>
      </div>

      {/* =====================================================================
          MINIMAL FARMER MODE (Default) - Intuitive, simple, large touch targets
         ===================================================================== */}
      {isSimpleMode ? (
        <div className="space-y-6">
          {/* Section 1: Live Demands to Sell to */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#1C2321] font-display">
                  {t('farmer_demands_title')}
                </h2>
                <p className="text-xs text-[#5B6660]">
                  {language === 'kn'
                    ? 'ಖರೀದಿದಾರರ ಬೇಡಿಕೆಗೆ ತಕ್ಕಂತೆ ನಿಮ್ಮ ಬೆಳೆ ಮಾರಾಟ ಮಾಡಿ. ಬೆಲೆ ಮತ್ತು ಪ್ರಮಾಣ ಸಂಧಾನ ಸಾಧ್ಯವಿದೆ.'
                    : 'Direct demand from verified buyers with negotiable price & quantity tolerance.'}
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-[8px] bg-[#E4ECE0] text-[#2F5233]">
                {demands.filter((d) => d.status === 'OPEN').length} {language === 'kn' ? 'ಬೇಡಿಕೆಗಳು' : 'Open'}
              </span>
            </div>

            <div className="space-y-4">
              {demands.map((demand) => {
                const myExistingApp = myApplications.find((a) => a.demand_id === demand.id);
                const isClosed = demand.status !== 'OPEN';
                const buyerMin = demand.target_price_min ?? Math.round(demand.target_price * 0.95);
                const buyerMax = demand.target_price_max ?? Math.round(demand.target_price * 1.05);
                const toleranceKg = Math.round(demand.quantity_required * ((demand.quantity_tolerance_pct ?? 5) / 100));

                return (
                  <div
                    key={demand.id}
                    className="bg-[#FFFFFF] border-2 border-[#DDD9CD] hover:border-[#2F5233]/50 rounded-[16px] p-5 shadow-sm space-y-4 transition-all"
                  >
                    {/* Header line: Commodity & Quantity */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DDD9CD]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg sm:text-xl font-display font-bold text-[#1C2321]">
                            {demand.commodity}
                          </span>
                          <span className="text-sm font-bold bg-[#EFEDE6] px-2.5 py-0.5 rounded-[6px] text-[#1C2321]">
                            {demand.quantity_required} {t('unit_kg')}
                          </span>
                          <StatusBadge status={demand.status} size="sm" />
                        </div>
                        <div className="text-xs text-[#5B6660] mt-1">
                          {t('buyer_title')}: <strong className="text-[#1C2321]">{demand.buyer_name}</strong> • {demand.delivery_location.split(',')[0]}
                        </div>
                      </div>

                      {/* Negotiable Price Range Badge */}
                      <div className="text-left sm:text-right bg-[#E4ECE0]/40 sm:bg-transparent p-2.5 sm:p-0 rounded-[10px]">
                        <div className="text-lg font-bold font-mono text-[#2F5233]">
                          ₹{buyerMin} - ₹{buyerMax} / {t('unit_kg')}
                        </div>
                        <div className="text-[11px] font-bold text-[#C77B2E] flex items-center gap-1 sm:justify-end">
                          <HeartHandshake size={13} />
                          <span>{t('price_range_negotiable')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Transit & Damage Buffer Explanation Box */}
                    <div className="bg-[#F7F6F2] border border-[#DDD9CD] rounded-[12px] p-3.5 space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                        <span className="font-bold text-[#1C2321] flex items-center gap-1.5">
                          <Truck size={15} className="text-[#2F5233]" />
                          <span>{t('transit_damage_title')}</span>
                        </span>
                        <span className="px-2 py-0.5 bg-[#F6E7D3] text-[#C77B2E] font-bold text-[11px] rounded-[6px]">
                          ±{demand.quantity_tolerance_pct ?? 5}% (~{toleranceKg} {t('unit_kg')})
                        </span>
                      </div>
                      <p className="text-xs text-[#5B6660] leading-relaxed">
                        {language === 'kn'
                          ? `ಪ್ರಯಾಣದ ಸಮಯದಲ್ಲಿ ಆಗಬಹುದಾದ ಅಲ್ಪ ಹಾನಿಗೆ ${toleranceKg} ಕೆ.ಜಿ (±5%) ಸಡಿಲಿಕೆ ಇರುತ್ತದೆ. 500 ಕೆ.ಜಿಯಲ್ಲಿ 475 ರಿಂದ 525 ಕೆ.ಜಿ ವರೆಗೆ ಖರೀದಿದಾರರು ಸ್ವೀಕರಿಸುತ್ತಾರೆ.`
                          : `Buyer accepts ±5% quantity tolerance (~${toleranceKg} kg) to cover potential transit or travel damage during transit.`}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        {myExistingApp ? (
                          <div className="inline-flex items-center gap-2 bg-[#E4ECE0] text-[#2F5233] px-3 py-1.5 rounded-[8px] text-xs font-bold">
                            <CheckCircle2 size={16} />
                            <span>
                              {language === 'kn' ? 'ನಿಮ್ಮ ಪ್ರಸ್ತಾಪ ಸಲ್ಲಿಸಲಾಗಿದೆ:' : 'You Offered:'}{' '}
                              {myExistingApp.offered_quantity} kg @ ₹{myExistingApp.offered_price_min || myExistingApp.offered_price}-₹{myExistingApp.offered_price_max || myExistingApp.offered_price}/kg
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-[#5B6660]">
                            {t('available_stock')}: <strong className="text-[#1C2321]">{profile.available_quantity_kg} {t('unit_kg')}</strong>
                          </span>
                        )}
                      </div>

                      {!myExistingApp && !isClosed && (
                        <button
                          type="button"
                          onClick={() => setSelectedDemandForApply(demand)}
                          className="min-h-[44px] px-6 py-2.5 rounded-[12px] bg-[#2F5233] hover:bg-[#25401F] text-white text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.01]"
                        >
                          <PackageCheck size={18} />
                          <span>{t('sell_crop')}</span>
                        </button>
                      )}

                      {isClosed && !myExistingApp && (
                        <span className="text-xs text-[#5B6660] font-medium bg-[#EFEDE6] px-3 py-1.5 rounded-[8px]">
                          {language === 'kn' ? 'ಬೇಡಿಕೆ ಮುಕ್ತಾಯವಾಗಿದೆ' : 'Response Closed'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: My Applications & Orders summary in Simple Farmer Mode */}
          <div className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-bold text-[#1C2321] font-display">
              {t('my_offers')} ({myApplications.length})
            </h2>

            {myApplications.length === 0 ? (
              <div className="bg-white border border-[#DDD9CD] rounded-[16px] p-6 text-center text-xs text-[#5B6660]">
                {language === 'kn'
                  ? 'ನೀವು ಇನ್ನೂ ಯಾವುದೇ ಬೆಳೆ ಮಾರಾಟ ಪ್ರಸ್ತಾಪ ಸಲ್ಲಿಸಿಲ್ಲ. ಮೇಲಿನ ಬೇಡಿಕೆಗಳಲ್ಲಿ "ಬೆಳೆ ಮಾರಾಟ ಮಾಡಿ" ಕ್ಲಿಕ್ ಮಾಡಿ.'
                  : 'You have not submitted any crop offers yet. Click "Sell Crop" on the demands above.'}
              </div>
            ) : (
              <div className="space-y-3">
                {myApplications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white border border-[#DDD9CD] rounded-[14px] p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1C2321]">{app.demand_id}</span>
                        <StatusBadge status={app.status} size="sm" />
                      </div>
                      <div className="text-xs font-semibold text-[#2F5233] mt-1">
                        {language === 'kn' ? 'ಪ್ರಸ್ತಾಪಿಸಿದ ತೂಕ:' : 'Offered:'} {app.offered_quantity} kg • {language === 'kn' ? 'ಬೆಲೆ:' : 'Price:'} ₹{app.offered_price_min || app.offered_price} - ₹{app.offered_price_max || app.offered_price}/kg
                      </div>
                      {app.transit_damage_allowance_kg && (
                        <div className="text-[11px] text-[#C77B2E] mt-0.5">
                          ✓ {language === 'kn' ? 'ಸಾಗಾಣಿಕೆ ಹಾನಿ ಸಡಿಲಿಕೆ ಒಪ್ಪಿಗೆಯಿದೆ' : 'Transit damage allowance agreed'} (±{app.quantity_tolerance_pct ?? 5}%)
                        </div>
                      )}
                    </div>

                    <div className="text-right sm:self-center">
                      <span className="text-xs font-bold px-3 py-1.5 rounded-[8px] bg-[#EFEDE6] text-[#1C2321]">
                        {app.status === 'APPLIED' ? t('status_under_review') : app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* =====================================================================
           DETAILED TECHNICAL VIEW - Standard technical tabs for advanced control
           ===================================================================== */
        <div className="space-y-5">
          {/* Mandatory Quantity Locking Bar (§10 & §17) */}
          <QuantityLockBar profile={profile} />

          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto border-b border-[#DDD9CD] gap-1 pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('demands')}
              className={`min-h-[44px] px-4 text-xs font-semibold rounded-t-[8px] border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'demands'
                  ? 'border-[#2F5233] text-[#2F5233] bg-[#E4ECE0]/30'
                  : 'border-transparent text-[#5B6660] hover:text-[#1C2321]'
              }`}
            >
              Live Demands ({demands.filter(d => d.status === 'OPEN').length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('applications')}
              className={`min-h-[44px] px-4 text-xs font-semibold rounded-t-[8px] border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'applications'
                  ? 'border-[#2F5233] text-[#2F5233] bg-[#E4ECE0]/30'
                  : 'border-transparent text-[#5B6660] hover:text-[#1C2321]'
              }`}
            >
              My Offers ({myApplications.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('qa')}
              className={`min-h-[44px] px-4 text-xs font-semibold rounded-t-[8px] border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'qa'
                  ? 'border-[#2F5233] text-[#2F5233] bg-[#E4ECE0]/30'
                  : 'border-transparent text-[#5B6660] hover:text-[#1C2321]'
              }`}
            >
              Quality CV Scan
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`min-h-[44px] px-4 text-xs font-semibold rounded-t-[8px] border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'orders'
                  ? 'border-[#2F5233] text-[#2F5233] bg-[#E4ECE0]/30'
                  : 'border-transparent text-[#5B6660] hover:text-[#1C2321]'
              }`}
            >
              Confirmed Deliveries ({myOrders.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('transactions')}
              className={`min-h-[44px] px-4 text-xs font-semibold rounded-t-[8px] border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'transactions'
                  ? 'border-[#2F5233] text-[#2F5233] bg-[#E4ECE0]/30'
                  : 'border-transparent text-[#5B6660] hover:text-[#1C2321]'
              }`}
            >
              Payouts ({myTransactions.length})
            </button>
          </div>

          {/* Tab 1: Live Demands List (§4 & §5) */}
          {activeTab === 'demands' && (
            <div className="space-y-4">
              <div className="text-xs text-[#5B6660]">
                Verified commercial buyers seeking agricultural produce. Submit your offer before the response window closes:
              </div>

              <div className="grid grid-cols-1 gap-4">
                {demands.map((demand) => {
                  const myExistingApp = myApplications.find((a) => a.demand_id === demand.id);
                  const isClosed = demand.status !== 'OPEN';
                  const buyerMin = demand.target_price_min ?? Math.round(demand.target_price * 0.95);
                  const buyerMax = demand.target_price_max ?? Math.round(demand.target_price * 1.05);

                  return (
                    <div
                      key={demand.id}
                      className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-5 shadow-sm space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DDD9CD]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display font-bold text-base text-[#1C2321]">
                              {demand.quantity_required} kg {demand.commodity}
                            </span>
                            <StatusBadge status={demand.status} size="sm" />
                          </div>
                          <div className="text-xs text-[#5B6660] mt-0.5">
                            Buyer: <strong className="text-[#1C2321]">{demand.buyer_name}</strong> ({demand.buyer_type})
                          </div>
                        </div>

                        <div className="text-right sm:self-center">
                          <div className="font-display font-bold text-lg text-[#2F5233]">
                            ₹{buyerMin} - ₹{buyerMax}/kg
                          </div>
                          <div className="text-[11px] text-[#5B6660]">Negotiable Range</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#5B6660] bg-[#EFEDE6] p-3 rounded-[10px]">
                        <div>
                          <span className="text-[#5B6660] block text-[11px]">Required Grade:</span>
                          <strong className="text-[#1C2321]">{demand.quality_requirement}</strong>
                        </div>
                        <div>
                          <span className="text-[#5B6660] block text-[11px]">Delivery Location:</span>
                          <strong className="text-[#1C2321] truncate block">{demand.delivery_location.split(',')[0]}</strong>
                        </div>
                        <div>
                          <span className="text-[#5B6660] block text-[11px]">Transit Tolerance:</span>
                          <span className="text-[#C77B2E] font-medium flex items-center gap-1">
                            <ShieldCheck size={12} />
                            ±{demand.quantity_tolerance_pct ?? 5}% Buffer
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-2 flex items-center justify-between">
                        <div>
                          {myExistingApp ? (
                            <span className="text-xs font-semibold text-[#2F5233] flex items-center gap-1.5 bg-[#E4ECE0] px-3 py-1.5 rounded-[8px]">
                              <CheckCircle2 size={14} />
                              <span>Offered {myExistingApp.offered_quantity} kg @ ₹{myExistingApp.offered_price_min || myExistingApp.offered_price}-₹{myExistingApp.offered_price_max || myExistingApp.offered_price}/kg</span>
                            </span>
                          ) : (
                            <span className="text-xs text-[#5B6660]">
                              Your available inventory: <strong>{profile.available_quantity_kg} kg</strong>
                            </span>
                          )}
                        </div>

                        {!myExistingApp && !isClosed && (
                          <button
                            type="button"
                            onClick={() => setSelectedDemandForApply(demand)}
                            className="min-h-[44px] px-5 py-2 rounded-[10px] bg-[#2F5233] hover:bg-[#25401F] text-white text-xs font-bold transition-colors shadow-sm"
                          >
                            Apply: I CAN PROVIDE (§5)
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: My Applications */}
          {activeTab === 'applications' && (
            <div className="space-y-4">
              {myApplications.length === 0 ? (
                <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-8 text-center text-xs text-[#5B6660]">
                  You have not applied to any demands yet. Check the "Live Demands" tab to submit your produce offers.
                </div>
              ) : (
                <div className="space-y-3">
                  {myApplications.map((app) => (
                    <div
                      key={app.id}
                      className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-xs text-[#1C2321]">{app.id}</span>
                          <StatusBadge status={app.status} size="sm" />
                          <span className="text-xs text-[#5B6660]">for Demand {app.demand_id}</span>
                        </div>
                        <div className="text-xs text-[#1C2321] font-semibold mt-1">
                          Offered: {app.offered_quantity} kg @ ₹{app.offered_price_min || app.offered_price} - ₹{app.offered_price_max || app.offered_price}/kg
                        </div>
                        <div className="text-[11px] text-[#5B6660] mt-0.5">
                          Mode: {app.delivery_capability.replace('_', ' ')} • Submitted: {new Date(app.submitted_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      <div className="text-right sm:self-center">
                        <span className="text-xs font-medium px-3 py-1 rounded-[6px] bg-[#EFEDE6] text-[#1C2321]">
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Quality Assessment */}
          {activeTab === 'qa' && (
            <QualityAssessmentView
              onAssessmentCompleted={(assessment) => {
                // Assessment completed
              }}
            />
          )}

          {/* Tab 4: Confirmed Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {myOrders.length === 0 ? (
                <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-8 text-center text-xs text-[#5B6660]">
                  No confirmed delivery orders at this time.
                </div>
              ) : (
                myOrders.map((order) => {
                  const myCommitment = order.farmers.find((f) => f.farmer_id === currentUser.id);
                  if (!myCommitment) return null;

                  return (
                    <div
                      key={order.id}
                      className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-5 shadow-sm space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DDD9CD]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-[#1C2321]">{order.id}</span>
                            <StatusBadge status={order.status} size="sm" />
                          </div>
                          <div className="text-xs text-[#5B6660] mt-0.5">
                            Buyer: <strong>{order.buyer_name}</strong>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-display font-bold text-lg text-[#2F5233]">
                            {myCommitment.committed_quantity} kg @ ₹{myCommitment.agreed_price}/kg
                          </div>
                          <div className="text-xs text-[#5B6660]">
                            Payout: ₹{(myCommitment.committed_quantity * myCommitment.agreed_price).toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-[#E4ECE0]/40 rounded-[10px] text-xs text-[#1C2321] flex items-center justify-between">
                        <span>
                          <strong>Pickup: </strong> {myCommitment.pickup_location}
                        </span>
                        <span className="font-semibold text-[#2F5233]">
                          Status: {myCommitment.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Tab 5: Transactions */}
          {activeTab === 'transactions' && (
            <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-5 shadow-sm space-y-4">
              <h2 className="font-display font-bold text-base text-[#1C2321]">
                Farmer Payment & Escrow Settlement (§20)
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#DDD9CD] bg-[#EFEDE6] text-[#5B6660]">
                      <th className="py-2.5 px-3">Transaction ID</th>
                      <th className="py-2.5 px-3">Order Ref</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDD9CD]">
                    {myTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#EFEDE6]/40">
                        <td className="py-2.5 px-3 font-mono font-medium text-[#1C2321]">{tx.id}</td>
                        <td className="py-2.5 px-3 font-mono text-[#5B6660]">{tx.order_id}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#2F5233]">
                          ₹{tx.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 capitalize text-[#5B6660]">{tx.type.replace('_', ' ')}</td>
                        <td className="py-2.5 px-3">
                          <StatusBadge status={tx.status} size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Farmer Application Modal */}
      {selectedDemandForApply && (
        <FarmerApplicationModal
          demand={selectedDemandForApply}
          isOpen={true}
          onClose={() => setSelectedDemandForApply(null)}
          onSuccess={() => {
            if (!isSimpleMode) setActiveTab('applications');
          }}
        />
      )}

      {/* Real-time Agricultural Trends & ML Crop Suggestions Modal */}
      <MarketTrendsModal
        isOpen={trendsModalOpen}
        onClose={() => setTrendsModalOpen(false)}
        initialTab={trendsModalTab}
      />
    </div>
  );
};
