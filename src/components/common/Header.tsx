import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, Language } from '../../types';
import {
  Users,
  Building2,
  Tractor,
  Truck,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Menu,
  Check,
  Clock,
  Globe
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'app' | 'how-it-works' | 'landing';
  onSelectTab: (tab: 'app' | 'how-it-works' | 'landing') => void;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, onOpenMobileMenu }) => {
  const {
    currentUser,
    setCurrentUser,
    users,
    resetToDemoSeed,
    runAutomatedScenarioStep,
    demoStep,
    demands,
    getDemandTimer,
    language,
    setLanguage,
    t
  } = useApp();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const activeDemand = demands.find((d) => d.status === 'RESPONSE_CLOSED' || d.status === 'OPEN') || demands[0];
  const activeTimer = activeDemand ? getDemandTimer(activeDemand.id) : null;
  const timerMins = activeTimer ? Math.floor(activeTimer.remainingSeconds / 60) : 30;
  const timerSecs = activeTimer ? activeTimer.remainingSeconds % 60 : 0;
  const formattedCountdown = `${timerMins.toString().padStart(2, '0')}:${timerSecs.toString().padStart(2, '0')}`;

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'buyer':
        return <Building2 size={16} className="text-[#C77B2E]" />;
      case 'farmer':
        return <Tractor size={16} className="text-[#2F5233]" />;
      case 'logistics':
        return <Truck size={16} className="text-[#3B6FA0]" />;
      case 'admin':
        return <ShieldAlert size={16} className="text-[#5B6660]" />;
    }
  };

  const getContextTitle = () => {
    if (currentTab === 'landing') return 'Platform Overview: Demand-First Model';
    if (currentTab === 'how-it-works') return 'Specification & Mathematical Workflow';
    
    switch (currentUser.role) {
      case 'buyer':
        return `${t('buyer_title')}: ${activeDemand ? activeDemand.id : 'Commercial'}`;
      case 'farmer':
        return language === 'kn' ? `ರೈತ ಡೆಸ್ಕ್: ${currentUser.name}` : `Producer Desk: ${currentUser.name}`;
      case 'logistics':
        return `Freight Dispatch & Route Sequencing`;
      case 'admin':
        return `Governance & Matching Weight Tuning`;
      default:
        return t('app_name');
    }
  };

  const getContextSubtitle = () => {
    if (currentTab === 'landing') return t('platform_subtitle');
    if (currentTab === 'how-it-works') return '8-Stage Multi-Factor Evaluation Lifecycle (§1–§24)';

    switch (currentUser.role) {
      case 'buyer':
        return 'Processing Response Window Results';
      case 'farmer':
        return language === 'kn' ? 'ಬೆಳೆ ಮಾರಾಟ, ಬೆಲೆ ಸಂಧಾನ ಮತ್ತು ಸಾಗಾಣಿಕೆ ಸಡಿಲಿಕೆ' : 'Direct Produce Sale, Price Range Negotiation & Transit Damage Buffer';
      case 'logistics':
        return 'Multi-Stop Optimized Consolidation Fleet';
      case 'admin':
        return 'Multi-Factor Utility Weights Configuration (§8)';
      default:
        return t('platform_subtitle');
    }
  };

  return (
    <header id="platform-header" className="h-20 bg-white border-b border-[#DDD9CD] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40 shrink-0">
      
      {/* Left: Mobile Toggle + High-Contrast Title Block */}
      <div className="flex items-center gap-3 sm:gap-4">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-[8px] text-[#5B6660] hover:text-[#1C2321] hover:bg-[#EFEDE6]"
            title="Open Navigation"
          >
            <Menu size={22} />
          </button>
        )}

        <div>
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-[#1C2321] font-display line-clamp-1">
            {getContextTitle()}
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6660] font-medium line-clamp-1">
            {getContextSubtitle()}
          </p>
        </div>
      </div>

      {/* Right Controls: Scenario Runner, Reset, and Role Switcher */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Remaining Time badge when on buyer view */}
        {currentUser.role === 'buyer' && currentTab === 'app' && activeTimer && (
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] uppercase text-[#5B6660] font-bold tracking-wider flex items-center gap-1">
              <Clock size={11} className={activeTimer.isRunning ? 'text-[#C77B2E] animate-pulse' : 'text-[#5B6660]'} />
              <span>30m Acceptance Window</span>
            </span>
            {activeTimer.isConfirmed ? (
              <span className="text-xs sm:text-sm font-bold text-[#2E7D4F]">Confirmed</span>
            ) : activeTimer.isExpired || activeTimer.isRejected ? (
              <span className="text-xs sm:text-sm font-bold text-[#B3412C]">Auto-Rejected (00:00)</span>
            ) : (
              <span className="text-xs sm:text-sm font-bold font-mono text-[#C77B2E]">
                {formattedCountdown}
              </span>
            )}
          </div>
        )}

        <div className="hidden md:block h-10 w-[1px] bg-[#DDD9CD]" />

        {/* Quick Scenario Runner Button (§21) */}
        <button
          id="run-demo-step-btn"
          type="button"
          onClick={runAutomatedScenarioStep}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-[10px] text-xs font-bold bg-[#F6E7D3] hover:bg-[#EDD4B8] text-[#C77B2E] border border-[#C77B2E]/30 transition-colors shadow-xs"
          title="Step through the §21 end-to-end demo scenario"
        >
          <Sparkles size={14} />
          <span>
            {demoStep === 0
              ? 'Run Round-2 Demo'
              : `Demo Step ${demoStep}/8: Next`}
          </span>
        </button>

        {/* Reset Seed Button */}
        <button
          id="reset-seed-btn"
          type="button"
          onClick={resetToDemoSeed}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-[10px] text-xs font-medium text-[#5B6660] hover:text-[#1C2321] hover:bg-[#EFEDE6] border border-[#DDD9CD] transition-colors"
          title="Reset data to initial seed scenario (§25)"
        >
          <RotateCcw size={13} />
          <span className="hidden xl:inline">Reset Seed</span>
        </button>

        {/* Language Switcher Dropdown */}
        <div className="relative">
          <button
            id="language-switcher-btn"
            type="button"
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] bg-[#E4ECE0] hover:bg-[#D5E1CF] border border-[#2F5233]/30 text-xs font-bold text-[#2F5233] transition-colors shadow-xs"
            title="ಭಾಷೆ ಬದಲಾಯಿಸಿ / Change Language"
          >
            <Globe size={14} className="text-[#2F5233]" />
            <span>
              {language === 'kn' ? 'ಕನ್ನಡ' : language === 'hi' ? 'हिन्दी' : 'English'}
            </span>
            <ChevronDown size={13} className="text-[#2F5233]" />
          </button>

          {langDropdownOpen && (
            <div
              id="language-dropdown-menu"
              className="absolute right-0 mt-2 w-44 bg-white rounded-[12px] border border-[#DDD9CD] shadow-xl py-1.5 z-50 animate-in fade-in"
            >
              <div className="px-3 py-1 text-[11px] font-bold text-[#5B6660] uppercase tracking-wider border-b border-[#DDD9CD]">
                ಭಾಷೆ / Language
              </div>
              <button
                type="button"
                onClick={() => {
                  setLanguage('kn');
                  setLangDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                  language === 'kn' ? 'bg-[#E4ECE0] text-[#2F5233] font-bold' : 'hover:bg-[#EFEDE6] text-[#1C2321]'
                }`}
              >
                <span>ಕನ್ನಡ (Kannada)</span>
                {language === 'kn' && <Check size={14} className="text-[#2F5233]" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setLanguage('en');
                  setLangDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                  language === 'en' ? 'bg-[#E4ECE0] text-[#2F5233] font-bold' : 'hover:bg-[#EFEDE6] text-[#1C2321]'
                }`}
              >
                <span>English</span>
                {language === 'en' && <Check size={14} className="text-[#2F5233]" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setLanguage('hi');
                  setLangDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                  language === 'hi' ? 'bg-[#E4ECE0] text-[#2F5233] font-bold' : 'hover:bg-[#EFEDE6] text-[#1C2321]'
                }`}
              >
                <span>हिन्दी (Hindi)</span>
                {language === 'hi' && <Check size={14} className="text-[#2F5233]" />}
              </button>
            </div>
          )}
        </div>

        {/* Persona / Role Selector Dropdown */}
        <div className="relative">
          <button
            id="role-switcher-dropdown"
            type="button"
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-[10px] bg-[#EFEDE6] hover:bg-[#DDD9CD]/70 border border-[#DDD9CD] text-xs font-semibold text-[#1C2321] transition-colors shadow-xs"
          >
            <span className="flex items-center gap-1.5">
              {getRoleIcon(currentUser.role)}
              <span className="font-bold">{currentUser.name}</span>
              <span className="text-[#5B6660] capitalize hidden sm:inline">
                ({currentUser.role})
              </span>
            </span>
            <ChevronDown size={14} className="text-[#5B6660]" />
          </button>

          {roleDropdownOpen && (
            <div
              id="role-dropdown-menu"
              className="absolute right-0 mt-2 w-72 bg-white rounded-[12px] border border-[#DDD9CD] shadow-xl py-2 z-50 animate-in fade-in"
            >
              <div className="px-3 py-1.5 text-[11px] font-semibold text-[#5B6660] uppercase tracking-wider border-b border-[#DDD9CD]">
                Switch Persona (§16 User Roles)
              </div>

              <div className="max-h-80 overflow-y-auto py-1">
                {users.map((user) => {
                  const isSelected = user.id === currentUser.id;
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        setCurrentUser(user);
                        onSelectTab('app');
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs transition-colors ${
                        isSelected
                          ? 'bg-[#E4ECE0] text-[#2F5233] font-semibold'
                          : 'hover:bg-[#EFEDE6] text-[#1C2321]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {getRoleIcon(user.role)}
                        <div>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-[11px] text-[#5B6660] capitalize">
                            {user.role} • {user.location.split(',')[0]}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <Check size={14} className="text-[#2F5233]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
