import React, { useState } from 'react';
import {
  EcosystemHappiness,
  FuelEngineConfig,
  Order,
  SupportTicket,
  IncidentReport,
  Restaurant,
  Rider
} from '../types';
import {
  ShieldCheck,
  Heart,
  Sliders,
  MapPin,
  Clock,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Sparkles,
  CheckCircle,
  XCircle,
  MessageSquare,
  Activity,
  Flame,
  UserCheck,
  Database,
  Trash2,
  Plus,
  RefreshCw,
  Server
} from 'lucide-react';

interface AdminPortalProps {
  happiness: EcosystemHappiness;
  fuelConfig: FuelEngineConfig;
  orders: Order[];
  tickets: SupportTicket[];
  incidents: IncidentReport[];
  restaurants: Restaurant[];
  riders: Rider[];
  onUpdateFuelConfig: (newConfig: FuelEngineConfig) => void;
  onResolveTicket: (ticketId: string, aiResponse: string) => void;
  onResolveIncident: (incidentId: string) => void;
  onAdminApproveEscalation?: (ticketId: string, approved: boolean, note: string) => void;
  onClearDatabase?: () => void;
  onQuickSeedDemo?: () => void;
  onDeleteRestaurant?: (id: string) => void;
  onDeleteRider?: (id: string) => void;
  onDeleteOrder?: (id: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  happiness,
  fuelConfig,
  orders,
  tickets,
  incidents,
  restaurants,
  riders,
  onUpdateFuelConfig,
  onResolveTicket,
  onResolveIncident,
  onAdminApproveEscalation,
  onClearDatabase,
  onQuickSeedDemo,
  onDeleteRestaurant,
  onDeleteRider,
  onDeleteOrder,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<
    'happiness' | 'fuel' | 'map' | 'fairness' | 'users' | 'escalations' | 'database'
  >('happiness');

  const [adminNote, setAdminNote] = useState('');
  const [isWiping, setIsWiping] = useState(false);
  const [confirmWipeModal, setConfirmWipeModal] = useState(false);

  // Fuel Engine Form state
  const [petrol, setPetrol] = useState(fuelConfig.petrolPrice);
  const [baseKm, setBaseKm] = useState(fuelConfig.basePerKm);
  const [rushMult, setRushMult] = useState(fuelConfig.rushMultiplier);
  const [rainMult, setRainMult] = useState(fuelConfig.rainMultiplier);

  const handleSaveFuelEngine = () => {
    onUpdateFuelConfig({
      petrolPrice: petrol,
      basePerKm: baseKm,
      rushMultiplier: rushMult,
      rainMultiplier: rainMult,
      nightMultiplier: fuelConfig.nightMultiplier,
    });
  };

  const handleExecuteWipe = async () => {
    if (!onClearDatabase) return;
    setIsWiping(true);
    try {
      await onClearDatabase();
      setConfirmWipeModal(false);
    } finally {
      setIsWiping(false);
    }
  };

  // Sample dynamic delivery fee sample calculation
  const sampleDistanceKm = 3.5;
  const sampleFuelAdj = (petrol - 250) * 0.08 * sampleDistanceKm;
  const sampleCalculatedFee = Math.round(
    ((sampleDistanceKm * baseKm) + Math.max(0, sampleFuelAdj)) * rushMult * rainMult
  );

  const escalatedTickets = tickets.filter((t) => t.requiresAdminApproval);

  return (
    <div className="space-y-6 font-editorial-mono">
      {/* Database Quick Actions & Status Strip */}
      <div className="bg-[#0F110E] border border-white/10 rounded-xs p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-[#F5F5F0]">Cloud Firestore Realtime Sync</span>
          <span className="text-white/40">|</span>
          <span className="text-white/60">
            {orders.length} Orders • {riders.length} Riders • {restaurants.length} Shops • {tickets.length} Tickets
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onQuickSeedDemo && (
            <button
              onClick={onQuickSeedDemo}
              className="px-2.5 py-1.5 bg-[#161815] border border-white/20 hover:border-[#FF6B35] text-[#FF6B35] hover:text-white rounded-xs font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>⚡ Onboard Starter Pair</span>
            </button>
          )}

          {onClearDatabase && (
            <button
              onClick={() => setConfirmWipeModal(true)}
              className="px-2.5 py-1.5 bg-rose-950/40 border border-rose-800/40 hover:border-rose-500 text-rose-300 hover:text-white rounded-xs font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Wipe DB</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Clearing Database */}
      {confirmWipeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#161815] border border-rose-500/40 rounded-xs p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-rose-400 border-b border-white/10 pb-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-editorial-serif text-xl font-bold italic text-[#F5F5F0]">
                Clear All Database Records?
              </h3>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              This will wipe all documents in Firestore across:
              <br />
              • <strong className="text-white">orders</strong> ({orders.length} records)
              <br />
              • <strong className="text-white">riders</strong> ({riders.length} records)
              <br />
              • <strong className="text-white">restaurants</strong> ({restaurants.length} records)
              <br />
              • <strong className="text-white">tickets</strong> ({tickets.length} records)
              <br />
              • <strong className="text-white">incidents</strong> ({incidents.length} records)
              <br />
              Base fuel and platform config will remain intact.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                disabled={isWiping}
                onClick={handleExecuteWipe}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isWiping ? 'Wiping Cloud Firestore...' : 'Yes, Wipe Everything'}
              </button>
              <button
                disabled={isWiping}
                onClick={() => setConfirmWipeModal(false)}
                className="px-4 py-2.5 bg-[#0F110E] border border-white/20 text-white/80 hover:text-white font-bold text-xs uppercase rounded-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Top Navigation Sub-Bar */}
      <div className="flex items-center bg-[#0F110E] border border-white/10 text-[#F5F5F0] p-2 rounded-xs gap-2 overflow-x-auto text-xs font-editorial-mono">
        <button
          onClick={() => setActiveAdminTab('happiness')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeAdminTab === 'happiness'
              ? 'bg-[#FF6B35] text-black font-bold shadow-xs'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Happiness</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('fuel')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeAdminTab === 'fuel'
              ? 'bg-[#FF6B35] text-black font-bold shadow-xs'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Fuel Pricing</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('map')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeAdminTab === 'map'
              ? 'bg-[#FF6B35] text-black font-bold shadow-xs'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Ops Map</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('fairness')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeAdminTab === 'fairness'
              ? 'bg-[#FF6B35] text-black font-bold shadow-xs'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Fairness ({incidents.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('users')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeAdminTab === 'users'
              ? 'bg-[#FF6B35] text-black font-bold shadow-xs'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Users ({riders.length + restaurants.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('escalations')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeAdminTab === 'escalations'
              ? 'bg-amber-500 text-black font-bold shadow-xs'
              : 'text-amber-400 hover:text-amber-300'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Escalations ({escalatedTickets.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('database')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeAdminTab === 'database'
              ? 'bg-[#FF6B35] text-black font-bold shadow-xs'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>DB Tools</span>
        </button>
      </div>

      {/* TAB 1: ECOSYSTEM HAPPINESS SCORE */}
      {activeAdminTab === 'happiness' && (
        <div className="space-y-6">
          <div className="bg-[#161815] border border-white/10 rounded-xs p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-editorial-mono font-bold text-[#FF6B35] uppercase tracking-widest">
                  PLATFORM INTEGRITY
                </span>
                <h2 className="text-2xl font-editorial-serif italic font-bold text-[#F5F5F0]">
                  Ecosystem Happiness Index
                </h2>
              </div>

              <div className="text-right font-editorial-mono">
                <span className="text-[9px] uppercase font-bold text-white/40 block">
                  Weighted Score
                </span>
                <span className="text-3xl font-extrabold text-[#FF6B35]">
                  {happiness.overallScore}%
                </span>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed font-editorial-mono">
              <span className="font-bold text-[#F5F5F0]">Formula:</span>{' '}
              <code className="bg-[#0F110E] border border-white/10 px-2 py-1 rounded-xs text-[#FF6B35]">
                Happiness = 0.4(Customer) + 0.3(Rider) + 0.2(Restaurant) + 0.1(Support Quality)
              </code>
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-[#0F110E] border border-white/10 rounded-xs space-y-1">
                <span className="text-[9px] text-white/40 uppercase block">Customer (40%)</span>
                <div className="text-xl font-bold text-[#F5F5F0]">{happiness.customerHappiness}%</div>
              </div>
              <div className="p-3 bg-[#0F110E] border border-white/10 rounded-xs space-y-1">
                <span className="text-[9px] text-white/40 uppercase block">Rider (30%)</span>
                <div className="text-xl font-bold text-[#F5F5F0]">{happiness.riderHappiness}%</div>
              </div>
              <div className="p-3 bg-[#0F110E] border border-white/10 rounded-xs space-y-1">
                <span className="text-[9px] text-white/40 uppercase block">Merchant (20%)</span>
                <div className="text-xl font-bold text-[#F5F5F0]">{happiness.restaurantHappiness}%</div>
              </div>
              <div className="p-3 bg-[#0F110E] border border-white/10 rounded-xs space-y-1">
                <span className="text-[9px] text-white/40 uppercase block">Support SLA (10%)</span>
                <div className="text-xl font-bold text-[#F5F5F0]">{happiness.supportQuality}%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FUEL PRICING ENGINE */}
      {activeAdminTab === 'fuel' && (
        <div className="bg-[#161815] border border-white/10 rounded-xs p-6 space-y-6 shadow-sm">
          <div className="border-b border-white/10 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-editorial-serif italic font-bold text-[#F5F5F0]">
                Dynamic Fuel Engine Configuration
              </h2>
              <p className="text-xs text-white/50 mt-0.5">
                Automatically adjusts rider base delivery fees based on real-time petrol prices and weather conditions.
              </p>
            </div>
            <button
              onClick={handleSaveFuelEngine}
              className="px-4 py-2 bg-[#FF6B35] hover:bg-[#ff7b4b] text-black font-bold text-xs uppercase rounded-xs cursor-pointer"
            >
              Save to Firestore
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-[#0F110E] border border-white/10 rounded-xs space-y-2">
              <label className="text-white/60 font-bold block">Petrol Price (Rs / L)</label>
              <input
                type="number"
                value={petrol}
                onChange={(e) => setPetrol(Number(e.target.value))}
                className="w-full bg-[#161815] border border-white/20 p-2 rounded-xs text-[#F5F5F0] font-bold"
              />
            </div>
            <div className="p-4 bg-[#0F110E] border border-white/10 rounded-xs space-y-2">
              <label className="text-white/60 font-bold block">Base Rate (Rs / Km)</label>
              <input
                type="number"
                value={baseKm}
                onChange={(e) => setBaseKm(Number(e.target.value))}
                className="w-full bg-[#161815] border border-white/20 p-2 rounded-xs text-[#F5F5F0] font-bold"
              />
            </div>
            <div className="p-4 bg-[#0F110E] border border-white/10 rounded-xs space-y-2">
              <label className="text-white/60 font-bold block">Rush Hour Multiplier</label>
              <input
                type="number"
                step="0.05"
                value={rushMult}
                onChange={(e) => setRushMult(Number(e.target.value))}
                className="w-full bg-[#161815] border border-white/20 p-2 rounded-xs text-[#F5F5F0] font-bold"
              />
            </div>
            <div className="p-4 bg-[#0F110E] border border-white/10 rounded-xs space-y-2">
              <label className="text-white/60 font-bold block">Rain / Storm Multiplier</label>
              <input
                type="number"
                step="0.05"
                value={rainMult}
                onChange={(e) => setRainMult(Number(e.target.value))}
                className="w-full bg-[#161815] border border-white/20 p-2 rounded-xs text-[#F5F5F0] font-bold"
              />
            </div>
          </div>

          <div className="p-4 bg-[#0F110E] border border-[#FF6B35]/30 rounded-xs flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-[#F5F5F0] block">Sample Calculation Preview (3.5 km delivery)</span>
              <span className="text-white/50 text-[11px]">Distance × Rate + Fuel Offset × Multipliers</span>
            </div>
            <div className="text-xl font-bold text-[#FF6B35]">
              Base Delivery Fee: Rs. {sampleCalculatedFee}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OPS MAP */}
      {activeAdminTab === 'map' && (
        <div className="bg-[#161815] border border-white/10 rounded-xs p-6 space-y-4">
          <div className="border-b border-white/10 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-editorial-serif italic font-bold text-[#F5F5F0]">
                Lahore Metro Operations Map
              </h2>
              <p className="text-xs text-white/50 mt-0.5">Live fleet GPS nodes and active dispatch density</p>
            </div>
            <span className="text-xs text-[#FF6B35] font-bold">
              {riders.length} Active Riders on Road
            </span>
          </div>

          <div className="h-64 bg-[#0F110E] border border-white/10 rounded-xs relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FF6B35_1px,transparent_1px)] [background-size:16px_16px]" />
            
            {riders.length === 0 ? (
              <div className="text-center text-white/40 text-xs">
                <MapPin className="w-8 h-8 mx-auto text-white/20 mb-1" />
                <p>No riders currently broadcasting GPS coordinates.</p>
              </div>
            ) : (
              riders.map((r, i) => (
                <div
                  key={r.id}
                  className="absolute flex items-center gap-1 bg-[#161815] border border-[#FF6B35] px-2 py-1 rounded-xs text-[10px] font-bold text-[#FF6B35]"
                  style={{ top: `${30 + (i % 3) * 20}%`, left: `${25 + (i % 4) * 20}%` }}
                >
                  <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-ping" />
                  <span>{r.name.split(' ')[0]} ({r.vehicle.split(' ')[0]})</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: FAIRNESS AUDIT */}
      {activeAdminTab === 'fairness' && (
        <div className="bg-[#161815] border border-white/10 rounded-xs p-6 space-y-4 shadow-sm">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-2xl font-editorial-serif italic font-bold text-[#F5F5F0]">
              Fairness Center & Delay Audit
            </h2>
            <p className="text-xs text-white/50 mt-0.5">
              Zero unfair penalties. Reviews kitchen timers and rider GPS notes before taking any action.
            </p>
          </div>

          {incidents.length === 0 ? (
            <div className="p-8 text-center bg-[#0F110E] rounded-xs border border-white/10 text-white/40 text-xs">
              Zero active incidents or dispute reports logged.
            </div>
          ) : (
            <div className="space-y-3">
              {incidents.map((inc) => (
                <div
                  key={inc.id}
                  className="p-4 bg-[#0F110E] border border-white/10 rounded-xs flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[#F5F5F0]">{inc.id}</span>
                      <span className="px-2 py-0.5 bg-[#FF6B35]/10 border border-[#FF6B35]/30 text-[#FF6B35] font-bold rounded-xs">
                        {inc.category}
                      </span>
                    </div>
                    <p className="text-white/70 mt-1">{inc.details}</p>
                    <p className="text-white/40 text-[11px] mt-0.5">
                      Reported by: {inc.reporterName} ({inc.reportedBy})
                    </p>
                  </div>

                  {inc.status === 'under_review' ? (
                    <button
                      onClick={() => onResolveIncident(inc.id)}
                      className="px-3 py-1.5 bg-[#FF6B35] hover:bg-[#ff7b4b] text-black font-bold text-xs uppercase rounded-xs cursor-pointer"
                    >
                      Resolve Incident
                    </button>
                  ) : (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Resolved
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: USER MANAGEMENT */}
      {activeAdminTab === 'users' && (
        <div className="bg-[#161815] border border-white/10 rounded-xs p-6 space-y-6 shadow-sm">
          <div className="border-b border-white/10 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-editorial-serif italic font-bold text-[#F5F5F0]">
                User Management & Verification
              </h2>
              <p className="text-xs text-white/50 mt-0.5">
                Active Partner Merchants & Delivery Riders synced from Cloud Firestore.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-[#FF6B35]/10 text-[#FF6B35] text-xs font-bold rounded-xs border border-[#FF6B35]/30">
              {riders.length + restaurants.length} Active Accounts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Riders */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#FF6B35] uppercase tracking-wider border-b border-white/10 pb-2">
                Delivery Riders ({riders.length})
              </h3>
              {riders.length === 0 ? (
                <div className="p-6 text-center bg-[#0F110E] rounded-xs text-white/40 text-xs">
                  No riders registered in Firestore.
                </div>
              ) : (
                riders.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 bg-[#0F110E] border border-white/10 rounded-xs flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img src={r.avatar} className="w-10 h-10 rounded-xs object-cover border border-white/10" />
                      <div>
                        <span className="font-bold text-[#F5F5F0] block">{r.name}</span>
                        <span className="text-white/50 text-[10px]">{r.vehicle} • Rating {r.rating}</span>
                      </div>
                    </div>
                    {onDeleteRider && (
                      <button
                        onClick={() => onDeleteRider(r.id)}
                        className="p-1.5 text-white/40 hover:text-rose-400 hover:bg-rose-950/40 rounded-xs transition-colors cursor-pointer"
                        title="Delete Rider"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Merchants */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#FF6B35] uppercase tracking-wider border-b border-white/10 pb-2">
                Partner Merchants ({restaurants.length})
              </h3>
              {restaurants.length === 0 ? (
                <div className="p-6 text-center bg-[#0F110E] rounded-xs text-white/40 text-xs">
                  No restaurants registered in Firestore.
                </div>
              ) : (
                restaurants.map((rest) => (
                  <div
                    key={rest.id}
                    className="p-3 bg-[#0F110E] border border-white/10 rounded-xs flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img src={rest.bannerImage} className="w-10 h-10 rounded-xs object-cover border border-white/10" />
                      <div>
                        <span className="font-bold text-[#F5F5F0] block">{rest.name}</span>
                        <span className="text-white/50 text-[10px]">
                          {rest.category} • {rest.commissionRate}% Commission
                        </span>
                      </div>
                    </div>
                    {onDeleteRestaurant && (
                      <button
                        onClick={() => onDeleteRestaurant(rest.id)}
                        className="p-1.5 text-white/40 hover:text-rose-400 hover:bg-rose-950/40 rounded-xs transition-colors cursor-pointer"
                        title="Delete Shop"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SUPPORT ESCALATIONS */}
      {activeAdminTab === 'escalations' && (
        <div className="bg-[#161815] border border-white/10 rounded-xs p-6 space-y-4 shadow-sm">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-2xl font-editorial-serif italic font-bold text-[#F5F5F0]">
              Admin Support Escalations ({escalatedTickets.length})
            </h2>
            <p className="text-xs text-white/50 mt-0.5">
              High-value refunds and dispute overrides requiring Admin authorization.
            </p>
          </div>

          {escalatedTickets.length === 0 ? (
            <div className="p-8 text-center bg-[#0F110E] rounded-xs border border-white/10 text-white/40 text-xs">
              No pending support escalations requiring approval.
            </div>
          ) : (
            <div className="space-y-4">
              {escalatedTickets.map((ticket) => (
                <div key={ticket.id} className="p-4 bg-[#0F110E] border border-amber-500/40 rounded-xs space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400 uppercase">
                      Ticket #{ticket.id} • {ticket.userType}
                    </span>
                    <span className="text-white/40 text-[11px]">{ticket.createdAt}</span>
                  </div>

                  <p className="text-[#F5F5F0] font-medium">{ticket.subject}</p>
                  <p className="text-white/60 text-[11px]">{ticket.message}</p>

                  <div className="p-3 bg-[#161815] border border-white/10 rounded-xs text-[11px] text-amber-200/80">
                    <strong>Reason for Escalation:</strong> {ticket.escalationReason || 'Action requires Admin override'}
                  </div>

                  {ticket.adminApprovalStatus === 'pending' && onAdminApproveEscalation && (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onAdminApproveEscalation(ticket.id, true, 'Approved by Platform Admin')}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase rounded-xs cursor-pointer"
                      >
                        Approve Action
                      </button>
                      <button
                        onClick={() => onAdminApproveEscalation(ticket.id, false, 'Rejected by Platform Admin')}
                        className="px-3 py-1.5 bg-rose-900 hover:bg-rose-800 text-white font-bold uppercase rounded-xs cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {ticket.adminApprovalStatus !== 'pending' && (
                    <span className="text-emerald-400 font-bold block pt-1">
                      Status: {ticket.adminApprovalStatus === 'approved' ? '✓ Approved' : '✗ Rejected'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 7: DATABASE TOOLS & RAW COLLECTIONS */}
      {activeAdminTab === 'database' && (
        <div className="bg-[#161815] border border-white/10 rounded-xs p-6 space-y-6 shadow-sm">
          <div className="border-b border-white/10 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-editorial-serif italic font-bold text-[#F5F5F0]">
                Firestore Database Manager
              </h2>
              <p className="text-xs text-white/50 mt-0.5">
                Real-time collection monitors and wipe controls.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {onQuickSeedDemo && (
                <button
                  onClick={onQuickSeedDemo}
                  className="px-3 py-1.5 bg-[#FF6B35] hover:bg-[#ff7b4b] text-black font-bold text-xs uppercase rounded-xs cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>⚡ Seed Starter Pair</span>
                </button>
              )}
              {onClearDatabase && (
                <button
                  onClick={() => setConfirmWipeModal(true)}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase rounded-xs cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Wipe All Collections</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-4 bg-[#0F110E] border border-white/10 rounded-xs text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-white/40 block">Orders</span>
              <div className="text-2xl font-bold text-[#FF6B35]">{orders.length}</div>
            </div>
            <div className="p-4 bg-[#0F110E] border border-white/10 rounded-xs text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-white/40 block">Riders</span>
              <div className="text-2xl font-bold text-[#FF6B35]">{riders.length}</div>
            </div>
            <div className="p-4 bg-[#0F110E] border border-white/10 rounded-xs text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-white/40 block">Restaurants</span>
              <div className="text-2xl font-bold text-[#FF6B35]">{restaurants.length}</div>
            </div>
            <div className="p-4 bg-[#0F110E] border border-white/10 rounded-xs text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-white/40 block">Tickets</span>
              <div className="text-2xl font-bold text-[#FF6B35]">{tickets.length}</div>
            </div>
            <div className="p-4 bg-[#0F110E] border border-white/10 rounded-xs text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-white/40 block">Incidents</span>
              <div className="text-2xl font-bold text-[#FF6B35]">{incidents.length}</div>
            </div>
          </div>

          {/* Active Orders Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#F5F5F0] uppercase tracking-wider border-b border-white/10 pb-2">
              Active Orders In Firestore ({orders.length})
            </h3>
            {orders.length === 0 ? (
              <div className="p-6 text-center bg-[#0F110E] rounded-xs text-white/40 text-xs">
                No orders currently in the database.
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="p-3 bg-[#0F110E] border border-white/10 rounded-xs flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-[#FF6B35]">#{o.id}</span>
                      <span className="text-white/80 ml-2">{o.restaurantName}</span>
                      <span className="text-white/40 text-[11px] ml-2">→ {o.deliveryAddress}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 bg-[#161815] border border-white/10 text-white/70 text-[10px] font-bold uppercase rounded-xs">
                        {o.status.replace('_', ' ')}
                      </span>
                      {onDeleteOrder && (
                        <button
                          onClick={() => onDeleteOrder(o.id)}
                          className="p-1 text-white/40 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
