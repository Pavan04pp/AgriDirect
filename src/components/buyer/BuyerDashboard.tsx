import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Demand, Order } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { StateStepper } from '../common/StateStepper';
import { RouteMapVisualizer } from '../common/RouteMapVisualizer';
import { CreateDemandModal } from './CreateDemandModal';
import { MatchingReviewModal } from './MatchingReviewModal';
import { ModifyDemandModal } from './ModifyDemandModal';
import {
  Plus,
  Clock,
  Sparkles,
  Truck,
  CheckCircle2,
  AlertCircle,
  Eye,
  Layers,
  Calendar,
  RotateCcw,
  Building2,
  Package,
  FastForward
} from 'lucide-react';

export const BuyerDashboard: React.FC = () => {
  const {
    demands,
    orders,
    logisticsJobs,
    buyerProfile,
    currentUser,
    getDemandMatchResult,
    closeResponseWindow,
    getDemandTimer,
    expireDemandTimerNow,
    resetDemandTimer,
    rejectMatch,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'demands' | 'orders' | 'logistics' | 'history'>('demands');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedDemandForMatch, setSelectedDemandForMatch] = useState<Demand | null>(null);
  const [selectedDemandForModify, setSelectedDemandForModify] = useState<Demand | null>(null);
  const [inspectingDemand, setInspectingDemand] = useState<Demand | null>(demands[0] || null);

  // Stats calculation
  const activeDemandsCount = demands.filter((d) => d.status === 'OPEN' || d.status === 'RESPONSE_CLOSED').length;
  const readyMatchesCount = demands.filter((d) => {
    if (d.status === 'RESPONSE_CLOSED' || d.status === 'MATCHED') return true;
    const match = getDemandMatchResult(d.id);
    return match && match.selected_matches.length > 0 && d.status === 'OPEN';
  }).length;
  const inTransitCount = orders.filter((o) => o.status === 'IN_TRANSIT' || o.status === 'PICKUP_IN_PROGRESS' || o.status === 'CONFIRMED').length;
  const totalFulfilledKg = orders.reduce((sum, o) => sum + (o.status === 'DELIVERED' || o.status === 'COMPLETED' ? o.total_quantity : 0), 0);

  return (
    <div id="buyer-dashboard" className="space-y-6">
      {/* Top Banner & Profile Overview */}
      <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D4F]" />
            <h1 className="font-display font-bold text-xl sm:text-2xl text-[#1C2321]">
              {buyerProfile.business_name}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-[6px] bg-[#EFEDE6] text-[#5B6660] font-medium">
              {buyerProfile.buyer_type}
            </span>
          </div>
          <p className="text-xs text-[#5B6660] mt-1 flex items-center gap-1.5">
            <span>Procurement Hub: {buyerProfile.location}</span>
            <span>•</span>
            <span>Authorized: {currentUser.name}</span>
          </p>
        </div>

        <button
          id="post-new-demand-btn"
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2F5233] hover:bg-[#25401F] text-white text-xs font-semibold rounded-[10px] transition-colors shadow-sm"
        >
          <Plus size={16} />
          <span>Post Commercial Demand</span>
        </button>
      </div>

      {/* Summary Stat Cards (§16.7 & §17) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-5">
          <div className="text-xs text-[#5B6660] font-medium flex items-center justify-between">
            <span>Active Demands</span>
            <Clock size={16} className="text-[#2F5233]" />
          </div>
          <div className="font-display font-extrabold text-3xl text-[#1C2321] mt-2">
            {activeDemandsCount}
          </div>
          <div className="text-[11px] text-[#5B6660] mt-1">Collecting farmer responses</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-5">
          <div className="text-xs text-[#5B6660] font-medium flex items-center justify-between">
            <span>Ready for Matching</span>
            <Sparkles size={16} className="text-[#C77B2E]" />
          </div>
          <div className="font-display font-extrabold text-3xl text-[#C77B2E] mt-2">
            {readyMatchesCount}
          </div>
          <div className="text-[11px] text-[#5B6660] mt-1">Multi-farmer supply available</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-5">
          <div className="text-xs text-[#5B6660] font-medium flex items-center justify-between">
            <span>Orders In Transit</span>
            <Truck size={16} className="text-[#3B6FA0]" />
          </div>
          <div className="font-display font-extrabold text-3xl text-[#3B6FA0] mt-2">
            {inTransitCount}
          </div>
          <div className="text-[11px] text-[#5B6660] mt-1">Logistics active</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-5">
          <div className="text-xs text-[#5B6660] font-medium flex items-center justify-between">
            <span>Completed Volume</span>
            <CheckCircle2 size={16} className="text-[#2E7D4F]" />
          </div>
          <div className="font-display font-extrabold text-3xl text-[#2E7D4F] mt-2">
            {totalFulfilledKg} <span className="text-sm font-normal text-[#5B6660]">kg</span>
          </div>
          <div className="text-[11px] text-[#5B6660] mt-1">Directly procured & delivered</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-[#DDD9CD] gap-2 overflow-x-auto pb-0.5">
        <button
          type="button"
          onClick={() => setActiveTab('demands')}
          className={`min-h-[44px] px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'demands'
              ? 'border-[#2F5233] text-[#2F5233]'
              : 'border-transparent text-[#5B6660] hover:text-[#1C2321]'
          }`}
        >
          Active Demands ({demands.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`min-h-[44px] px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'orders'
              ? 'border-[#2F5233] text-[#2F5233]'
              : 'border-transparent text-[#5B6660] hover:text-[#1C2321]'
          }`}
        >
          Confirmed Orders ({orders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('logistics')}
          className={`min-h-[44px] px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'logistics'
              ? 'border-[#2F5233] text-[#2F5233]'
              : 'border-transparent text-[#5B6660] hover:text-[#1C2321]'
          }`}
        >
          Logistics Tracking ({logisticsJobs.length})
        </button>
      </div>

      {/* Tab 1: Demands View */}
      {activeTab === 'demands' && (
        <div className="space-y-6">
          {/* Selected Demand Stepper Inspection */}
          {inspectingDemand && (
            <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-2 border-b border-[#DDD9CD]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-base text-[#1C2321]">
                      {inspectingDemand.id}: {inspectingDemand.quantity_required} kg {inspectingDemand.commodity}
                    </span>
                    <StatusBadge status={inspectingDemand.status} size="sm" />
                  </div>
                  <p className="text-xs text-[#5B6660] mt-0.5">
                    Target: ₹{inspectingDemand.target_price}/kg • {inspectingDemand.quality_requirement} • Delivery: {inspectingDemand.delivery_location}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {inspectingDemand.status === 'OPEN' && (
                    <button
                      type="button"
                      onClick={() => closeResponseWindow(inspectingDemand.id)}
                      className="px-3 py-1.5 rounded-[8px] bg-[#EFEDE6] hover:bg-[#DDD9CD] text-xs font-medium text-[#1C2321] transition-colors"
                      title="Close response window early to evaluate candidate matches immediately"
                    >
                      Close Window & Evaluate
                    </button>
                  )}

                  {(inspectingDemand.status === 'RESPONSE_CLOSED' || inspectingDemand.status === 'OPEN') && (
                    <button
                      type="button"
                      onClick={() => setSelectedDemandForMatch(inspectingDemand)}
                      className="px-3 py-1.5 rounded-[8px] bg-[#2F5233] hover:bg-[#25401F] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Sparkles size={13} />
                      <span>Review Fulfilment Recommendation</span>
                    </button>
                  )}

                  {inspectingDemand.status === 'UNFULFILLED' && (
                    <button
                      type="button"
                      onClick={() => setSelectedDemandForModify(inspectingDemand)}
                      className="px-3 py-1.5 rounded-[8px] bg-[#C77B2E] hover:bg-[#A86420] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <RotateCcw size={13} />
                      <span>Reopen / Modify Requirements (§12)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Stepper */}
              <StateStepper currentStatus={inspectingDemand.status} />

              {/* 30-Minute Owner Acceptance Timer Card */}
              {(() => {
                const timer = getDemandTimer(inspectingDemand.id);
                const isExpired = timer.isExpired || timer.remainingSeconds <= 0;
                const mins = Math.floor(timer.remainingSeconds / 60);
                const secs = timer.remainingSeconds % 60;
                const formattedCountdown = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                const progressPct = Math.max(0, Math.min(100, Math.round((timer.remainingSeconds / (30 * 60)) * 100)));

                return (
                  <div className="mt-4 pt-4 border-t border-[#DDD9CD]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-[12px] bg-[#FAF8F3] border border-[#DDD9CD]">
                      <div className="flex items-start sm:items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                            timer.isConfirmed
                              ? 'bg-[#E4ECE0] text-[#2F5233]'
                              : isExpired
                              ? 'bg-[#FBEBE8] text-[#B3412C]'
                              : 'bg-[#F6E7D3] text-[#C77B2E]'
                          }`}
                        >
                          <Clock size={18} className={timer.isRunning ? 'animate-pulse' : ''} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs uppercase tracking-wider text-[#1C2321]">
                              30-Minute Acceptance Window
                            </span>
                            {timer.isConfirmed ? (
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#E4ECE0] text-[#2F5233]">
                                Confirmed & Locked
                              </span>
                            ) : isExpired ? (
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#FBEBE8] text-[#B3412C]">
                                Auto-Rejected (00:00 Expired)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#F6E7D3] text-[#C77B2E]">
                                {formattedCountdown} remaining
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#5B6660] mt-0.5">
                            {timer.isConfirmed
                              ? 'Owner confirmed within 30-min window. Quantity locked across matched farmers.'
                              : isExpired
                              ? 'Window elapsed without acceptance. System automatically marked demand UNFULFILLED (§12).'
                              : 'Owner can review & accept or reject before 00:00. Unconfirmed demands auto-reject when timer hits zero.'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {timer.isRunning && (
                          <>
                            <button
                              type="button"
                              onClick={() => expireDemandTimerNow(inspectingDemand.id)}
                              className="px-2.5 py-1 text-[11px] font-bold rounded-[8px] bg-[#FBEBE8] hover:bg-[#F5D8D3] text-[#B3412C] border border-[#B3412C]/20 transition-colors flex items-center gap-1"
                              title="Fast-forward timer to 0 to simulate automatic rejection immediately"
                            >
                              <FastForward size={12} />
                              <span>Test Auto-Reject (00:00)</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => rejectMatch(inspectingDemand.id, 'Buyer manual rejection before 30m window timeout')}
                              className="px-2.5 py-1 text-[11px] font-medium rounded-[8px] bg-white hover:bg-[#EFEDE6] text-[#B3412C] border border-[#DDD9CD] transition-colors"
                            >
                              Reject Now
                            </button>
                          </>
                        )}
                        {isExpired && (
                          <button
                            type="button"
                            onClick={() => resetDemandTimer(inspectingDemand.id, 30)}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded-[8px] bg-[#C77B2E] hover:bg-[#A86420] text-white transition-colors flex items-center gap-1"
                          >
                            <RotateCcw size={12} />
                            <span>Reset 30m Timer</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar for Active Timer */}
                    {timer.isRunning && (
                      <div className="mt-2 w-full bg-[#EFEDE6] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#C77B2E] h-full transition-all duration-1000"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Demands Table (§16.6) */}
          <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-[#DDD9CD] flex items-center justify-between">
              <h2 className="font-display font-bold text-sm text-[#1C2321]">
                Commercial Demands Table
              </h2>
              <span className="text-xs text-[#5B6660]">
                Strict response window evaluation — no first-come selection (§6)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#DDD9CD] bg-[#EFEDE6] text-[#5B6660] font-medium">
                    <th className="py-3 px-4">Demand ID</th>
                    <th className="py-3 px-4">Commodity</th>
                    <th className="py-3 px-4 text-right">Required (kg)</th>
                    <th className="py-3 px-4">Grade</th>
                    <th className="py-3 px-4 text-right">Target Price</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Farmer Supply Match</th>
                    <th className="py-3 px-4">Acceptance Timer (30m)</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDD9CD]">
                  {demands.map((demand, index) => {
                    const matchResult = getDemandMatchResult(demand.id);
                    const isSelected = inspectingDemand?.id === demand.id;
                    const timer = getDemandTimer(demand.id);
                    const isExpired = timer.isExpired || timer.remainingSeconds <= 0;
                    const mins = Math.floor(timer.remainingSeconds / 60);
                    const secs = timer.remainingSeconds % 60;
                    const formattedTimer = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

                    return (
                      <tr
                        key={demand.id}
                        onClick={() => setInspectingDemand(demand)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#E4ECE0]/30'
                            : index % 2 === 1
                            ? 'bg-[#EFEDE6]/40 hover:bg-[#EFEDE6]/80'
                            : 'bg-white hover:bg-[#EFEDE6]/50'
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono font-semibold text-[#1C2321]">
                          {demand.id}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#1C2321]">
                          {demand.commodity}
                        </td>
                        <td className="py-3.5 px-4 text-right font-display font-bold text-sm text-[#1C2321]">
                          {demand.quantity_required} kg
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-[#EFEDE6] text-[#1C2321] font-mono">
                            {demand.quality_requirement}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium text-[#1C2321]">
                          ₹{demand.target_price}/kg
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={demand.status} size="sm" />
                        </td>
                        <td className="py-3.5 px-4">
                          {matchResult && matchResult.selected_matches.length > 0 ? (
                            <span className="text-[#2F5233] font-medium flex items-center gap-1">
                              <Layers size={13} />
                              <span>
                                {matchResult.total_fulfilled}kg ({matchResult.selected_matches.length} farmers)
                              </span>
                            </span>
                          ) : (
                            <span className="text-[#5B6660]">Collecting offers...</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {timer.isConfirmed ? (
                            <span className="inline-flex items-center gap-1 text-[#2E7D4F] font-bold text-xs">
                              <CheckCircle2 size={13} />
                              <span>Accepted</span>
                            </span>
                          ) : isExpired || timer.isRejected || demand.status === 'UNFULFILLED' ? (
                            <span className="inline-flex items-center gap-1 text-[#B3412C] font-semibold text-xs bg-[#FBEBE8] px-2 py-0.5 rounded">
                              <AlertCircle size={12} />
                              <span>Auto-Rejected (00:00)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#C77B2E] bg-[#FAF8F3] px-2 py-0.5 rounded border border-[#C77B2E]/20">
                              <Clock size={12} className="animate-pulse" />
                              <span>{formattedTimer}</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          {(demand.status === 'RESPONSE_CLOSED' || demand.status === 'OPEN') && (
                            <button
                              type="button"
                              onClick={() => setSelectedDemandForMatch(demand)}
                              className="px-3 py-1.5 bg-[#2F5233] hover:bg-[#25401F] text-white rounded-[10px] text-xs font-bold shadow-xs transition-colors"
                            >
                              Review & Confirm
                            </button>
                          )}
                          {demand.status === 'UNFULFILLED' && (
                            <button
                              type="button"
                              onClick={() => setSelectedDemandForModify(demand)}
                              className="px-3 py-1.5 bg-[#C77B2E] hover:bg-[#A86420] text-white rounded-[10px] text-xs font-bold shadow-xs transition-colors"
                            >
                              Reopen / Modify
                            </button>
                          )}
                          {demand.status === 'CONFIRMED' && (
                            <span className="text-[#2E7D4F] font-bold text-xs">Order Confirmed</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Orders View */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-8 text-center text-xs text-[#5B6660]">
              No confirmed orders yet. Review recommended matches on an active demand to confirm procurement.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-5 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DDD9CD]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-base text-[#1C2321]">{order.id}</span>
                        <StatusBadge status={order.status} size="sm" />
                      </div>
                      <div className="text-xs text-[#5B6660] mt-0.5">
                        Demand ref: {order.demand_id} • Confirmed on {new Date(order.confirmed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-display font-extrabold text-xl text-[#2F5233]">
                        {order.total_quantity} kg {order.commodity}
                      </div>
                      <div className="text-xs text-[#5B6660]">
                        Total Value: ₹{order.total_value.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Farmer commitments breakdown */}
                  <div>
                    <div className="text-xs font-semibold text-[#1C2321] mb-2 flex items-center gap-1.5">
                      <Layers size={14} className="text-[#2F5233]" />
                      <span>Committed Farmer Supply (Locked & Protected per §10):</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {order.farmers.map((f) => (
                        <div
                          key={f.farmer_id}
                          className="p-3 rounded-[10px] bg-[#EFEDE6] border border-[#DDD9CD] text-xs"
                        >
                          <div className="font-semibold text-[#1C2321]">{f.farmer_name}</div>
                          <div className="text-[11px] text-[#5B6660] truncate">{f.pickup_location}</div>
                          <div className="mt-2 pt-2 border-t border-[#DDD9CD]/80 flex items-center justify-between font-mono">
                            <span>{f.committed_quantity} kg</span>
                            <span className="text-[#2F5233] font-semibold">₹{f.agreed_price}/kg</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Logistics Tracking View */}
      {activeTab === 'logistics' && (
        <div className="space-y-6">
          {logisticsJobs.length === 0 ? (
            <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-8 text-center text-xs text-[#5B6660]">
              No active logistics jobs right now. Confirming a recommended match creates an automated multi-stop carrier dispatch job.
            </div>
          ) : (
            logisticsJobs.map((job) => (
              <div key={job.id} className="space-y-4">
                <RouteMapVisualizer job={job} interactive={false} />
              </div>
            ))
          )}
        </div>
      )}

      {/* Modals */}
      <CreateDemandModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      {selectedDemandForMatch && (
        <MatchingReviewModal
          demand={selectedDemandForMatch}
          matchResult={getDemandMatchResult(selectedDemandForMatch.id)}
          isOpen={true}
          onClose={() => setSelectedDemandForMatch(null)}
          onConfirmedSuccess={() => {
            setActiveTab('orders');
          }}
        />
      )}

      {selectedDemandForModify && (
        <ModifyDemandModal
          demand={selectedDemandForModify}
          isOpen={true}
          onClose={() => setSelectedDemandForModify(null)}
        />
      )}
    </div>
  );
};
