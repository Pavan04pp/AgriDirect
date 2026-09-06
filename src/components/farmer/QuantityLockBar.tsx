import React from 'react';
import { FarmerProfile } from '../../types';
import { Lock, CheckCircle2, Package } from 'lucide-react';

interface QuantityLockBarProps {
  profile: FarmerProfile;
  className?: string;
}

export const QuantityLockBar: React.FC<QuantityLockBarProps> = ({ profile, className = '' }) => {
  const total = profile.total_capacity_kg || 1;
  const locked = profile.locked_quantity_kg;
  const available = profile.available_quantity_kg;

  const lockedPercent = Math.min(100, Math.round((locked / total) * 100));
  const availablePercent = Math.max(0, 100 - lockedPercent);

  return (
    <div
      id="farmer-quantity-locking-card"
      className={`bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-5 shadow-sm space-y-4 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-display font-bold text-base text-[#1C2321] flex items-center gap-2">
            <Lock size={16} className="text-[#C77B2E]" />
            <span>Quantity Locking & Capacity Protection (§10)</span>
          </h2>
          <p className="text-xs text-[#5B6660] mt-0.5">
            Committed inventory is transaction-locked against double-selling. Surplus remains available.
          </p>
        </div>

        <div className="text-xs font-mono text-[#5B6660] bg-[#EFEDE6] px-3 py-1 rounded-[8px] self-start sm:self-center">
          Total Farm Capacity: <strong>{total} kg</strong>
        </div>
      </div>

      {/* Visual Split Bar (§10 & §17) */}
      <div className="space-y-2">
        <div className="h-6 w-full bg-[#EFEDE6] rounded-[8px] overflow-hidden flex border border-[#DDD9CD]">
          {/* Locked Portion */}
          {locked > 0 && (
            <div
              style={{ width: `${lockedPercent}%` }}
              className="bg-[#C77B2E] text-white flex items-center justify-center text-xs font-bold font-mono transition-all duration-300"
              title={`${locked} kg Locked for confirmed buyers`}
            >
              {lockedPercent >= 15 ? `${locked} kg Locked` : `${locked}k`}
            </div>
          )}

          {/* Available Portion */}
          <div
            style={{ width: `${availablePercent}%` }}
            className="bg-[#2E7D4F] text-white flex items-center justify-center text-xs font-bold font-mono transition-all duration-300"
            title={`${available} kg Available for active demands`}
          >
            {availablePercent >= 15 ? `${available} kg Available` : `${available}k`}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[3px] bg-[#C77B2E]" />
              <span className="font-semibold text-[#1C2321]">
                Locked: {locked} kg ({lockedPercent}%)
              </span>
              <span className="text-[#5B6660] text-[11px]">(Committed to orders)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[3px] bg-[#2E7D4F]" />
              <span className="font-semibold text-[#1C2321]">
                Available: {available} kg ({availablePercent}%)
              </span>
              <span className="text-[#5B6660] text-[11px]">(Open for new demands)</span>
            </div>
          </div>

          <span className="text-[11px] text-[#5B6660] hidden md:inline">
            Status: <strong>AVAILABLE → RESERVED/LOCKED → DELIVERED</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
