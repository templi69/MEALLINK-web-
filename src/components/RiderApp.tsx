import React, { useState } from 'react';
import { Rider, Order, IncidentReport } from '../types';
import {
  Bike,
  Shield,
  AlertOctagon,
  Clock,
  DollarSign,
  Heart,
  CheckCircle,
  MapPin,
  Send,
  AlertTriangle,
  Moon,
  Plus,
  Sparkles,
  Check
} from 'lucide-react';

interface RiderAppProps {
  riders: Rider[];
  availableOrders: Order[];
  activeOrder?: Order;
  incidents: IncidentReport[];
  onSubmitBid: (orderId: string, rider: Rider, proposedFee: number) => void;
  onPickupOrder: (orderId: string) => void;
  onDeliverOrder: (orderId: string) => void;
  onSubmitIncident: (incident: Omit<IncidentReport, 'id' | 'timestamp'>) => void;
  onRiderExplainDelay: (orderId: string, reason: string) => void;
  onRegisterRider: (rider: Rider) => void;
  onQuickSeedDemo?: () => void;
}

export const RiderApp: React.FC<RiderAppProps> = ({
  riders,
  availableOrders,
  activeOrder,
  incidents,
  onSubmitBid,
  onPickupOrder,
  onDeliverOrder,
  onSubmitIncident,
  onRiderExplainDelay,
  onRegisterRider,
  onQuickSeedDemo,
}) => {
  const [selectedRiderId, setSelectedRiderId] = useState<string>(riders[0]?.id || '');
  const [nightMode, setNightMode] = useState(false);
  const [selectedBidFee, setSelectedBidFee] = useState<Record<string, number>>({});
  const [activeSubTab, setActiveSubTab] = useState<'bidding' | 'active' | 'protection' | 'ledger'>('bidding');

  // New Rider Registration Form State
  const [showRegisterForm, setShowRegisterForm] = useState(riders.length === 0);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('+92 312 4490123');
  const [newVehicle, setNewVehicle] = useState('Honda 125 Motorcycle');
  const [newLocation, setNewLocation] = useState('Gulberg / Main Market, Lahore');

  // Explanation Modal & Reassurance State
  const [explanationReason, setExplanationReason] = useState('Restaurant kitchen not ready');
  const [reassurancePopup, setReassurancePopup] = useState<string | null>(null);

  // Misbehavior Report Modal State
  const [reportTarget, setReportTarget] = useState<'restaurant' | 'customer'>('restaurant');
  const [reportDetails, setReportDetails] = useState('');
  const [sosTriggered, setSosTriggered] = useState(false);

  // Current selected active rider
  const currentRider = riders.find((r) => r.id === selectedRiderId) || riders[0];

  const handleRegisterRiderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newRiderRecord: Rider = {
      id: `rider-${Date.now().toString().slice(-6)}`,
      name: newName.trim(),
      phone: newPhone.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      rating: 4.95,
      vehicle: newVehicle,
      deliveriesCompleted: 0,
      earningsToday: 0,
      safetyScore: 99,
      status: 'available',
      currentLocationName: newLocation,
    };

    onRegisterRider(newRiderRecord);
    setSelectedRiderId(newRiderRecord.id);
    setShowRegisterForm(false);
    setNewName('');
  };

  const handleBidClick = (order: Order) => {
    if (!currentRider) return;
    const fee = selectedBidFee[order.id] || order.baseDeliveryFee;
    onSubmitBid(order.id, currentRider, fee);
  };

  const handleSendExplanation = () => {
    if (activeOrder) {
      onRiderExplainDelay(activeOrder.id, explanationReason);
      setReassurancePopup(
        "Relax. Your report has been received in real-time. Focus on your safety and delivery. Our fair timeline system ensures zero penalties for kitchen or traffic delays."
      );
    }
  };

  const handleSosClick = () => {
    if (!currentRider) return;
    setSosTriggered(true);
    onSubmitIncident({
      reportedBy: 'rider',
      reporterName: currentRider.name,
      targetType: 'emergency',
      targetName: 'Road SOS',
      category: 'Immediate Safety Emergency',
      details: `SOS signal sent by rider ${currentRider.name} from current GPS location (${currentRider.currentLocationName}).`,
      status: 'under_review',
      reassuranceSent: true,
    });
  };

  const handleReportMisbehavior = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDetails.trim() || !currentRider) return;

    onSubmitIncident({
      reportedBy: 'rider',
      reporterName: currentRider.name,
      targetType: reportTarget,
      targetName: reportTarget === 'restaurant' ? 'Restaurant Partner' : 'Customer',
      category: reportTarget === 'restaurant' ? 'Rude staff / Seating denial' : 'Customer abuse / Fake pin',
      details: reportDetails,
      status: 'under_review',
      reassuranceSent: true,
    });

    setReportDetails('');
    setReassurancePopup(
      "Your dignity report has been filed into Cloud Firestore. Our support team will investigate and handle the issue fairly."
    );
  };

  // If no riders exist and not showing form
  if (!currentRider) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-[#161815] border border-white/10 rounded-xs p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="w-12 h-12 rounded-xs bg-[#FF6B35]/10 border border-[#FF6B35]/30 flex items-center justify-center text-[#FF6B35]">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-editorial-mono font-bold text-[#FF6B35] uppercase tracking-widest">
                DELIVERY PARTNER NETWORK
              </span>
              <h2 className="font-editorial-serif text-2xl font-bold italic text-[#F5F5F0]">
                Register Delivery Rider Profile
              </h2>
            </div>
          </div>

          <p className="text-xs text-white/60 font-editorial-mono leading-relaxed">
            No delivery riders are currently active in Cloud Firestore. Register a rider profile below to test dynamic InDrive bidding, zero-penalty fair audits, and live delivery tracking in real-time.
          </p>

          <form onSubmit={handleRegisterRiderSubmit} className="space-y-4 font-editorial-mono text-xs">
            <div>
              <label className="block text-white/70 mb-1 font-bold">Rider Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g., Tariq Mehmood"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-[#0F110E] border border-white/10 p-2.5 rounded-xs text-[#F5F5F0] focus:border-[#FF6B35] focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 mb-1 font-bold">Phone Number</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-[#0F110E] border border-white/10 p-2.5 rounded-xs text-[#F5F5F0] focus:border-[#FF6B35] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-bold">Vehicle Type</label>
                <select
                  value={newVehicle}
                  onChange={(e) => setNewVehicle(e.target.value)}
                  className="w-full bg-[#0F110E] border border-white/10 p-2.5 rounded-xs text-[#F5F5F0] focus:border-[#FF6B35] focus:outline-hidden"
                >
                  <option value="Honda 125 Motorcycle">Honda 125 Motorcycle</option>
                  <option value="Yamaha YBR 125">Yamaha YBR 125</option>
                  <option value="Suzuki GS 150">Suzuki GS 150</option>
                  <option value="Electric Scooter">Electric Scooter</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white/70 mb-1 font-bold">Active Hub / Zone</label>
              <input
                type="text"
                required
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full bg-[#0F110E] border border-white/10 p-2.5 rounded-xs text-[#F5F5F0] focus:border-[#FF6B35] focus:outline-hidden"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                className="w-full sm:flex-1 py-3 bg-[#FF6B35] hover:bg-[#ff7b4b] text-black font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Register Rider to Firestore</span>
              </button>

              {onQuickSeedDemo && (
                <button
                  type="button"
                  onClick={onQuickSeedDemo}
                  className="w-full sm:w-auto px-4 py-3 bg-[#0F110E] border border-white/20 hover:border-[#FF6B35] text-white/80 hover:text-white font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#FF6B35]" />
                  <span>⚡ Quick Demo Rider</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`max-w-4xl mx-auto rounded-xs border transition-colors shadow-sm overflow-hidden ${
        nightMode
          ? 'bg-[#050605] border-white/10 text-[#F5F5F0]'
          : 'bg-[#161815] border-white/10 text-[#F5F5F0]'
      }`}
    >
      {/* Rider Header Bar (One-Thumb Optimized) */}
      <div className="bg-[#0F110E] text-[#F5F5F0] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <img
            src={currentRider.avatar}
            alt={currentRider.name}
            className="w-12 h-12 rounded-xs object-cover border border-[#FF6B35]"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-base text-[#F5F5F0]">{currentRider.name}</h2>
              <span className="px-2 py-0.5 bg-[#FF6B35]/10 text-[#FF6B35] text-[10px] font-editorial-mono font-bold rounded-xs border border-[#FF6B35]/30 uppercase">
                PARTNER RIDER
              </span>
            </div>
            <p className="text-xs text-white/50 font-editorial-mono mt-0.5">
              {currentRider.vehicle} • {currentRider.currentLocationName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Night / Battery Saver Mode */}
          <button
            onClick={() => setNightMode(!nightMode)}
            className={`p-2 rounded-xs text-[10px] font-editorial-mono uppercase tracking-wider font-bold flex items-center gap-1 border transition-colors ${
              nightMode
                ? 'bg-[#FF6B35] text-black border-[#FF6B35]'
                : 'bg-[#161815] text-white/70 border-white/10 hover:text-white'
            }`}
            title="Battery Saving Dark Mode"
          >
            <Moon className="w-3.5 h-3.5" />
            <span>OLED Saver</span>
          </button>

          {/* SOS Emergency Button */}
          <button
            onClick={handleSosClick}
            className="px-3.5 py-2 bg-[#FF6B35] hover:bg-[#ff7b4b] text-black font-editorial-mono font-bold text-xs uppercase tracking-wider rounded-xs flex items-center gap-1.5 shadow-md animate-pulse cursor-pointer"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>1-Tap SOS</span>
          </button>

          {/* Add Rider Toggle */}
          <button
            onClick={() => setShowRegisterForm(!showRegisterForm)}
            className="px-3 py-2 bg-[#161815] border border-white/20 hover:border-[#FF6B35] text-white/80 hover:text-white rounded-xs text-xs font-editorial-mono flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span>+ Rider</span>
          </button>
        </div>
      </div>

      {/* Switch Rider Selector */}
      {riders.length > 1 && (
        <div className="bg-[#0F110E] px-4 py-2 border-b border-white/10 flex items-center gap-2 text-xs font-editorial-mono">
          <span className="text-white/40 uppercase text-[10px]">Switch Rider:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {riders.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRiderId(r.id)}
                className={`px-2.5 py-1 rounded-xs border text-[11px] transition-colors ${
                  currentRider.id === r.id
                    ? 'bg-[#FF6B35] text-black font-bold border-[#FF6B35]'
                    : 'bg-[#161815] text-white/60 border-white/10 hover:text-white'
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Inline Register Rider Form */}
      {showRegisterForm && (
        <div className="p-4 bg-[#0F110E] border-b border-[#FF6B35]/30 space-y-3 font-editorial-mono text-xs">
          <h3 className="font-bold text-[#FF6B35] uppercase tracking-wider text-[11px]">
            Register Another Rider to Realtime Network
          </h3>
          <form onSubmit={handleRegisterRiderSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Rider Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="bg-[#161815] border border-white/10 p-2 rounded-xs text-[#F5F5F0] focus:border-[#FF6B35] focus:outline-hidden"
            />
            <input
              type="text"
              required
              placeholder="Vehicle"
              value={newVehicle}
              onChange={(e) => setNewVehicle(e.target.value)}
              className="bg-[#161815] border border-white/10 p-2 rounded-xs text-[#F5F5F0] focus:border-[#FF6B35] focus:outline-hidden"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2 bg-[#FF6B35] hover:bg-[#ff7b4b] text-black font-bold rounded-xs cursor-pointer"
              >
                Save Rider
              </button>
              <button
                type="button"
                onClick={() => setShowRegisterForm(false)}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SOS Alert Banner */}
      {sosTriggered && (
        <div className="bg-rose-950 text-rose-100 p-3 text-xs font-editorial-mono font-semibold flex items-center justify-between border-b border-rose-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-300 animate-bounce" />
            <span>
              EMERGENCY SOS ACTIVE: Safety Team & GPS location dispatched to Firestore. Stay safe!
            </span>
          </div>
          <button
            onClick={() => setSosTriggered(false)}
            className="text-white/70 hover:text-white underline text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Reassurance Toast */}
      {reassurancePopup && (
        <div className="p-4 bg-emerald-950/90 border-b border-emerald-500/40 text-emerald-100 text-xs font-editorial-mono flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold uppercase text-[10px] text-emerald-300 block">
                MEALLINK RIDER WELFARE & PROTECTION
              </span>
              <p className="mt-0.5 leading-relaxed">{reassurancePopup}</p>
            </div>
          </div>
          <button
            onClick={() => setReassurancePopup(null)}
            className="text-emerald-300 hover:text-white text-[11px] underline"
          >
            Close
          </button>
        </div>
      )}

      {/* Rider Navigation Sub-Tabs */}
      <div className="flex items-center bg-[#0F110E] border-b border-white/10 p-1.5 gap-2 font-editorial-mono text-xs">
        <button
          onClick={() => setActiveSubTab('bidding')}
          className={`flex-1 py-2 px-2 rounded-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'bidding'
              ? 'bg-[#FF6B35] text-black font-bold shadow-xs'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Bike className="w-3.5 h-3.5" />
          <span>Live Bids ({availableOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('active')}
          className={`flex-1 py-2 px-2 rounded-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 relative ${
            activeSubTab === 'active'
              ? 'bg-[#FF6B35] text-black font-bold shadow-xs'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Active Order {activeOrder && '●'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('protection')}
          className={`flex-1 py-2 px-2 rounded-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'protection'
              ? 'bg-[#FF6B35] text-black font-bold shadow-xs'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Dignity Desk</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ledger')}
          className={`flex-1 py-2 px-2 rounded-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'ledger'
              ? 'bg-[#FF6B35] text-black font-bold shadow-xs'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Earnings</span>
        </button>
      </div>

      {/* TAB 1: INDRIVE JOBS & DYNAMIC BIDDING */}
      {activeSubTab === 'bidding' && (
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial-serif text-xl font-bold italic text-[#F5F5F0] flex items-center gap-2">
              <Bike className="w-5 h-5 text-[#FF6B35]" />
              Available Delivery Jobs (Dynamic Bidding)
            </h3>
            <span className="text-[10px] font-editorial-mono text-white/50 uppercase">
              Fuel Engine Base Calculated
            </span>
          </div>

          {availableOrders.length === 0 ? (
            <div className="p-10 text-center bg-[#0F110E] rounded-xs border border-white/10 text-white/50 text-xs font-editorial-mono space-y-2">
              <CheckCircle className="w-8 h-8 text-[#FF6B35] mx-auto" />
              <p className="font-bold text-[#F5F5F0] text-sm">No Pending Orders for Bidding</p>
              <p className="text-white/40">When customers place orders from the Customer Portal, they appear here live via Firestore for dynamic bidding!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableOrders.map((ord) => {
                const currentBid = selectedBidFee[ord.id] || ord.baseDeliveryFee;
                const existingBid = ord.riderBids.find((b) => b.riderId === currentRider.id);

                return (
                  <div
                    key={ord.id}
                    className="p-4 bg-[#0F110E] border border-white/10 rounded-xs space-y-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div>
                        <span className="text-[10px] font-editorial-mono font-bold text-[#FF6B35] uppercase">
                          Order #{ord.id}
                        </span>
                        <h4 className="font-bold text-sm text-[#F5F5F0]">{ord.restaurantName}</h4>
                      </div>
                      <div className="text-right font-editorial-mono">
                        <span className="text-[9px] text-white/40 uppercase block">
                          Base Delivery Fee
                        </span>
                        <span className="font-bold text-sm text-[#FF6B35]">
                          Rs. {ord.baseDeliveryFee}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-white/70 font-editorial-mono">
                      <div>
                        <span className="text-white/40 block text-[9px] uppercase">Deliver To:</span>
                        <span className="font-medium text-[#F5F5F0]">{ord.deliveryAddress}</span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[9px] uppercase">Est. Distance:</span>
                        <span className="font-medium text-[#F5F5F0]">3.5 km (~12 mins)</span>
                      </div>
                    </div>

                    {/* Rider Dynamic Bidding Controls */}
                    <div className="p-3 bg-[#161815] border border-white/10 rounded-xs space-y-2">
                      <div className="flex items-center justify-between text-xs font-editorial-mono">
                        <span className="font-bold text-white/80">
                          Your Dynamic Delivery Fee Bid:
                        </span>
                        <span className="font-extrabold text-[#FF6B35] text-sm">
                          Rs. {currentBid}
                        </span>
                      </div>

                      {/* Quick Adjustment Pills */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() =>
                            setSelectedBidFee((prev) => ({
                              ...prev,
                              [ord.id]: ord.baseDeliveryFee,
                            }))
                          }
                          className={`px-3 py-1.5 rounded-xs text-[10px] font-editorial-mono font-bold border transition-colors cursor-pointer ${
                            currentBid === ord.baseDeliveryFee
                              ? 'bg-[#FF6B35] text-black border-[#FF6B35]'
                              : 'bg-[#0F110E] text-white/70 border-white/10 hover:border-white/30'
                          }`}
                        >
                          Base Fee (Rs. {ord.baseDeliveryFee})
                        </button>

                        <button
                          onClick={() =>
                            setSelectedBidFee((prev) => ({
                              ...prev,
                              [ord.id]: ord.baseDeliveryFee + 15,
                            }))
                          }
                          className={`px-3 py-1.5 rounded-xs text-[10px] font-editorial-mono font-bold border transition-colors cursor-pointer ${
                            currentBid === ord.baseDeliveryFee + 15
                              ? 'bg-[#FF6B35] text-black border-[#FF6B35]'
                              : 'bg-[#0F110E] text-white/70 border-white/10 hover:border-white/30'
                          }`}
                        >
                          +Rs. 15 (Rs. {ord.baseDeliveryFee + 15})
                        </button>

                        <button
                          onClick={() =>
                            setSelectedBidFee((prev) => ({
                              ...prev,
                              [ord.id]: ord.baseDeliveryFee + 30,
                            }))
                          }
                          className={`px-3 py-1.5 rounded-xs text-[10px] font-editorial-mono font-bold border transition-colors cursor-pointer ${
                            currentBid === ord.baseDeliveryFee + 30
                              ? 'bg-[#FF6B35] text-black border-[#FF6B35]'
                              : 'bg-[#0F110E] text-white/70 border-white/10 hover:border-white/30'
                          }`}
                        >
                          +Rs. 30 (Rush/Rain)
                        </button>
                      </div>

                      {/* Submit Bid Button */}
                      <button
                        onClick={() => handleBidClick(ord)}
                        className="w-full py-2.5 bg-[#FF6B35] hover:bg-[#ff7b4b] text-black font-editorial-mono font-bold text-xs uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Bike className="w-4 h-4" />
                        <span>
                          {existingBid
                            ? `Update Live Bid to Rs. ${currentBid}`
                            : `Submit Live Bid (Rs. ${currentBid})`}
                        </span>
                      </button>

                      {existingBid && (
                        <p className="text-[10px] text-emerald-400 font-editorial-mono text-center">
                          ✓ Live bid of Rs. {existingBid.proposedFee} submitted! Awaiting customer selection.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ACTIVE ORDER TRACKING & EXECUTION */}
      {activeSubTab === 'active' && (
        <div className="p-4 sm:p-6 space-y-4">
          {!activeOrder ? (
            <div className="p-10 text-center bg-[#0F110E] rounded-xs border border-white/10 text-white/50 text-xs font-editorial-mono space-y-2">
              <Clock className="w-8 h-8 text-[#FF6B35] mx-auto" />
              <p className="font-bold text-[#F5F5F0] text-sm">No Active Delivery Right Now</p>
              <p className="text-white/40">
                Bid on available orders or wait for a customer to accept your bid.
              </p>
            </div>
          ) : (
            <div className="space-y-4 font-editorial-mono">
              <div className="p-5 bg-[#0F110E] border border-white/10 rounded-xs space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#FF6B35] uppercase tracking-widest">
                      ACTIVE ORDER #{activeOrder.id}
                    </span>
                    <h3 className="text-lg font-bold text-[#F5F5F0]">{activeOrder.restaurantName}</h3>
                  </div>
                  <span className="px-2.5 py-1 bg-[#FF6B35]/10 border border-[#FF6B35]/30 text-[#FF6B35] text-[10px] font-bold uppercase rounded-xs">
                    {activeOrder.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#161815] border border-white/10 rounded-xs space-y-1">
                    <span className="text-white/40 block text-[9px] uppercase">Pickup From:</span>
                    <span className="font-bold text-[#F5F5F0]">{activeOrder.restaurantName}</span>
                  </div>
                  <div className="p-3 bg-[#161815] border border-white/10 rounded-xs space-y-1">
                    <span className="text-white/40 block text-[9px] uppercase">Deliver To:</span>
                    <span className="font-bold text-[#F5F5F0]">{activeOrder.deliveryAddress}</span>
                    <p className="text-[10px] text-white/50">Customer: {activeOrder.customerName}</p>
                  </div>
                </div>

                {/* Status-Specific Action Buttons */}
                <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
                  {activeOrder.status === 'preparing' && (
                    <div className="w-full p-3 bg-[#161815] border border-white/10 rounded-xs text-center text-xs text-amber-400">
                      ⏳ Restaurant is preparing the food. You will be alerted when order is ready!
                    </div>
                  )}

                  {activeOrder.status === 'ready_for_pickup' && (
                    <button
                      onClick={() => onPickupOrder(activeOrder.id)}
                      className="w-full py-3 bg-[#FF6B35] hover:bg-[#ff7b4b] text-black font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Check className="w-4 h-4" />
                      <span>Confirm Food Picked Up from Kitchen</span>
                    </button>
                  )}

                  {activeOrder.status === 'in_transit' && (
                    <button
                      onClick={() => onDeliverOrder(activeOrder.id)}
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Mark Delivered to Customer</span>
                    </button>
                  )}

                  {activeOrder.status === 'delivered' && (
                    <div className="w-full p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 rounded-xs text-center text-xs font-bold">
                      ✓ Order Successfully Delivered! Rs. {activeOrder.finalDeliveryFee} added to your ledger.
                    </div>
                  )}
                </div>

                {/* 1-Tap Delay Explanation (Zero Penalty) */}
                {activeOrder.status !== 'delivered' && (
                  <div className="p-4 bg-[#161815] border border-white/10 rounded-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#F5F5F0] flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-[#FF6B35]" />
                        1-Tap Delay Explanation (Zero Penalty Protocol)
                      </span>
                      <span className="text-[10px] text-white/40">Protection Active</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={explanationReason}
                        onChange={(e) => setExplanationReason(e.target.value)}
                        className="flex-1 bg-[#0F110E] border border-white/10 p-2 text-xs text-[#F5F5F0] rounded-xs"
                      >
                        <option value="Restaurant kitchen not ready">Restaurant kitchen not ready</option>
                        <option value="Heavy rain / waterlogged road">Heavy rain / waterlogged road</option>
                        <option value="Traffic congestion / diversion">Traffic congestion / diversion</option>
                        <option value="Customer unreachable on phone">Customer unreachable on phone</option>
                      </select>

                      <button
                        onClick={handleSendExplanation}
                        className="px-3 py-2 bg-[#FF6B35] hover:bg-[#ff7b4b] text-black font-bold text-xs rounded-xs cursor-pointer"
                      >
                        Log Delay Note
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DIGNITY & MISBEHAVIOR REPORTING */}
      {activeSubTab === 'protection' && (
        <div className="p-4 sm:p-6 space-y-6 font-editorial-mono">
          <div className="border-b border-white/10 pb-3">
            <h3 className="font-editorial-serif text-xl font-bold italic text-[#F5F5F0]">
              Rider Dignity & Welfare Center
            </h3>
            <p className="text-xs text-white/50 mt-0.5">
              MealLink strictly protects rider dignity. Zero tolerance for abusive customers or disrespectful kitchen staff.
            </p>
          </div>

          <form onSubmit={handleReportMisbehavior} className="space-y-4 bg-[#0F110E] p-4 rounded-xs border border-white/10 text-xs">
            <span className="font-bold text-[#FF6B35] uppercase block text-[11px]">
              Report Partner Misbehavior or Seating Denial
            </span>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="reportTarget"
                  checked={reportTarget === 'restaurant'}
                  onChange={() => setReportTarget('restaurant')}
                  className="accent-[#FF6B35]"
                />
                <span>Restaurant Staff Misbehavior / Water Denial</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="reportTarget"
                  checked={reportTarget === 'customer'}
                  onChange={() => setReportTarget('customer')}
                  className="accent-[#FF6B35]"
                />
                <span>Customer Verbal Abuse / Fake Location</span>
              </label>
            </div>

            <div>
              <textarea
                rows={3}
                placeholder="Describe what happened. Your report is securely sent to Support Ops for immediate audit..."
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                className="w-full bg-[#161815] border border-white/10 p-2.5 rounded-xs text-[#F5F5F0] focus:border-[#FF6B35] focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2.5 bg-[#FF6B35] hover:bg-[#ff7b4b] text-black font-bold uppercase tracking-wider rounded-xs cursor-pointer shadow-xs"
            >
              Submit Confidential Report
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: EARNINGS & ZERO UNFAIR FINES */}
      {activeSubTab === 'ledger' && (
        <div className="p-4 sm:p-6 space-y-6 font-editorial-mono text-xs">
          <div className="border-b border-white/10 pb-3">
            <h3 className="font-editorial-serif text-xl font-bold italic text-[#F5F5F0]">
              Transparent Earnings & Zero Fines Policy
            </h3>
            <p className="text-xs text-white/50 mt-0.5">
              100% of the customer's delivery fee goes directly to you. MealLink charges 0% commission on rider earnings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[#0F110E] border border-white/10 rounded-xs space-y-1">
              <span className="text-[10px] text-white/40 uppercase block">Deliveries Completed</span>
              <div className="text-2xl font-bold text-[#FF6B35]">{currentRider.deliveriesCompleted}</div>
            </div>

            <div className="p-4 bg-[#0F110E] border border-white/10 rounded-xs space-y-1">
              <span className="text-[10px] text-white/40 uppercase block">Earnings Today</span>
              <div className="text-2xl font-bold text-emerald-400">Rs. {currentRider.earningsToday}</div>
            </div>

            <div className="p-4 bg-[#0F110E] border border-white/10 rounded-xs space-y-1">
              <span className="text-[10px] text-white/40 uppercase block">Arbitrary Fines / Deductions</span>
              <div className="text-2xl font-bold text-emerald-400">Rs. 0 (Guaranteed)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
