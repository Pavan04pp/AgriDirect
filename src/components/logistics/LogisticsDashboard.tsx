import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LogisticsJob, LogisticsJobStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { RouteMapVisualizer } from '../common/RouteMapVisualizer';
import {
  Truck,
  MapPin,
  CheckCircle2,
  Navigation,
  AlertTriangle,
  Clock,
  DollarSign,
  ShieldCheck
} from 'lucide-react';

export const LogisticsDashboard: React.FC = () => {
  const {
    logisticsJobs,
    logisticsProviders,
    currentUser,
    updateLogisticsJobStatus,
    completeLogisticsStop
  } = useApp();

  const provider = logisticsProviders[currentUser.id] || {
    id: currentUser.id,
    name: currentUser.name,
    vehicle_type: 'Tata 407 (Medium Commercial)',
    vehicle_number: 'KA-04-E-8821',
    capacity_kg: 2500,
    current_load_kg: 500,
    base_location: 'Yeshwanthpur Industrial Area, Bengaluru',
    reliability_rating: 96,
  };

  const [selectedJobId, setSelectedJobId] = useState<string>(logisticsJobs[0]?.id || '');
  const activeJob = logisticsJobs.find((j) => j.id === selectedJobId) || logisticsJobs[0];

  return (
    <div id="logistics-workspace" className="max-w-5xl mx-auto space-y-6">
      {/* Carrier Header */}
      <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3B6FA0]" />
            <h1 className="font-display font-bold text-xl text-[#1C2321]">
              {provider.name}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-[6px] bg-[#EBF3FA] text-[#3B6FA0] font-medium">
              Verified Freight Carrier
            </span>
          </div>
          <p className="text-xs text-[#5B6660] mt-1 flex items-center gap-1.5">
            <Truck size={13} className="text-[#5B6660]" />
            <span>Vehicle: {provider.vehicle_type} ({provider.vehicle_number})</span>
            <span>•</span>
            <span>Payload: {provider.capacity_kg} kg max</span>
            <span>•</span>
            <span>Rating: <strong>{provider.reliability_rating}%</strong></span>
          </p>
        </div>

        <div className="text-xs font-mono text-[#5B6660] bg-[#EFEDE6] px-3 py-1.5 rounded-[8px] self-start sm:self-center">
          Active Carrier Jobs: <strong>{logisticsJobs.length}</strong>
        </div>
      </div>

      {/* Main Jobs Section */}
      {logisticsJobs.length === 0 ? (
        <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-12 text-center text-xs text-[#5B6660]">
          No logistics jobs assigned right now. When a buyer confirms a multi-farmer demand match, consolidated pickup jobs are generated here automatically.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Job Selection Tabs if multiple */}
          {logisticsJobs.length > 1 && (
            <div className="flex gap-2">
              {logisticsJobs.map((j) => (
                <button
                  key={j.id}
                  type="button"
                  onClick={() => setSelectedJobId(j.id)}
                  className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold border transition-colors ${
                    activeJob?.id === j.id
                      ? 'bg-[#3B6FA0] text-white border-[#3B6FA0]'
                      : 'bg-white text-[#5B6660] border-[#DDD9CD] hover:bg-[#EFEDE6]'
                  }`}
                >
                  Job {j.id} ({j.order_id})
                </button>
              ))}
            </div>
          )}

          {activeJob && (
            <div className="space-y-6">
              {/* Job Action Status Bar */}
              <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-base text-[#1C2321]">{activeJob.id}</span>
                    <StatusBadge status={activeJob.status} size="sm" />
                    <span className="text-xs text-[#5B6660]">Order: {activeJob.order_id}</span>
                  </div>
                  <p className="text-xs text-[#5B6660] mt-1">
                    Multi-stop consolidated dispatch: {activeJob.route_stops.length} checkpoints • Payout: ₹{activeJob.freight_amount.toLocaleString('en-IN')}
                  </p>
                </div>

                {/* Status Advancement Buttons (§14) */}
                <div className="flex items-center gap-2">
                  {activeJob.status === 'ASSIGNED' && (
                    <button
                      id="accept-logistics-job-btn"
                      type="button"
                      onClick={() => updateLogisticsJobStatus(activeJob.id, 'ACCEPTED')}
                      className="px-4 py-2 bg-[#3B6FA0] hover:bg-[#2F5A82] text-white text-xs font-semibold rounded-[10px] transition-colors"
                    >
                      Accept Consolidated Job (§14)
                    </button>
                  )}

                  {activeJob.status === 'ACCEPTED' && (
                    <button
                      type="button"
                      onClick={() => updateLogisticsJobStatus(activeJob.id, 'PICKUP_IN_PROGRESS')}
                      className="px-4 py-2 bg-[#C77B2E] hover:bg-[#A86420] text-white text-xs font-semibold rounded-[10px] transition-colors"
                    >
                      Start Farmgate Pickups
                    </button>
                  )}

                  {activeJob.status === 'PICKUP_IN_PROGRESS' && (
                    <button
                      type="button"
                      onClick={() => updateLogisticsJobStatus(activeJob.id, 'IN_TRANSIT')}
                      className="px-4 py-2 bg-[#3B6FA0] hover:bg-[#2F5A82] text-white text-xs font-semibold rounded-[10px] transition-colors"
                    >
                      All Pickups Loaded → Set In-Transit
                    </button>
                  )}

                  {activeJob.status === 'IN_TRANSIT' && (
                    <button
                      id="complete-delivery-btn"
                      type="button"
                      onClick={() => updateLogisticsJobStatus(activeJob.id, 'DELIVERED')}
                      className="px-4 py-2 bg-[#2E7D4F] hover:bg-[#256640] text-white text-xs font-bold rounded-[10px] transition-colors shadow-sm"
                    >
                      Confirm Central Kitchen Delivery (§14)
                    </button>
                  )}

                  {activeJob.status === 'DELIVERED' && (
                    <div className="flex items-center gap-1.5 text-xs text-[#2E7D4F] font-bold bg-[#E4ECE0] px-3 py-1.5 rounded-[8px]">
                      <CheckCircle2 size={16} />
                      <span>Delivery Successfully Completed</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Graphical Route Visualizer (§14, §15, §16.6) */}
              <RouteMapVisualizer
                job={activeJob}
                interactive={true}
                onCompleteStop={(stopId) => completeLogisticsStop(activeJob.id, stopId)}
              />

              {/* Stop by Stop Checklist */}
              <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-5 shadow-sm space-y-3">
                <h2 className="font-display font-bold text-sm text-[#1C2321]">
                  Sequential Route Stops & Pickup Verification (§15)
                </h2>

                <div className="divide-y divide-[#DDD9CD]">
                  {activeJob.route_stops.map((stop, index) => (
                    <div
                      key={stop.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            stop.completed
                              ? 'bg-[#2E7D4F] text-white'
                              : 'bg-[#EFEDE6] text-[#1C2321]'
                          }`}
                        >
                          {stop.completed ? <CheckCircle2 size={13} /> : index + 1}
                        </span>
                        <div>
                          <div className="font-semibold text-xs text-[#1C2321]">
                            {stop.farmer_or_buyer_name} ({stop.type.toUpperCase()})
                          </div>
                          <div className="text-[11px] text-[#5B6660]">
                            {stop.location_name} • Payload: {stop.quantity_kg} kg {stop.commodity}
                          </div>
                        </div>
                      </div>

                      <div>
                        {stop.completed ? (
                          <span className="text-xs text-[#2E7D4F] font-medium flex items-center gap-1">
                            <CheckCircle2 size={13} />
                            Completed
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => completeLogisticsStop(activeJob.id, stop.id)}
                            className="px-3 py-1 bg-white hover:bg-[#EFEDE6] border border-[#DDD9CD] text-xs font-medium text-[#1C2321] rounded-[6px] transition-colors"
                          >
                            Mark {stop.type === 'delivery' ? 'Delivered' : 'Collected'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
