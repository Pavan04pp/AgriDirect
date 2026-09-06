import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, MapPin, DollarSign, Package, AlertCircle, ShieldCheck, HeartHandshake } from 'lucide-react';

interface CreateDemandModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateDemandModal: React.FC<CreateDemandModalProps> = ({ isOpen, onClose }) => {
  const { createDemand, buyerProfile, currentUser } = useApp();

  const [commodity, setCommodity] = useState('Tomatoes');
  const [quantity, setQuantity] = useState('500');
  const [grade, setGrade] = useState<'Grade A' | 'Grade B' | 'Grade C'>('Grade A');
  const [targetPrice, setTargetPrice] = useState('32');
  const [priceMin, setPriceMin] = useState('30');
  const [priceMax, setPriceMax] = useState('34');
  const [tolerancePct, setTolerancePct] = useState('5');
  const [deliveryLocation, setDeliveryLocation] = useState(
    buyerProfile.location || 'Apex Central Kitchen, Yeshwanthpur, Bengaluru'
  );
  const [deliveryHours, setDeliveryHours] = useState('24'); // Tomorrow
  const [responseHours, setResponseHours] = useState('2'); // 2 hour response window
  const [specifications, setSpecifications] = useState(
    'Firm salad variety, minimum 50mm diameter, plastic crate packaging required.'
  );

  if (!isOpen) return null;

  const parsedQty = Number(quantity) || 500;
  const parsedTolerancePct = Number(tolerancePct) || 5;
  const transitDamageKg = Math.round(parsedQty * (parsedTolerancePct / 100));

  const handlePriceTargetChange = (val: string) => {
    setTargetPrice(val);
    const num = Number(val);
    if (!isNaN(num) && num > 0) {
      setPriceMin(String(Math.round(num * 0.95)));
      setPriceMax(String(Math.round(num * 1.05)));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const deliveryDate = new Date(Date.now() + Number(deliveryHours) * 3600 * 1000).toISOString();
    const responseDate = new Date(Date.now() + Number(responseHours) * 3600 * 1000).toISOString();

    createDemand({
      buyer_id: currentUser.id,
      buyer_name: buyerProfile.business_name || currentUser.name,
      buyer_type: buyerProfile.buyer_type || 'Hotel/Restaurant',
      commodity,
      quantity_required: parsedQty,
      quantity_tolerance_pct: parsedTolerancePct,
      acceptable_min_quantity: Math.round(parsedQty * (1 - parsedTolerancePct / 100)),
      transit_damage_allowance_kg: transitDamageKg,
      quality_requirement: grade,
      target_price: Number(targetPrice) || 32,
      target_price_min: Number(priceMin) || 30,
      target_price_max: Number(priceMax) || 34,
      delivery_location: deliveryLocation,
      delivery_coordinates: buyerProfile.coordinates || { lat: 13.028, lng: 77.5409 },
      delivery_deadline: deliveryDate,
      response_deadline: responseDate,
      optional_specifications: specifications,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl animate-in fade-in my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#DDD9CD] flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-display font-bold text-lg text-[#1C2321]">
              Post Commercial Demand
            </h2>
            <p className="text-xs text-[#5B6660]">
              Demand-first procurement with negotiable tolerances (§4)
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Commodity */}
            <div>
              <label className="block text-xs font-semibold text-[#1C2321] mb-1">
                Commodity
              </label>
              <select
                value={commodity}
                onChange={(e) => setCommodity(e.target.value)}
                className="w-full h-11 px-3 rounded-[10px] border border-[#DDD9CD] bg-white text-sm text-[#1C2321] focus:outline-none focus:border-[#2F5233] focus:ring-2 focus:ring-[#2F5233]/20"
              >
                <option value="Tomatoes">Tomatoes (Fresh Red)</option>
                <option value="Onions">Onions (Nashik / Bellary Red)</option>
                <option value="Potatoes">Potatoes (Jyoti / Kufri)</option>
                <option value="Capsicum">Capsicum / Bell Peppers</option>
                <option value="Green Chillies">Green Chillies (G4)</option>
              </select>
            </div>

            {/* Required Quantity */}
            <div>
              <label className="block text-xs font-semibold text-[#1C2321] mb-1">
                Required Quantity (kg)
              </label>
              <input
                type="number"
                min="50"
                step="10"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full h-11 px-3 rounded-[10px] border border-[#DDD9CD] bg-white text-sm text-[#1C2321] focus:outline-none focus:border-[#2F5233] focus:ring-2 focus:ring-[#2F5233]/20"
                placeholder="e.g. 500"
              />
            </div>
          </div>

          {/* Quantity Tolerance & Transit Damage Allowance (±5% / ~10-25 kg) */}
          <div className="p-3.5 rounded-[12px] bg-[#F6E7D3]/40 border border-[#C77B2E]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1C2321] flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-[#C77B2E]" />
                Negotiable Quantity & Transit Damage Allowance
              </span>
              <span className="text-xs font-mono font-bold text-[#C77B2E]">
                ±{tolerancePct}% (~{transitDamageKg} kg)
              </span>
            </div>
            <p className="text-[11px] text-[#5B6660] leading-relaxed">
              Allows ±{tolerancePct}% buffer to account for travel friction, moisture loss, or minor transit sorting damage. Acceptable delivery range: <strong>{Math.round(parsedQty * (1 - parsedTolerancePct / 100))} kg - {Math.round(parsedQty * (1 + parsedTolerancePct / 100))} kg</strong>.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-[#5B6660]">Tolerance %:</span>
              {[3, 5, 8, 10].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setTolerancePct(String(pct))}
                  className={`px-2.5 py-1 rounded-[6px] text-xs font-semibold border ${
                    tolerancePct === String(pct)
                      ? 'bg-[#C77B2E] text-white border-[#C77B2E]'
                      : 'bg-white text-[#5B6660] border-[#DDD9CD] hover:bg-[#EFEDE6]'
                  }`}
                >
                  ±{pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Quality Grade & Target Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C2321] mb-1">
                Required Grade
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as any)}
                className="w-full h-11 px-3 rounded-[10px] border border-[#DDD9CD] bg-white text-sm text-[#1C2321] focus:outline-none focus:border-[#2F5233] focus:ring-2 focus:ring-[#2F5233]/20"
              >
                <option value="Grade A">Grade A (Premium / Hotel Standard)</option>
                <option value="Grade B">Grade B (Commercial / Processing Standard)</option>
                <option value="Grade C">Grade C (Industrial / Pulping)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2321] mb-1">
                Reference Price (₹/kg)
              </label>
              <input
                type="number"
                min="1"
                step="0.5"
                required
                value={targetPrice}
                onChange={(e) => handlePriceTargetChange(e.target.value)}
                className="w-full h-11 px-3 rounded-[10px] border border-[#DDD9CD] bg-white text-sm text-[#1C2321] focus:outline-none focus:border-[#2F5233] focus:ring-2 focus:ring-[#2F5233]/20"
                placeholder="e.g. 32"
              />
            </div>
          </div>

          {/* Negotiable Price Range */}
          <div className="p-3.5 rounded-[12px] bg-[#E4ECE0]/40 border border-[#2F5233]/20 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#2F5233]">
              <HeartHandshake size={15} />
              <span>Negotiable Price Range (₹/kg)</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-[#5B6660] mb-1 font-medium">
                  Buyer Min Acceptable (₹/kg)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  required
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full h-9 px-3 rounded-[8px] border border-[#DDD9CD] bg-white text-xs font-semibold text-[#1C2321]"
                  placeholder="₹ Min"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#5B6660] mb-1 font-medium">
                  Buyer Max Ceiling (₹/kg)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  required
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full h-9 px-3 rounded-[8px] border border-[#DDD9CD] bg-white text-xs font-semibold text-[#1C2321]"
                  placeholder="₹ Max"
                />
              </div>
            </div>
            <span className="text-[11px] text-[#5B6660] block">
              Farmers offering supply within ₹{priceMin} to ₹{priceMax} will qualify for optimal multi-factor aggregation.
            </span>
          </div>

          {/* Delivery Location */}
          <div>
            <label className="block text-xs font-semibold text-[#1C2321] mb-1">
              Delivery Location
            </label>
            <input
              type="text"
              required
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              className="w-full h-11 px-3 rounded-[10px] border border-[#DDD9CD] bg-white text-sm text-[#1C2321] focus:outline-none focus:border-[#2F5233] focus:ring-2 focus:ring-[#2F5233]/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Delivery Deadline */}
            <div>
              <label className="block text-xs font-semibold text-[#1C2321] mb-1">
                Delivery Required By
              </label>
              <select
                value={deliveryHours}
                onChange={(e) => setDeliveryHours(e.target.value)}
                className="w-full h-11 px-3 rounded-[10px] border border-[#DDD9CD] bg-white text-sm text-[#1C2321] focus:outline-none focus:border-[#2F5233] focus:ring-2 focus:ring-[#2F5233]/20"
              >
                <option value="12">Today Evening (12 Hours)</option>
                <option value="24">Tomorrow Morning (24 Hours)</option>
                <option value="48">In 2 Days (48 Hours)</option>
                <option value="72">In 3 Days (72 Hours)</option>
              </select>
            </div>

            {/* Response Window */}
            <div>
              <label className="block text-xs font-semibold text-[#1C2321] mb-1">
                Farmer Response Window (§6)
              </label>
              <select
                value={responseHours}
                onChange={(e) => setResponseHours(e.target.value)}
                className="w-full h-11 px-3 rounded-[10px] border border-[#DDD9CD] bg-white text-sm text-[#1C2321] focus:outline-none focus:border-[#2F5233] focus:ring-2 focus:ring-[#2F5233]/20"
              >
                <option value="1">1 Hour Window (Rapid Match)</option>
                <option value="2">2 Hours Window (Standard)</option>
                <option value="6">6 Hours Window (Extended)</option>
                <option value="12">12 Hours Window</option>
              </select>
            </div>
          </div>

          {/* Specifications */}
          <div>
            <label className="block text-xs font-semibold text-[#1C2321] mb-1">
              Optional Specifications & Packaging Notes
            </label>
            <textarea
              rows={2}
              value={specifications}
              onChange={(e) => setSpecifications(e.target.value)}
              className="w-full p-3 rounded-[10px] border border-[#DDD9CD] bg-white text-sm text-[#1C2321] focus:outline-none focus:border-[#2F5233] focus:ring-2 focus:ring-[#2F5233]/20"
              placeholder="e.g. Size specifications, crate types, wash requirements..."
            />
          </div>

          <div className="p-3 rounded-[10px] bg-[#EFEDE6] text-xs text-[#5B6660] flex items-start gap-2">
            <AlertCircle size={15} className="text-[#2F5233] shrink-0 mt-0.5" />
            <span>
              <strong>30-Minute Owner Acceptance Rule:</strong> Once matching closes and aggregated farmer bundles are calculated, demand owner has 30 minutes to review and accept or reject; after 30 minutes, it automatically auto-rejects for supply safety.
            </span>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#DDD9CD] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#5B6660] hover:text-[#1C2321] rounded-[10px] border border-[#DDD9CD] hover:bg-[#EFEDE6]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#2F5233] hover:bg-[#25401F] rounded-[10px] transition-colors"
            >
              Publish Demand
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
