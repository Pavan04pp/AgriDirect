import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Demand } from '../../types';
import { X, AlertCircle } from 'lucide-react';

interface ModifyDemandModalProps {
  demand: Demand;
  isOpen: boolean;
  onClose: () => void;
}

export const ModifyDemandModal: React.FC<ModifyDemandModalProps> = ({
  demand,
  isOpen,
  onClose,
}) => {
  const { modifyDemand, reopenDemand, cancelDemand } = useApp();

  const [quantity, setQuantity] = useState(String(demand.quantity_required));
  const [targetPrice, setTargetPrice] = useState(String(demand.target_price));
  const [grade, setGrade] = useState(demand.quality_requirement);
  const [specifications, setSpecifications] = useState(demand.optional_specifications || '');
  const [extendHours, setExtendHours] = useState('2');

  if (!isOpen) return null;

  const handleModifyAndReopen = (e: React.FormEvent) => {
    e.preventDefault();
    modifyDemand(demand.id, {
      quantity_required: Number(quantity) || demand.quantity_required,
      target_price: Number(targetPrice) || demand.target_price,
      quality_requirement: grade,
      optional_specifications: specifications,
      response_deadline: new Date(Date.now() + Number(extendHours) * 3600 * 1000).toISOString(),
    });
    onClose();
  };

  const handleJustReopen = () => {
    reopenDemand(demand.id);
    onClose();
  };

  const handleCancel = () => {
    cancelDemand(demand.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] w-full max-w-lg shadow-2xl animate-in fade-in">
        <div className="px-6 py-4 border-b border-[#DDD9CD] flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-lg text-[#1C2321]">
              Unfulfilled Demand Resolution
            </h2>
            <p className="text-xs text-[#5B6660]">
              Demand {demand.id} (§12: Reopen, Modify Requirements, or Cancel)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-[6px] text-[#5B6660] hover:text-[#1C2321] hover:bg-[#EFEDE6]"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleModifyAndReopen} className="p-6 space-y-4">
          <div className="p-3 bg-[#FBEBE8] border border-[#B3412C]/30 rounded-[10px] text-xs text-[#B3412C]">
            <strong>Unfulfilled Status: </strong>
            {demand.unfulfilled_reason || 'Buyer rejected proposed applications.'} Uncommitted farmer supply was safely returned to available state.
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1C2321] mb-1">
                Adjusted Quantity (kg)
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full h-10 px-3 rounded-[8px] border border-[#DDD9CD] text-sm text-[#1C2321]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2321] mb-1">
                Target Price (₹/kg)
              </label>
              <input
                type="number"
                step="0.5"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="w-full h-10 px-3 rounded-[8px] border border-[#DDD9CD] text-sm text-[#1C2321]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1C2321] mb-1">
                Quality Grade
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as any)}
                className="w-full h-10 px-3 rounded-[8px] border border-[#DDD9CD] text-sm text-[#1C2321]"
              >
                <option value="Grade A">Grade A (Hotel Premium)</option>
                <option value="Grade B">Grade B (Kitchen Standard)</option>
                <option value="Grade C">Grade C (Processing)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2321] mb-1">
                New Response Window
              </label>
              <select
                value={extendHours}
                onChange={(e) => setExtendHours(e.target.value)}
                className="w-full h-10 px-3 rounded-[8px] border border-[#DDD9CD] text-sm text-[#1C2321]"
              >
                <option value="1">1 Hour</option>
                <option value="2">2 Hours</option>
                <option value="6">6 Hours</option>
                <option value="24">24 Hours</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C2321] mb-1">
              Revised Specifications
            </label>
            <textarea
              rows={2}
              value={specifications}
              onChange={(e) => setSpecifications(e.target.value)}
              className="w-full p-2.5 rounded-[8px] border border-[#DDD9CD] text-xs text-[#1C2321]"
            />
          </div>

          {/* Action Bar */}
          <div className="pt-3 border-t border-[#DDD9CD] flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-2 text-xs font-medium text-[#B3412C] hover:bg-[#FBEBE8] rounded-[8px] border border-[#B3412C]/30"
            >
              Cancel Demand
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleJustReopen}
                className="px-3 py-2 text-xs font-medium text-[#1C2321] bg-[#EFEDE6] hover:bg-[#DDD9CD] rounded-[8px]"
              >
                Reopen As-Is
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#2F5233] hover:bg-[#25401F] rounded-[8px]"
              >
                Save & Reopen Cycle
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
