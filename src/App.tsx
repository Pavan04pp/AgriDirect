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
import { UserRole } from './types';

const MainAppContent: React.FC = () => {
  const { currentUser, isAuthenticated } = useApp();
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'app' | 'how-it-works' | 'landing'>('dashboard');

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
    if (!isAuthenticated) {
      handleOpenAuth('signup', role);
      return;
    }
    setCurrentTab('app');
  };

  const handleOpenTrends = (tab: 'trends' | 'ml_suggestions') => {
    setTrendsModalTab(tab);
    setTrendsModalOpen(true);
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

  return (
    <div className="min-h-screen w-full bg-[#F6F5F0] text-[#1C2321] font-sans antialiased flex flex-col selection:bg-[#E4ECE0] selection:text-[#2F5233]">
      
      {/* Centered Horizontal Glassmorphic Navigation Bar */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenAuth={handleOpenAuth}
        onOpenTrends={handleOpenTrends}
      />

      {/* Main Page Layout Container (Centered for Desktop & Responsively Balanced) */}
      <main className="flex-1 w-full flex flex-col">
        {currentTab === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full">
            <ExecutiveDashboard
              onNavigateToRole={handleNavigateToRole}
              onOpenAuth={handleOpenAuth}
            />
          </div>
        )}

        {currentTab === 'landing' && (
          <div className="w-full">
            <LandingPage
              onNavigateToApp={() => setCurrentTab('dashboard')}
              onOpenAuth={handleOpenAuth}
            />
          </div>
        )}

        {currentTab === 'how-it-works' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <HowItWorksPage onStartDemo={() => setCurrentTab('dashboard')} />
          </div>
        )}

        {currentTab === 'app' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-in fade-in duration-200">
            {renderActiveRoleView()}
          </div>
        )}
      </main>

      {/* Glassmorphic Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-white/70 py-6 px-4 sm:px-8 mt-auto shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5B6660]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-[8px] bg-[#2F5233] text-white flex items-center justify-center font-display font-bold text-xs shadow-xs">
              🌱
            </div>
            <span>
              <strong className="text-[#1C2321]">Agridirect</strong> • Demand-Driven Agricultural Procurement & Supply Aggregation Network
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#5B6660]">
            <span>Zero Middlemen Commission</span>
            <span>•</span>
            <span>Direct Farmgate Escrow Settlement</span>
            <span>•</span>
            <span>Consolidated Cold-Chain Freight Routing</span>
          </div>
        </div>
      </footer>

      {/* Global Authentication Modal */}
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
