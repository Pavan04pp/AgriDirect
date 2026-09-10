import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { UserRole, Language } from '../../types';
import {
  Building2,
  Tractor,
  Truck,
  ShieldAlert,
  ChevronDown,
  Menu,
  X,
  Check,
  Clock,
  Globe,
  LogIn,
  LogOut,
  UserPlus,
  LayoutDashboard,
  Layers,
  Compass,
  BarChart3,
  Sparkles
} from 'lucide-react';

export interface HeaderProps {
  currentTab: 'dashboard' | 'app' | 'how-it-works' | 'landing';
  onSelectTab: (tab: 'dashboard' | 'app' | 'how-it-works' | 'landing') => void;
  onOpenAuth: (mode: 'login' | 'signup', role?: UserRole) => void;
  onOpenTrends?: (tab: 'trends' | 'ml_suggestions') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenAuth,
  onOpenTrends
}) => {
  const {
    currentUser,
    demands,
    getDemandTimer,
    language,
    setLanguage,
    t,
    isAuthenticated,
    logoutUser
  } = useApp();

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check 30m active acceptance countdown for buyer
  const activeDemand = demands.find((d) => d.status === 'RESPONSE_CLOSED' || d.status === 'OPEN') || demands[0];
  const activeTimer = activeDemand ? getDemandTimer(activeDemand.id) : null;
  const timerMins = activeTimer ? Math.floor(activeTimer.remainingSeconds / 60) : 30;
  const timerSecs = activeTimer ? activeTimer.remainingSeconds % 60 : 0;
  const formattedCountdown = `${timerMins.toString().padStart(2, '0')}:${timerSecs.toString().padStart(2, '0')}`;

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'buyer':
        return <Building2 size={15} className="text-[#C77B2E]" />;
      case 'farmer':
        return <Tractor size={15} className="text-[#2F5233]" />;
      case 'logistics':
        return <Truck size={15} className="text-[#3B6FA0]" />;
      case 'admin':
        return <ShieldAlert size={15} className="text-[#5B6660]" />;
    }
  };

  const getRoleBadgeTitle = (role: UserRole) => {
    switch (role) {
      case 'buyer':
        return 'Buyer';
      case 'farmer':
        return 'Farmer';
      case 'logistics':
        return 'Logistics';
      case 'admin':
        return 'Admin';
    }
  };

  const getDeskTitle = (role: UserRole) => {
    switch (role) {
      case 'buyer':
        return 'Buyer Desk';
      case 'farmer':
        return 'Farmer Desk';
      case 'logistics':
        return 'Logistics Fleet';
      case 'admin':
        return 'Governance Desk';
    }
  };

  const navTabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'app' as const,
      label: getDeskTitle(currentUser.role),
      icon: Compass,
      requiresAuth: true
    },
    { id: 'landing' as const, label: 'Public Demands', icon: Globe },
    { id: 'how-it-works' as const, label: 'How It Works', icon: Layers }
  ];

  return (
    <>
      <header
        id="agridirect-navbar-wrapper"
        className="sticky top-2 sm:top-3.5 z-40 w-full px-3 sm:px-6 lg:px-8 transition-all duration-300 pointer-events-none"
      >
        <div
          id="agridirect-navbar"
          className={`max-w-7xl mx-auto pointer-events-auto backdrop-blur-xl border rounded-[22px] sm:rounded-[28px] transition-all duration-300 px-3.5 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-2.5 sm:gap-6 ${
            isScrolled
              ? 'bg-white/95 border-white/90 shadow-[0_12px_40px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.05]'
              : 'bg-white/85 border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.03]'
          }`}
        >
          
          {/* Brand Identity / Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none shrink-0"
            title="Agridirect Homepage"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[12px] sm:rounded-[14px] bg-gradient-to-br from-[#2F5233] to-[#1E3821] text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-md border border-emerald-400/20 shrink-0">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold tracking-tight text-base sm:text-xl font-display text-[#1C2321] leading-none">
                  AGRIDIRECT
                </span>
                <span className="hidden sm:inline-flex text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/80 text-[#2F5233] border border-emerald-300/40 uppercase tracking-wide">
                  Agritech
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-[#5B6660] font-medium tracking-normal hidden sm:block leading-tight">
                Direct Agricultural Clearing
              </span>
            </div>
          </motion.div>

          {/* Centered Desktop Horizontal Navigation Bar with Glassmorphic Pill */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-full bg-[#1C2321]/5 backdrop-blur-md border border-white/80 shadow-inner">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    if (tab.requiresAuth && !isAuthenticated) {
                      onOpenAuth('login');
                      return;
                    }
                    onSelectTab(tab.id);
                  }}
                  className={`relative px-4 py-2 rounded-full text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer z-10 ${
                    isActive ? 'text-white' : 'text-[#5B6660] hover:text-[#1C2321]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-horizontal-tab-pill"
                      className="absolute inset-0 bg-[#2F5233] rounded-full shadow-sm -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <Icon size={15} />
                  <span>{tab.label}</span>
                  {tab.id === 'app' && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? 'bg-emerald-300' : 'bg-[#2F5233]'
                      }`}
                    />
                  )}
                </button>
              );
            })}

            {/* Direct Market Trends (Graphs) Button in Centered Nav */}
            {onOpenTrends && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => onOpenTrends('trends')}
                className="px-3.5 py-2 rounded-full text-xs font-bold text-[#2F5233] hover:bg-emerald-100/60 transition-colors flex items-center gap-1.5 cursor-pointer bg-white/70 border border-emerald-600/20 shadow-xs"
                title="View live APMC spot rates and product demand graphs"
              >
                <BarChart3 size={15} className="text-[#2F5233]" />
                <span>Trends</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-[#2F5233] font-extrabold uppercase">
                  Live
                </span>
              </motion.button>
            )}

            {/* Direct ML Crop Advisory Button (Farmer or Admin only) */}
            {onOpenTrends && (currentUser.role === 'farmer' || currentUser.role === 'admin') && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => onOpenTrends('ml_suggestions')}
                className="px-3.5 py-2 rounded-full text-xs font-bold text-[#C77B2E] hover:bg-amber-100/60 transition-colors flex items-center gap-1.5 cursor-pointer bg-white/70 border border-[#C77B2E]/30 shadow-xs"
                title="Machine learning harvest advice and forward demand contracts"
              >
                <Sparkles size={14} className="text-[#C77B2E]" />
                <span>Crop AI</span>
              </motion.button>
            )}
          </nav>

          {/* Right Action Utilities & Auth Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Buyer 30-Minute Acceptance Countdown Pill */}
            {isAuthenticated && currentUser.role === 'buyer' && currentTab === 'app' && activeTimer && (
              <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-[16px] bg-amber-50/90 border border-amber-300/60 text-xs font-bold text-[#C77B2E] shadow-xs backdrop-blur-sm">
                <Clock size={13} className={activeTimer.isRunning ? 'animate-pulse text-[#C77B2E]' : ''} />
                <span className="text-[11px] font-mono">{formattedCountdown}</span>
                <span className="text-[10px] text-amber-700/80 font-normal">Acceptance</span>
              </div>
            )}

            {/* Language Switcher Dropdown with Framer Motion */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.96 }}
                id="header-lang-btn"
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/90 hover:bg-white border border-[#DDD9CD] text-xs font-bold text-[#2F5233] transition-all shadow-xs backdrop-blur-md cursor-pointer"
                title="Change language / ಭಾಷೆ ಬದಲಾಯಿಸಿ"
              >
                <Globe size={14} className="text-[#2F5233]" />
                <span className="font-semibold">
                  {language === 'kn' ? 'ಕನ್ನಡ' : language === 'hi' ? 'हिन्दी' : 'EN'}
                </span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-44 bg-white/95 backdrop-blur-xl rounded-[20px] border border-white/80 shadow-xl py-2 z-50 overflow-hidden"
                  >
                    <div className="px-3.5 py-1 text-[10px] font-bold text-[#5B6660] uppercase tracking-wider border-b border-gray-100">
                      ಭಾಷೆ / Select Language
                    </div>
                    {[
                      { code: 'kn' as const, label: 'ಕನ್ನಡ (Kannada)' },
                      { code: 'en' as const, label: 'English' },
                      { code: 'hi' as const, label: 'हिन्दी (Hindi)' }
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          language === lang.code
                            ? 'bg-[#E4ECE0] text-[#2F5233] font-bold'
                            : 'hover:bg-[#F6F5F0] text-[#1C2321]'
                        }`}
                      >
                        <span>{lang.label}</span>
                        {language === lang.code && <Check size={14} className="text-[#2F5233]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Authenticated Profile or Login / Sign Up */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-white/80 shadow-xs backdrop-blur-md">
                  <div className="w-7 h-7 rounded-full bg-[#E4ECE0] flex items-center justify-center">
                    {getRoleIcon(currentUser.role)}
                  </div>
                  <div className="text-left leading-tight pr-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-[#1C2321] truncate max-w-[100px] lg:max-w-[130px]">
                        {currentUser.name}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold uppercase tracking-wide ${
                          currentUser.role === 'buyer'
                            ? 'bg-[#F6E7D3] text-[#C77B2E]'
                            : currentUser.role === 'farmer'
                            ? 'bg-[#E4ECE0] text-[#2F5233]'
                            : currentUser.role === 'logistics'
                            ? 'bg-[#EBF3FA] text-[#3B6FA0]'
                            : 'bg-gray-100 text-[#5B6660]'
                        }`}
                      >
                        {getRoleBadgeTitle(currentUser.role)}
                      </span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => {
                    logoutUser();
                    onSelectTab('landing');
                  }}
                  className="p-2 sm:px-3 sm:py-2 rounded-full bg-[#EFEDE6]/90 hover:bg-[#B3412C]/10 border border-[#DDD9CD] hover:border-[#B3412C]/30 text-[#5B6660] hover:text-[#B3412C] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Sign Out"
                >
                  <LogOut size={14} />
                  <span className="hidden md:inline">Sign Out</span>
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="px-2.5 sm:px-3 py-2 min-h-[40px] rounded-full text-xs font-bold text-[#1C2321] hover:bg-white/80 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn size={14} className="text-[#2F5233]" />
                  <span>Sign In</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => onOpenAuth('signup')}
                  className="hidden xs:inline-flex px-3 sm:px-4 py-2 min-h-[40px] rounded-full bg-gradient-to-r from-[#2F5233] to-[#25401F] text-white text-xs font-bold transition-all shadow-sm items-center gap-1.5 cursor-pointer border border-emerald-500/30"
                >
                  <UserPlus size={14} />
                  <span>Register</span>
                </motion.button>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle with 44px touch target */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-11 h-11 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white/95 text-[#1C2321] border border-[#DDD9CD] hover:bg-white transition-colors cursor-pointer shadow-xs shrink-0"
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <Menu size={20} />
            </motion.button>

          </div>
        </div>
      </header>

      {/* Mobile Animated Glassmorphism Slide-Out Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs cursor-pointer"
            />

            {/* Glass Drawer */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="relative ml-auto w-84 max-w-[88vw] h-full bg-white/95 backdrop-blur-2xl border-l border-white/80 p-5 sm:p-6 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto"
            >
              <div>
                {/* Header inside drawer */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-[12px] bg-[#2F5233] text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                      🌱
                    </div>
                    <div>
                      <span className="font-extrabold text-base tracking-tight font-display text-[#1C2321] block leading-tight">
                        AGRIDIRECT
                      </span>
                      <span className="text-[10px] text-[#5B6660]">Direct Clearing Network</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-10 h-10 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Mobile Language Selector Strip in Drawer */}
                <div className="mb-4 p-2.5 rounded-[16px] bg-[#F6F5F0] border border-[#DDD9CD]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#5B6660] mb-1.5 flex items-center gap-1">
                    <Globe size={12} className="text-[#2F5233]" />
                    <span>ಭಾಷೆ / Select Language</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { code: 'kn' as const, label: 'ಕನ್ನಡ' },
                      { code: 'en' as const, label: 'English' },
                      { code: 'hi' as const, label: 'हिन्दी' },
                    ].map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => setLanguage(l.code)}
                        className={`min-h-[38px] py-1.5 px-2 rounded-[10px] text-xs font-bold transition-all text-center cursor-pointer ${
                          language === l.code
                            ? 'bg-[#2F5233] text-white shadow-xs'
                            : 'bg-white text-[#1C2321] hover:bg-white/80 border border-[#DDD9CD]/60'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nav items */}
                <div className="space-y-1.5">
                  {navTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = currentTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          if (tab.requiresAuth && !isAuthenticated) {
                            setMobileMenuOpen(false);
                            onOpenAuth('login');
                            return;
                          }
                          onSelectTab(tab.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full min-h-[44px] p-3 rounded-[16px] text-xs font-bold flex items-center gap-3 transition-colors text-left cursor-pointer ${
                          isActive
                            ? 'bg-[#2F5233] text-white shadow-xs'
                            : 'text-[#5B6660] hover:bg-gray-100 hover:text-[#1C2321]'
                        }`}
                      >
                        <Icon size={16} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}

                  {/* Market Trends (Graphs) */}
                  {onOpenTrends && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenTrends('trends');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full p-3 rounded-[16px] text-xs font-bold flex items-center gap-3 transition-colors text-left bg-emerald-50 text-[#2F5233] border border-emerald-300/40"
                    >
                      <BarChart3 size={16} />
                      <div className="flex-1 flex items-center justify-between">
                        <span>Current Trends (Graphs)</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-200 text-[#2F5233] font-extrabold uppercase">
                          Live
                        </span>
                      </div>
                    </button>
                  )}

                  {/* ML Crop Advisory */}
                  {onOpenTrends && (currentUser.role === 'farmer' || currentUser.role === 'admin') && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenTrends('ml_suggestions');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full p-3 rounded-[16px] text-xs font-bold flex items-center gap-3 transition-colors text-left bg-amber-50 text-[#C77B2E] border border-amber-300/40"
                    >
                      <Sparkles size={16} />
                      <div className="flex-1 flex items-center justify-between">
                        <span>Crop AI Advisory</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-200 text-[#C77B2E] font-extrabold uppercase">
                          ML Model
                        </span>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom drawer user info or sign-in */}
              <div className="pt-5 border-t border-gray-100">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5 p-2 rounded-[14px] bg-gray-50 border border-gray-100">
                      <div className="w-8 h-8 rounded-full bg-[#E4ECE0] flex items-center justify-center">
                        {getRoleIcon(currentUser.role)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-[#1C2321] truncate">
                          {currentUser.name}
                        </div>
                        <div className="text-[10px] text-[#5B6660] capitalize">
                          {currentUser.role} • {currentUser.location}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        logoutUser();
                        setMobileMenuOpen(false);
                        onSelectTab('landing');
                      }}
                      className="w-full py-2.5 rounded-full bg-red-50 hover:bg-red-100 text-[#B3412C] text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-red-200"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenAuth('login');
                      }}
                      className="w-full py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-[#1C2321] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <LogIn size={14} />
                      <span>Sign In</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenAuth('signup');
                      }}
                      className="w-full py-2.5 rounded-full bg-[#2F5233] hover:bg-[#25401F] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <UserPlus size={14} />
                      <span>Create Account</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
