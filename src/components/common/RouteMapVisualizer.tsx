import React from 'react';
import { RouteStop, LogisticsJob } from '../../types';
import { MapPin, Truck, CheckCircle2, Navigation, AlertCircle } from 'lucide-react';

interface RouteMapVisualizerProps {
  job: LogisticsJob;
  onCompleteStop?: (stopId: string) => void;
  interactive?: boolean;
}

export const RouteMapVisualizer: React.FC<RouteMapVisualizerProps> = ({
  job,
  onCompleteStop,
  interactive = false,
}) => {
  return (
    <div id="route-map-visualizer" className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-5">
      {/* Route Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DDD9CD]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-base text-[#1C2321]">
              Aggregated Pickup & Delivery Route
            </span>
            {job.fallback_mode && (
              <span className="px-2 py-0.5 text-xs rounded-[6px] bg-[#F6E7D3] text-[#C77B2E] border border-[#C77B2E]/30 font-medium">
                Hub / Direct Arrangement Fallback
              </span>
            )}
          </div>
          <p className="text-[13px] text-[#5B6660] mt-0.5">
            Optimized sequence: Multi-farmer farmgate collection to Buyer Central Kitchen
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-[#1C2321] bg-[#EFEDE6] px-3 py-1.5 rounded-[10px]">
          <div>
            <span className="text-[#5B6660]">Distance: </span>
            <span className="font-semibold">{job.total_distance_km} km</span>
          </div>
          <div className="w-[1px] h-3 bg-[#DDD9CD]" />
          <div>
            <span className="text-[#5B6660]">Est. Time: </span>
            <span className="font-semibold">{job.estimated_duration_hours}h</span>
          </div>
        </div>
      </div>

      {/* Visual Graphical Route Flow */}
      <div className="py-5">
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-7 left-8 right-8 h-0.5 bg-[#DDD9CD] z-0" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
            {job.route_stops.map((stop, index) => {
              const isDelivery = stop.type === 'delivery';
              const isDone = stop.completed;
              const isCurrent = !isDone && (index === 0 || job.route_stops[index - 1]?.completed);

              let badgeColor = 'bg-white border-[#DDD9CD] text-[#5B6660]';
              if (isDone) {
                badgeColor = 'bg-[#2F5233] border-[#2F5233] text-white';
              } else if (isCurrent) {
                badgeColor = 'bg-[#C77B2E] border-[#C77B2E] text-white ring-4 ring-[#F6E7D3]';
              }

              return (
                <div
                  key={stop.id}
                  className={`border rounded-[12px] p-3.5 transition-colors ${
                    isCurrent
                      ? 'border-[#C77B2E] bg-[#FFFBF7]'
                      : isDone
                      ? 'border-[#2F5233]/30 bg-[#F7FBF6]'
                      : 'border-[#DDD9CD] bg-[#FFFFFF]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${badgeColor}`}
                    >
                      {isDone ? <CheckCircle2 size={13} /> : index + 1}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-[6px] bg-[#EFEDE6] text-[#5B6660]">
                      {isDelivery ? 'Delivery' : 'Pickup'}
                    </span>
                  </div>

                  <div className="font-medium text-sm text-[#1C2321] truncate">
                    {stop.farmer_or_buyer_name}
                  </div>
                  <div className="text-xs text-[#5B6660] truncate mt-0.5 flex items-center gap-1">
                    <MapPin size={12} className="shrink-0 text-[#5B6660]" />
                    <span>{stop.location_name}</span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#DDD9CD]/60 flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#1C2321]">
                      {stop.quantity_kg} kg {stop.commodity}
                    </span>
                    {interactive && !isDone && onCompleteStop && (
                      <button
                        type="button"
                        onClick={() => onCompleteStop(stop.id)}
                        className="px-2 py-1 bg-[#2F5233] hover:bg-[#25401F] text-white text-xs rounded-[6px] transition-colors"
                      >
                        {isDelivery ? 'Mark Received' : 'Confirm Loaded'}
                      </button>
                    )}
                    {isDone && (
                      <span className="text-xs text-[#2E7D4F] font-medium flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Vehicle & Carrier info */}
      <div className="bg-[#EFEDE6] rounded-[10px] p-3 text-xs flex flex-wrap items-center justify-between gap-3 text-[#1C2321]">
        <div className="flex items-center gap-2">
          <Truck size={16} className="text-[#2F5233]" />
          <span>
            <strong>Assigned Carrier:</strong> {job.provider_name} ({job.vehicle_type} •{' '}
            <span className="font-mono">{job.vehicle_number}</span>)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>
            <strong>Vehicle Payload:</strong> {job.capacity_kg} kg max
          </span>
          <span className="text-[#DDD9CD]">|</span>
          <span>
            <strong>Freight Payout:</strong> ₹{job.freight_amount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
};
