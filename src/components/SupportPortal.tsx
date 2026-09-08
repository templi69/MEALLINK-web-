import React, { useState } from 'react';
import {
  SupportTicket,
  Order,
  IncidentReport,
  Restaurant,
  Rider
} from '../types';
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  ShieldCheck,
  Search,
  User,
  ArrowUpRight,
  ChevronRight,
  RotateCcw,
  Bot
} from 'lucide-react';

interface SupportPortalProps {
  tickets: SupportTicket[];
  orders: Order[];
  incidents: IncidentReport[];
  restaurants: Restaurant[];
  riders: Rider[];
  onResolveTicket: (id: string, response: string) => void;
  onEscalateTicket: (
    ticketId: string,
    type: 'large_refund' | 'suspend_user' | 'penalty_override' | 'commission_adj',
    amount: number,
    reason: string
  ) => void;
  onCreateTestTicket?: () => void;
}

export const SupportPortal: React.FC<SupportPortalProps> = ({
  tickets,
  orders,
  incidents,
  onResolveTicket,
  onEscalateTicket,
  onCreateTestTicket,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'queue' | 'investigate' | 'escalations'>('queue');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(tickets[0]?.id || null);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [filterType, setFilterType] = useState<'all' | 'customer' | 'rider' | 'restaurant'>('all');
  const [agentReply, setAgentReply] = useState('');
  
  // Escalation Modal Form State
  const [isEscalating, setIsEscalating] = useState(false);
  const [escalationType, setEscalationType] = useState<'large_refund' | 'suspend_user' | 'penalty_override' | 'commission_adj'>('large_refund');
  const [escalationAmount, setEscalationAmount] = useState<number>(750);
  const [escalationReason, setEscalationReason] = useState<string>('');

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];
  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const filteredTickets = tickets.filter((t) => {
    if (filterType === 'all') return true;
    return t.userType === filterType;
  });

  const handleSendResolution = () => {
    if (!selectedTicket || !agentReply.trim()) return;
    onResolveTicket(selectedTicket.id, agentReply);
    setAgentReply('');
  };

  const handleQuickSlaRefund = () => {
    if (!selectedTicket) return;
    const msg = `SLA Auto-Approved (< 2 min): Instant Rs. 200 compensation credit issued to user wallet. Resolved by Support Ops.`;
    onResolveTicket(selectedTicket.id, msg);
  };

  const handleSubmitEscalation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !escalationReason.trim()) return;
    onEscalateTicket(selectedTicket.id, escalationType, escalationAmount, escalationReason);
    setIsEscalating(false);
    setEscalationReason('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-editorial-mono">
      {/* Support Header */}
      <div className="bg-[#161815] border border-white/10 rounded-xs p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#FF6B35] text-black text-[10px] font-bold rounded-xs uppercase tracking-wider">
              COMMAND CENTER
            </span>
            <span className="text-xs text-white/50">Agent: Bilawal Shah (ID #SUP-402)</span>
          </div>
          <h1 className="font-editorial-serif text-3xl font-bold italic text-[#F5F5F0] mt-1">
            Customer Support Ops Portal
          </h1>
          <p className="text-xs text-white/60 mt-0.5">
            Strict &lt; 2 Minute SLA Target • Deep Investigation Logs • Admin Escalation Gateway
          </p>
        </div>

        {/* SLA Status Card */}
        <div className="flex items-center gap-4 bg-[#0F110E] border border-white/10 p-3.5 rounded-xs">
          <div className="text-right">
            <span className="text-[9px] uppercase font-bold text-white/40 block">
              Live SLA Compliance
            </span>
            <span className="text-2xl font-extrabold text-[#FF6B35]">
              99.4%
            </span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div>
            <span className="text-[9px] uppercase font-bold text-white/40 block">
              Avg Response Time
            </span>
            <span className="text-lg font-bold text-[#F5F5F0]">
              48 seconds
            </span>
          </div>
        </div>
      </div>

      {/* Portal Navigation Sub-Tabs */}
      <div className="flex items-center bg-[#0F110E] border border-white/10 p-1.5 rounded-xs gap-2">
        <button
          onClick={() => setActiveSubTab('queue')}
          className={`flex-1 py-2.5 px-3 rounded-xs text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'queue'
              ? 'bg-[#FF6B35] text-black font-bold shadow-xs'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Live Ticket Queue ({tickets.filter(t => t.status !== 'resolved').length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('investigate')}
          className={`flex-1 py-2.5 px-3 rounded-xs text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'investigate'
              ? 'bg-[#FF6B35] text-black font-bold shadow-xs'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Deep Investigation Tools</span>
        </button>

        <button
          onClick={() => setActiveSubTab('escalations')}
          className={`flex-1 py-2.5 px-3 rounded-xs text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'escalations'
              ? 'bg-[#FF6B35] text-black font-bold shadow-xs'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Admin Escalations ({tickets.filter(t => t.requiresAdminApproval).length})</span>
        </button>
      </div>

      {/* TAB 1: LIVE TICKET QUEUE */}
      {activeSubTab === 'queue' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Ticket List Sidebar (5 cols) */}
          <div className="lg:col-span-5 bg-[#161815] border border-white/10 rounded-xs p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-editorial-serif text-lg font-bold italic text-[#F5F5F0]">
                Active SLA Queue
              </h3>
              <div className="flex items-center gap-1 bg-[#0F110E] p-1 border border-white/10 rounded-xs text-[10px]">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2 py-0.5 rounded-xs ${filterType === 'all' ? 'bg-[#FF6B35] text-black font-bold' : 'text-white/50'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('customer')}
                  className={`px-2 py-0.5 rounded-xs ${filterType === 'customer' ? 'bg-[#FF6B35] text-black font-bold' : 'text-white/50'}`}
                >
                  Cust
                </button>
                <button
                  onClick={() => setFilterType('rider')}
                  className={`px-2 py-0.5 rounded-xs ${filterType === 'rider' ? 'bg-[#FF6B35] text-black font-bold' : 'text-white/50'}`}
                >
                  Rider
                </button>
              </div>
            </div>

            <div className="space-y-2.5 max-h-[550px] overflow-y-auto pr-1">
              {filteredTickets.length === 0 ? (
                <div className="p-8 text-center bg-[#0F110E] border border-white/10 rounded-xs space-y-3">
                  <CheckCircle2 className="w-8 h-8 text-[#FF6B35] mx-auto" />
                  <p className="text-xs text-white/50">Ticket queue is completely empty. 100% SLA compliance achieved.</p>
                  {onCreateTestTicket && (
                    <button
                      onClick={onCreateTestTicket}
                      className="px-3 py-1.5 bg-[#FF6B35] hover:bg-[#ff7b4b] text-black font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer"
                    >
                      + Log Test Ticket
                    </button>
                  )}
                </div>
              ) : (
                filteredTickets.map((t) => {
                  const isSelected = selectedTicket?.id === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTicketId(t.id)}
                      className={`p-3.5 border rounded-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#0F110E] border-[#FF6B35] shadow-xs'
                          : 'bg-[#161815] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-[#FF6B35] uppercase">
                          {t.id} • {t.userType}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-[#0F110E] border border-white/10 text-white/60 rounded-xs flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#FF6B35]" />
                          SLA: {t.slaMinutes}m
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-[#F5F5F0] truncate">{t.subject}</h4>
                      <p className="text-[11px] text-white/50 line-clamp-1 mt-0.5">{t.message}</p>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px]">
                        <span className="text-white/40">{t.userName}</span>
                        {t.requiresAdminApproval ? (
                          <span className="text-amber-400 font-bold bg-amber-950/40 border border-amber-500/30 px-1.5 py-0.5 rounded-xs">
                            Escalated to Admin
                          </span>
                        ) : t.status === 'resolved' ? (
                          <span className="text-[#FF6B35] font-bold">Resolved</span>
                        ) : (
                          <span className="text-emerald-400 font-bold">Active SLA</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Ticket Inspector & Action Area (7 cols) */}
          <div className="lg:col-span-7 bg-[#161815] border border-white/10 rounded-xs p-6 space-y-5">
            {selectedTicket ? (
              <>
                {/* Ticket Top Info */}
                <div className="border-b border-white/10 pb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#FF6B35]/10 border border-[#FF6B35]/30 text-[#FF6B35] text-[10px] font-bold uppercase rounded-xs">
                        {selectedTicket.userType} ISSUE
                      </span>
                      <span className="text-xs font-bold text-white/40">ID: {selectedTicket.id}</span>
                    </div>
                    <span className="text-xs text-white/40">{selectedTicket.createdAt}</span>
                  </div>

                  <h2 className="font-editorial-serif text-2xl font-bold italic text-[#F5F5F0]">
                    {selectedTicket.subject}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-white/60">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#FF6B35]" />
                      User: {selectedTicket.userName}
                    </span>
                    <span>•</span>
                    <span>Priority: <strong className="text-[#FF6B35] uppercase">{selectedTicket.priority}</strong></span>
                  </div>
                </div>

                {/* User Message Box */}
                <div className="p-4 bg-[#0F110E] border border-white/10 rounded-xs space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-white/40 block">User Complaint Message</span>
                  <p className="text-xs text-[#F5F5F0] leading-relaxed">{selectedTicket.message}</p>
                </div>

                {/* Existing AI / Agent Response */}
                {selectedTicket.aiResponse && (
                  <div className="p-4 bg-[#0F110E] border border-[#FF6B35]/30 rounded-xs space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-[#FF6B35]" />
                      <span className="text-[10px] uppercase font-bold text-[#FF6B35]">Previous System Response</span>
                    </div>
                    <p className="text-xs text-white/80">{selectedTicket.aiResponse}</p>
                  </div>
                )}

                {/* Admin Escalation Status Alert */}
                {selectedTicket.requiresAdminApproval && (
                  <div className="p-4 bg-amber-950/30 border border-amber-500/40 rounded-xs space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-amber-300 font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>ESCALATED TO ADMIN PORTAL</span>
                    </div>
                    <p className="text-amber-200/80 text-[11px]">
                      Reason: {selectedTicket.escalationReason || 'Action requires Admin authorization'}.
                    </p>
                    <div className="pt-2 border-t border-amber-500/20 text-[11px] font-bold text-amber-300">
                      Status: {selectedTicket.adminApprovalStatus === 'approved' ? '✅ Approved by Admin' : selectedTicket.adminApprovalStatus === 'rejected' ? '❌ Rejected by Admin' : '⏳ Pending Admin Approval'}
                    </div>
                  </div>
                )}

                {/* Support Agent Fast Actions */}
                <div className="p-4 bg-[#0F110E] border border-white/10 rounded-xs space-y-3">
                  <h4 className="text-xs font-bold text-[#F5F5F0] uppercase tracking-wider">
                    Support Agent Action Deck
                  </h4>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={handleQuickSlaRefund}
                      className="p-2.5 bg-[#161815] hover:bg-[#1f221e] border border-white/10 hover:border-[#FF6B35] rounded-xs text-left transition-colors flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4 text-[#FF6B35]" />
                      <div>
                        <span className="font-bold text-[#F5F5F0] block text-[11px]">Issue Rs. 200 Refund</span>
                        <span className="text-[9px] text-white/50">Auto-credit to user wallet</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setIsEscalating(!isEscalating)}
                      className="p-2.5 bg-[#161815] hover:bg-amber-950/30 border border-white/10 hover:border-amber-500/50 rounded-xs text-left transition-colors flex items-center gap-2"
                    >
                      <ArrowUpRight className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="font-bold text-amber-300 block text-[11px]">Escalate to Admin</span>
                        <span className="text-[9px] text-white/50">For large refund or bans</span>
                      </div>
                    </button>
                  </div>

                  {/* Escalation Form Drawer */}
                  {isEscalating && (
                    <form onSubmit={handleSubmitEscalation} className="p-4 bg-[#161815] border border-amber-500/40 rounded-xs space-y-3 mt-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="text-xs font-bold text-amber-300 uppercase">Escalate Ticket to Admin</span>
                        <button type="button" onClick={() => setIsEscalating(false)} className="text-white/40 hover:text-white text-xs">Cancel</button>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-white/60 block mb-1">Escalation Type</label>
                        <select
                          value={escalationType}
                          onChange={(e) => setEscalationType(e.target.value as any)}
                          className="w-full p-2 bg-[#0F110E] border border-white/10 text-xs text-[#F5F5F0] rounded-xs"
                        >
                          <option value="large_refund">Large Refund Request (&gt; Rs. 500)</option>
                          <option value="suspend_user">User Account Suspension / Ban Request</option>
                          <option value="penalty_override">Merchant / Rider Penalty Override</option>
                          <option value="commission_adj">Special Commission Rate Discount</option>
                        </select>
                      </div>

                      {escalationType === 'large_refund' && (
                        <div>
                          <label className="text-[10px] font-bold text-white/60 block mb-1">Refund Amount (Rs.)</label>
                          <input
                            type="number"
                            value={escalationAmount}
                            onChange={(e) => setEscalationAmount(Number(e.target.value))}
                            className="w-full p-2 bg-[#0F110E] border border-white/10 text-xs text-[#F5F5F0] rounded-xs font-bold"
                          />
                        </div>
                      )}

                      <div>
                        <label className="text-[10px] font-bold text-white/60 block mb-1">Investigation Notes & Justification</label>
                        <textarea
                          rows={2}
                          value={escalationReason}
                          onChange={(e) => setEscalationReason(e.target.value)}
                          placeholder="Provide evidence logs or justification for Admin approval..."
                          className="w-full p-2 bg-[#0F110E] border border-white/10 text-xs text-[#F5F5F0] rounded-xs"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                        <span>Submit to Admin Portal for Approval</span>
                      </button>
                    </form>
                  )}
                </div>

                {/* Custom Reply Box */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#F5F5F0] uppercase tracking-wider block">
                    Direct Support Reply
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={agentReply}
                      onChange={(e) => setAgentReply(e.target.value)}
                      placeholder="Type custom response to resolve ticket..."
                      className="flex-1 p-3 bg-[#0F110E] border border-white/10 rounded-xs text-xs text-[#F5F5F0] focus:outline-hidden focus:border-[#FF6B35]"
                    />
                    <button
                      onClick={handleSendResolution}
                      className="px-5 bg-[#FF6B35] hover:bg-[#ff7b4b] text-black font-bold text-xs uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-white/40 text-xs">
                Select a ticket from the queue to investigate.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DEEP INVESTIGATION TOOL */}
      {activeSubTab === 'investigate' && (
        <div className="bg-[#161815] border border-white/10 rounded-xs p-6 space-y-6">
          <div className="border-b border-white/10 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-editorial-serif text-2xl font-bold italic text-[#F5F5F0]">
                Deep Order & GPS Forensic Inspector
              </h2>
              <p className="text-xs text-white/50 mt-0.5">
                Investigate exact timestamps, kitchen prep logs, GPS rider transit pings, and responsibility allocation.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60">Select Order to Inspect:</span>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="p-2 bg-[#0F110E] border border-white/10 text-xs font-bold text-[#F5F5F0] rounded-xs"
              >
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.id} - {o.restaurantName} ({o.customerName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedOrder && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              {/* Order Overview Panel */}
              <div className="p-4 bg-[#0F110E] border border-white/10 rounded-xs space-y-3">
                <span className="text-[10px] font-bold text-[#FF6B35] uppercase tracking-wider block">
                  ORDER METADATA
                </span>

                <div className="space-y-1.5 text-[#F5F5F0]">
                  <div className="flex justify-between">
                    <span className="text-white/50">Order ID:</span>
                    <span className="font-bold">{selectedOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Customer:</span>
                    <span className="font-bold">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Restaurant:</span>
                    <span className="font-bold">{selectedOrder.restaurantName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Assigned Rider:</span>
                    <span className="font-bold">{selectedOrder.assignedRider?.name || 'Unassigned'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Total Amount:</span>
                    <span className="font-bold text-[#FF6B35]">Rs. {selectedOrder.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Responsibility Timeline Logs */}
              <div className="p-4 bg-[#0F110E] border border-white/10 rounded-xs space-y-3">
                <span className="text-[10px] font-bold text-[#FF6B35] uppercase tracking-wider block">
                  RESPONSIBILITY TIMELINE AUDIT
                </span>

                <div className="space-y-2 font-mono text-[11px]">
                  <div className="flex items-center gap-2 text-white/70">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B35]" />
                    <span>Order Placed: 18 mins ago</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B35]" />
                    <span>Kitchen Promise: {selectedOrder.restaurantPromiseMins} mins</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B35]" />
                    <span>Actual Prep Time: {selectedOrder.actualPrepMins || 14} mins</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B35]" />
                    <span>Rider Transit Progress: {selectedOrder.transitProgressPercent}%</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <span className="text-[10px] text-white/40 block uppercase">Calculated Delay Penalty</span>
                  <span className="font-bold text-emerald-400">
                    {selectedOrder.responsibility === 'restaurant' ? '100% Restaurant Responsibility' : 'No delay penalty detected'}
                  </span>
                </div>
              </div>

              {/* GPS Breadcrumb Logs */}
              <div className="p-4 bg-[#0F110E] border border-white/10 rounded-xs space-y-3">
                <span className="text-[10px] font-bold text-[#FF6B35] uppercase tracking-wider block">
                  GPS BREADCRUMB PINGS
                </span>

                <div className="p-3 bg-[#161815] border border-white/10 rounded-xs space-y-2 text-[10px] text-white/70 font-mono">
                  <p>• 18:02:10 - GPS Pin at Restaurant Node (Accuracy: 3m)</p>
                  <p>• 18:08:45 - Rider waiting inside Merchant premises</p>
                  <p>• 18:14:20 - Kitchen marked Order Ready</p>
                  <p>• 18:15:00 - Transit started towards Customer GPS Pin</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ADMIN ESCALATIONS TRACKING */}
      {activeSubTab === 'escalations' && (
        <div className="bg-[#161815] border border-white/10 rounded-xs p-6 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="font-editorial-serif text-2xl font-bold italic text-[#F5F5F0]">
              Support-to-Admin Escalation Tracker
            </h2>
            <p className="text-xs text-white/50 mt-0.5">
              High-privilege actions (large refunds, suspensions, penalty overrides) submitted to Admin Portal for authorization.
            </p>
          </div>

          <div className="space-y-3">
            {tickets.filter((t) => t.requiresAdminApproval).length === 0 ? (
              <div className="p-8 text-center text-white/40 text-xs">
                No active tickets currently escalated to Admin.
              </div>
            ) : (
              tickets
                .filter((t) => t.requiresAdminApproval)
                .map((t) => (
                  <div
                    key={t.id}
                    className="p-4 bg-[#0F110E] border border-white/10 rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#FF6B35]">{t.id}</span>
                        <span className="px-2 py-0.5 bg-[#161815] border border-white/10 text-white/70 rounded-xs text-[10px] uppercase font-bold">
                          Type: {t.escalationType || 'large_refund'}
                        </span>
                      </div>
                      <p className="font-bold text-[#F5F5F0] mt-1">{t.subject}</p>
                      <p className="text-white/50 text-[11px] mt-0.5">Reason: {t.escalationReason}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-white/40 block uppercase">Admin Status</span>
                      {t.adminApprovalStatus === 'approved' ? (
                        <span className="px-3 py-1 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-bold rounded-xs inline-block mt-1">
                          ✅ Approved by Admin
                        </span>
                      ) : t.adminApprovalStatus === 'rejected' ? (
                        <span className="px-3 py-1 bg-rose-950/40 border border-rose-500/40 text-rose-300 font-bold rounded-xs inline-block mt-1">
                          ❌ Rejected by Admin
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-amber-950/40 border border-amber-500/40 text-amber-300 font-bold rounded-xs inline-block mt-1 animate-pulse">
                          ⏳ Pending Admin Authorization
                        </span>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
