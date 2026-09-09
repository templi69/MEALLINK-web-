import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Search,
  Send,
  Users,
  UtensilsCrossed,
  Bike,
  User,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Clock,
  UserPlus
} from 'lucide-react';
import { Order, ChatMessage, ViewMode, PortalUser } from '../types';
import { saveChatMessageToDb } from '../lib/firestoreSync';

interface RobloxOrderChatProps {
  orders: Order[];
  chatMessages: ChatMessage[];
  currentViewMode: ViewMode;
  currentUser: PortalUser | null;
  onSelectOrder?: (orderId: string) => void;
}

export const RobloxOrderChat: React.FC<RobloxOrderChatProps> = ({
  orders,
  chatMessages,
  currentViewMode,
  currentUser,
}) => {
  // Collapsed / Expanded state (default collapsed / slided down at bottom right as requested)
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [activeRoleOverride, setActiveRoleOverride] = useState<'customer' | 'restaurant' | 'rider' | 'support'>(
    currentViewMode === 'rider'
      ? 'rider'
      : currentViewMode === 'restaurant'
      ? 'restaurant'
      : currentViewMode === 'support' || currentViewMode === 'admin'
      ? 'support'
      : 'customer'
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync role override when viewMode changes
  useEffect(() => {
    if (currentViewMode === 'rider') setActiveRoleOverride('rider');
    else if (currentViewMode === 'restaurant') setActiveRoleOverride('restaurant');
    else if (currentViewMode === 'support' || currentViewMode === 'admin') setActiveRoleOverride('support');
    else setActiveRoleOverride('customer');
  }, [currentViewMode]);

  // Auto-select active order if only one exists or if none selected
  useEffect(() => {
    if (!selectedOrderId && orders.length > 0) {
      // Pick first active or newest order
      setSelectedOrderId(orders[0].id);
    } else if (selectedOrderId && !orders.some((o) => o.id === selectedOrderId)) {
      setSelectedOrderId(orders[0]?.id || null);
    }
  }, [orders, selectedOrderId]);

  // Scroll to bottom of chat when new messages arrive or order changes
  useEffect(() => {
    if (isOpen && selectedOrderId) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, selectedOrderId, chatMessages]);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  // Filter messages for current order
  const orderMessages = selectedOrderId
    ? chatMessages.filter((m) => m.orderId === selectedOrderId)
    : [];

  // Filtered orders list for the search view
  const filteredOrders = orders.filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.restaurantName.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      (o.assignedRider?.name && o.assignedRider.name.toLowerCase().includes(q))
    );
  });

  // Count unread or active orders
  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !selectedOrderId || !selectedOrder) return;

    let senderName = currentUser?.name || 'Customer';
    let senderAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

    if (activeRoleOverride === 'rider') {
      senderName = selectedOrder.assignedRider?.name || 'Partner Rider (Zubair)';
      senderAvatar = selectedOrder.assignedRider?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';
    } else if (activeRoleOverride === 'restaurant') {
      senderName = `${selectedOrder.restaurantName} (Kitchen)`;
      senderAvatar = selectedOrder.restaurantImage || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=150&auto=format&fit=crop&q=80';
    } else if (activeRoleOverride === 'customer') {
      senderName = selectedOrder.customerName || currentUser?.name || 'Ayesha (Customer)';
      senderAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
    } else {
      senderName = currentUser?.name || 'Support Agent';
      senderAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80';
    }

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      orderId: selectedOrderId,
      senderRole: activeRoleOverride,
      senderName,
      senderAvatar,
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (!textToSend) {
      setInputText('');
    }

    await saveChatMessageToDb(newMsg);
  };

  const handleQuickChip = (chipText: string) => {
    handleSendMessage(chipText);
  };

  return (
    <div
      id="roblox-aligned-order-chat"
      className={`fixed bottom-0 right-4 sm:right-6 z-50 transition-all duration-300 ease-in-out font-sans ${
        isOpen ? 'w-[340px] sm:w-[380px] h-[520px] max-h-[85vh]' : 'w-[280px] sm:w-[320px] h-11'
      }`}
    >
      {/* Outer Shell with Roblox-inspired Top-Rounded Card */}
      <div
        className={`w-full h-full flex flex-col rounded-t-2xl shadow-2xl border border-b-0 backdrop-blur-md overflow-hidden transition-colors ${
          isOpen
            ? 'bg-[#181A16] border-[#3B82F6]/60 shadow-[0_-8px_30px_rgba(0,0,0,0.6)]'
            : 'bg-[#161814]/95 border-white/20 hover:border-white/40 cursor-pointer shadow-[0_-4px_20px_rgba(0,0,0,0.5)]'
        }`}
      >
        {/* Top Roblox-Style Header Bar */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`h-11 px-3.5 flex items-center justify-between select-none cursor-pointer transition-colors border-b ${
            isOpen
              ? 'bg-[#1F221D] border-white/10 text-white'
              : 'bg-[#1A1D18] hover:bg-[#22261F] border-white/10 text-white/90'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
              Chat
              {activeOrdersCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.2 bg-[#3B82F6] text-[10px] font-mono font-bold rounded-full text-white min-w-4 h-4">
                  {activeOrdersCount}
                </span>
              )}
            </span>

            {/* Tri-Party Live Indicator */}
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              3-Way Sync
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-white/70">
            {isOpen ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="p-1 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                title="Slide down chat"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-white/60">
                <UserPlus className="w-3.5 h-3.5" />
                <ChevronUp className="w-4 h-4 text-[#3B82F6]" />
              </div>
            )}
          </div>
        </div>

        {/* Expanded View Content */}
        {isOpen && (
          <div className="flex-1 flex flex-col bg-[#141613] overflow-hidden text-sm">
            {/* View A: In Active Order Tri-Party Chat */}
            {selectedOrder ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Order Subheader & Participants */}
                <div className="px-3 py-2 bg-[#1B1E19] border-b border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 overflow-hidden">
                    {orders.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setSelectedOrderId(null)}
                        className="p-1 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors"
                        title="Back to all orders"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <div className="truncate">
                      <div className="font-bold text-white flex items-center gap-1.5 truncate">
                        <span>{selectedOrder.id}</span>
                        <span className="text-[10px] font-normal text-white/50">•</span>
                        <span className="text-white/80 truncate">{selectedOrder.restaurantName}</span>
                      </div>
                      <div className="text-[10px] text-white/60 flex items-center gap-1">
                        <span className="capitalize text-emerald-400 font-mono font-medium">
                          {selectedOrder.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Switcher Dropdown (if multiple orders exist) */}
                  {orders.length > 1 && (
                    <select
                      value={selectedOrderId}
                      onChange={(e) => setSelectedOrderId(e.target.value)}
                      className="bg-[#242921] border border-white/10 text-white/80 rounded px-1.5 py-0.5 text-[10px] focus:outline-hidden"
                    >
                      {orders.map((ord) => (
                        <option key={ord.id} value={ord.id}>
                          {ord.id} ({ord.restaurantName})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* 3-Party Alignment Status Ribbon */}
                <div className="px-3 py-1.5 bg-[#121411] border-b border-white/5 flex items-center justify-between text-[10px] text-white/70">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-emerald-400" title="Customer">
                      <User className="w-3 h-3" />
                      <span className="truncate max-w-[65px]">{selectedOrder.customerName.split(' ')[0]}</span>
                    </span>
                    <span className="flex items-center gap-1 text-amber-400" title="Restaurant Kitchen">
                      <UtensilsCrossed className="w-3 h-3" />
                      <span className="truncate max-w-[70px]">{selectedOrder.restaurantName.split(' ')[0]}</span>
                    </span>
                    <span className="flex items-center gap-1 text-purple-400" title="Rider">
                      <Bike className="w-3 h-3" />
                      <span className="truncate max-w-[70px]">
                        {selectedOrder.assignedRider?.name.split(' ')[0] || 'Seeking...'}
                      </span>
                    </span>
                  </div>
                  <span className="text-white/40 text-[9px] font-mono">Synced</span>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-[#111310] scrollbar-thin">
                  {/* Tri-Party Welcome Notice */}
                  <div className="p-2.5 rounded-lg bg-[#1D201A] border border-white/5 text-center text-[11px] text-white/70 leading-relaxed">
                    <div className="font-bold text-white flex items-center justify-center gap-1 mb-0.5">
                      <Users className="w-3.5 h-3.5 text-[#3B82F6]" />
                      <span>Tri-Party Aligned Communication</span>
                    </div>
                    <span>Customer, Restaurant Kitchen, and Rider are connected in this channel for real-time updates.</span>
                  </div>

                  {/* Message Items */}
                  {orderMessages.map((msg) => {
                    const isCustomer = msg.senderRole === 'customer';
                    const isRestaurant = msg.senderRole === 'restaurant';
                    const isRider = msg.senderRole === 'rider';
                    const isSystem = msg.isSystemNotice || msg.senderRole === 'system';

                    if (isSystem) {
                      return (
                        <div key={msg.id} className="text-center my-1.5">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/60 font-mono">
                            {msg.content}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          msg.senderRole === activeRoleOverride ? 'items-end' : 'items-start'
                        }`}
                      >
                        {/* Sender Label & Role Badge */}
                        <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px]">
                          <span
                            className={`font-semibold capitalize ${
                              isCustomer
                                ? 'text-emerald-400'
                                : isRestaurant
                                ? 'text-amber-400'
                                : isRider
                                ? 'text-purple-400'
                                : 'text-blue-400'
                            }`}
                          >
                            {msg.senderName}
                          </span>
                          <span
                            className={`text-[9px] px-1 py-0.2 rounded-xs font-mono font-medium ${
                              isCustomer
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : isRestaurant
                                ? 'bg-amber-500/20 text-amber-300'
                                : isRider
                                ? 'bg-purple-500/20 text-purple-300'
                                : 'bg-blue-500/20 text-blue-300'
                            }`}
                          >
                            {msg.senderRole}
                          </span>
                          <span className="text-white/40 text-[9px]">{msg.timestamp}</span>
                        </div>

                        {/* Bubble Content */}
                        <div
                          className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-snug break-words ${
                            msg.senderRole === activeRoleOverride
                              ? 'bg-[#2E3329] border border-white/15 text-white rounded-br-xs'
                              : isCustomer
                              ? 'bg-emerald-950/40 border border-emerald-500/20 text-white/95 rounded-bl-xs'
                              : isRestaurant
                              ? 'bg-amber-950/40 border border-amber-500/20 text-white/95 rounded-bl-xs'
                              : 'bg-purple-950/40 border border-purple-500/20 text-white/95 rounded-bl-xs'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick-Action Chips for Fast 1-Tap Updates */}
                <div className="px-2.5 py-1.5 bg-[#171915] border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
                  {activeRoleOverride === 'restaurant' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleQuickChip('🍳 Food is being freshly prepared in the kitchen.')}
                        className="shrink-0 px-2 py-0.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-[10px] text-amber-300 transition-colors"
                      >
                        🍳 Food Preparing
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickChip('📦 Order is packed & ready for pickup on counter!')}
                        className="shrink-0 px-2 py-0.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-[10px] text-amber-300 transition-colors"
                      >
                        📦 Order Packed
                      </button>
                    </>
                  )}

                  {activeRoleOverride === 'rider' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleQuickChip('🛵 I have arrived at the restaurant pickup counter.')}
                        className="shrink-0 px-2 py-0.5 rounded-full bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-[10px] text-purple-300 transition-colors"
                      >
                        🛵 At Restaurant
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickChip('🚀 Picked up package and heading to your location now.')}
                        className="shrink-0 px-2 py-0.5 rounded-full bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-[10px] text-purple-300 transition-colors"
                      >
                        🚀 En Route
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickChip('📍 Arrived outside your delivery address.')}
                        className="shrink-0 px-2 py-0.5 rounded-full bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-[10px] text-purple-300 transition-colors"
                      >
                        📍 Outside Door
                      </button>
                    </>
                  )}

                  {activeRoleOverride === 'customer' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleQuickChip('🔔 Gate code / please ring the main bell.')}
                        className="shrink-0 px-2 py-0.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-[10px] text-emerald-300 transition-colors"
                      >
                        🔔 Gate Code / Bell
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickChip('🙏 Thank you! Please take your time and ride safely.')}
                        className="shrink-0 px-2 py-0.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-[10px] text-emerald-300 transition-colors"
                      >
                        🙏 Ride Safely
                      </button>
                    </>
                  )}
                </div>

                {/* Role Switcher (Allows testing speaking as Customer, Kitchen, or Rider in demo) */}
                <div className="px-3 py-1 bg-[#1A1D17] border-t border-white/5 flex items-center justify-between text-[10px]">
                  <span className="text-white/40">Sending message as:</span>
                  <div className="flex items-center gap-1">
                    {(['customer', 'restaurant', 'rider'] as const).map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setActiveRoleOverride(role)}
                        className={`px-1.5 py-0.5 rounded-xs capitalize font-mono text-[9px] transition-colors ${
                          activeRoleOverride === role
                            ? role === 'customer'
                              ? 'bg-emerald-500 text-black font-bold'
                              : role === 'restaurant'
                              ? 'bg-amber-500 text-black font-bold'
                              : 'bg-purple-500 text-white font-bold'
                            : 'bg-white/5 text-white/50 hover:text-white/80'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="p-2.5 bg-[#1A1D17] border-t border-white/10 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Message ${selectedOrder.restaurantName} & Rider...`}
                    className="flex-1 bg-[#232720] border border-white/10 focus:border-[#3B82F6] rounded-lg px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-2 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-40 disabled:hover:bg-[#3B82F6] text-white rounded-lg transition-colors shrink-0"
                    title="Send message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            ) : (
              /* View B: Order Threads / Search List (Roblox list view) */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Search Bar matching Roblox reference */}
                <div className="p-2.5 border-b border-white/10 bg-[#1A1D18]">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for orders or participants..."
                      className="w-full bg-[#232720] border border-white/10 focus:border-[#3B82F6] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* List of Orders */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-thin">
                  {filteredOrders.length === 0 ? (
                    <div className="p-6 text-center text-white/50 text-xs flex flex-col items-center justify-center h-full">
                      <MessageSquare className="w-8 h-8 text-white/20 mb-2" />
                      <p className="font-medium text-white/70 mb-1">No Active Order Chats</p>
                      <p className="text-[11px] text-white/40 max-w-[200px]">
                        When an order is placed, Customer, Restaurant & Rider will be joined here automatically.
                      </p>
                    </div>
                  ) : (
                    filteredOrders.map((ord) => {
                      const lastMsg = chatMessages
                        .filter((m) => m.orderId === ord.id)
                        .slice(-1)[0];

                      return (
                        <div
                          key={ord.id}
                          onClick={() => setSelectedOrderId(ord.id)}
                          className="p-2.5 rounded-xl bg-[#1B1E19] hover:bg-[#232720] border border-white/5 hover:border-white/15 cursor-pointer transition-colors flex items-center gap-3"
                        >
                          {/* Tri-Party Avatar Ring */}
                          <div className="relative w-9 h-9 shrink-0">
                            <img
                              src={
                                ord.restaurantImage ||
                                'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=100&auto=format&fit=crop&q=60'
                              }
                              alt={ord.restaurantName}
                              className="w-9 h-9 rounded-full object-cover border border-white/20"
                            />
                            {ord.assignedRider && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-purple-600 border border-[#181A16] flex items-center justify-center">
                                <Bike className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}
                          </div>

                          {/* Thread Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-white truncate">{ord.restaurantName}</span>
                              <span className="text-[9px] text-white/40 font-mono">
                                {lastMsg?.timestamp || 'Active'}
                              </span>
                            </div>
                            <p className="text-[11px] text-white/60 truncate mt-0.5">
                              {lastMsg?.content || `Aligned chat for Order #${ord.id}`}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/5 border border-white/10 text-emerald-400 font-mono capitalize">
                                {ord.status.replace(/_/g, ' ')}
                              </span>
                              <span className="text-[9px] text-white/40">
                                Rider: {ord.assignedRider?.name || 'Awaiting bid'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
