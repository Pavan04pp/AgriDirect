import React from 'react';
import { StateStepper } from '../common/StateStepper';
import { 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Lock, 
  Truck, 
  Sparkles, 
  ShieldCheck,
  Scale
} from 'lucide-react';

export const HowItWorksPage: React.FC<{ onStartDemo: () => void }> = ({ onStartDemo }) => {
  return (
    <div id="how-it-works-page" className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Page Header */}
      <div className="space-y-3">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#1C2321]">
          How Demand-First Procurement Works
        </h1>
        <p className="text-[#5B6660] text-sm sm:text-base max-w-3xl leading-relaxed">
          Agridirect operates on real buyer demand instead of passive produce listings. Rather than having farmers post produce and wait uncertainly, buyers commit procurement requirements, and the platform aggregates supply to fulfill them.
        </p>
      </div>

      {/* Mandatory Differentiation Table (§2) */}
      <div className="clay-card p-6 shadow-sm">
        <h2 className="font-display font-bold text-lg text-[#1C2321] mb-2 flex items-center gap-2">
          <Scale size={20} className="text-[#2F5233]" />
          Core Platform Differentiation
        </h2>
        <p className="text-xs text-[#5B6660] mb-4">
          A fundamental shift in market structure from speculative listing to demand-driven fulfillment.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#DDD9CD] bg-[#EFEDE6]">
                <th className="py-3 px-4 text-xs font-semibold text-[#1C2321] uppercase tracking-wider w-1/2">
                  Conventional Marketplace
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#2F5233] uppercase tracking-wider w-1/2 bg-[#E4ECE0]/50">
                  Agridirect (Demand-First)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD9CD] text-sm">
              <tr>
                <td className="py-4 px-4 text-[#5B6660] align-top">
                  <div className="font-medium text-[#1C2321]">Farmer lists produce → Buyer searches → Buyer selects</div>
                  <p className="text-xs text-[#5B6660] mt-1">
                    Farmers bear inventory risk, listing produce without guaranteed buyers. Small farmers with 100–200 kg get overlooked by bulk buyers.
                  </p>
                </td>
                <td className="py-4 px-4 text-[#1C2321] align-top bg-[#E4ECE0]/20">
                  <div className="font-semibold text-[#2F5233]">
                    Buyer posts demand → Farmers respond → System evaluates → Supply aggregated → Buyer confirms → Logistics coordinated
                  </div>
                  <p className="text-xs text-[#5B6660] mt-1">
                    Procurement begins with confirmed demand. Small farmers are automatically aggregated to meet commercial bulk volume.
                  </p>
                </td>
              </tr>
              <tr className="bg-[#EFEDE6]/40">
                <td className="py-3 px-4 text-xs text-[#5B6660]">
                  First-come first-served or sponsored ranking leads to fragmented sourcing.
                </td>
                <td className="py-3 px-4 text-xs text-[#1C2321] bg-[#E4ECE0]/20">
                  Response windows ensure fair batch evaluation across quality, distance, price, and reliability.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-xs text-[#5B6660]">
                  Risk of double-selling produce across multiple physical markets and chats.
                </td>
                <td className="py-3 px-4 text-xs text-[#1C2321] bg-[#E4ECE0]/20">
                  Transaction-safe quantity locking commits confirmed volume while keeping surplus available.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Demand State Machine (§4) */}
      <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-6 shadow-sm">
        <h2 className="font-display font-bold text-lg text-[#1C2321] mb-2">
          Demand State Machine Architecture
        </h2>
        <p className="text-xs text-[#5B6660] mb-4">
          Every requirement passes through verifiable state transitions with strict boundary conditions.
        </p>
        
        <StateStepper currentStatus="MATCHED" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-[#DDD9CD]">
          <div className="p-3.5 rounded-[10px] bg-[#EFEDE6] text-xs space-y-1.5">
            <span className="font-semibold text-[#1C2321] block">Standard Progression Cycle</span>
            <p className="text-[#5B6660]">
              <code className="font-mono text-[#2F5233]">DRAFT → OPEN → RESPONSE_CLOSED → MATCHED → CONFIRMED → IN_FULFILMENT → DELIVERED → COMPLETED</code>
            </p>
            <p className="text-[#5B6660]">
              Demands accumulate farmer responses during a defined time window. When closed, candidates are evaluated collectively.
            </p>
          </div>

          <div className="p-3.5 rounded-[10px] bg-[#FBEBE8]/60 border border-[#B3412C]/20 text-xs space-y-1.5">
            <span className="font-semibold text-[#B3412C] block">Unfulfilled & Reopen Branch (§12)</span>
            <p className="text-[#5B6660]">
              <code className="font-mono text-[#B3412C]">UNFULFILLED → REOPENED / MODIFIED / CANCELLED</code>
            </p>
            <p className="text-[#5B6660]">
              If a buyer rejects all proposals, uncommitted farmer supply is immediately released. Demands never auto-reopen indefinitely without explicit buyer action.
            </p>
          </div>
        </div>
      </div>

      {/* Six Pillars of the Enigma Protocol */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1 */}
        <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-5">
          <div className="w-9 h-9 rounded-[8px] bg-[#E4ECE0] text-[#2F5233] flex items-center justify-center mb-3">
            <Layers size={18} />
          </div>
          <h3 className="font-display font-semibold text-base text-[#1C2321]">
            Multi-Farmer Aggregation
          </h3>
          <p className="text-xs text-[#5B6660] mt-1.5 leading-relaxed">
            When a buyer requires 500 kg, the matching engine combines Farmer A (200 kg) + Farmer B (150 kg) + Farmer C (150 kg). Smallholders participate directly in commercial procurement.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-5">
          <div className="w-9 h-9 rounded-[8px] bg-[#F6E7D3] text-[#C77B2E] flex items-center justify-center mb-3">
            <Lock size={18} />
          </div>
          <h3 className="font-display font-semibold text-base text-[#1C2321]">
            Transaction-Safe Locking
          </h3>
          <p className="text-xs text-[#5B6660] mt-1.5 leading-relaxed">
            A farmer’s same quantity is never committed to two buyers. Confirmed quantities are locked on the server; remaining balance remains available for other active demands.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-5">
          <div className="w-9 h-9 rounded-[8px] bg-[#EBF3FA] text-[#3B6FA0] flex items-center justify-center mb-3">
            <Sparkles size={18} />
          </div>
          <h3 className="font-display font-semibold text-base text-[#1C2321]">
            Prototype Quality Assessment
          </h3>
          <p className="text-xs text-[#5B6660] mt-1.5 leading-relaxed">
            Computer vision preliminary grade analysis provides objective decision support. If confidence is low, a "Manual Verification Required" flag is raised.
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-[#2F5233] rounded-[16px] p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-lg">Test the End-to-End Prototype Demo</h3>
          <p className="text-xs text-white/80 mt-1 max-w-xl">
            Simulate the 500 kg tomato procurement scenario: create demand, apply across 4 farmers, run utility matching, lock inventory, and coordinate logistics.
          </p>
        </div>
        <button
          type="button"
          onClick={onStartDemo}
          className="px-4 py-2.5 bg-white text-[#2F5233] hover:bg-[#F7F6F2] font-semibold text-xs rounded-[10px] whitespace-nowrap transition-colors"
        >
          Launch Operations Dashboard
        </button>
      </div>
    </div>
  );
};
