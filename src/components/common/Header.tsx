import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, Language } from '../../types';
import {
  Building2,
  Tractor,
  Truck,
  ShieldAlert,
  ChevronDown,
  Menu,
  Check,
  Clock,
  Globe,
  LogIn,
  LogOut,
  UserPlus,
  LayoutDashboard,
  Layers,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'dashboard' | 'app' | 'how-it-works' | 'landing';
  onSelectTab: (tab: 'dashboard' | 'app' | 'how-it-works' | 'landing') => void;
  onOpenMobileMenu?: () => void;
  onOpenAuth: (mode: 'login' | 'signup', role?: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenMobileMenu,
  onOpenAuth
}) => {
  const {
    currentUser,
    setCurrentUser,
    users,
    demands,
    getDemandTimer,
    language,
    setLanguage,
    t,
    isAuthenticated,
    logoutUser
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
    if (currentTab === 'dashboard') return 'Agritech Command & Operations Dashboard';
    if (currentTab === 'landing') return 'Agree Direct: Agricultural Procurement & Trade';
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
    if (currentTab === 'dashboard') return 'Executive metrics, live APMC mandi spot rates, and rapid actions';
    if (currentTab === 'landing') return t('platform_subtitle');
    if (currentTab === 'how-it-works') return '8-Stage Multi-Factor Evaluation Lifecycle';

    switch (currentUser.role) {
      case 'buyer':
        return 'Processing Response Window Results & 30m Acceptance';
      case 'farmer':
        return language === 'kn' ? 'ಬೆಳೆ ಮಾರಾಟ, ಬೆಲೆ ಸಂಧಾನ ಮತ್ತು ಸಾಗಾಣಿಕೆ ಸಡಿಲಿಕೆ' : 'Direct Produce Sale, Price Range Negotiation & Transit Damage Buffer';
      case 'logistics':
        return 'Multi-Stop Optimized Consolidation Fleet';
      case 'admin':
        return 'Multi-Factor Utility Weights Configuration';
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

      {/* Right Controls: Status, Language, and Role / Auth Switcher */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Remaining Time badge when on buyer view */}
        {isAuthenticated && currentUser.role === 'buyer' && currentTab === 'app' && activeTimer && (
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

        <div className="hidden md:block h-8 w-[1px] bg-[#DDD9CD]" />

        {/* Language Switcher Dropdown */}
        <div className="relative">
          <button
            id="language-switcher-btn"
            type="button"
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] bg-[#E4ECE0] hover:bg-[#D5E1CF] border border-[#2F5233]/30 text-xs font-bold text-[#2F5233] transition-colors shadow-2xs"
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

        {/* Authenticated vs Logged Out Controls */}
        {isAuthenticated ? (
          /* User Profile & Single-Role Account Badge with Sign Out */
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-white border border-[#DDD9CD] shadow-2xs">
              <div className="flex items-center gap-2">
                {getRoleIcon(currentUser.role)}
                <div className="text-left">
                  <div className="flex items-center gap-1.5 leading-tight">
                    <span className="font-bold text-xs text-[#1C2321] truncate max-w-[120px] sm:max-w-none">
                      {currentUser.name}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        currentUser.role === 'buyer'
                          ? 'bg-[#F6E7D3] text-[#C77B2E]'
                          : currentUser.role === 'farmer'
                          ? 'bg-[#E4ECE0] text-[#2F5233]'
                          : currentUser.role === 'logistics'
                          ? 'bg-[#EBF3FA] text-[#3B6FA0]'
                          : 'bg-[#EFEDE6] text-[#5B6660]'
                      }`}
                    >
                      {currentUser.role === 'buyer'
                        ? 'Buyer'
                        : currentUser.role === 'farmer'
                        ? 'Farmer'
                        : currentUser.role === 'logistics'
                        ? 'Logistics'
                        : 'Admin'}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#5B6660] truncate max-w-[160px] hidden sm:block">
                    {currentUser.location}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                logoutUser();
                onSelectTab('landing');
              }}
              title="Sign Out of this account"
              className="px-3 py-2 rounded-[10px] bg-[#EFEDE6] hover:bg-[#B3412C]/10 border border-[#DDD9CD] hover:border-[#B3412C]/30 text-[#5B6660] hover:text-[#B3412C] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        ) : (
          /* Logged Out: Sign In / Register Buttons */
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenAuth('login')}
              className="px-3 py-2 rounded-[10px] text-xs font-bold text-[#1C2321] hover:bg-[#EFEDE6] transition-colors flex items-center gap-1.5"
            >
              <LogIn size={14} className="text-[#2F5233]" />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenAuth('signup')}
              className="px-3.5 py-2 rounded-[10px] bg-[#2F5233] hover:bg-[#25401F] text-white text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <UserPlus size={14} />
              <span>Create Account</span>
            </button>
          </div>
        )}

      </div>
    </header>
  );
};
