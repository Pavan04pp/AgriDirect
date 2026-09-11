import React, { useState, useMemo } from 'react';
import { Demand, FarmerApplication, FarmerProfile } from '../../types';
import {
  UtilityWeights,
  DEFAULT_UTILITY_WEIGHTS,
  UTILITY_PRESETS,
  calculateFarmerUtility,
  runUtilityFarmerAllocation,
  ScoredFarmerCandidate
} from '../../utils/farmerAllocationUtility';
import {
  Sliders,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  MapPin,
  Award,
  Layers,
  Cpu,
  Calculator
} from 'lucide-react';

interface FarmerAllocationOptimizerProps {
  demand: Demand;
  applications: FarmerApplication[];
  farmerProfiles: Record<string, FarmerProfile>;
  onApplyWeights?: (weights: UtilityWeights) => void;
}

export const FarmerAllocationOptimizer: React.FC<FarmerAllocationOptimizerProps> = ({
  demand,
  applications,
  farmerProfiles,
  onApplyWeights
}) => {
  const [weights, setWeights] = useState<UtilityWeights>(DEFAULT_UTILITY_WEIGHTS);
  const [activePreset, setActivePreset] = useState<string>('balanced');
  const [selectedCandidate, setSelectedCandidate] = useState<ScoredFarmerCandidate | null>(null);

  const handlePresetSelect = (presetKey: string) => {
    setActivePreset(presetKey);
    const p = UTILITY_PRESETS[presetKey];
    if (p) {
      setWeights({ ...p.weights });
      if (onApplyWeights) onApplyWeights(p.weights);
    }
  };

  const handleSliderChange = (factor: keyof UtilityWeights, val: number) => {
    setActivePreset('custom');
    setWeights((prev) => {
      const updated = { ...prev, [factor]: val };
      if (onApplyWeights) onApplyWeights(updated);
      return updated;
    });
  };

  const handleResetWeights = () => {
    handlePresetSelect('balanced');
  };

  // Run the multi-farmer algorithmic utility knapsack
  const allocationResult = useMemo(() => {
    return runUtilityFarmerAllocation(demand, applications, farmerProfiles, weights);
  }, [demand, applications, farmerProfiles, weights]);

  // All scored candidates
  const scoredCandidates = useMemo(() => {
    const list: ScoredFarmerCandidate[] = [];
    for (const app of applications) {
      const f = farmerProfiles[app.farmer_id];
      if (f) {
        list.push(calculateFarmerUtility(demand, app, f, weights));
      }
    }
    list.sort((a, b) => b.utilityScore - a.utilityScore);
    return list;
  }, [demand, applications, farmerProfiles, weights]);

  const totalWeight = Object.values(weights).reduce((s: number, w: number) => s + w, 0);

  return (
    <div className="bg-white border border-[#DDD9CD] rounded-[16px] p-4 sm:p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#DDD9CD]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[#E4ECE0] flex items-center justify-center text-[#2F5233] shrink-0">
            <Sliders size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-base sm:text-lg text-[#1C2321] font-display">
                Multi-Factor Utility Decision Optimizer
              </h3>
              <span className="px-2 py-0.5 rounded-[6px] text-[10px] font-bold bg-[#FAF4ED] text-[#C77B2E] border border-[#C77B2E]/20 flex items-center gap-1">
                <Calculator size={11} />
                <span>Deterministic MCDA Knapsack Algorithm</span>
              </span>
            </div>
            <p className="text-xs text-[#5B6660] mt-0.5">
              Balances optical Grade A confidence, transit distance exponential decay, lot compatibility, and reliability history
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetWeights}
            className="px-3 py-1.5 rounded-[8px] text-xs font-bold text-[#5B6660] hover:text-[#1C2321] hover:bg-[#EFEDE6] transition-colors border border-[#DDD9CD] flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Preset Strategy Buttons */}
      <div className="py-4 border-b border-[#DDD9CD]">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6660] block mb-2">
          Algorithm Optimization Strategy Presets:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(UTILITY_PRESETS).map(([key, p]) => (
            <button
              key={key}
              type="button"
              onClick={() => handlePresetSelect(key)}
              className={`p-2.5 rounded-[10px] border text-left transition-all cursor-pointer ${
                activePreset === key
                  ? 'bg-[#E4ECE0] border-[#2F5233] text-[#2F5233] shadow-xs'
                  : 'bg-[#FAF8F3] border-[#DDD9CD] text-[#1C2321] hover:bg-[#EFEDE6]'
              }`}
            >
              <div className="font-bold text-xs flex items-center justify-between">
                <span>{p.name}</span>
                {activePreset === key && <CheckCircle2 size={13} className="text-[#2F5233]" />}
              </div>
              <p className="text-[10px] text-[#5B6660] mt-1 leading-snug line-clamp-2">{p.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Sliders for Custom Tuning */}
      <div className="py-4 border-b border-[#DDD9CD] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#1C2321] flex items-center gap-1.5">
            <Cpu size={14} className="text-[#2F5233]" />
            <span>Tune Mathematical Factor Weights</span>
          </span>
          <span className="text-[11px] font-mono text-[#5B6660]">
            Total Weight Sum: <strong className="text-[#1C2321]">{totalWeight}%</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Quality */}
          <div className="p-3 bg-[#FAF8F3] border border-[#DDD9CD] rounded-[10px] space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[#1C2321] flex items-center gap-1">
                <Award size={13} className="text-[#2F5233]" /> Quality & Grade
              </span>
              <span className="font-mono font-bold text-[#2F5233]">{weights.quality}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={weights.quality}
              onChange={(e) => handleSliderChange('quality', Number(e.target.value))}
              className="w-full accent-[#2F5233] cursor-pointer"
            />
            <span className="text-[10px] text-[#5B6660] block">Grade A, blemish penalties, CV confidence</span>
          </div>

          {/* Distance */}
          <div className="p-3 bg-[#FAF8F3] border border-[#DDD9CD] rounded-[10px] space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[#1C2321] flex items-center gap-1">
                <MapPin size={13} className="text-[#C77B2E]" /> Farmgate Proximity
              </span>
              <span className="font-mono font-bold text-[#2F5233]">{weights.distance}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={weights.distance}
              onChange={(e) => handleSliderChange('distance', Number(e.target.value))}
              className="w-full accent-[#2F5233] cursor-pointer"
            />
            <span className="text-[10px] text-[#5B6660] block">Exponential decay over 42km corridor radius</span>
          </div>

          {/* Quantity Fit */}
          <div className="p-3 bg-[#FAF8F3] border border-[#DDD9CD] rounded-[10px] space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[#1C2321] flex items-center gap-1">
                <Layers size={13} className="text-[#2F5233]" /> Lot Fit & Batching
              </span>
              <span className="font-mono font-bold text-[#2F5233]">{weights.quantity_fit}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={weights.quantity_fit}
              onChange={(e) => handleSliderChange('quantity_fit', Number(e.target.value))}
              className="w-full accent-[#2F5233] cursor-pointer"
            />
            <span className="text-[10px] text-[#5B6660] block">Rewards single or dual-lot batch fulfillment</span>
          </div>

          {/* Reliability */}
          <div className="p-3 bg-[#FAF8F3] border border-[#DDD9CD] rounded-[10px] space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[#1C2321] flex items-center gap-1">
                <CheckCircle2 size={13} className="text-[#2E7D4F]" /> Reliability History
              </span>
              <span className="font-mono font-bold text-[#2F5233]">{weights.reliability}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              step="5"
              value={weights.reliability}
              onChange={(e) => handleSliderChange('reliability', Number(e.target.value))}
              className="w-full accent-[#2F5233] cursor-pointer"
            />
            <span className="text-[10px] text-[#5B6660] block">Historical delivery on-time & dispute-free score</span>
          </div>

          {/* Price */}
          <div className="p-3 bg-[#FAF8F3] border border-[#DDD9CD] rounded-[10px] space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[#1C2321] flex items-center gap-1">
                <TrendingUp size={13} className="text-[#2F5233]" /> Price Competitiveness
              </span>
              <span className="font-mono font-bold text-[#2F5233]">{weights.price}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              step="5"
              value={weights.price}
              onChange={(e) => handleSliderChange('price', Number(e.target.value))}
              className="w-full accent-[#2F5233] cursor-pointer"
            />
            <span className="text-[10px] text-[#5B6660] block">Margin relative to buyer target ₹{demand.target_price}/kg</span>
          </div>

          {/* Freshness */}
          <div className="p-3 bg-[#FAF8F3] border border-[#DDD9CD] rounded-[10px] space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[#1C2321]">Harvest Timing</span>
              <span className="font-mono font-bold text-[#2F5233]">{weights.freshness}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="5"
              value={weights.freshness}
              onChange={(e) => handleSliderChange('freshness', Number(e.target.value))}
              className="w-full accent-[#2F5233] cursor-pointer"
            />
            <span className="text-[10px] text-[#5B6660] block">Morning pickup slot availability</span>
          </div>
        </div>
      </div>

      {/* Algorithmic Knapsack Fulfillment Summary Banner */}
      <div className="pt-4 pb-2">
        <div className="p-4 rounded-[12px] bg-[#2F5233] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#C77B2E]" />
              <span className="text-xs uppercase font-bold tracking-wider text-white/80">
                Knapsack Allocation Result
              </span>
            </div>
            <div className="text-xl font-bold font-display mt-1">
              {allocationResult.total_fulfilled} / {demand.quantity_required} kg fulfilled
              {allocationResult.selected_matches.length > 1 ? (
                <span className="text-xs font-normal text-white/80 ml-2">
                  ({allocationResult.selected_matches.length} Farmer Aggregation)
                </span>
              ) : (
                <span className="text-xs font-normal text-white/80 ml-2">(Single Lot)</span>
              )}
            </div>
            <p className="text-xs text-white/80 mt-0.5">
              Weighted Average Price: ₹{allocationResult.average_price}/kg • Est. Consolidated Freight: ₹{allocationResult.estimated_logistics_cost}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-white/70 block">Lead Utility Score</span>
            <div className="text-2xl font-black font-display text-white">
              {scoredCandidates[0]?.utilityScore || 88}/100
            </div>
            <span className="text-[11px] font-medium text-white/80">
              {scoredCandidates[0]?.farmer.farm_or_fpo_name || 'Optimal Lead Farmer'}
            </span>
          </div>
        </div>
      </div>

      {/* Candidate Score Cards */}
      <div className="pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5B6660]">
            Ranked Farmer Candidates ({scoredCandidates.length})
          </span>
          <span className="text-[11px] text-[#5B6660]">
            Formula: U(f) = Σ(w_i · s_i) / Σw_i
          </span>
        </div>

        <div className="space-y-2.5">
          {scoredCandidates.map((c, idx) => {
            const isAllocated = allocationResult.selected_matches.some(
              (af) => af.farmer_id === c.farmer.user_id
            );
            const allocatedInfo = allocationResult.selected_matches.find(
              (af) => af.farmer_id === c.farmer.user_id
            );

            return (
              <div
                key={c.farmer.user_id}
                onClick={() => setSelectedCandidate(c)}
                className={`p-3.5 rounded-[12px] border transition-all cursor-pointer ${
                  isAllocated
                    ? 'bg-[#FAF8F3] border-[#2F5233] shadow-xs'
                    : 'bg-white border-[#DDD9CD] hover:border-[#5B6660]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isAllocated ? 'bg-[#2F5233] text-white' : 'bg-[#EFEDE6] text-[#5B6660]'
                      }`}
                    >
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-[#1C2321]">{c.farmer.farm_or_fpo_name}</span>
                        <span className="text-xs text-[#5B6660]">({c.farmer.location})</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-[6px] ${
                            isAllocated
                              ? 'bg-[#E4ECE0] text-[#2F5233] border border-[#2F5233]/20'
                              : 'bg-[#EFEDE6] text-[#5B6660]'
                          }`}
                        >
                          {isAllocated ? `ALLOCATED: ${allocatedInfo?.selected_quantity} kg` : 'BACKUP RESERVE'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#5B6660] mt-1 flex-wrap">
                        <span>Offered: <strong>{c.application.offered_quantity} kg</strong></span>
                        <span>Rate: <strong>₹{c.application.offered_price}/kg</strong></span>
                        <span>Distance: <strong>{c.application.distance_km} km</strong></span>
                        <span>Reliability: <strong>{c.farmer.reliability_score || 90}%</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:text-right shrink-0">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#5B6660] block">Utility Score</span>
                      <span className="text-lg font-black text-[#2F5233] font-display">
                        {c.utilityScore}<span className="text-xs text-[#5B6660] font-normal">/100</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Micro Factor Progress Bars */}
                <div className="grid grid-cols-5 gap-2 mt-3 pt-2.5 border-t border-[#DDD9CD]/60 text-[10px]">
                  <div>
                    <span className="text-[#5B6660] block truncate">Quality: {c.factors.quality_score}</span>
                    <div className="h-1 bg-[#EFEDE6] rounded-full overflow-hidden mt-0.5">
                      <div className="h-full bg-[#2F5233]" style={{ width: `${c.factors.quality_score}%` }} />
                    </div>
                  </div>
                  <div>
                    <span className="text-[#5B6660] block truncate">Dist: {c.factors.distance_score}</span>
                    <div className="h-1 bg-[#EFEDE6] rounded-full overflow-hidden mt-0.5">
                      <div className="h-full bg-[#C77B2E]" style={{ width: `${c.factors.distance_score}%` }} />
                    </div>
                  </div>
                  <div>
                    <span className="text-[#5B6660] block truncate">Lot: {c.factors.quantity_fit}</span>
                    <div className="h-1 bg-[#EFEDE6] rounded-full overflow-hidden mt-0.5">
                      <div className="h-full bg-[#2F5233]" style={{ width: `${c.factors.quantity_fit}%` }} />
                    </div>
                  </div>
                  <div>
                    <span className="text-[#5B6660] block truncate">Rel: {c.factors.reliability_score}</span>
                    <div className="h-1 bg-[#EFEDE6] rounded-full overflow-hidden mt-0.5">
                      <div className="h-full bg-[#2E7D4F]" style={{ width: `${c.factors.reliability_score}%` }} />
                    </div>
                  </div>
                  <div>
                    <span className="text-[#5B6660] block truncate">Price: {c.factors.price_score}</span>
                    <div className="h-1 bg-[#EFEDE6] rounded-full overflow-hidden mt-0.5">
                      <div className="h-full bg-[#2F5233]" style={{ width: `${c.factors.price_score}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
