import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Demand } from '../../types';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Truck,
  Package,
  HelpCircle,
  ShieldCheck,
  Percent
} from 'lucide-react';

interface FarmerApplicationModalProps {
  demand: Demand;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const FarmerApplicationModal: React.FC<FarmerApplicationModalProps> = ({
  demand,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { submitFarmerApplication, farmerProfiles, currentUser, qualityAssessments, language, t } = useApp();
  const profile = farmerProfiles[currentUser.id];

  const maxAvailable = profile ? profile.available_quantity_kg : 200;
  const defaultOfferQty = Math.min(demand.quantity_required, maxAvailable);

  const buyerMin = demand.target_price_min ?? Math.round(demand.target_price * 0.95);
  const buyerMax = demand.target_price_max ?? Math.round(demand.target_price * 1.05);

  const [quantity, setQuantity] = useState(String(defaultOfferQty));
  const [priceMin, setPriceMin] = useState(String(buyerMin));
  const [priceMax, setPriceMax] = useState(String(demand.target_price));
  const [acceptTransitDamageBuffer, setAcceptTransitDamageBuffer] = useState(true);
  const [tolerancePct, setTolerancePct] = useState<number>(5);
  const [deliveryMode, setDeliveryMode] = useState<'farmgate_pickup' | 'hub_dropoff'>('farmgate_pickup');
  const [note, setNote] = useState(
    language === 'kn'
      ? 'ಬೆಳೆ ಸಿದ್ಧವಾಗಿದೆ, ಉತ್ತಮ ಗುಣಮಟ್ಟದ ಬಾಕ್ಸ್/ಕ್ರೇಟ್‌ಗಳಲ್ಲಿ ಪ್ಯಾಕ್ ಮಾಡಲಾಗಿದೆ.'
      : 'Fresh harvest ready in standard crates for transport.'
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const parsedQty = Number(quantity) || 0;
  const calculatedBufferKg = Math.round(parsedQty * (tolerancePct / 100));

  const handleQuickAdd = (addQty: number) => {
    const next = Math.min(maxAvailable, parsedQty + addQty);
    setQuantity(String(next));
  };

  const handleSetMax = () => {
    setQuantity(String(maxAvailable));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    const parsedMinP = Number(priceMin);
    const parsedMaxP = Number(priceMax);
    const primaryPrice = Math.round(((parsedMinP + parsedMaxP) / 2) * 10) / 10;

    if (parsedQty <= 0) {
      setErrorMsg(t('offer_qty') + ': ' + (language === 'kn' ? 'ದಯವಿಟ್ಟು ಸರಿಯಾದ ಪ್ರಮಾಣ ನಮೂದಿಸಿ' : 'Please enter valid quantity'));
      setSubmitting(false);
      return;
    }

    if (parsedQty > maxAvailable) {
      setErrorMsg(
        language === 'kn'
          ? `ನೀವು ನಮೂದಿಸಿದ ತೂಕ (${parsedQty} ಕೆ.ಜಿ) ಲಭ್ಯವಿರುವ ತೂಕಕ್ಕಿಂತ (${maxAvailable} ಕೆ.ಜಿ) ಹೆಚ್ಚಾಗಿದೆ.`
          : `Offered quantity exceeds available inventory (${maxAvailable} kg)`
      );
      setSubmitting(false);
      return;
    }

    if (parsedMinP <= 0 || parsedMaxP <= 0 || parsedMinP > parsedMaxP) {
      setErrorMsg(
        language === 'kn'
          ? 'ದಯವಿಟ್ಟು ಸರಿಯಾದ ಕನಿಷ್ಠ ಮತ್ತು ಗರಿಷ್ಠ ಬೆಲೆ ಶ್ರೇಣಿಯನ್ನು ನಮೂದಿಸಿ (ಕನಿಷ್ಠ ಬೆಲೆ ಗರಿಷ್ಠಕ್ಕಿಂತ ಕಡಿಮೆ ಇರಬೇಕು).'
          : 'Please enter valid min and max prices (min must be <= max).'
      );
      setSubmitting(false);
      return;
    }

    const currentQa = qualityAssessments[`qa-${currentUser.id}`];

    const res = await submitFarmerApplication(
      demand.id,
      parsedQty,
      primaryPrice,
      deliveryMode,
      note,
      currentQa,
      parsedMinP,
      parsedMaxP,
      acceptTransitDamageBuffer ? tolerancePct : 0,
      acceptTransitDamageBuffer ? calculatedBufferKg : 0
    );

    setSubmitting(false);
    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg(res.error || 'Failed to submit application');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] w-full max-w-lg shadow-2xl animate-in fade-in my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-[#DDD9CD] flex items-center justify-between bg-[#F7F6F2] rounded-t-[16px]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-[6px] bg-[#E4ECE0] text-[#2F5233] text-[11px] font-bold">
                {language === 'kn' ? 'ರೈತ ಮಾರಾಟ ಪ್ರಸ್ತಾಪ' : 'Farmer Crop Offer'}
              </span>
              <span className="text-xs text-[#5B6660] font-mono">{demand.id}</span>
            </div>
            <h2 className="font-display font-bold text-base sm:text-lg text-[#1C2321] mt-0.5">
              {demand.commodity} - {t('offer_crop')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-[8px] text-[#5B6660] hover:text-[#1C2321] hover:bg-[#DDD9CD]/50"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3 bg-[#FBEBE8] border border-[#B3412C]/30 rounded-[10px] text-xs text-[#B3412C] flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Simple Demand Highlight Card */}
          <div className="p-3.5 rounded-[12px] bg-[#EFEDE6] border border-[#DDD9CD] text-xs space-y-2">
            <div className="flex items-center justify-between font-medium">
              <span className="text-[#5B6660]">{t('required_qty')}:</span>
              <span className="font-bold text-[#1C2321] text-sm">
                {demand.quantity_required} {t('unit_kg')}
              </span>
            </div>
            <div className="flex items-center justify-between font-medium">
              <span className="text-[#5B6660]">{t('price_range_negotiable')}:</span>
              <span className="font-bold text-[#2F5233] bg-[#E4ECE0] px-2 py-0.5 rounded-[6px]">
                ₹{buyerMin} - ₹{buyerMax} / {t('unit_kg')}
              </span>
            </div>
            <div className="flex items-center justify-between font-medium pt-1 border-t border-[#DDD9CD]/60">
              <span className="text-[#5B6660]">{t('available_stock')}:</span>
              <span className="font-bold text-[#2E7D4F] font-mono">
                {maxAvailable} {t('unit_kg')}
              </span>
            </div>
          </div>

          {/* 1. Offered Quantity Input with Quick Chips */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#1C2321]">
                1. {t('offer_qty')} ({t('unit_kg')})
              </label>
              <span className="text-[11px] text-[#5B6660]">
                {language === 'kn' ? 'ಗರಿಷ್ಠ:' : 'Max:'} <strong>{maxAvailable} kg</strong>
              </span>
            </div>

            <div className="relative">
              <input
                type="number"
                min="10"
                max={maxAvailable}
                step="5"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full h-11 px-3.5 rounded-[10px] border border-[#DDD9CD] text-base font-bold text-[#1C2321] focus:outline-none focus:border-[#2F5233] focus:ring-1 focus:ring-[#2F5233]"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-[#5B6660] font-semibold">
                {t('unit_kg')}
              </span>
            </div>

            {/* Quick Chips for Farmer Ease */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] text-[#5B6660]">
                {language === 'kn' ? 'ತ್ವರಿತ ಆಯ್ಕೆ:' : 'Quick set:'}
              </span>
              <button
                type="button"
                onClick={() => handleQuickAdd(50)}
                className="px-2 py-0.5 rounded-[6px] bg-[#EFEDE6] hover:bg-[#DDD9CD] text-[11px] font-semibold text-[#1C2321]"
              >
                +50 kg
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd(100)}
                className="px-2 py-0.5 rounded-[6px] bg-[#EFEDE6] hover:bg-[#DDD9CD] text-[11px] font-semibold text-[#1C2321]"
              >
                +100 kg
              </button>
              <button
                type="button"
                onClick={handleSetMax}
                className="px-2 py-0.5 rounded-[6px] bg-[#E4ECE0] hover:bg-[#D5E1CF] text-[11px] font-bold text-[#2F5233]"
              >
                {language === 'kn' ? 'ಪೂರ್ಣ ದಾಸ್ತಾನು (Max)' : 'All Stock (Max)'}
              </button>
            </div>
          </div>

          {/* 2. Transit Damage Buffer & Negotiable Quantity (±5% ~ 10-25 kg) */}
          <div className="p-3.5 rounded-[12px] bg-[#F6E7D3]/40 border border-[#C77B2E]/30 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#C77B2E] shrink-0" />
                <label className="text-xs font-bold text-[#1C2321] cursor-pointer">
                  2. {t('transit_damage_title')}
                </label>
              </div>
              <input
                type="checkbox"
                checked={acceptTransitDamageBuffer}
                onChange={(e) => setAcceptTransitDamageBuffer(e.target.checked)}
                className="w-4 h-4 rounded text-[#2F5233] focus:ring-[#2F5233] cursor-pointer mt-0.5"
              />
            </div>

            <p className="text-[11px] text-[#5B6660] leading-relaxed">
              {t('transit_damage_desc')}
            </p>

            {acceptTransitDamageBuffer && (
              <div className="flex items-center justify-between text-xs bg-white p-2 rounded-[8px] border border-[#C77B2E]/20 text-[#1C2321]">
                <span className="font-semibold text-[#C77B2E]">
                  {t('buffer_amount')}:
                </span>
                <span className="font-bold font-mono">
                  ±{tolerancePct}% ({calculatedBufferKg} {t('unit_kg')})
                </span>
              </div>
            )}
          </div>

          {/* 3. Negotiable Price Range Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#1C2321]">
                3. {t('farmer_price_range')} (₹/{t('unit_kg')})
              </label>
              <span className="text-[11px] text-[#2F5233] font-semibold">
                {t('buyer_range')}: ₹{buyerMin} - ₹{buyerMax}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <span className="block text-[11px] text-[#5B6660] mb-1 font-medium">
                  {t('min_price')} (₹/{t('unit_kg')})
                </span>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  required
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full h-10 px-3 rounded-[10px] border border-[#DDD9CD] text-sm font-semibold text-[#1C2321] focus:outline-none focus:border-[#2F5233]"
                  placeholder="₹ Min"
                />
              </div>

              <div>
                <span className="block text-[11px] text-[#5B6660] mb-1 font-medium">
                  {t('max_price')} (₹/{t('unit_kg')})
                </span>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  required
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full h-10 px-3 rounded-[10px] border border-[#DDD9CD] text-sm font-semibold text-[#1C2321] focus:outline-none focus:border-[#2F5233]"
                  placeholder="₹ Max"
                />
              </div>
            </div>
            <span className="text-[11px] text-[#5B6660] block">
              {language === 'kn'
                ? 'ಸೂಚನೆ: ನಿಮ್ಮ ಬೆಲೆ ಶ್ರೇಣಿಯು ಖರೀದಿದಾರರ ಬೆಲೆಗೆ ಹೊಂದುವುದರಿಂದ ತಕ್ಷಣ ಆಯ್ಕೆಯಾಗುವ ಸಾಧ್ಯತೆ ಹೆಚ್ಚುತ್ತದೆ.'
                : 'Note: Specifying an agreed range increases match compatibility.'}
            </span>
          </div>

          {/* 4. Delivery Mode */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1C2321]">
              4. {t('delivery_capability')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryMode('farmgate_pickup')}
                className={`p-2.5 rounded-[10px] border text-left text-xs transition-colors ${
                  deliveryMode === 'farmgate_pickup'
                    ? 'border-[#2F5233] bg-[#E4ECE0] text-[#2F5233] font-semibold'
                    : 'border-[#DDD9CD] bg-white text-[#5B6660]'
                }`}
              >
                <div className="font-semibold text-xs text-[#1C2321]">
                  {t('farmgate_pickup')}
                </div>
                <div className="text-[10px] text-[#5B6660] mt-0.5">
                  {language === 'kn' ? 'ವಾಹನ ನಿಮ್ಮ ತೋಟಕ್ಕೆ ಬರುತ್ತದೆ' : 'Carrier collects from farm'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMode('hub_dropoff')}
                className={`p-2.5 rounded-[10px] border text-left text-xs transition-colors ${
                  deliveryMode === 'hub_dropoff'
                    ? 'border-[#2F5233] bg-[#E4ECE0] text-[#2F5233] font-semibold'
                    : 'border-[#DDD9CD] bg-white text-[#5B6660]'
                }`}
              >
                <div className="font-semibold text-xs text-[#1C2321]">
                  {t('hub_dropoff')}
                </div>
                <div className="text-[10px] text-[#5B6660] mt-0.5">
                  {language === 'kn' ? 'ನೀವೇ ಮಂಡಿ/ಕೇಂದ್ರಕ್ಕೆ ತಲುಪಿಸಿ' : 'Drop at regional hub'}
                </div>
              </button>
            </div>
          </div>

          {/* 5. Simple Note */}
          <div>
            <label className="block text-xs font-semibold text-[#1C2321] mb-1">
              5. {language === 'kn' ? 'ಹೆಚ್ಚುವರಿ ವಿವರಗಳು (ಐಚ್ಛಿಕ)' : 'Harvest Note (Optional)'}
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full h-9 px-3 rounded-[8px] border border-[#DDD9CD] text-xs text-[#1C2321] focus:outline-none focus:border-[#2F5233]"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-[#DDD9CD] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#5B6660] hover:text-[#1C2321] rounded-[10px] border border-[#DDD9CD]"
            >
              {t('cancel')}
            </button>
            <button
              id="i-can-provide-btn"
              type="submit"
              disabled={submitting}
              className="min-h-[44px] px-6 py-2 text-xs font-bold text-white bg-[#2F5233] hover:bg-[#25401F] rounded-[10px] transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
            >
              <CheckCircle2 size={16} />
              <span>
                {submitting
                  ? (language === 'kn' ? 'ಪ್ರಸ್ತಾಪ ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...' : 'Submitting Offer...')
                  : t('confirm_offer')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
