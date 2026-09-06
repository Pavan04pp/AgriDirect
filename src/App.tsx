import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { ScenarioTourBar } from './components/common/ScenarioTourBar';
import { BuyerDashboard } from './components/buyer/BuyerDashboard';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { LogisticsDashboard } from './components/logistics/LogisticsDashboard';
import { AdminPanel } from './components/admin/AdminPanel';
import { HowItWorksPage } from './components/public/HowItWorksPage';
import { LandingPage } from './components/public/LandingPage';
import {
  Building2,
  Tractor,
  Truck,
  ShieldCheck,
  Layers,
  HelpCircle,
  Compass,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { UserRole } from './types';

const MainAppContent: React.FC = () => {
  const { currentUser, setCurrentUser, users } = useApp();
  const [currentTab, setCurrentTab] = useState<'app' | 'how-it-works' | 'landing'>('app');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        return 'Institutional Buyer';
      case 'farmer':
        return 'Progressive Producer';
      case 'logistics':
        return 'Logistics Carrier';
      case 'admin':
        return 'Platform Governance';
      default:
        return 'Platform User';
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F7F6F2] text-[#1C2321] font-sans overflow-hidden antialiased selection:bg-[#E4ECE0] selection:text-[#2F5233]">
      
      {/* "Professional Polish" Navigation Sidebar (Desktop lg+) */}
      <nav className="w-64 bg-[#1C2321] hidden lg:flex flex-col p-6 text-white shrink-0 justify-between h-full border-r border-[#DDD9CD]/10">
        <div>
          {/* Logo & Platform Brand */}
          <div className="mb-10 flex items-center gap-3">
            <div className="w-8 h-8 bg-[#2F5233] rounded-md flex items-center justify-center font-bold text-lg text-white font-display shadow-xs">
              E
            </div>
            <span className="font-bold tracking-tight text-xl font-display text-white">
              TEAM ENIGMA
            </span>
          </div>

          {/* Nav Items */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setCurrentTab('app');
              }}
              className={`w-full p-3 rounded-[10px] text-sm font-semibold flex items-center gap-3 cursor-pointer transition-colors text-left ${
                currentTab === 'app'
                  ? 'bg-[#2F5233] text-white shadow-xs'
                  : 'text-[#5B6660] hover:text-white hover:bg-white/5'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  currentTab === 'app' ? 'bg-white opacity-60' : 'bg-current opacity-40'
                }`}
              />
              <span>Active Workspace</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentTab('app');
              }}
              className="w-full p-3 text-[#5B6660] hover:text-white rounded-[10px] text-sm font-semibold flex items-center gap-3 cursor-pointer transition-colors text-left hover:bg-white/5"
            >
              <div className="w-2 h-2 rounded-full bg-current opacity-40" />
              <span>Demand Board</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentTab('how-it-works');
              }}
              className={`w-full p-3 rounded-[10px] text-sm font-semibold flex items-center gap-3 cursor-pointer transition-colors text-left ${
                currentTab === 'how-it-works'
                  ? 'bg-[#2F5233] text-white shadow-xs'
                  : 'text-[#5B6660] hover:text-white hover:bg-white/5'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  currentTab === 'how-it-works' ? 'bg-white opacity-60' : 'bg-current opacity-40'
                }`}
              />
              <span>How It Works</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentTab('landing');
              }}
              className={`w-full p-3 rounded-[10px] text-sm font-semibold flex items-center gap-3 cursor-pointer transition-colors text-left ${
                currentTab === 'landing'
                  ? 'bg-[#2F5233] text-white shadow-xs'
                  : 'text-[#5B6660] hover:text-white hover:bg-white/5'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  currentTab === 'landing' ? 'bg-white opacity-60' : 'bg-current opacity-40'
                }`}
              />
              <span>Public Overview</span>
            </button>
          </div>

          {/* Persona Switcher Buttons in Sidebar */}
          <div className="mt-8 pt-6 border-t border-[#DDD9CD]/15">
            <span className="text-[10px] font-bold text-[#5B6660] uppercase tracking-wider block mb-3">
              Switch Perspective (§16)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  const b = users.find((u) => u.role === 'buyer');
                  if (b) setCurrentUser(b);
                  setCurrentTab('app');
                }}
                className={`px-2.5 py-2 rounded-[8px] text-xs font-semibold text-left transition-colors flex items-center gap-2 ${
                  currentUser.role === 'buyer'
                    ? 'bg-[#C77B2E]/20 text-[#C77B2E] border border-[#C77B2E]/40'
                    : 'text-[#5B6660] hover:text-white hover:bg-white/5'
                }`}
              >
                <Building2 size={13} />
                <span>Buyer</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const f = users.find((u) => u.role === 'farmer');
                  if (f) setCurrentUser(f);
                  setCurrentTab('app');
                }}
                className={`px-2.5 py-2 rounded-[8px] text-xs font-semibold text-left transition-colors flex items-center gap-2 ${
                  currentUser.role === 'farmer'
                    ? 'bg-[#2F5233]/40 text-[#E4ECE0] border border-[#2F5233]'
                    : 'text-[#5B6660] hover:text-white hover:bg-white/5'
                }`}
              >
                <Tractor size={13} />
                <span>Farmer</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const l = users.find((u) => u.role === 'logistics');
                  if (l) setCurrentUser(l);
                  setCurrentTab('app');
                }}
                className={`px-2.5 py-2 rounded-[8px] text-xs font-semibold text-left transition-colors flex items-center gap-2 ${
                  currentUser.role === 'logistics'
                    ? 'bg-[#3B6FA0]/20 text-[#7CA8D4] border border-[#3B6FA0]/40'
                    : 'text-[#5B6660] hover:text-white hover:bg-white/5'
                }`}
              >
                <Truck size={13} />
                <span>Logistics</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const a = users.find((u) => u.role === 'admin');
                  if (a) setCurrentUser(a);
                  setCurrentTab('app');
                }}
                className={`px-2.5 py-2 rounded-[8px] text-xs font-semibold text-left transition-colors flex items-center gap-2 ${
                  currentUser.role === 'admin'
                    ? 'bg-white/15 text-white border border-white/30'
                    : 'text-[#5B6660] hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldCheck size={13} />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* User Card at Sidebar Bottom */}
        <div className="pt-6 border-t border-[#DDD9CD]/20">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 ${getRoleColor(
                currentUser.role
              )} rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-xs`}
            >
              {getRoleInitials(currentUser.name)}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold truncate text-white">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-[#5B6660] uppercase tracking-wider font-semibold">
                {getRoleTitle(currentUser.role)}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer (When Open) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-[#1C2321] text-white p-6 flex flex-col justify-between h-full z-10">
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#2F5233] rounded-md flex items-center justify-center font-bold text-lg text-white">
                    E
                  </div>
                  <span className="font-bold tracking-tight text-xl font-display text-white">
                    TEAM ENIGMA
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#5B6660] hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentTab('app');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full p-3 rounded-[10px] text-sm font-semibold flex items-center gap-3 text-left ${
                    currentTab === 'app' ? 'bg-[#2F5233] text-white' : 'text-[#5B6660]'
                  }`}
                >
                  Active Workspace
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentTab('how-it-works');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full p-3 rounded-[10px] text-sm font-semibold flex items-center gap-3 text-left ${
                    currentTab === 'how-it-works' ? 'bg-[#2F5233] text-white' : 'text-[#5B6660]'
                  }`}
                >
                  How It Works
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentTab('landing');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full p-3 rounded-[10px] text-sm font-semibold flex items-center gap-3 text-left ${
                    currentTab === 'landing' ? 'bg-[#2F5233] text-white' : 'text-[#5B6660]'
                  }`}
                >
                  Public Overview
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-[#DDD9CD]/20 flex items-center gap-3">
              <div
                className={`w-10 h-10 ${getRoleColor(
                  currentUser.role
                )} rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0`}
              >
                {getRoleInitials(currentUser.name)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold truncate text-white">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-[#5B6660] uppercase tracking-wider font-semibold">
                  {getRoleTitle(currentUser.role)}
                </span>
              </div>
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
        />

        {/* Guided Scenario Tour Bar for Evaluator (§21) */}
        <ScenarioTourBar />

        {/* Dynamic Page Views */}
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
          {currentTab === 'landing' && (
            <LandingPage onNavigateToApp={() => setCurrentTab('app')} />
          )}

          {currentTab === 'how-it-works' && (
            <HowItWorksPage onStartDemo={() => setCurrentTab('app')} />
          )}

          {currentTab === 'app' && (
            <div className="animate-in fade-in duration-200">
              {renderActiveRoleView()}
            </div>
          )}
        </div>

        {/* Compliant Platform Footer (§2, §16.1) */}
        <footer className="bg-[#FFFFFF] border-t border-[#DDD9CD] py-4 px-4 sm:px-8 mt-auto shrink-0">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5B6660]">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-[4px] bg-[#2F5233] text-white flex items-center justify-center font-display font-bold text-[10px]">
                E
              </div>
              <span>
                <strong>Team Enigma</strong> • Demand-First Agricultural Procurement Platform
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span>Specification v2 Compliant</span>
              <span>•</span>
              <span>Deterministic Multi-Factor Aggregation</span>
              <span>•</span>
              <span>Prototype AI Decision Support</span>
            </div>
          </div>
        </footer>
      </main>

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
