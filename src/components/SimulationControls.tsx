import React from 'react';
import { SlidersHorizontal, X, Fuel, Clock, AlertTriangle, MessageSquare, Sparkles } from 'lucide-react';

interface SimulationControlsProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulatePetrolSpike: () => void;
  onSimulateKitchenDelay: () => void;
  onSimulateRiderSos: () => void;
  onSimulateCustomerSlaTicket: () => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  isOpen,
  onClose,
  onSimulatePetrolSpike,
  onSimulateKitchenDelay,
  onSimulateRiderSos,
  onSimulateCustomerSlaTicket,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 font-editorial-mono">
      <div className="bg-[#161815] border border-white/10 rounded-xs max-w-lg w-full p-5 shadow-2xl space-y-4 text-[#F5F5F0]">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#FF6B35]" />
            <h3 className="font-editorial-serif italic font-bold text-[#F5F5F0] text-xl">
              Startup Scenario Simulator
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/40 hover:text-white rounded-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-white/60 font-editorial-mono">
          Test MealLink's core innovations in real-time across all viewports:
        </p>

        <div className="space-y-2.5 text-xs">
          {/* Scenario 1: Petrol Price Surge */}
          <button
            onClick={() => {
              onSimulatePetrolSpike();
              onClose();
            }}
            className="w-full p-3 bg-[#0F110E] hover:bg-[#1f221e] border border-white/10 rounded-xs text-left transition-colors flex items-start gap-3 group"
          >
            <Fuel className="w-5 h-5 text-[#FF6B35] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#F5F5F0] group-hover:text-[#FF6B35] transition-colors block">
                1. Simulate Petrol Price Surge (Rs. 275 → Rs. 295/L)
              </span>
              <span className="text-white/50 text-[11px]">
                Watch the Fuel Engine recalculate base delivery fees across Lahore dynamically.
              </span>
            </div>
          </button>

          {/* Scenario 2: Restaurant Kitchen Delay */}
          <button
            onClick={() => {
              onSimulateKitchenDelay();
              onClose();
            }}
            className="w-full p-3 bg-[#0F110E] hover:bg-[#1f221e] border border-white/10 rounded-xs text-left transition-colors flex items-start gap-3 group"
          >
            <Clock className="w-5 h-5 text-[#FF6B35] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#F5F5F0] group-hover:text-[#FF6B35] transition-colors block">
                2. Simulate Kitchen Delay (+15 mins)
              </span>
              <span className="text-white/50 text-[11px]">
                Tests Responsibility Timeline — verifies delay is attributed 100% to merchant.
              </span>
            </div>
          </button>

          {/* Scenario 3: Rider Emergency SOS */}
          <button
            onClick={() => {
              onSimulateRiderSos();
              onClose();
            }}
            className="w-full p-3 bg-[#0F110E] hover:bg-[#1f221e] border border-white/10 rounded-xs text-left transition-colors flex items-start gap-3 group"
          >
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#F5F5F0] group-hover:text-[#FF6B35] transition-colors block">
                3. Simulate Emergency Incident
              </span>
              <span className="text-white/50 text-[11px]">
                Triggers signature reassurance message: "Relax. Your report has been received..."
              </span>
            </div>
          </button>

          {/* Scenario 4: Customer Missing Item <2min SLA */}
          <button
            onClick={() => {
              onSimulateCustomerSlaTicket();
              onClose();
            }}
            className="w-full p-3 bg-[#0F110E] hover:bg-[#1f221e] border border-white/10 rounded-xs text-left transition-colors flex items-start gap-3 group"
          >
            <MessageSquare className="w-5 h-5 text-[#FF6B35] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#F5F5F0] group-hover:text-[#FF6B35] transition-colors block">
                4. Trigger Missing Item SLA Chat (&lt; 2 min)
              </span>
              <span className="text-white/50 text-[11px]">
                Tests instant support AI resolution & wallet refund credit under SLA guarantee.
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
