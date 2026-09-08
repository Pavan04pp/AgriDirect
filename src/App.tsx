import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BuyerDashboard } from './components/buyer/BuyerDashboard';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { LogisticsDashboard } from './components/logistics/LogisticsDashboard';
import { AdminPanel } from './components/admin/AdminPanel';
import { HowItWorksPage } from './components/public/HowItWorksPage';
import { LandingPage } from './components/public/LandingPage';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { MarketTrendsModal } from './components/trends/MarketTrendsModal';
import {
  Building2,
  Tractor,
  Truck,
  ShieldCheck,
  LayoutDashboard,
  Layers,
  Globe,
  LogIn,
  LogOut,
  X,
  Compass,
  ArrowRight,
  Sparkles,
  BarChart3,
  Sprout
} from 'lucide-react';
import { UserRole } from './types';

const MainAppContent: React.FC = () => {
  const { currentUser, setCurrentUser, users, isAuthenticated, logoutUser } = useApp();
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'app' | 'how-it-works' | 'landing'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [authModalRole, setAuthModalRole] = useState<UserRole | undefined>(undefined);

  // Real-time market trends & ML crop suggestions modal state
  const [trendsModalOpen, setTrendsModalOpen] = useState(false);
  const [trendsModalTab, setTrendsModalTab] = useState<'trends' | 'ml_suggestions'>('trends');

  const handleOpenAuth = (mode: 'login' | 'signup', role?: UserRole) => {
    setAuthModalMode(mode);
    setAuthModalRole(role);
    setAuthModalOpen(true);
  };

  const handleNavigateToRole = (role: UserRole) => {
    // If not authenticated, open auth modal targeted to requested role
    if (!isAuthenticated) {
      handleOpenAuth('signup', role);
      return;
    }
    // If already authenticated, maintain user's assigned role and open their workspace
    setCurrentTab('app');
  };

  const renderActiveRoleView = () => {
    switch (currentUser.role) {
      case 'buyer':
        return <BuyerDashboard />;
      case 'farmer':
        return <FarmerDashboard />;
      case 'logistics':
        return <LogisticsDashboard />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <BuyerDashboard />;
    }
  };

  const getRoleInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'buyer':
        return 'bg-[#C77B2E]';
      case 'farmer':
        return 'bg-[#2F5233]';
      case 'logistics':
        return 'bg-[#3B6FA0]';
      case 'admin':
        return 'bg-[#5B6660]';
      default:
        return 'bg-[#2F5233]';
    }
  };

  const getRoleTitle = (role: UserRole) => {
    switch (role) {
      case 'buyer':
        return 'Commercial Buyer';
      case 'farmer':
        return 'Farmer / FPO';
      case 'logistics':
        return 'Logistics Fleet';
      case 'admin':
        return 'Platform Governance';
      default:
        return 'Platform User';
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F7F6F2] text-[#1C2321] font-sans overflow-hidden antialiased selection:bg-[#E4ECE0] selection:text-[#2F5233]">
      
      {/* Navigation Sidebar (Desktop lg+) */}
      <nav className="w-64 bg-[#1C2321] hidden lg:flex flex-col p-5 text-white shrink-0 justify-between h-full border-r border-[#DDD9CD]/10">
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#2F5233] rounded-[12px] flex items-center justify-center font-bold text-lg text-white font-display shadow-sm">
                🌱
              </div>
              <div>
                <span className="font-bold tracking-tight text-base font-display text-white block leading-none">
                  AGREE DIRECT
                </span>
                <span className="text-[10px] text-[#A0A8A4] font-medium tracking-wide">
                  Agritech Procurement
                </span>
              </div>
            </div>
          </div>

          {/* Primary Navigation */}
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => setCurrentTab('dashboard')}
              className={`w-full p-2.5 rounded-[10px] text-xs font-bold flex items-center gap-3 cursor-pointer transition-colors text-left ${
                currentTab === 'dashboard'
                  ? 'bg-[#2F5233] text-white shadow-xs'
                  : 'text-[#9AA8A0] hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard size={16} />
              <span>Command Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) {
                  handleOpenAuth('login');
                } else {
                  setCurrentTab('app');
                }
              }}
              className={`w-full p-2.5 rounded-[10px] text-xs font-bold flex items-center gap-3 cursor-pointer transition-colors text-left ${
                currentTab === 'app'
                  ? 'bg-[#2F5233] text-white shadow-xs'
                  : 'text-[#9AA8A0] hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass size={16} />
              <div className="flex-1 flex items-center justify-between">
                <span>{getRoleTitle(currentUser.role)} Desk</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D4F]" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab('landing')}
              className={`w-full p-2.5 rounded-[10px] text-xs font-bold flex items-center gap-3 cursor-pointer transition-colors text-left ${
                currentTab === 'landing'
                  ? 'bg-[#2F5233] text-white shadow-xs'
                  : 'text-[#9AA8A0] hover:text-white hover:bg-white/5'
              }`}
            >
              <Globe size={16} />
              <span>Public Home & Board</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab('how-it-works')}
              className={`w-full p-2.5 rounded-[10px] text-xs font-bold flex items-center gap-3 cursor-pointer transition-colors text-left ${
                currentTab === 'how-it-works'
                  ? 'bg-[#2F5233] text-white shadow-xs'
                  : 'text-[#9AA8A0] hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers size={16} />
              <span>Architecture & Logic</span>
            </button>

            {/* Direct Market Trends & Bar Graphs Button */}
            <button
              id="sidebar-trends-btn"
              type="button"
              onClick={() => {
                setTrendsModalTab('trends');
                setTrendsModalOpen(true);
              }}
              className="w-full p-2.5 rounded-[10px] text-xs font-bold flex items-center gap-3 cursor-pointer transition-colors text-left text-[#E4ECE0] hover:text-white hover:bg-white/10 border border-emerald-500/20 bg-emerald-950/30"
              title="View current selling points, product demands, and trade market bar graphs"
            >
              <BarChart3 size={16} className="text-emerald-400" />
              <div className="flex-1 flex items-center justify-between">
                <span>Current Trends</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-extrabold uppercase">
                  Graphs
                </span>
              </div>
            </button>

            {/* Direct ML Farmer Suggestions Button: STRICTLY FOR FARMER OR ADMIN */}
            {(currentUser.role === 'farmer' || currentUser.role === 'admin') && (
              <button
                id="sidebar-ml-btn"
                type="button"
                onClick={() => {
                  setTrendsModalTab('ml_suggestions');
                  setTrendsModalOpen(true);
                }}
                className="w-full p-2.5 rounded-[10px] text-xs font-bold flex items-center gap-3 cursor-pointer transition-colors text-left text-[#F6E7D3] hover:text-white hover:bg-white/10 border border-[#C77B2E]/30 bg-[#C77B2E]/10"
                title="Machine learning suggestions for farmers based on demand"
              >
                <Sparkles size={16} className="text-[#C77B2E]" />
                <div className="flex-1 flex items-center justify-between">
                  <span>Farmer Suggestions</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#C77B2E]/30 text-[#F6E7D3] font-extrabold uppercase">
                    AI Model
                  </span>
                </div>
              </button>
            )}
          </div>

          {/* Active Registered Perspective Status */}
          {isAuthenticated && (
            <div className="mt-6 pt-5 border-t border-white/10">
              <span className="text-[10px] font-bold text-[#A0A8A4] uppercase tracking-wider block mb-2">
                Active Perspective
              </span>
              <div className="p-3 rounded-[10px] bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2">
                  {currentUser.role === 'buyer' && <Building2 size={14} className="text-[#C77B2E]" />}
                  {currentUser.role === 'farmer' && <Tractor size={14} className="text-[#4E9B56]" />}
                  {currentUser.role === 'logistics' && <Truck size={14} className="text-[#5B9BD5]" />}
                  {currentUser.role === 'admin' && <ShieldCheck size={14} className="text-white" />}
                  <span className="text-xs font-bold text-white capitalize">
                    {currentUser.role} Interface
                  </span>
                </div>
                <div className="text-[11px] text-[#A0A8A4] truncate font-medium">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-[#7A8882] truncate">
                  {currentUser.location}
                </div>
                <div className="pt-1">
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70 inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Role Locked • {currentUser.role.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* User Profile / Auth State at Sidebar Bottom */}
          <div className="mt-auto pt-4 border-t border-white/10">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 ${getRoleColor(
                      currentUser.role
                    )} rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs`}
                  >
                    {getRoleInitials(currentUser.name)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold truncate text-white">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-[#A0A8A4] capitalize">
                      {currentUser.role}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    logoutUser();
                    setCurrentTab('landing');
                  }}
                  className="p-1.5 text-[#9AA8A0] hover:text-[#E27D60] rounded-md hover:bg-white/5 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleOpenAuth('login')}
                  className="w-full py-2 px-3 rounded-[8px] bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <LogIn size={14} />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenAuth('signup')}
                  className="w-full py-2 px-3 rounded-[8px] bg-[#2F5233] hover:bg-[#25401F] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Create Account</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-[#1C2321] text-white p-5 flex flex-col justify-between h-full z-10">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-[#2F5233] rounded-[8px] flex items-center justify-center text-sm font-bold">
                    🌱
                  </div>
                  <span className="font-bold tracking-tight text-base font-display text-white">
                    AGREE DIRECT
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#9AA8A0] hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentTab('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-[8px] text-xs font-bold flex items-center gap-2.5 text-left ${
                    currentTab === 'dashboard' ? 'bg-[#2F5233] text-white' : 'text-[#9AA8A0]'
                  }`}
                >
                  <LayoutDashboard size={15} />
                  <span>Command Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentTab('app');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-[8px] text-xs font-bold flex items-center gap-2.5 text-left ${
                    currentTab === 'app' ? 'bg-[#2F5233] text-white' : 'text-[#9AA8A0]'
                  }`}
                >
                  <Compass size={15} />
                  <span>Active Workspace</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentTab('landing');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-[8px] text-xs font-bold flex items-center gap-2.5 text-left ${
                    currentTab === 'landing' ? 'bg-[#2F5233] text-white' : 'text-[#9AA8A0]'
                  }`}
                >
                  <Globe size={15} />
                  <span>Public Home & Demands</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentTab('how-it-works');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-[8px] text-xs font-bold flex items-center gap-2.5 text-left ${
                    currentTab === 'how-it-works' ? 'bg-[#2F5233] text-white' : 'text-[#9AA8A0]'
                  }`}
                >
                  <Layers size={15} />
                  <span>How It Works</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTrendsModalTab('trends');
                    setTrendsModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full p-2.5 rounded-[8px] text-xs font-bold flex items-center gap-2.5 text-left text-emerald-300 bg-emerald-950/40 border border-emerald-500/20"
                >
                  <BarChart3 size={15} />
                  <span>Current Trends (Graphs)</span>
                </button>

                {(currentUser.role === 'farmer' || currentUser.role === 'admin') && (
                  <button
                    type="button"
                    onClick={() => {
                      setTrendsModalTab('ml_suggestions');
                      setTrendsModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full p-2.5 rounded-[8px] text-xs font-bold flex items-center gap-2.5 text-left text-[#F6E7D3] bg-[#C77B2E]/20 border border-[#C77B2E]/30"
                  >
                    <Sparkles size={15} />
                    <span>Farmer Suggestions (ML)</span>
                  </button>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 ${getRoleColor(
                    currentUser.role
                  )} rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0`}
                >
                  {getRoleInitials(currentUser.name)}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{currentUser.name}</div>
                  <div className="text-[10px] text-[#A0A8A4] capitalize">{currentUser.role}</div>
                </div>
              </div>

              {!isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleOpenAuth('login');
                  }}
                  className="text-xs text-[#4E9B56] font-bold"
                >
                  Sign In
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    logoutUser();
                    setMobileMenuOpen(false);
                    setCurrentTab('landing');
                  }}
                  className="text-xs text-[#E27D60] font-bold"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main App Layout Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Global Platform Top Header */}
        <Header
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenAuth={handleOpenAuth}
        />

        {/* Dynamic Page Views */}
        <div className="flex-1 w-full pb-8">
          {currentTab === 'dashboard' && (
            <ExecutiveDashboard
              onNavigateToRole={handleNavigateToRole}
              onOpenAuth={handleOpenAuth}
            />
          )}

          {currentTab === 'landing' && (
            <LandingPage
              onNavigateToApp={() => setCurrentTab('dashboard')}
              onOpenAuth={handleOpenAuth}
            />
          )}

          {currentTab === 'how-it-works' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
              <HowItWorksPage onStartDemo={() => setCurrentTab('dashboard')} />
            </div>
          )}

          {currentTab === 'app' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 animate-in fade-in duration-200">
              {renderActiveRoleView()}
            </div>
          )}
        </div>

        {/* Professional Commercial Agritech Footer */}
        <footer className="bg-[#FFFFFF] border-t border-[#DDD9CD] py-4 px-4 sm:px-8 mt-auto shrink-0">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5B6660]">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-[4px] bg-[#2F5233] text-white flex items-center justify-center font-display font-bold text-[10px]">
                🌱
              </div>
              <span>
                <strong>Agree Direct</strong> • Demand-Driven Agricultural Procurement & Supply Aggregation Network
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span>Zero Middlemen Commission</span>
              <span>•</span>
              <span>Direct Farmgate Escrow Settlement</span>
              <span>•</span>
              <span>Optimized Multi-Stop Freight Routing</span>
            </div>
          </div>
        </footer>
      </main>

      {/* Global Auth Modal for Buyer, Farmer, and Logistics */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        initialRole={authModalRole}
      />

      {/* Global Real-time Agricultural Trends & ML Crop Advisory Modal */}
      <MarketTrendsModal
        isOpen={trendsModalOpen}
        onClose={() => setTrendsModalOpen(false)}
        initialTab={trendsModalTab}
      />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
