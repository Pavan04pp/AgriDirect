import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { MatchingWeights } from '../../types';
import { Sliders, ShieldCheck, Database, Layers, CheckCircle2, RotateCcw } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    demands,
    applications,
    orders,
    matchingWeights,
    setMatchingWeights,
    resetToDemoSeed,
    transactions,
    qualityAssessments
  } = useApp();

  const [activeTab, setActiveTab] = useState<'weights' | 'demands' | 'applications' | 'audit'>('weights');
  const [weights, setWeights] = useState<MatchingWeights>(matchingWeights);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveWeights = (e: React.FormEvent) => {
    e.preventDefault();
    setMatchingWeights(weights);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleResetWeights = () => {
    const defaultWeights: MatchingWeights = {
      quantity_fit: 30,
      price: 25,
      quality: 20,
      distance: 15,
      reliability: 10,
      delivery_feasibility: 10,
      urgency: 0,
    };
    setWeights(defaultWeights);
    setMatchingWeights(defaultWeights);
  };

  return (
    <div id="admin-control-panel" className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1C2321]" />
            <h1 className="font-display font-bold text-xl text-[#1C2321]">
              Platform Operations Control
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-[6px] bg-[#EFEDE6] text-[#1C2321] font-mono">
              Admin Telemetry & Configuration
            </span>
          </div>
          <p className="text-xs text-[#5B6660] mt-1">
            Configure multi-factor utility weights (§8), inspect transactions, and monitor state machines.
          </p>
        </div>

        <button
          type="button"
          onClick={resetToDemoSeed}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[#DDD9CD] hover:bg-[#EFEDE6] text-xs text-[#1C2321] transition-colors"
        >
          <RotateCcw size={13} />
          <span>Reset Demo Seed (§25)</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#DDD9CD] gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('weights')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'weights'
              ? 'border-[#2F5233] text-[#2F5233]'
              : 'border-transparent text-[#5B6660] hover:text-[#1C2321]'
          }`}
        >
          Matching Algorithm Weights (§8)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('demands')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'demands'
              ? 'border-[#2F5233] text-[#2F5233]'
              : 'border-transparent text-[#5B6660] hover:text-[#1C2321]'
          }`}
        >
          All Demands ({demands.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('applications')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'applications'
              ? 'border-[#2F5233] text-[#2F5233]'
              : 'border-transparent text-[#5B6660] hover:text-[#1C2321]'
          }`}
        >
          All Farmer Offers ({applications.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'audit'
              ? 'border-[#2F5233] text-[#2F5233]'
              : 'border-transparent text-[#5B6660] hover:text-[#1C2321]'
          }`}
        >
          Audit & Settlement Log ({transactions.length})
        </button>
      </div>

      {/* Tab 1: Matching Weights Configuration (§8) */}
      {activeTab === 'weights' && (
        <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-base text-[#1C2321] flex items-center gap-2">
                <Sliders size={18} className="text-[#2F5233]" />
                <span>Multi-Factor Utility Function Tuning (§8)</span>
              </h2>
              <p className="text-xs text-[#5B6660] mt-0.5">
                Formula: <code>Utility = w1*Quantity + w2*Price + w3*Quality + w4*Distance + w5*Reliability</code>
              </p>
            </div>

            {savedNotice && (
              <span className="text-xs text-[#2E7D4F] bg-[#E4ECE0] px-3 py-1 rounded-[6px] font-semibold flex items-center gap-1">
                <CheckCircle2 size={13} />
                Weights Applied Live
              </span>
            )}
          </div>

          <form onSubmit={handleSaveWeights} className="space-y-4">
            <div className="space-y-3">
              {/* Quantity Fit */}
              <div className="p-3 bg-[#EFEDE6] rounded-[10px]">
                <div className="flex justify-between text-xs font-semibold text-[#1C2321] mb-1">
                  <span>Quantity Fit Weight: {Math.round(weights.quantity_fit * 100)}%</span>
                  <span className="text-[#5B6660] font-mono">{weights.quantity_fit.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.60"
                  step="0.05"
                  value={weights.quantity_fit}
                  onChange={(e) => setWeights({ ...weights, quantity_fit: parseFloat(e.target.value) })}
                  className="w-full accent-[#2F5233]"
                />
              </div>

              {/* Price */}
              <div className="p-3 bg-[#EFEDE6] rounded-[10px]">
                <div className="flex justify-between text-xs font-semibold text-[#1C2321] mb-1">
                  <span>Price Competitiveness Weight: {Math.round(weights.price * 100)}%</span>
                  <span className="text-[#5B6660] font-mono">{weights.price.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.60"
                  step="0.05"
                  value={weights.price}
                  onChange={(e) => setWeights({ ...weights, price: parseFloat(e.target.value) })}
                  className="w-full accent-[#2F5233]"
                />
              </div>

              {/* Quality */}
              <div className="p-3 bg-[#EFEDE6] rounded-[10px]">
                <div className="flex justify-between text-xs font-semibold text-[#1C2321] mb-1">
                  <span>Quality / Grade Match Weight: {Math.round(weights.quality * 100)}%</span>
                  <span className="text-[#5B6660] font-mono">{weights.quality.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.60"
                  step="0.05"
                  value={weights.quality}
                  onChange={(e) => setWeights({ ...weights, quality: parseFloat(e.target.value) })}
                  className="w-full accent-[#2F5233]"
                />
              </div>

              {/* Distance */}
              <div className="p-3 bg-[#EFEDE6] rounded-[10px]">
                <div className="flex justify-between text-xs font-semibold text-[#1C2321] mb-1">
                  <span>Proximity / Distance Weight: {Math.round(weights.distance * 100)}%</span>
                  <span className="text-[#5B6660] font-mono">{weights.distance.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.60"
                  step="0.05"
                  value={weights.distance}
                  onChange={(e) => setWeights({ ...weights, distance: parseFloat(e.target.value) })}
                  className="w-full accent-[#2F5233]"
                />
              </div>

              {/* Reliability */}
              <div className="p-3 bg-[#EFEDE6] rounded-[10px]">
                <div className="flex justify-between text-xs font-semibold text-[#1C2321] mb-1">
                  <span>Farmer Reliability History Weight: {Math.round(weights.reliability * 100)}%</span>
                  <span className="text-[#5B6660] font-mono">{weights.reliability.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.60"
                  step="0.05"
                  value={weights.reliability}
                  onChange={(e) => setWeights({ ...weights, reliability: parseFloat(e.target.value) })}
                  className="w-full accent-[#2F5233]"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={handleResetWeights}
                className="px-3 py-1.5 text-xs text-[#5B6660] hover:text-[#1C2321] border border-[#DDD9CD] rounded-[8px]"
              >
                Restore §8 Defaults
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-[#2F5233] hover:bg-[#25401F] rounded-[8px] transition-colors"
              >
                Save & Recalculate Matching
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: All Demands Table */}
      {activeTab === 'demands' && (
        <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#DDD9CD] bg-[#EFEDE6] text-[#5B6660]">
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Buyer</th>
                  <th className="py-2.5 px-3">Commodity</th>
                  <th className="py-2.5 px-3 text-right">Required</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD9CD]">
                {demands.map((d) => (
                  <tr key={d.id} className="hover:bg-[#EFEDE6]/40">
                    <td className="py-2.5 px-3 font-mono font-medium text-[#1C2321]">{d.id}</td>
                    <td className="py-2.5 px-3 font-medium text-[#1C2321]">{d.buyer_name}</td>
                    <td className="py-2.5 px-3">{d.commodity} ({d.quality_requirement})</td>
                    <td className="py-2.5 px-3 text-right font-bold">{d.quantity_required} kg</td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={d.status} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 text-[#5B6660]">
                      {new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: All Applications */}
      {activeTab === 'applications' && (
        <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#DDD9CD] bg-[#EFEDE6] text-[#5B6660]">
                  <th className="py-2.5 px-3">Application ID</th>
                  <th className="py-2.5 px-3">Demand Ref</th>
                  <th className="py-2.5 px-3">Farmer</th>
                  <th className="py-2.5 px-3 text-right">Offered Qty</th>
                  <th className="py-2.5 px-3 text-right">Price</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD9CD]">
                {applications.map((a) => (
                  <tr key={a.id} className="hover:bg-[#EFEDE6]/40">
                    <td className="py-2.5 px-3 font-mono font-medium text-[#1C2321]">{a.id}</td>
                    <td className="py-2.5 px-3 font-mono text-[#5B6660]">{a.demand_id}</td>
                    <td className="py-2.5 px-3 font-medium text-[#1C2321]">{a.farmer_name}</td>
                    <td className="py-2.5 px-3 text-right font-bold">{a.offered_quantity} kg</td>
                    <td className="py-2.5 px-3 text-right">₹{a.offered_price}/kg</td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={a.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Log */}
      {activeTab === 'audit' && (
        <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#DDD9CD] bg-[#EFEDE6] text-[#5B6660]">
                  <th className="py-2.5 px-3">Transaction</th>
                  <th className="py-2.5 px-3">Order</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD9CD]">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-[#EFEDE6]/40">
                    <td className="py-2.5 px-3 font-mono text-[#1C2321]">{t.id}</td>
                    <td className="py-2.5 px-3 font-mono text-[#5B6660]">{t.order_id}</td>
                    <td className="py-2.5 px-3 capitalize">{t.type.replace('_', ' ')}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#2F5233]">
                      ₹{t.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={t.status} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 text-[#5B6660]">
                      {new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
