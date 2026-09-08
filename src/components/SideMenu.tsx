import React from 'react';
import { ViewMode, PortalUser } from '../types';
import {
  Utensils,
  Bike,
  Store,
  Headphones,
  ShieldCheck,
  X,
  LogOut,
  User,
  SlidersHorizontal,
  Lock,
  CheckCircle2,
  Database
} from 'lucide-react';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: ViewMode;
  onSelectPortal: (portal: ViewMode) => void;
  authenticatedUsers: Record<ViewMode, PortalUser | null>;
  onLogoutPortal: (portal: ViewMode) => void;
  onOpenSimulations: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  onClose,
  activeView,
  onSelectPortal,
  authenticatedUsers,
  onLogoutPortal,
  onOpenSimulations
}) => {
  if (!isOpen) return null;

  const PORTAL_ITEMS: {
    id: ViewMode;
    label: string;
    description: string;
    icon: React.ReactNode;
    requiresAuth: boolean;
  }[] = [
    {
      id: 'customer',
      label: 'Customer App',
      description: 'Order food, track live GPS rider & bid delivery fees',
      icon: <Utensils className="w-5 h-5 text-[#FF6B35]" />,
      requiresAuth: false
    },
    {
      id: 'rider',
      label: 'Rider Portal',
      description: 'Earnings, dynamic bidding & emergency SOS center',
      icon: <Bike className="w-5 h-5 text-[#FF6B35]" />,
      requiresAuth: true
    },
    {
      id: 'restaurant',
      label: 'Merchant Portal',
      description: 'Kitchen management, prep timers & respect score',
      icon: <Store className="w-5 h-5 text-[#FF6B35]" />,
      requiresAuth: true
    },
    {
      id: 'support',
      label: 'Customer Support Portal',
      description: 'SLA ticket queue, deep investigation & admin escalation',
      icon: <Headphones className="w-5 h-5 text-[#FF6B35]" />,
      requiresAuth: true
    },
    {
      id: 'admin',
      label: 'Admin Command Center',
      description: 'Global operations map, fuel engine & support approval',
      icon: <ShieldCheck className="w-5 h-5 text-[#FF6B35]" />,
      requiresAuth: true
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex justify-start font-editorial-mono">
      <div className="bg-[#161815] border-r border-white/10 w-full max-w-sm h-full p-6 shadow-2xl flex flex-col justify-between text-[#F5F5F0] overflow-y-auto">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial-serif italic font-bold text-2xl text-[#F5F5F0]">
                  MealLink
                </span>
                <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-[#FF6B35] text-black rounded-xs">
                  5 PORTALS
                </span>
              </div>
              <p className="text-[10px] text-white/50 mt-0.5">
                Human-First Food Delivery Ecosystem
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-white/40 hover:text-white rounded-xs transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cloud DB Status Banner */}
          <div className="mb-6 p-3 bg-[#0F110E] border border-emerald-500/30 rounded-xs flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="font-bold text-[#F5F5F0] block text-[11px]">Cloud Firestore Active</span>
                <span className="text-[9px] text-white/50">Real-time sync across portals</span>
              </div>
            </div>
            <span className="text-[9px] px-2 py-0.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold rounded-xs">
              Connected
            </span>
          </div>

          {/* Portals List */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">
              SEPARATE PORTAL ACCESS
            </h4>

            {PORTAL_ITEMS.map((item) => {
              const isActive = activeView === item.id;
              const authUser = authenticatedUsers[item.id];
              const isAuthReady = !item.requiresAuth || !!authUser;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectPortal(item.id);
                    onClose();
                  }}
                  className={`p-3.5 border rounded-xs cursor-pointer transition-all flex items-start justify-between gap-3 group ${
                    isActive
                      ? 'bg-[#0F110E] border-[#FF6B35] shadow-xs'
                      : 'bg-[#161815] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[#0F110E] border border-white/10 rounded-xs mt-0.5 shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-xs ${isActive ? 'text-[#FF6B35]' : 'text-[#F5F5F0] group-hover:text-[#FF6B35]'}`}>
                          {item.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 mt-0.5 leading-snug">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 pt-0.5">
                    {item.requiresAuth ? (
                      authUser ? (
                        <span className="px-2 py-0.5 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-[9px] font-bold rounded-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Logged In
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-950/40 border border-amber-500/40 text-amber-300 text-[9px] font-bold rounded-xs flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-400" />
                          Login
                        </span>
                      )
                    ) : (
                      <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-white/60 text-[9px] font-bold rounded-xs">
                        Public
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <button
            onClick={() => {
              onOpenSimulations();
              onClose();
            }}
            className="w-full py-2.5 px-3 bg-[#0F110E] hover:bg-[#1f221e] border border-white/10 hover:border-[#FF6B35] text-[#F5F5F0] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#FF6B35]" />
            <span>Launch Scenario Simulator</span>
          </button>

          {authenticatedUsers[activeView] && (
            <div className="p-3 bg-[#0F110E] border border-white/10 rounded-xs flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#FF6B35]" />
                <div>
                  <span className="font-bold text-[#F5F5F0] block text-[11px]">
                    {authenticatedUsers[activeView]?.name}
                  </span>
                  <span className="text-[9px] text-white/50 truncate block">
                    {authenticatedUsers[activeView]?.email}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onLogoutPortal(activeView)}
                className="p-1.5 text-white/40 hover:text-rose-400 hover:bg-rose-950/40 rounded-xs transition-colors"
                title="Logout from this portal"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
