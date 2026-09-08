import React, { useState } from 'react';
import { Restaurant, Order, MenuItem, RiderBid, SupportTicket } from '../types';
import {
  Search,
  ShoppingCart,
  Clock,
  Star,
  Bike,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Send,
  MapPin,
  Check,
  Plus,
  Minus,
  Store,
  Navigation,
  Radio
} from 'lucide-react';

interface CustomerAppProps {
  restaurants: Restaurant[];
  orders: Order[];
  onPlaceOrder: (
    restaurant: Restaurant,
    cartItems: { item: MenuItem; quantity: number }[],
    deliveryAddress: string
  ) => void;
  onAcceptBid: (orderId: string, bid: RiderBid) => void;
  onQuickSeedDemo?: () => void;
  onSimulateRiderBid?: (orderId: string) => void;
  onSubmitTicket?: (ticket: Omit<SupportTicket, 'id' | 'createdAt'>) => void;
}

export const CustomerApp: React.FC<CustomerAppProps> = ({
  restaurants,
  orders,
  onPlaceOrder,
  onAcceptBid,
  onQuickSeedDemo,
  onSimulateRiderBid,
  onSubmitTicket,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestId, setSelectedRestId] = useState<string>(restaurants[0]?.id || '');
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [address, setAddress] = useState('House 42, Block B, Model Town, Lahore');
  const [activeTab, setActiveTab] = useState<'explore' | 'track' | 'support'>('explore');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Support Chat State
  const [chatMessages, setChatMessages] = useState<
    { sender: 'user' | 'support'; text: string; time: string; category?: string }[]
  >([
    {
      sender: 'support',
      text: 'Hello! I am your MealLink A-Level Support Assistant. We guarantee responses in < 2 minutes. How can I help with your order today?',
      time: 'Just now',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Active restaurant selection
  const currentRestaurant = restaurants.find((r) => r.id === selectedRestId) || restaurants[0];

  // Active order selection
  const activeOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  // Cart operations
  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map((i) =>
          i.item.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter((i) => i.item.id !== itemId);
    });
  };

  const subtotal = cart.reduce((sum, i) => sum + i.item.price * i.quantity, 0);

  const handleCheckout = () => {
    if (!currentRestaurant || cart.length === 0) return;
    onPlaceOrder(currentRestaurant, cart, address);
    setCart([]);
    setActiveTab('track');
  };

  // Support chat handler
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsAiThinking(true);

    if (onSubmitTicket) {
      onSubmitTicket({
        userType: 'customer',
        userName: 'Ayesha Siddiqui',
        subject: textToSend.slice(0, 45) + (textToSend.length > 45 ? '...' : ''),
        message: textToSend,
        priority: 'high',
        status: 'open',
        slaMinutes: 2,
        relatedOrderId: activeOrder?.id,
      });
    }

    try {
      const response = await fetch('/api/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          userType: 'customer',
          orderContext: activeOrder ? { id: activeOrder.id, status: activeOrder.status, restaurant: activeOrder.restaurantName } : undefined
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'support',
            text: data.reply || 'Your ticket has been logged into Support Ops with < 2 min SLA guarantee.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error('Fallback support');
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'support',
          text: 'MealLink SLA Support: Your inquiry has been prioritized in real-time. A support representative will resolve this within 2 minutes.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation Sub-Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-4 gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-4 py-2 rounded-xs text-xs font-editorial-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'explore'
                ? 'bg-[#FF6B35] text-black font-bold shadow-sm'
                : 'bg-[#161815] text-white/70 hover:text-white border border-white/10'
            }`}
          >
            Explore & Order
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`px-4 py-2 rounded-xs text-xs font-editorial-mono uppercase tracking-wider transition-all relative cursor-pointer ${
              activeTab === 'track'
                ? 'bg-[#FF6B35] text-black font-bold shadow-sm'
                : 'bg-[#161815] text-white/70 hover:text-white border border-white/10'
            }`}
          >
            <span>Live Tracking</span>
            {orders.length > 0 && (
              <span className="ml-2 bg-white text-black text-[10px] px-1.5 py-0.2 rounded-xs font-extrabold font-editorial-mono">
                {orders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`px-4 py-2 rounded-xs text-xs font-editorial-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'support'
                ? 'bg-[#FF6B35] text-black font-bold shadow-sm'
                : 'bg-[#161815] text-white/70 hover:text-white border border-white/10'
            }`}
          >
            Support SLA (&lt;2min)
          </button>
        </div>

        {/* Address Location Bar */}
        <div className="flex items-center gap-2 text-xs bg-[#161815] border border-white/10 px-3 py-1.5 rounded-xs text-[#F5F5F0]">
          <MapPin className="w-3.5 h-3.5 text-[#FF6B35]" />
          <span className="font-editorial-mono text-[10px] uppercase tracking-wider text-white/40">Deliver to:</span>
          <span className="font-medium text-[#F5F5F0] truncate max-w-[220px]">
            {address}
          </span>
        </div>
      </div>

      {/* TAB 1: EXPLORE & ORDER */}
      {activeTab === 'explore' && (
        <div>
          {restaurants.length === 0 ? (
            <div className="bg-[#161815] border border-white/10 rounded-xs p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-xs bg-[#0F110E] border border-white/10 flex items-center justify-center mx-auto text-[#FF6B35]">
                <Store className="w-7 h-7" />
              </div>
              <h3 className="font-editorial-serif text-2xl font-bold italic text-[#F5F5F0]">
                No Merchants Active in Cloud Firestore
              </h3>
              <p className="text-xs text-white/50 max-w-md mx-auto font-editorial-mono leading-relaxed">
                The database is clean and completely clear of mock records. You can register your own shop from the <strong>Merchant Portal</strong> in the side menu, or click below to onboard a live starter shop & rider in real-time.
              </p>
              {onQuickSeedDemo && (
                <button
                  onClick={onQuickSeedDemo}
                  className="px-5 py-3 bg-[#FF6B35] hover:bg-[#ff7b4b] text-black font-editorial-mono font-bold text-xs uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>⚡ Onboard Starter Shop & Delivery Partner</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Restaurant List & Search */}
              <div className="lg:col-span-7 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search biryani, zinger burgers, woodfire pizza..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#161815] border border-white/10 rounded-xs text-xs text-[#F5F5F0] focus:outline-hidden focus:border-[#FF6B35] placeholder:text-white/30 font-editorial-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {restaurants
                    .filter(
                      (r) =>
                        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        r.category.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((rest) => (
                      <div
                        key={rest.id}
                        onClick={() => setSelectedRestId(rest.id)}
                        className={`cursor-pointer rounded-xs border transition-all overflow-hidden bg-[#161815] ${
                          currentRestaurant?.id === rest.id
                            ? 'border-[#FF6B35] shadow-lg ring-1 ring-[#FF6B35]/30'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="h-32 w-full overflow-hidden relative">
                          <img
                            src={rest.bannerImage}
                            alt={rest.name}
                            className="w-full h-full object-cover opacity-90 transition-transform duration-500 hover:scale-105"
                          />
                          <div className="absolute top-2 right-2 bg-[#0F110E]/90 backdrop-blur-xs px-2 py-0.5 rounded-xs text-[10px] font-editorial-mono font-bold text-[#F5F5F0] flex items-center gap-1 border border-white/10">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            {rest.rating}
                          </div>
                          <div className="absolute bottom-2 left-2 bg-[#0F110E]/90 backdrop-blur-xs text-[#F5F5F0] px-2 py-0.5 rounded-xs text-[10px] font-editorial-mono font-semibold flex items-center gap-1 border border-[#FF6B35]/40">
                            <ShieldCheck className="w-3 h-3 text-[#FF6B35]" />
                            Respect: {rest.respectScore}%
                          </div>
                        </div>

                        <div className="p-3.5 space-y-1">
                          <h3 className="font-editorial-serif text-lg font-bold text-[#F5F5F0] leading-tight">
                            {rest.name}
                          </h3>
                          <div className="flex items-center justify-between text-xs text-white/50 font-editorial-mono pt-1">
                            <span>{rest.category}</span>
                            <span className="flex items-center gap-1 text-white/70">
                              <Clock className="w-3 h-3 text-[#FF6B35]" />
                              {rest.deliveryTimeMins} mins
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Restaurant Menu & Cart Drawer */}
              <div className="lg:col-span-5 space-y-4">
                {currentRestaurant && (
                  <div className="bg-[#161815] border border-white/10 rounded-xs p-5 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <h2 className="font-editorial-serif text-xl font-bold text-[#F5F5F0] italic">
                          {currentRestaurant.name}
                        </h2>
                        <p className="text-xs text-white/50 font-editorial-mono mt-0.5">
                          {currentRestaurant.address}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 bg-[#FF6B35]/10 text-[#FF6B35] text-[10px] font-editorial-mono uppercase tracking-widest font-bold rounded-xs border border-[#FF6B35]/30">
                        {currentRestaurant.commissionRate}% Capped Fee
                      </span>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                      {currentRestaurant.menuItems.map((item) => {
                        const inCart = cart.find((i) => i.item.id === item.id);
                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 bg-[#0F110E] rounded-xs border border-white/10"
                          >
                            <div className="flex-1 pr-3">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-[#F5F5F0] text-xs">
                                  {item.name}
                                </span>
                                {item.popular && (
                                  <span className="bg-[#FF6B35] text-black text-[9px] font-editorial-mono px-1.5 py-0.2 rounded-xs font-bold uppercase">
                                    POPULAR
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-white/50 line-clamp-1 mt-0.5">
                                {item.description}
                              </p>
                              <span className="font-editorial-mono font-bold text-[#FF6B35] text-xs mt-1 block">
                                Rs. {item.price}
                              </span>
                            </div>

                            {inCart ? (
                              <div className="flex items-center bg-[#161815] border border-white/20 rounded-xs p-1">
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="p-1 text-white/70 hover:text-white cursor-pointer"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="px-2 text-xs font-editorial-mono font-bold text-[#F5F5F0]">
                                  {inCart.quantity}
                                </span>
                                <button
                                  onClick={() => addToCart(item)}
                                  className="p-1 text-white/70 hover:text-white cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(item)}
                                className="px-3 py-1.5 bg-[#FF6B35] hover:bg-[#ff7b4b] text-black rounded-xs font-editorial-mono font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                Add
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Cart Summary */}
                    <div className="border-t border-white/10 pt-4 space-y-3">
                      <div className="flex items-center justify-between text-xs font-editorial-mono">
                        <span className="text-white/60">Cart Items:</span>
                        <span className="font-bold text-[#F5F5F0]">
                          {cart.reduce((s, i) => s + i.quantity, 0)} items (Rs. {subtotal})
                        </span>
                      </div>

                      <div className="p-3 bg-[#0F110E] border border-white/10 rounded-xs space-y-1.5 font-editorial-mono">
                        <div className="flex items-center justify-between text-white/80 font-bold">
                          <span className="flex items-center gap-1.5 text-xs">
                            <Bike className="w-3.5 h-3.5 text-[#FF6B35]" />
                            InDrive Dynamic Rider Bidding
                          </span>
                          <span>Base Fee ~ Rs. 90</span>
                        </div>
                        <p className="text-[11px] text-white/50 leading-relaxed pt-0.5">
                          When you place your order, nearby riders submit dynamic delivery bids in real-time. You choose the rider you like!
                        </p>
                      </div>

                      <button
                        disabled={cart.length === 0}
                        onClick={handleCheckout}
                        className={`w-full py-3 rounded-xs font-editorial-mono uppercase tracking-widest text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          cart.length > 0
                            ? 'bg-[#FF6B35] hover:bg-[#ff7b4b] text-black shadow-md cursor-pointer'
                            : 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Place Order & Open Live Bidding</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LIVE ORDER TRACKING & INDRIVE BIDDING */}
      {activeTab === 'track' && (
        <div className="space-y-6">
          {orders.length > 1 && (
            <div className="bg-[#0F110E] p-3 border border-white/10 rounded-xs flex items-center gap-2 text-xs font-editorial-mono flex-wrap">
              <span className="text-white/40 uppercase text-[10px]">Your Active Orders:</span>
              {orders.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setSelectedOrderId(o.id)}
                  className={`px-3 py-1 rounded-xs border text-[11px] transition-colors cursor-pointer ${
                    activeOrder?.id === o.id
                      ? 'bg-[#FF6B35] text-black font-bold border-[#FF6B35]'
                      : 'bg-[#161815] text-white/70 border-white/10 hover:text-white'
                  }`}
                >
                  Order #{o.id} ({o.status.replace('_', ' ')})
                </button>
              ))}
            </div>
          )}

          {!activeOrder ? (
            <div className="bg-[#161815] border border-white/10 rounded-xs p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-xs bg-[#0F110E] border border-white/10 flex items-center justify-center mx-auto text-[#FF6B35]">
                <Bike className="w-6 h-6" />
              </div>
              <h3 className="font-editorial-serif text-2xl font-bold text-[#F5F5F0] italic">
                No active orders right now
              </h3>
              <p className="text-xs text-white/50 max-w-md mx-auto font-editorial-mono">
                Place an order from the Explore tab to test live InDrive dynamic rider bidding, kitchen displays, and zero-penalty fair delivery.
              </p>
              <button
                onClick={() => setActiveTab('explore')}
                className="px-4 py-2.5 bg-[#FF6B35] text-black font-editorial-mono uppercase tracking-wider text-xs font-bold rounded-xs hover:bg-[#ff7b4b] cursor-pointer"
              >
                Explore Merchants
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Main Order Details & Status */}
              <div className="lg:col-span-7 space-y-6">
                {/* Order Header Card */}
                <div className="bg-[#161815] border border-white/10 rounded-xs p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <span className="text-[10px] font-editorial-mono font-bold text-[#FF6B35] uppercase tracking-widest">
                        ACTIVE ORDER #{activeOrder.id}
                      </span>
                      <h2 className="text-xl font-editorial-serif italic font-bold text-[#F5F5F0]">
                        {activeOrder.restaurantName}
                      </h2>
                    </div>
                    <span className="px-3 py-1 bg-[#FF6B35]/10 text-[#FF6B35] font-editorial-mono font-bold text-[10px] rounded-xs border border-[#FF6B35]/30 uppercase tracking-widest">
                      {activeOrder.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* IN-DRIVE RIDER BIDDING MODULE */}
                  {!activeOrder.assignedRider && (
                    <div className="bg-[#0F110E] border border-[#FF6B35]/40 text-[#F5F5F0] p-4 rounded-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bike className="w-5 h-5 text-[#FF6B35] animate-bounce" />
                          <h3 className="font-editorial-mono font-bold text-xs uppercase tracking-wider text-[#FF6B35]">
                            {activeOrder.riderBids.length > 0
                              ? `InDrive Bids Received (${activeOrder.riderBids.length} Nearby Riders)`
                              : 'Broadcasting to Delivery Partners in Real-time'}
                          </h3>
                        </div>
                        <span className="text-[10px] font-editorial-mono bg-[#161815] border border-white/10 px-2.5 py-1 rounded-xs text-white/70">
                          Base Fee: Rs. {activeOrder.baseDeliveryFee}
                        </span>
                      </div>

                      {activeOrder.riderBids.length === 0 ? (
                        <div className="space-y-3 pt-2">
                          <div className="p-4 bg-[#161815] border border-white/10 rounded-xs flex items-center gap-3">
                            <Radio className="w-5 h-5 text-[#FF6B35] animate-pulse" />
                            <div className="text-xs font-editorial-mono">
                              <p className="font-bold text-[#F5F5F0]">Live Radar Active across Cloud Firestore</p>
                              <p className="text-white/50 text-[11px] mt-0.5">
                                Active delivery riders in the Rider Portal see this job and can submit live dynamic bids.
                              </p>
                            </div>
                          </div>

                          {onSimulateRiderBid && (
                            <button
                              onClick={() => onSimulateRiderBid(activeOrder.id)}
                              className="w-full py-2 bg-[#161815] border border-[#FF6B35]/40 hover:border-[#FF6B35] text-[#FF6B35] hover:text-white text-xs font-editorial-mono font-bold uppercase rounded-xs flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>⚡ Simulate Nearby Rider Offer (Rs. {activeOrder.baseDeliveryFee + 10})</span>
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2 pt-1">
                          <p className="text-xs text-white/60 font-editorial-mono">
                            Review offers submitted by nearby riders and choose who delivers your food:
                          </p>

                          {activeOrder.riderBids.map((bid) => (
                            <div
                              key={bid.riderId}
                              className="flex items-center justify-between p-3 bg-[#161815] border border-white/10 rounded-xs hover:border-[#FF6B35]/50 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={bid.riderAvatar}
                                  alt={bid.riderName}
                                  className="w-10 h-10 rounded-xs object-cover border border-white/20"
                                />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm text-[#F5F5F0]">
                                      {bid.riderName}
                                    </span>
                                    <span className="text-[10px] text-amber-400 flex items-center font-editorial-mono font-bold">
                                      <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                                      {bid.rating}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-white/50 font-editorial-mono">
                                    {bid.vehicle} • {bid.deliveriesCount} trips • ETA {bid.etaMins}m
                                  </p>
                                </div>
                              </div>

                              <div className="text-right space-y-1">
                                <div className="text-sm font-editorial-mono font-extrabold text-[#FF6B35]">
                                  Rs. {bid.proposedFee}
                                </div>
                                <button
                                  onClick={() => onAcceptBid(activeOrder.id, bid)}
                                  className="px-3 py-1 bg-[#FF6B35] hover:bg-[#ff7b4b] text-black font-editorial-mono font-bold text-[10px] uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                                >
                                  Accept Bid
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Assigned Rider Card (If bid accepted) */}
                  {activeOrder.assignedRider && (
                    <div className="bg-[#0F110E] border border-white/10 p-4 rounded-xs flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={activeOrder.assignedRider.avatar}
                          alt={activeOrder.assignedRider.name}
                          className="w-12 h-12 rounded-xs object-cover border border-[#FF6B35]"
                        />
                        <div>
                          <span className="text-[9px] font-editorial-mono font-bold uppercase tracking-widest text-[#FF6B35]">
                            ASSIGNED RIDER
                          </span>
                          <h4 className="font-bold text-[#F5F5F0] text-sm">
                            {activeOrder.assignedRider.name}
                          </h4>
                          <p className="text-xs text-white/50 font-editorial-mono">
                            {activeOrder.assignedRider.vehicle} • Contact: {activeOrder.assignedRider.phone}
                          </p>
                        </div>
                      </div>
                      <div className="text-right font-editorial-mono">
                        <span className="text-[10px] text-white/40 uppercase">Delivery Fee</span>
                        <div className="font-bold text-[#FF6B35] text-sm">
                          Rs. {activeOrder.finalDeliveryFee}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* RESPONSIBILITY TIMELINE */}
                  <div className="border border-white/10 rounded-xs p-4 bg-[#0F110E] space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-editorial-mono font-bold text-xs uppercase tracking-wider text-[#F5F5F0] flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#FF6B35]" />
                        Responsibility Timeline Engine
                      </h3>
                      <span className="text-[10px] text-white/50 bg-[#161815] border border-white/10 px-2 py-0.5 rounded-xs font-editorial-mono uppercase">
                        Fair Audit Active
                      </span>
                    </div>

                    {/* Timeline Phases */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Phase 1: Restaurant Timer */}
                      <div className="p-3 bg-[#161815] border border-white/10 rounded-xs space-y-1">
                        <div className="flex items-center justify-between font-editorial-mono font-bold text-[#F5F5F0]">
                          <span className="text-[11px] uppercase">Phase 1 — Kitchen</span>
                          <span className="text-[#FF6B35]">{activeOrder.restaurantPromiseMins} mins</span>
                        </div>
                        <p className="text-[11px] text-white/50 font-editorial-mono">
                          {activeOrder.status === 'placed' || activeOrder.status === 'bidding'
                            ? 'Order broadcasted to restaurant'
                            : activeOrder.status === 'preparing'
                            ? 'Food currently being prepared'
                            : 'Food prepared & handed over'}
                        </p>
                      </div>

                      {/* Phase 2: Rider Transit */}
                      <div className="p-3 bg-[#161815] border border-white/10 rounded-xs space-y-1">
                        <div className="flex items-center justify-between font-editorial-mono font-bold text-[#F5F5F0]">
                          <span className="text-[11px] uppercase">Phase 2 — Transit</span>
                          <span className="text-[#FF6B35]">{activeOrder.riderPromiseMins} mins</span>
                        </div>
                        <p className="text-[11px] text-white/50 font-editorial-mono">
                          {activeOrder.status === 'in_transit'
                            ? 'Rider en route to your doorstep'
                            : activeOrder.status === 'delivered'
                            ? 'Successfully delivered'
                            : 'Timer starts after food pickup'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items & Receipt */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-[#161815] border border-white/10 rounded-xs p-5 space-y-3 font-editorial-mono">
                  <h3 className="font-editorial-serif text-lg font-bold italic text-[#F5F5F0]">
                    Order Summary
                  </h3>
                  <div className="space-y-2 border-b border-white/10 pb-3">
                    {activeOrder.items.map((i, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-white/80">
                        <span>
                          <strong className="text-[#FF6B35]">{i.quantity}x</strong> {i.item.name}
                        </span>
                        <span>Rs. {i.item.price * i.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5 text-xs text-white/60">
                    <div className="flex justify-between">
                      <span>Items Subtotal:</span>
                      <span className="text-[#F5F5F0]">Rs. {activeOrder.itemsTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span className="text-[#FF6B35] font-bold">
                        Rs. {activeOrder.finalDeliveryFee || activeOrder.baseDeliveryFee}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-2 font-bold text-[#F5F5F0] text-sm">
                      <span>Total Amount:</span>
                      <span className="text-[#FF6B35]">
                        Rs. {activeOrder.itemsTotal + (activeOrder.finalDeliveryFee || activeOrder.baseDeliveryFee)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SUPPORT SLA (< 2 MIN) */}
      {activeTab === 'support' && (
        <div className="max-w-3xl mx-auto bg-[#161815] border border-white/10 rounded-xs p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#FF6B35] text-black text-[10px] font-editorial-mono font-bold uppercase rounded-xs">
                  SLA GUARANTEE
                </span>
                <span className="text-xs text-white/50 font-editorial-mono">&lt; 2-Minute Response</span>
              </div>
              <h2 className="font-editorial-serif text-2xl font-bold italic text-[#F5F5F0] mt-1">
                MealLink Care & Customer Support
              </h2>
            </div>
            <span className="text-[10px] font-editorial-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-xs">
              Live Ops Online
            </span>
          </div>

          {/* Chat Transcript Area */}
          <div className="p-4 bg-[#0F110E] border border-white/10 rounded-xs space-y-3 min-h-[260px] max-h-[380px] overflow-y-auto">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-xs text-xs font-editorial-mono ${
                    msg.sender === 'user'
                      ? 'bg-[#FF6B35] text-black font-semibold'
                      : 'bg-[#161815] border border-white/10 text-[#F5F5F0]'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-[9px] text-white/40 font-editorial-mono mt-1 px-1">
                  {msg.sender === 'user' ? 'You' : 'MealLink Support'} • {msg.time}
                </span>
              </div>
            ))}

            {isAiThinking && (
              <div className="flex items-center gap-2 text-xs text-[#FF6B35] font-editorial-mono p-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Support specialist reviewing incident with zero-delay guarantee...</span>
              </div>
            )}
          </div>

          {/* Quick Issue Chips */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-editorial-mono text-white/40 uppercase block">Quick Dispute Triggers:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSendMessage('My food is delayed past the kitchen promise timer.')}
                className="px-2.5 py-1 bg-[#0F110E] border border-white/10 hover:border-[#FF6B35] rounded-xs text-[11px] text-white/80 font-editorial-mono cursor-pointer"
              >
                ⏱️ Food Delayed past Kitchen Timer
              </button>
              <button
                onClick={() => handleSendMessage('Missing item in food package.')}
                className="px-2.5 py-1 bg-[#0F110E] border border-white/10 hover:border-[#FF6B35] rounded-xs text-[11px] text-white/80 font-editorial-mono cursor-pointer"
              >
                📦 Missing Item in Order
              </button>
              <button
                onClick={() => handleSendMessage('Need instant compensation credit.')}
                className="px-2.5 py-1 bg-[#0F110E] border border-white/10 hover:border-[#FF6B35] rounded-xs text-[11px] text-white/80 font-editorial-mono cursor-pointer"
              >
                💳 Instant Compensation Request
              </button>
            </div>
          </div>

          {/* Chat Input Bar */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Describe your issue. Immediate response guaranteed..."
              className="flex-1 bg-[#0F110E] border border-white/10 p-2.5 rounded-xs text-xs text-[#F5F5F0] focus:outline-hidden focus:border-[#FF6B35] font-editorial-mono"
            />
            <button
              onClick={() => handleSendMessage()}
              className="px-4 py-2.5 bg-[#FF6B35] hover:bg-[#ff7b4b] text-black font-editorial-mono font-bold text-xs uppercase tracking-wider rounded-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
