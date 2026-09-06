import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ChevronRight, CheckCircle2, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

export const ScenarioTourBar: React.FC = () => {
  const { demoStep, runAutomatedScenarioStep, resetToDemoSeed, currentUser } = useApp();

  const stepDescriptions = [
    {
      title: 'Ready: Demand-First Round-2 Demo (§21)',
      desc: 'Buyer created 500 kg Tomatoes Grade A demand. Farmers responded with quantities/prices during the response window.',
      actionLabel: '1. Inspect Active Demand',
      targetRole: 'buyer',
    },
    {
      title: 'Step 1/8: Farmer Applications Received',
      desc: '4 farmers submitted offers: Ramesh (200kg @ ₹31), Suresh (150kg @ ₹30), Ananya (180kg @ ₹32), Rajesh (100kg Grade B @ ₹35).',
      actionLabel: '2. Close Response Window & Match',
      targetRole: 'buyer',
    },
    {
      title: 'Step 2/8: Response Window Closed & Utility Matched',
      desc: 'Utility engine evaluated all 4 applicants using multi-factor scores. Supply aggregation combines Ramesh + Suresh + Ananya = 500 kg!',
      actionLabel: '3. Buyer Confirms Fulfilment',
      targetRole: 'buyer',
    },
    {
      title: 'Step 3/8: Buyer Confirmed → Quantities Locked',
      desc: 'Transaction committed: 500 kg tomatoes locked across 3 farmers. Rajesh unselected (quantity stays AVAILABLE, no penalty).',
      actionLabel: '4. View Farmer Locked Inventory',
      targetRole: 'farmer',
    },
    {
      title: 'Step 4/8: Farmer Ramesh View (Quantity Locking)',
      desc: 'Notice Ramesh has 200 kg LOCKED for GreenLeaf Kitchens, and remaining 300 kg AVAILABLE for other demands (§10).',
      actionLabel: '5. Switch to Logistics Provider',
      targetRole: 'logistics',
    },
    {
      title: 'Step 5/8: Logistics Job Assigned & Accepted',
      desc: 'Multi-stop route created: Hosakote (200kg) → Kolar (150kg) → Chintamani (150kg) → Yeshwanthpur Buyer Hub.',
      actionLabel: '6. Start Pickups & In-Transit',
      targetRole: 'logistics',
    },
    {
      title: 'Step 6/8: Pickups Completed & Truck In-Transit',
      desc: 'Logistics provider collected crates from farmers. Truck is en-route to Buyer Central Kitchen with live tracking.',
      actionLabel: '7. Deliver to Central Kitchen',
      targetRole: 'logistics',
    },
    {
      title: 'Step 7/8: Delivery Verified & Completed!',
      desc: 'Order delivered, locked quantities settled to Delivered, and farmer payments released to escrow settlement (§21 complete).',
      actionLabel: 'Restart Demo Sequence',
      targetRole: 'buyer',
    },
  ];

  const currentInfo = stepDescriptions[Math.min(demoStep, stepDescriptions.length - 1)];

  return (
    <div id="scenario-tour-bar" className="bg-[#FFFFFF] border-b border-[#DDD9CD] px-4 sm:px-8 py-3 shrink-0">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-[8px] bg-[#F6E7D3] border border-[#C77B2E]/30 text-[#C77B2E] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 shadow-xs">
            <Sparkles size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xs sm:text-sm text-[#1C2321]">
                {currentInfo.title}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-[6px] bg-[#EFEDE6] border border-[#DDD9CD] text-[#5B6660] font-semibold hidden sm:inline">
                Active: {currentUser.name} ({currentUser.role})
              </span>
            </div>
            <p className="text-xs text-[#5B6660] mt-0.5 line-clamp-1 sm:line-clamp-none font-medium">
              {currentInfo.desc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
          <button
            type="button"
            onClick={resetToDemoSeed}
            className="p-2 text-xs text-[#5B6660] hover:text-[#1C2321] hover:bg-[#EFEDE6] rounded-[8px] border border-[#DDD9CD] transition-colors"
            title="Reset to beginning seed scenario"
          >
            <RotateCcw size={14} />
          </button>
          <button
            type="button"
            onClick={runAutomatedScenarioStep}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] text-xs font-bold bg-[#2F5233] hover:bg-[#25401F] text-white transition-colors shadow-xs"
          >
            <span>{currentInfo.actionLabel}</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
