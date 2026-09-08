import React from 'react';
import { ViewMode, EcosystemHappiness } from '../types';
import { Utensils, Bike, Store, ShieldCheck, Headphones, SlidersHorizontal, Heart, AlertTriangle, Menu } from 'lucide-react';

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  happiness: EcosystemHappiness;
  onOpenSimulator: () => void;
  onOpenSideMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  happiness,
  onOpenSimulator,
  onOpenSideMenu
}) => {
  const getHappinessBorder = (status: EcosystemHappiness['status']) => {
    switch (status) {
      case 'optimal':
        return 'border-[#FF6B35]/40 text-[#F5F5F0] bg-[#161815]';
      case 'warning':
        return 'border-amber-500/50 text-amber-200 bg-amber-950/30';
      case 'critical':
        return 'border-rose-500/50 text-rose-200 bg-rose-950/30';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0F110E]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Hamburger Menu */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onOpenSideMenu}
              className="p-2 bg-[#161815] hover:bg-[#1f221e] border border-white/10 hover:border-[#FF6B35] rounded-xs text-[#F5F5F0] transition-colors flex items-center gap-1.5"
              title="Open Side Menu - Portals & Access"
            >
              <Menu className="w-5 h-5 text-[#FF6B35]" />
              <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-wider hidden sm:inline">
                Menu
              </span>
            </button>

            <div className="w-8 h-8 bg-[#FF6B35] rounded-xs rotate-45 flex items-center justify-center shrink-0">
              <div className="w-3.5 h-3.5 bg-[#0F110E] rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F5F0] italic">
                  MealLink
                </span>
                <span className="px-2 py-0.5 text-[9px] font-editorial-mono font-bold tracking-widest uppercase bg-[#FF6B35] text-black rounded-xs">
                  5 PORTALS
                </span>
              </div>
              <p className="text-[10px] font-editorial-mono tracking-widest text-white/50 uppercase hidden md:block">
                Customer • Rider • Merchant • Support • Admin
              </p>
            </div>
          </div>


          {/* Viewport Switcher - Editorial Pill Tabs for 5 Portals */}
          <nav className="flex items-center bg-[#161815] p-1 border border-white/10 rounded-xs gap-1">
            <button
              id="nav-btn-customer"
              onClick={() => setViewMode('customer')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xs text-[11px] font-editorial-mono uppercase tracking-wider font-medium transition-all ${
                viewMode === 'customer'
                  ? 'bg-[#FF6B35] text-black font-bold shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Customer</span>
            </button>

            <button
              id="nav-btn-rider"
              onClick={() => setViewMode('rider')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xs text-[11px] font-editorial-mono uppercase tracking-wider font-medium transition-all ${
                viewMode === 'rider'
                  ? 'bg-[#FF6B35] text-black font-bold shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Rider</span>
            </button>

            <button
              id="nav-btn-restaurant"
              onClick={() => setViewMode('restaurant')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xs text-[11px] font-editorial-mono uppercase tracking-wider font-medium transition-all ${
                viewMode === 'restaurant'
                  ? 'bg-[#FF6B35] text-black font-bold shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Merchant</span>
            </button>

            <button
              id="nav-btn-support"
              onClick={() => setViewMode('support')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xs text-[11px] font-editorial-mono uppercase tracking-wider font-medium transition-all ${
                viewMode === 'support'
                  ? 'bg-[#FF6B35] text-black font-bold shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Support Ops</span>
            </button>

            <button
              id="nav-btn-admin"
              onClick={() => setViewMode('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xs text-[11px] font-editorial-mono uppercase tracking-wider font-medium transition-all ${
                viewMode === 'admin'
                  ? 'bg-[#FF6B35] text-black font-bold shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Admin Ops</span>
            </button>
          </nav>

          {/* Signature Metric & Simulator Button */}
          <div className="flex items-center gap-3">
            {/* Ecosystem Happiness Score */}
            <div
              id="happiness-badge"
              className={`hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xs border text-xs font-editorial-mono ${getHappinessBorder(
                happiness.status
              )}`}
              title="Signature Metric: 0.4(Customer) + 0.3(Rider) + 0.2(Restaurant) + 0.1(Support)"
            >
              <Heart className="w-3.5 h-3.5 text-[#FF6B35] fill-[#FF6B35]" />
              <div className="flex flex-col">
                <span className="text-[9px] leading-none text-white/50 font-bold uppercase tracking-widest">
                  HAPPINESS
                </span>
                <span className="font-extrabold text-sm leading-tight text-[#F5F5F0]">
                  {happiness.overallScore}<span className="text-[10px] text-white/40">%</span>
                </span>
              </div>
              {happiness.status !== 'optimal' && (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              )}
            </div>

            {/* Simulation Controls Trigger */}
            <button
              id="btn-open-simulator"
              onClick={onOpenSimulator}
              className="flex items-center gap-2 px-3.5 py-2 border border-white/20 hover:border-[#FF6B35] bg-[#161815] text-[#F5F5F0] hover:text-[#FF6B35] rounded-xs text-[10px] font-editorial-mono uppercase tracking-widest transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span className="hidden sm:inline">Simulator</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

