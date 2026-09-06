import React from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Tractor, Truck, ShieldAlert, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';

export const LandingPage: React.FC<{ onNavigateToApp: () => void }> = ({ onNavigateToApp }) => {
  const { setCurrentUser, users } = useApp();

  const handleRoleSelect = (role: string) => {
    const target = users.find((u) => u.role === role);
    if (target) {
      setCurrentUser(target);
      onNavigateToApp();
    }
  };

  return (
    <div id="landing-page" className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <div className="bg-[#FFFFFF] border border-[#DDD9CD] rounded-[16px] p-6 sm:p-10 relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#E4ECE0] text-[#2F5233] text-xs font-semibold">
            <span>Operational Specification v2</span>
            <span>•</span>
            <span>Demand-Driven Agricultural Infrastructure</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1C2321] tracking-tight leading-tight">
            Commercial agricultural procurement starting from confirmed demand.
          </h1>

          <p className="text-[#5B6660] text-sm sm:text-base leading-relaxed">
            Team Enigma connects commercial buyers with farmer collectives and local logistics providers. Rather than listing produce blindly, buyers post verified requirements and the system aggregates matching farmgate supply.
          </p>

          {/* Key system positioning per §2 */}
          <div className="pt-2 text-xs text-[#5B6660] space-y-1.5 border-t border-[#DDD9CD]">
            <p className="font-medium text-[#1C2321]">Core Mission Objectives:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F5233]" />
                <span>Direct buyer-to-farmer/FPO connectivity</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F5233]" />
                <span>Transparent procurement with audit trails</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F5233]" />
                <span>Multi-farmer supply aggregation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F5233]" />
                <span>Coordinated farmgate-to-kitchen logistics</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onNavigateToApp}
              className="px-5 py-2.5 rounded-[10px] bg-[#2F5233] hover:bg-[#25401F] text-white font-semibold text-xs transition-colors shadow-sm"
            >
              Enter Operations Console
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('farmer')}
              className="px-4 py-2.5 rounded-[10px] bg-white border border-[#DDD9CD] hover:bg-[#EFEDE6] text-[#1C2321] font-semibold text-xs transition-colors"
            >
              Enter as Farmer / FPO
            </button>
          </div>
        </div>
      </div>

      {/* Role Navigation Cards (§3) */}
      <div>
        <h2 className="font-display font-bold text-lg text-[#1C2321] mb-4">
          Select Operational Workspace
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Buyer */}
          <div
            onClick={() => handleRoleSelect('buyer')}
            className="bg-[#FFFFFF] border border-[#DDD9CD] hover:border-[#2F5233] rounded-[16px] p-5 cursor-pointer transition-all hover:shadow-sm group"
          >
            <div className="w-10 h-10 rounded-[8px] bg-[#E4ECE0] text-[#2F5233] flex items-center justify-center mb-3">
              <Building2 size={20} />
            </div>
            <h3 className="font-display font-bold text-base text-[#1C2321] group-hover:text-[#2F5233]">
              Commercial Buyer
            </h3>
            <p className="text-xs text-[#5B6660] mt-1 line-clamp-2">
              Hotels, restaurants, retailers, processors. Create demands, review aggregated matches, confirm orders.
            </p>
            <div className="mt-4 pt-3 border-t border-[#DDD9CD] flex items-center justify-between text-xs font-semibold text-[#2F5233]">
              <span>Chef Arvind (GreenLeaf)</span>
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Farmer */}
          <div
            onClick={() => handleRoleSelect('farmer')}
            className="bg-[#FFFFFF] border border-[#DDD9CD] hover:border-[#C77B2E] rounded-[16px] p-5 cursor-pointer transition-all hover:shadow-sm group"
          >
            <div className="w-10 h-10 rounded-[8px] bg-[#F6E7D3] text-[#C77B2E] flex items-center justify-center mb-3">
              <Tractor size={20} />
            </div>
            <h3 className="font-display font-bold text-base text-[#1C2321] group-hover:text-[#C77B2E]">
              Farmer / FPO
            </h3>
            <p className="text-xs text-[#5B6660] mt-1 line-clamp-2">
              Respond to suitable demands with quantity & price. Upload produce for CV grade assessment. Track locked volume.
            </p>
            <div className="mt-4 pt-3 border-t border-[#DDD9CD] flex items-center justify-between text-xs font-semibold text-[#C77B2E]">
              <span>Ramesh Gowda (Hosakote)</span>
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Logistics */}
          <div
            onClick={() => handleRoleSelect('logistics')}
            className="bg-[#FFFFFF] border border-[#DDD9CD] hover:border-[#3B6FA0] rounded-[16px] p-5 cursor-pointer transition-all hover:shadow-sm group"
          >
            <div className="w-10 h-10 rounded-[8px] bg-[#EBF3FA] text-[#3B6FA0] flex items-center justify-center mb-3">
              <Truck size={20} />
            </div>
            <h3 className="font-display font-bold text-base text-[#1C2321] group-hover:text-[#3B6FA0]">
              Logistics Provider
            </h3>
            <p className="text-xs text-[#5B6660] mt-1 line-clamp-2">
              Accept consolidated pickup jobs, review multi-point route sequence, update transit & delivery milestones.
            </p>
            <div className="mt-4 pt-3 border-t border-[#DDD9CD] flex items-center justify-between text-xs font-semibold text-[#3B6FA0]">
              <span>Kisan Express Freight</span>
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Admin */}
          <div
            onClick={() => handleRoleSelect('admin')}
            className="bg-[#FFFFFF] border border-[#DDD9CD] hover:border-[#1C2321] rounded-[16px] p-5 cursor-pointer transition-all hover:shadow-sm group"
          >
            <div className="w-10 h-10 rounded-[8px] bg-[#EFEDE6] text-[#1C2321] flex items-center justify-center mb-3">
              <ShieldAlert size={20} />
            </div>
            <h3 className="font-display font-bold text-base text-[#1C2321]">
              Platform Admin
            </h3>
            <p className="text-xs text-[#5B6660] mt-1 line-clamp-2">
              Configure multi-factor utility scoring weights, audit demand transactions, inspect system telemetry.
            </p>
            <div className="mt-4 pt-3 border-t border-[#DDD9CD] flex items-center justify-between text-xs font-semibold text-[#1C2321]">
              <span>Operations Control</span>
              <ChevronRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
