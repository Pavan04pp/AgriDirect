import React from 'react';
import { DemandStatus } from '../../types';
import { Check, AlertTriangle, XCircle, RotateCcw } from 'lucide-react';

interface StateStepperProps {
  currentStatus: DemandStatus;
  className?: string;
}

const MAIN_STEPS: { id: DemandStatus; label: string }[] = [
  { id: 'DRAFT', label: 'Draft' },
  { id: 'OPEN', label: 'Open' },
  { id: 'RESPONSE_CLOSED', label: 'Response closed' },
  { id: 'MATCHED', label: 'Matched' },
  { id: 'CONFIRMED', label: 'Confirmed' },
  { id: 'IN_FULFILMENT', label: 'In fulfilment' },
  { id: 'DELIVERED', label: 'Delivered' },
  { id: 'COMPLETED', label: 'Completed' },
];

export const StateStepper: React.FC<StateStepperProps> = ({ currentStatus, className = '' }) => {
  const isUnfulfilled = currentStatus === 'UNFULFILLED';
  const isCancelled = currentStatus === 'CANCELLED';

  const getStepIndex = (status: DemandStatus) => {
    switch (status) {
      case 'DRAFT': return 0;
      case 'OPEN': return 1;
      case 'RESPONSE_CLOSED': return 2;
      case 'MATCHED': return 3;
      case 'CONFIRMED': return 4;
      case 'IN_FULFILMENT': return 5;
      case 'DELIVERED': return 6;
      case 'COMPLETED': return 7;
      case 'UNFULFILLED': return 2;
      case 'CANCELLED': return 1;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div id="demand-state-stepper" className={`w-full overflow-x-auto py-2 ${className}`}>
      {/* Unfulfilled branch notification if applicable */}
      {isUnfulfilled && (
        <div className="mb-3 px-3 py-2 bg-[#FBEBE8] border border-[#B3412C]/30 rounded-[10px] flex items-center justify-between text-[13px] text-[#B3412C]">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle size={15} />
            <span>Demand marked as Unfulfilled (Buyer rejected recommendations). Awaiting Reopen or Modification.</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-white font-mono">No auto-reopen</span>
        </div>
      )}

      {isCancelled && (
        <div className="mb-3 px-3 py-2 bg-[#FBEBE8] border border-[#B3412C]/30 rounded-[10px] flex items-center gap-2 text-[13px] text-[#B3412C]">
          <XCircle size={15} />
          <span className="font-medium">Demand has been cancelled by buyer. Uncommitted farmer supply remains released.</span>
        </div>
      )}

      <div className="flex items-center min-w-[700px] justify-between relative px-2">
        {MAIN_STEPS.map((step, idx) => {
          const isPast = idx < currentIndex;
          const isCurrent = idx === currentIndex && !isUnfulfilled && !isCancelled;
          const isFuture = idx > currentIndex;

          let circleStyle = 'bg-white border-2 border-[#DDD9CD] text-[#5B6660]';
          let labelStyle = 'text-[#5B6660]';

          if (isPast) {
            circleStyle = 'bg-[#2F5233] border-2 border-[#2F5233] text-white';
            labelStyle = 'text-[#1C2321] font-medium';
          } else if (isCurrent) {
            circleStyle = 'bg-[#2F5233] border-2 border-[#2F5233] text-white shadow-sm ring-4 ring-[#E4ECE0]';
            labelStyle = 'text-[#2F5233] font-semibold';
          }

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors duration-150 ${circleStyle}`}
                >
                  {isPast ? <Check size={14} strokeWidth={3} /> : idx + 1}
                </div>
                <span className={`text-xs mt-1.5 whitespace-nowrap ${labelStyle}`}>
                  {step.label}
                </span>
              </div>

              {/* Connecting line */}
              {idx < MAIN_STEPS.length - 1 && (
                <div
                  className={`flex-1 h-[2px] mx-2 -mt-5 transition-colors duration-150 ${
                    idx < currentIndex ? 'bg-[#2F5233]' : 'bg-[#DDD9CD]'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
