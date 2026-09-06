import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Demand, DemandMatchResult } from '../../types';
import { 
  Check, 
  X, 
  Sparkles, 
  Layers, 
  Truck, 
  ShieldCheck, 
  AlertCircle, 
  TrendingUp, 
  MapPin, 
  Lock, 
  ArrowRight,
  Clock,
  RotateCcw,
  FastForward
} from 'lucide-react';

interface MatchingReviewModalProps {
  demand: Demand;
  matchResult: DemandMatchResult | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmedSuccess: (orderId: string) => void;
}

export const MatchingReviewModal: React.FC<MatchingReviewModalProps> = ({
  demand,
  matchResult,
  isOpen,
  onClose,
  onConfirmedSuccess,
}) => {
  const {
    confirmMatch,
    rejectMatch,
    farmerProfiles,
    getDemandTimer,
    expireDemandTimerNow,
    resetDemandTimer
  } = useApp();
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !matchResult) return null;

  const timer = getDemandTimer(demand.id);
  const isExpired = timer.isExpired || timer.remainingSeconds <= 0;
  const isConfirmed = timer.isConfirmed || demand.status === 'CONFIRMED';
  const mins = Math.floor(timer.remainingSeconds / 60);
  const secs = timer.remainingSeconds % 60;
  const formattedCountdown = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const handleConfirm = () => {
    if (isExpired) {
      setErrorMessage('Cannot confirm: 30-minute acceptance window has expired and this proposal was auto-rejected.');
      return;
    }
    setConfirming(true);
    setErrorMessage('');

    setTimeout(() => {
      const res = confirmMatch(demand.id);
      setConfirming(false);
      if (res.success && res.orderId) {
        onConfirmedSuccess(res.orderId);
        onClose();
      } else {
        setErrorMessage(res.error || 'Failed to confirm fulfillment');
      }
    }, 300);
  };

  const handleReject = () => {
    rejectMatch(demand.id, rejectReason || 'Buyer rejected proposed combination');
    onClose();
  };

  const satisfactionPct = Math.min(100, Math.round((matchResult.total_fulfilled / demand.quantity_required) * 100));
  const avgConfidence = matchResult.selected_matches.length > 0
    ? Math.round(matchResult.selected_matches.reduce((acc, m) => acc + m.confidence, 0) / matchResult.selected_matches.length)
    : 92;
  const projectedSavings = Math.max(0, (demand.target_price - matchResult.average_price) * matchResult.total_fulfilled);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#F7F6F2] border border-[#DDD9CD] rounded-[16px] w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col font-sans">
        
        {/* Header - Styled per "Professional Polish" Spec */}
        <header className="h-20 bg-white border-b border-[#DDD9CD] px-6 sm:px-8 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C2321] font-display">
              Fulfillment Strategy: {demand.id}
            </h1>
            <p className="text-xs sm:text-sm text-[#5B6660] font-medium">
              Processing Response Window Results • {demand.commodity} ({demand.quality_requirement})
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase text-[#5B6660] font-bold tracking-wider flex items-center gap-1">
                <Clock size={11} className={timer.isRunning ? 'text-[#C77B2E] animate-pulse' : 'text-[#5B6660]'} />
                <span>30m Owner Acceptance</span>
              </span>
              {isConfirmed ? (
                <span className="text-xs sm:text-sm font-bold text-[#2E7D4F]">Confirmed & Locked</span>
              ) : isExpired ? (
                <span className="text-xs sm:text-sm font-bold text-[#B3412C]">Auto-Rejected (00:00)</span>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold font-mono text-[#C77B2E]">
                    {formattedCountdown}
                  </span>
                  <button
                    type="button"
                    onClick={() => expireDemandTimerNow(demand.id)}
                    className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold text-[#B3412C] hover:underline bg-[#FBEBE8] px-1.5 py-0.5 rounded border border-[#B3412C]/20"
                    title="Simulate 30-minute expiration to test auto-reject immediately"
                  >
                    <FastForward size={10} />
                    <span>Test Auto-Reject</span>
                  </button>
                </div>
              )}
            </div>

            <div className="hidden sm:block h-10 w-[1px] bg-[#DDD9CD]" />

            <div className="flex items-center gap-2">
              {isExpired ? (
                <button
                  type="button"
                  onClick={() => resetDemandTimer(demand.id, 30)}
                  className="bg-[#C77B2E] hover:bg-[#A86420] text-white px-4 py-2.5 rounded-[10px] font-bold text-xs sm:text-sm transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <RotateCcw size={14} />
                  <span>Reset 30m Window</span>
                </button>
              ) : (
                <button
                  id="confirm-fulfilment-btn"
                  type="button"
                  disabled={confirming || isConfirmed}
                  onClick={handleConfirm}
                  className="bg-[#2F5233] hover:bg-[#25401F] text-white px-5 sm:px-6 py-2.5 rounded-[10px] font-bold text-xs sm:text-sm transition-colors shadow-sm disabled:opacity-60 flex items-center gap-2"
                >
                  {confirming ? (
                    <span>Locking...</span>
                  ) : isConfirmed ? (
                    <>
                      <Check size={15} />
                      <span>FULFILLED</span>
                    </>
                  ) : (
                    <>
                      <Lock size={15} />
                      <span>CONFIRM FULFILLMENT</span>
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="p-2 text-[#5B6660] hover:text-[#1C2321] hover:bg-[#EFEDE6] rounded-[8px] transition-colors"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Modal Scrollable Content Grid */}
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto grid grid-cols-12 gap-6">

          {/* 30-Minute Timer Notification Banner */}
          <div className="col-span-12">
            {isExpired ? (
              <div className="bg-[#FBEBE8] border-2 border-[#B3412C]/40 rounded-[12px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#1C2321]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#B3412C] text-white flex items-center justify-center shrink-0">
                    <AlertCircle size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#B3412C]">30-Minute Acceptance Window Expired</h4>
                    <p className="text-[#5B6660] mt-0.5">
                      This fulfillment proposal was <strong>automatically rejected by the system (§12)</strong>. All farmer quantities remain uncommitted and available (§13).
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => resetDemandTimer(demand.id, 30)}
                    className="px-3 py-1.5 rounded-[8px] bg-white border border-[#DDD9CD] hover:bg-[#EFEDE6] font-semibold text-[#1C2321] transition-colors"
                  >
                    Restart 30m Timer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-[8px] bg-[#C77B2E] text-white font-semibold hover:bg-[#A86420] transition-colors"
                  >
                    Modify / Reopen Demand (§12)
                  </button>
                </div>
              </div>
            ) : isConfirmed ? (
              <div className="bg-[#E4ECE0] border border-[#2F5233]/30 rounded-[12px] p-4 flex items-center gap-3 text-xs text-[#1C2321]">
                <Check size={18} className="text-[#2F5233]" />
                <div>
                  <h4 className="font-bold text-sm text-[#2F5233]">Fulfillment Accepted Before Expiration</h4>
                  <p className="text-[#5B6660]">
                    Quantities have been locked with multi-farmer allocation. Multi-stop logistics route generated.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-[#FAF8F3] border border-[#C77B2E]/30 rounded-[12px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#1C2321]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#F6E7D3] text-[#C77B2E] flex items-center justify-center shrink-0">
                    <Clock size={18} className="animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1C2321] flex items-center gap-2">
                      <span>Owner 30-Minute Decision Window: Active</span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#F6E7D3] text-[#C77B2E] font-bold">
                        {formattedCountdown} remaining
                      </span>
                    </h4>
                    <p className="text-[#5B6660] mt-0.5">
                      You can confirm (accept) or reject before this 30-minute timer ends. If unconfirmed at 00:00, the system automatically rejects the proposal (§12).
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => expireDemandTimerNow(demand.id)}
                    className="px-3 py-1.5 rounded-[8px] bg-[#FBEBE8] border border-[#B3412C]/20 hover:bg-[#F5D8D3] font-bold text-[#B3412C] transition-colors flex items-center gap-1.5"
                    title="Trigger auto-reject immediately without waiting 30 minutes"
                  >
                    <FastForward size={13} />
                    <span>Expire Now (Test Auto-Reject)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRejectForm(true)}
                    className="px-3 py-1.5 rounded-[8px] bg-white border border-[#DDD9CD] hover:bg-[#EFEDE6] font-medium text-[#5B6660] transition-colors"
                  >
                    Manual Reject
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Left Column (col-span-12 lg:col-span-8) */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            
            {/* System Recommended Aggregation Card */}
            <div className="bg-white border border-[#DDD9CD] rounded-[16px] p-6 shadow-none">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-bold text-lg text-[#1C2321] font-display">
                    System Recommended Aggregation
                  </h2>
                  <p className="text-xs text-[#5B6660] mt-0.5">
                    Multi-Farmer Aggregation Model (§9) combining partial allocations
                  </p>
                </div>
                <span className="bg-[#E4ECE0] text-[#2F5233] px-3 py-1 rounded-[6px] text-xs font-bold shrink-0">
                  ● {satisfactionPct}% Demand Satisfaction
                </span>
              </div>

              {/* Aggregated Farmer Rows */}
              <div className="space-y-3">
                {matchResult.selected_matches.map((item, index) => {
                  const profile = farmerProfiles[item.farmer_id];
                  const displayIndex = String(index + 1).padStart(2, '0');
                  
                  return (
                    <div
                      key={item.application_id}
                      className="grid grid-cols-12 gap-3 sm:gap-4 items-center bg-[#EFEDE6] p-4 rounded-[10px] border border-[#DDD9CD]"
                    >
                      <div className="col-span-2 sm:col-span-1 text-sm font-bold text-[#5B6660]">
                        {displayIndex}
                      </div>

                      <div className="col-span-10 sm:col-span-4">
                        <p className="font-bold text-sm text-[#1C2321]">{item.farmer_name}</p>
                        <p className="text-[11px] text-[#5B6660]">
                          {profile ? profile.location : 'Hub Regional'} | {item.distance_km}km
                        </p>
                      </div>

                      <div className="col-span-4 sm:col-span-3 text-left sm:text-center mt-2 sm:mt-0">
                        <p className="text-[10px] uppercase text-[#5B6660] font-bold tracking-wider">Supply</p>
                        <p className="text-sm font-bold text-[#1C2321]">{item.selected_quantity} kg</p>
                      </div>

                      <div className="col-span-4 sm:col-span-2 text-left sm:text-center mt-2 sm:mt-0">
                        <p className="text-[10px] uppercase text-[#5B6660] font-bold tracking-wider">Rate</p>
                        <p className="text-sm font-bold text-[#1C2321]">₹{item.offered_price}/kg</p>
                      </div>

                      <div className="col-span-4 sm:col-span-2 text-right mt-2 sm:mt-0">
                        <span className="bg-[#F6E7D3] text-[#C77B2E] px-2 py-1 rounded-[6px] text-[10px] font-bold inline-block">
                          {item.confidence}% {item.grade}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sub-factor weights breakdown note */}
              <div className="mt-4 pt-3 border-t border-[#DDD9CD] flex flex-wrap items-center justify-between text-[11px] text-[#5B6660]">
                <span>Deterministic Scoring: Quantity Fit, Price, Quality CV, Proximity & Reliability</span>
                <span className="font-mono">Logistics: Consolidates {matchResult.selected_matches.length} pickups</span>
              </div>
            </div>

            {/* Logistics Feasibility & Quality Verification Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Logistics Feasibility */}
              <div className="bg-white border border-[#DDD9CD] rounded-[16px] p-6 shadow-none flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase text-[#5B6660] tracking-wider mb-4">
                    Logistics Feasibility
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#E4ECE0] rounded-full shrink-0">
                      <Truck size={22} className="text-[#2F5233]" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#1C2321]">Optimized Shared Route</p>
                      <p className="text-xs text-[#5B6660]">
                        {matchResult.selected_matches.length} Pickups → 1 Delivery Point
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#DDD9CD] flex justify-between items-center">
                  <span className="text-[11px] font-bold text-[#5B6660]">Estimated Cost</span>
                  <span className="text-sm font-bold text-[#1C2321] font-display">
                    ₹{matchResult.estimated_logistics_cost.toLocaleString('en-IN')}.00
                  </span>
                </div>
              </div>

              {/* Quality Verification */}
              <div className="bg-white border border-[#DDD9CD] rounded-[16px] p-6 shadow-none flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase text-[#5B6660] tracking-wider mb-4">
                    Quality Verification
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#F6E7D3] rounded-full shrink-0">
                      <ShieldCheck size={22} className="text-[#C77B2E]" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#1C2321]">Prototype AI Assessed</p>
                      <p className="text-xs text-[#5B6660] font-medium">
                        Avg. Confidence Score: {avgConfidence}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#DDD9CD] flex justify-between items-center">
                  <span className="text-[11px] font-bold text-[#5B6660]">Requirement Met</span>
                  <span className="text-sm font-bold text-[#2E7D4F]">
                    {demand.quality_grade} VERIFIED
                  </span>
                </div>
              </div>
            </div>

            {/* Unselected Applicants (§13) if any */}
            {matchResult.unselected_matches.length > 0 && (
              <div className="bg-white border border-[#DDD9CD] rounded-[16px] p-5">
                <h4 className="text-xs font-bold uppercase text-[#5B6660] tracking-wider mb-3">
                  Unselected Applicants ({matchResult.unselected_matches.length}) — Uncommitted supply remains Available (§13)
                </h4>
                <div className="space-y-2">
                  {matchResult.unselected_matches.map((u) => (
                    <div
                      key={u.application_id}
                      className="p-3 rounded-[8px] bg-[#EFEDE6] border border-[#DDD9CD] text-xs flex items-center justify-between text-[#5B6660]"
                    >
                      <div>
                        <strong className="text-[#1C2321]">{u.farmer_name}: </strong>
                        <span>Offered {u.offered_quantity}kg @ ₹{u.offered_price}/kg ({u.grade}, {u.distance_km}km)</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#5B6660]">
                        Utility Score: {u.utility_score}/100
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message if any */}
            {errorMessage && (
              <div className="p-4 bg-[#FBEBE8] border border-[#B3412C]/30 rounded-[10px] text-xs text-[#B3412C] flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Reject Form or Rejection Option (§12) */}
            {showRejectForm ? (
              <div className="p-5 bg-white border border-[#B3412C]/30 rounded-[16px] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#B3412C]">
                  <AlertCircle size={16} />
                  <span>Reject Fulfilment Proposal (§12: Transitions Demand to Unfulfilled)</span>
                </div>
                <p className="text-xs text-[#5B6660]">
                  Rejecting releases uncommitted farmer inventory immediately. You will be able to reopen or modify requirements afterward.
                </p>
                <input
                  type="text"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Optional rejection reason (e.g. Budget variance, timeline adjustment)..."
                  className="w-full h-10 px-3 text-xs rounded-[8px] border border-[#DDD9CD] bg-[#EFEDE6] text-[#1C2321] focus:outline-none focus:border-[#2F5233]"
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRejectForm(false)}
                    className="px-4 py-2 text-xs text-[#5B6660] hover:bg-[#EFEDE6] rounded-[8px] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleReject}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#B3412C] hover:bg-[#8F3322] rounded-[8px] transition-colors"
                  >
                    Confirm Rejection (§12)
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setShowRejectForm(true)}
                  className="text-xs font-semibold text-[#B3412C] hover:underline"
                >
                  Reject Fulfilment Proposal (§12)
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-[#5B6660] hover:text-[#1C2321] rounded-[8px] border border-[#DDD9CD] hover:bg-[#EFEDE6] transition-colors"
                >
                  Close View
                </button>
              </div>
            )}
          </div>

          {/* Right Column (col-span-12 lg:col-span-4) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            
            {/* Deep Forest Green Hero Stats Card (§2, §16) */}
            <div className="bg-[#2F5233] text-white rounded-[16px] p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2">
                Order Total Quantity
              </h3>
              <p className="text-4xl font-extrabold mb-6 font-display">
                {matchResult.total_fulfilled} kg
              </p>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-white/20 pb-2">
                  <span className="opacity-70">Commodity</span>
                  <span className="font-bold">{demand.commodity}</span>
                </div>
                <div className="flex justify-between border-b border-white/20 pb-2">
                  <span className="opacity-70">Target Price</span>
                  <div className="text-right">
                    <span className="font-bold">₹{demand.target_price}.00/kg</span>
                    <span className="block text-[10px] opacity-75">
                      Range: ₹{demand.target_price_min || Math.round(demand.target_price * 0.95)} - ₹{demand.target_price_max || Math.round(demand.target_price * 1.05)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between border-b border-white/20 pb-2">
                  <span className="opacity-70">Current Avg.</span>
                  <span className="font-bold">₹{matchResult.average_price.toFixed(2)}/kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Transit Buffer</span>
                  <span className="font-semibold text-right text-xs">
                    ±{demand.quantity_tolerance_pct || 5}% (~{demand.transit_damage_allowance_kg || Math.round(demand.quantity_required * 0.05)} kg damage allowance)
                  </span>
                </div>
              </div>

              <div className="mt-8 bg-white/10 p-4 rounded-[10px]">
                <p className="text-[11px] uppercase opacity-60 font-bold mb-1 tracking-wider">
                  Projected Saving
                </p>
                <p className="text-xl font-bold text-[#C77B2E]">
                  ₹{projectedSavings.toLocaleString('en-IN')}.00{' '}
                  <span className="text-xs opacity-60 text-white font-normal">
                    vs target ceiling
                  </span>
                </p>
              </div>
            </div>

            {/* Fulfilment Stepper Card */}
            <div className="bg-white border border-[#DDD9CD] rounded-[16px] p-6 flex-1 shadow-none">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5B6660] mb-6">
                Fulfilment Stepper
              </h3>

              <div className="relative space-y-6">
                {/* Connecting vertical rail */}
                <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-[#DDD9CD]" />

                {/* Step 1: Demand Created */}
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-[#2F5233] flex items-center justify-center text-[10px] text-white font-bold shrink-0">
                    1
                  </div>
                  <span className="text-sm font-bold text-[#1C2321]">Demand Created</span>
                </div>

                {/* Step 2: Response Window */}
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-[#2F5233] flex items-center justify-center text-[10px] text-white font-bold shrink-0">
                    2
                  </div>
                  <span className="text-sm font-bold text-[#1C2321]">Response Window</span>
                </div>

                {/* Step 3: Aggregation Match */}
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-white border-2 border-[#2F5233] flex items-center justify-center text-[10px] text-[#2F5233] font-bold shrink-0 shadow-xs">
                    3
                  </div>
                  <span className="text-sm font-bold text-[#2F5233]">Aggregation Match</span>
                </div>

                {/* Step 4: Confirm Order */}
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-[#EFEDE6] border border-[#DDD9CD] flex items-center justify-center text-[10px] text-[#5B6660] font-bold shrink-0">
                    4
                  </div>
                  <span className="text-sm text-[#5B6660] font-medium">Confirm Order</span>
                </div>

                {/* Step 5: Quantity Lock */}
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-[#EFEDE6] border border-[#DDD9CD] flex items-center justify-center text-[10px] text-[#5B6660] font-bold shrink-0">
                    5
                  </div>
                  <span className="text-sm text-[#5B6660] font-medium">Quantity Lock</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
