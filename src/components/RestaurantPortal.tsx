import React, { useState } from 'react';
import { Restaurant, Order, MenuItem } from '../types';
import {
  Store,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  TrendingUp,
  Percent,
  Check,
  ShieldCheck,
  ChefHat,
  Plus,
  Sparkles
} from 'lucide-react';

interface RestaurantPortalProps {
  restaurants: Restaurant[];
  orders: Order[];
  onMarkOrderReady: (orderId: string) => void;
  onRegisterRestaurant: (restaurant: Restaurant) => void;
  onQuickSeedDemo?: () => void;
}

export const RestaurantPortal: React.FC<RestaurantPortalProps> = ({
  restaurants,
  orders,
  onMarkOrderReady,
  onRegisterRestaurant,
  onQuickSeedDemo,
}) => {
  const [selectedRestId, setSelectedRestId] = useState<string>(restaurants[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'kitchen' | 'respect' | 'commission'>('kitchen');

  // New Shop Form State
  const [showAddForm, setShowAddForm] = useState(restaurants.length === 0);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Desi & Biryani');
  const [newAddress, setNewAddress] = useState('Shop 12, Main Boulevard, Gulberg III, Lahore');
  const [newCommission, setNewCommission] = useState(10);

  // Sync selected restaurant when list changes
  const currentRestaurant = restaurants.find((r) => r.id === selectedRestId) || restaurants[0];

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const sampleMenuItems: MenuItem[] = [
      {
        id: `item-${Date.now()}-1`,
        name: 'Special Chicken Dum Biryani',
        description: 'Fragrant basmati rice cooked with saffron, tender chicken, and potato.',
        price: 340,
        category: 'Mains',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60',
        popular: true,
      },
      {
        id: `item-${Date.now()}-2`,
        name: 'Seekh Kebab Roll (2 Pcs)',
        description: 'Charcoal grilled beef seekh kebabs rolled in fresh flaky paratha with chutney.',
        price: 280,
        category: 'Starters',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60',
        popular: true,
      },
      {
        id: `item-${Date.now()}-3`,
        name: 'Fresh Mint Raita & Salad',
        description: 'Chilled herb-infused yogurt with diced cucumbers and roasted cumin.',
        price: 70,
        category: 'Sides',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60',
      },
      {
        id: `item-${Date.now()}-4`,
        name: 'Cold Drink 500ml',
        description: 'Chilled beverage of choice (Cola, Lemon, or Diet).',
        price: 90,
        category: 'Drinks',
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60',
      }
    ];

    const newRest: Restaurant = {
      id: `rest-${Date.now().toString().slice(-6)}`,
      name: newName.trim(),
      category: newCategory,
      rating: 4.9,
      deliveryTimeMins: 25,
      commissionRate: Math.min(10, Math.max(5, newCommission)),
      respectScore: 98,
      avgRiderWaitMins: 3.2,
      complaintFreqPer100: 0.2,
      staffBehaviorRating: 4.95,
      bannerImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&auto=format&fit=crop&q=60',
      address: newAddress,
      menuItems: sampleMenuItems,
    };

    onRegisterRestaurant(newRest);
    setSelectedRestId(newRest.id);
    setShowAddForm(false);
    setNewName('');
  };

  // If no restaurants exist and not toggling add form
  if (!currentRestaurant) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-[#161815] border border-white/10 rounded-xs p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="w-12 h-12 rounded-xs bg-[#FF6B35]/10 border border-[#FF6B35]/30 flex items-center justify-center text-[#FF6B35]">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-editorial-mono font-bold text-[#FF6B35] uppercase tracking-widest">
                MERCHANT REALTIME ONBOARDING
              </span>
              <h2 className="font-editorial-serif text-2xl font-bold italic text-[#F5F5F0]">
                Register Your Restaurant / Shop
              </h2>
            </div>
          </div>

          <p className="text-xs text-white/60 font-editorial-mono leading-relaxed">
            No shops are currently active in Cloud Firestore. Register your merchant profile below. All registered shops sync immediately across Customer, Rider, and Admin portals in real-time with our capped 10% commission.
          </p>

          <form onSubmit={handleRegisterSubmit} className="space-y-4 font-editorial-mono text-xs">
            <div>
              <label className="block text-white/70 mb-1 font-bold">Restaurant / Shop Name</label>
              <input
                type="text"
                required
                placeholder="e.g., Lahore Biryani & Karahi Express"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-[#0F110E] border border-white/10 p-2.5 rounded-xs text-[#F5F5F0] focus:border-[#FF6B35] focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 mb-1 font-bold">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#0F110E] border border-white/10 p-2.5 rounded-xs text-[#F5F5F0] focus:border-[#FF6B35] focus:outline-hidden"
                >
                  <option value="Desi & Biryani">Desi & Biryani</option>
                  <option value="Burgers & Fast Food">Burgers & Fast Food</option>
                  <option value="Woodfire Pizza">Woodfire Pizza</option>
                  <option value="Cafe & Bakery">Cafe & Bakery</option>
                  <option value="Grocery & Snacks">Grocery & Snacks</option>
                </select>
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-bold">Commission Rate (Capped at 10%)</label>
                <div className="flex items-center gap-2 bg-[#0F110E] border border-white/10 p-2.5 rounded-xs">
                  <Percent className="w-4 h-4 text-[#FF6B35]" />
                  <span className="text-[#FF6B35] font-bold">{newCommission}% Capped</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white/70 mb-1 font-bold">Shop Location / Address</label>
              <input
                type="text"
                required
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full bg-[#0F110E] border border-white/10 p-2.5 rounded-xs text-[#F5F5F0] focus:border-[#FF6B35] focus:outline-hidden"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                className="w-full sm:flex-1 py-3 bg-[#FF6B35] hover:bg-[#ff7b4b] text-black font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Register Shop to Firestore</span>
              </button>

              {onQuickSeedDemo && (
                <button
                  type="button"
                  onClick={onQuickSeedDemo}
                  className="w-full sm:w-auto px-4 py-3 bg-[#0F110E] border border-white/20 hover:border-[#FF6B35] text-white/80 hover:text-white font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#FF6B35]" />
                  <span>⚡ Quick Demo Shop</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  const kitchenOrders = orders.filter(
    (o) => o.restaurantId === currentRestaurant.id && (o.status === 'preparing' || o.status === 'placed' || o.status === 'bidding' || o.status === 'ready_for_pickup')
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Restaurant Selector & Header */}
      <div className="bg-[#161815] border border-white/10 rounded-xs p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-4">
            <img
              src={currentRestaurant.bannerImage}
              alt={currentRestaurant.name}
              className="w-16 h-16 rounded-xs object-cover border border-[#FF6B35]"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-editorial-serif text-2xl font-bold italic text-[#F5F5F0]">
                  {currentRestaurant.name}
                </h2>
                <span className="px-2.5 py-0.5 bg-[#FF6B35]/10 text-[#FF6B35] text-[10px] font-editorial-mono font-bold rounded-xs border border-[#FF6B35]/30 uppercase">
                  {currentRestaurant.commissionRate}% COMMISSION
                </span>
              </div>
              <p className="text-xs text-white/50 font-editorial-mono mt-0.5">{currentRestaurant.address}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Respect Score Card */}
            <div className="flex items-center gap-3 bg-[#0F110E] border border-white/10 p-3 rounded-xs text-xs font-editorial-mono">
              <Award className="w-7 h-7 text-[#FF6B35] shrink-0" />
              <div>
                <span className="font-bold text-white/40 uppercase text-[9px] block">
                  Respect Score
                </span>
                <span className="font-extrabold text-lg text-[#FF6B35]">
                  {currentRestaurant.respectScore} / 100
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-2 bg-[#0F110E] border border-white/20 hover:border-[#FF6B35] text-white/80 hover:text-white rounded-xs text-xs font-editorial-mono flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>+ Add Shop</span>
            </button>
          </div>
        </div>

        {/* Switch Shop Selector */}
        {restaurants.length > 1 && (
          <div className="flex items-center gap-2 text-xs font-editorial-mono">
            <span className="text-white/40 uppercase text-[10px]">Switch Shop:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {restaurants.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRestId(r.id)}
                  className={`px-2.5 py-1 rounded-xs border text-[11px] transition-colors ${
                    currentRestaurant.id === r.id
                      ? 'bg-[#FF6B35] text-black font-bold border-[#FF6B35]'
                      : 'bg-[#0F110E] text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Inline Add Shop Form */}
        {showAddForm && (
          <div className="p-4 bg-[#0F110E] border border-[#FF6B35]/30 rounded-xs space-y-3 font-editorial-mono text-xs">
            <h3 className="font-bold text-[#F5F5F0] uppercase tracking-wider text-[11px] text-[#FF6B35]">
              Register Another Restaurant / Shop to Firestore
            </h3>
            <form onSubmit={handleRegisterSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                placeholder="Shop Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-[#161815] border border-white/10 p-2 rounded-xs text-[#F5F5F0] focus:border-[#FF6B35] focus:outline-hidden"
              />
              <input
                type="text"
                required
                placeholder="Address"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="bg-[#161815] border border-white/10 p-2 rounded-xs text-[#F5F5F0] focus:border-[#FF6B35] focus:outline-hidden"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#FF6B35] hover:bg-[#ff7b4b] text-black font-bold rounded-xs cursor-pointer"
                >
                  Save & Activate
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center bg-[#0F110E] border border-white/10 p-1.5 rounded-xs gap-2 font-editorial-mono">
        <button
          onClick={() => setActiveTab('kitchen')}
          className={`flex-1 py-2 px-3 rounded-xs text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'kitchen'
              ? 'bg-[#FF6B35] text-black font-bold shadow-xs'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <ChefHat className="w-4 h-4" />
          <span>Kitchen Display ({kitchenOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('respect')}
          className={`flex-1 py-2 px-3 rounded-xs text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'respect'
              ? 'bg-[#FF6B35] text-black font-bold shadow-xs'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Respect Metrics</span>
        </button>

        <button
          onClick={() => setActiveTab('commission')}
          className={`flex-1 py-2 px-3 rounded-xs text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'commission'
              ? 'bg-[#FF6B35] text-black font-bold shadow-xs'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>Commission Savings</span>
        </button>
      </div>

      {/* TAB 1: KITCHEN DISPLAY SYSTEM */}
      {activeTab === 'kitchen' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial-serif text-xl font-bold italic text-[#F5F5F0]">Kitchen Display System</h3>
            <span className="text-[10px] font-editorial-mono text-white/50 uppercase">
              Real-time Firestore sync • One-tap "Ready" notifies rider
            </span>
          </div>

          {kitchenOrders.length === 0 ? (
            <div className="bg-[#161815] border border-white/10 rounded-xs p-10 text-center text-white/50 text-xs font-editorial-mono space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#FF6B35] mx-auto" />
              <p className="font-bold text-[#F5F5F0] text-sm font-editorial-serif italic">All Kitchen Orders Cleared!</p>
              <p className="text-white/40">New orders placed by customers will appear here in real-time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kitchenOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-[#161815] border border-[#FF6B35]/40 rounded-xs p-4 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div>
                      <span className="text-[10px] font-editorial-mono font-bold text-[#FF6B35] uppercase">
                        Order #{ord.id}
                      </span>
                      <p className="text-xs text-white/50 font-editorial-mono">
                        Customer: {ord.customerName}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] font-editorial-mono font-bold bg-[#0F110E] text-[#FF6B35] border border-[#FF6B35]/30 px-2.5 py-1 rounded-xs">
                      <Clock className="w-3 h-3" />
                      <span>Promise: {ord.restaurantPromiseMins}m</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-1.5 py-1">
                    {ord.items.map((i, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs text-white/80 font-editorial-mono"
                      >
                        <span>
                          <strong className="text-[#FF6B35]">{i.quantity}x</strong> {i.item.name}
                        </span>
                        <span className="text-white/40">Rs. {i.item.price * i.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Order Status & Ready Action */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-editorial-mono uppercase text-white/40 block">Status</span>
                      <span className="text-xs font-editorial-mono font-bold text-[#FF6B35] uppercase">
                        {ord.status.replace('_', ' ')}
                      </span>
                    </div>

                    {ord.status === 'ready_for_pickup' ? (
                      <span className="px-3 py-1.5 bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 font-editorial-mono text-xs font-bold rounded-xs flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Marked Ready
                      </span>
                    ) : (
                      <button
                        onClick={() => onMarkOrderReady(ord.id)}
                        className="px-4 py-2 bg-[#FF6B35] hover:bg-[#ff7b4b] text-black font-editorial-mono font-bold text-xs uppercase tracking-wider rounded-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Order Ready for Pickup</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RESPECT METRICS */}
      {activeTab === 'respect' && (
        <div className="bg-[#161815] border border-white/10 rounded-xs p-6 space-y-6 shadow-sm font-editorial-mono">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-2xl font-editorial-serif italic font-bold text-[#F5F5F0]">
              Restaurant Dignity & Respect Metrics
            </h2>
            <p className="text-xs text-white/50 mt-0.5">
              MealLink audits merchant behavior towards delivery partners: seated waiting zones, drinking water access, and polite kitchen handover.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[#0F110E] border border-white/10 rounded-xs space-y-1">
              <span className="text-[10px] text-white/40 uppercase block">Rider Handover Wait</span>
              <div className="text-2xl font-bold text-[#FF6B35]">{currentRestaurant.avgRiderWaitMins}m</div>
              <p className="text-[11px] text-white/50">Benchmark: &lt; 5 mins</p>
            </div>

            <div className="p-4 bg-[#0F110E] border border-white/10 rounded-xs space-y-1">
              <span className="text-[10px] text-white/40 uppercase block">Staff Courtesy Rating</span>
              <div className="text-2xl font-bold text-[#FF6B35]">{currentRestaurant.staffBehaviorRating} / 5.0</div>
              <p className="text-[11px] text-white/50">Verified rider reviews</p>
            </div>

            <div className="p-4 bg-[#0F110E] border border-white/10 rounded-xs space-y-1">
              <span className="text-[10px] text-white/40 uppercase block">Complaint Frequency</span>
              <div className="text-2xl font-bold text-emerald-400">{currentRestaurant.complaintFreqPer100}%</div>
              <p className="text-[11px] text-white/50">&lt; 1 per 100 orders</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMMISSION SAVINGS */}
      {activeTab === 'commission' && (
        <div className="bg-[#161815] border border-white/10 rounded-xs p-6 space-y-6 shadow-sm font-editorial-mono">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-2xl font-editorial-serif italic font-bold text-[#F5F5F0]">
              Capped 10% Commission Advantage
            </h2>
            <p className="text-xs text-white/50 mt-0.5">
              Unlike legacy predatory aggregator apps that charge 25% to 32% extortionate commissions, MealLink guarantees a strict maximum 10% commission cap.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-rose-950/20 border border-rose-800/30 rounded-xs space-y-2">
              <span className="text-[10px] font-bold text-rose-400 uppercase">Legacy Platforms (Foodpanda / UberEats)</span>
              <div className="text-2xl font-bold text-rose-300">28% - 32% Cut</div>
              <p className="text-xs text-rose-200/60">
                On Rs. 100,000 monthly sales, legacy aggregators take ~Rs. 30,000 straight from your food margin.
              </p>
            </div>

            <div className="p-5 bg-emerald-950/20 border border-emerald-500/40 rounded-xs space-y-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase">MealLink Capped Protocol</span>
              <div className="text-2xl font-bold text-emerald-300">Strictly 10% Flat</div>
              <p className="text-xs text-emerald-200/60">
                On Rs. 100,000 sales, you retain Rs. 90,000 in your pocket. Net monthly savings: ~Rs. 20,000.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
