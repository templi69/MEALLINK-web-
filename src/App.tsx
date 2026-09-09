import React, { useState, useEffect } from 'react';
import {
  ViewMode,
  Restaurant,
  Rider,
  Order,
  FuelEngineConfig,
  SupportTicket,
  IncidentReport,
  EcosystemHappiness,
  MenuItem,
  RiderBid,
  PortalUser,
  ChatMessage
} from './types';
import { INITIAL_FUEL_CONFIG } from './data/mockData';
import { Navbar } from './components/Navbar';
import { CustomerApp } from './components/CustomerApp';
import { RiderApp } from './components/RiderApp';
import { RestaurantPortal } from './components/RestaurantPortal';
import { SupportPortal } from './components/SupportPortal';
import { AdminPortal } from './components/AdminPortal';
import { SimulationControls } from './components/SimulationControls';
import { SideMenu } from './components/SideMenu';
import { PortalLoginModal } from './components/PortalLoginModal';
import { RobloxOrderChat } from './components/RobloxOrderChat';
import {
  initializeFirestoreDatabase,
  subscribeToRestaurants,
  subscribeToRiders,
  subscribeToOrders,
  subscribeToTickets,
  subscribeToIncidents,
  subscribeToFuelConfig,
  subscribeToHappiness,
  subscribeToChatMessages,
  saveChatMessageToDb,
  saveRestaurantToDb,
  deleteRestaurantFromDb,
  saveRiderToDb,
  deleteRiderFromDb,
  saveOrderToDb,
  deleteOrderFromDb,
  saveTicketToDb,
  saveIncidentToDb,
  saveFuelConfigToDb,
  saveHappinessToDb,
  clearAllDatabaseRecords,
  seedStarterDemoData
} from './lib/firestoreSync';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('customer');

  // Application State (Pure Realtime - Synced from Cloud Firestore)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [fuelConfig, setFuelConfig] = useState<FuelEngineConfig>(INITIAL_FUEL_CONFIG);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  
  // UI & Auth States
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [loginModalTarget, setLoginModalTarget] = useState<ViewMode | null>(null);

  // Authenticated User Session Profiles per Portal Category
  const [authenticatedUsers, setAuthenticatedUsers] = useState<Record<ViewMode, PortalUser | null>>({
    customer: {
      uid: 'demo-cust',
      email: 'customer@meallink.com',
      name: 'Ayesha Siddiqui',
      role: 'customer',
      portalName: 'Customer App',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    rider: null,
    restaurant: null,
    support: null,
    admin: null
  });

  // Initialize Cloud Firestore & Subscriptions on Mount
  useEffect(() => {
    // Ensure base fuel/platform config
    initializeFirestoreDatabase();

    // Subscribe to Firestore Real-Time Collections
    const unsubRestaurants = subscribeToRestaurants((updatedRestaurants) => {
      setRestaurants(updatedRestaurants);
    });

    const unsubRiders = subscribeToRiders((updatedRiders) => {
      setRiders(updatedRiders);
    });

    const unsubOrders = subscribeToOrders((updatedOrders) => {
      setOrders(updatedOrders);
    });

    const unsubTickets = subscribeToTickets((updatedTickets) => {
      setTickets(updatedTickets);
    });

    const unsubIncidents = subscribeToIncidents((updatedIncidents) => {
      setIncidents(updatedIncidents);
    });

    const unsubFuel = subscribeToFuelConfig((updatedFuel) => {
      setFuelConfig(updatedFuel);
    });

    const unsubChat = subscribeToChatMessages((updatedMsgs) => {
      setChatMessages(updatedMsgs);
    });

    return () => {
      unsubRestaurants();
      unsubRiders();
      unsubOrders();
      unsubTickets();
      unsubIncidents();
      unsubFuel();
      unsubChat();
    };
  }, []);

  // Dynamic Ecosystem Happiness Calculation
  const calculateHappiness = (): EcosystemHappiness => {
    const cust = 96;
    const riderScore = incidents.some((i) => i.status === 'under_review') ? 85 : 98;
    const restScore =
      restaurants.length > 0
        ? Math.round(restaurants.reduce((acc, r) => acc + (r.respectScore || 95), 0) / restaurants.length)
        : 95;
    const supp = 99;

    const weighted = Math.round(0.4 * cust + 0.3 * riderScore + 0.2 * restScore + 0.1 * supp);
    const status: EcosystemHappiness['status'] =
      weighted >= 90 ? 'optimal' : weighted >= 75 ? 'warning' : 'critical';

    return {
      customerHappiness: cust,
      riderHappiness: riderScore,
      restaurantHappiness: restScore,
      supportQuality: supp,
      overallScore: weighted,
      status,
    };
  };

  const happiness = calculateHappiness();

  // Navigation & Category Auth Gate Handler
  const handleSelectPortal = (targetMode: ViewMode) => {
    if (targetMode === 'customer') {
      setViewMode('customer');
      return;
    }

    if (!authenticatedUsers[targetMode]) {
      setLoginModalTarget(targetMode);
    } else {
      setViewMode(targetMode);
    }
  };

  const handleLoginSuccess = (user: PortalUser) => {
    setAuthenticatedUsers((prev) => ({
      ...prev,
      [user.role]: user
    }));
    setViewMode(user.role);
    setLoginModalTarget(null);
  };

  const handleLogoutPortal = (portal: ViewMode) => {
    setAuthenticatedUsers((prev) => ({
      ...prev,
      [portal]: null
    }));
    if (viewMode === portal) {
      setViewMode('customer');
    }
  };

  // Place Order from Customer Portal
  const handlePlaceOrder = async (
    restaurant: Restaurant,
    cartItems: { item: MenuItem; quantity: number }[],
    deliveryAddress: string
  ) => {
    const subtotal = cartItems.reduce((acc, i) => acc + i.item.price * i.quantity, 0);

    const distance = 3.5;
    const fuelAdj = (fuelConfig.petrolPrice - 250) * 0.08 * distance;
    const calculatedBase = Math.round(
      (distance * fuelConfig.basePerKm + Math.max(0, fuelAdj)) *
        fuelConfig.rushMultiplier *
        fuelConfig.rainMultiplier
    );

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: authenticatedUsers.customer?.name || 'Ayesha Siddiqui',
      customerPhone: '+92 300 5512390',
      deliveryAddress,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      restaurantImage: restaurant.bannerImage,
      items: cartItems,
      subtotal,
      baseDeliveryFee: Math.max(30, calculatedBase),
      finalDeliveryFee: Math.max(30, calculatedBase),
      platformFee: 15,
      totalAmount: subtotal + Math.max(30, calculatedBase) + 15,
      status: 'placed',
      restaurantPromiseMins: 18,
      createdAt: new Date().toISOString(),
      estimatedDeliveryMins: 15,
      responsibility: 'none',
      transitProgressPercent: 0,
      riderBids: [],
    };

    await saveOrderToDb(newOrder);

    // Automatically initialize the aligned tri-party chat for Customer + Restaurant + Rider
    await saveChatMessageToDb({
      id: `sys-${newOrder.id}-init`,
      orderId: newOrder.id,
      senderRole: 'system',
      senderName: 'MealLink Dispatch',
      content: `🎉 Order #${newOrder.id} placed! Customer (${newOrder.customerName}), Kitchen (${restaurant.name}), and Delivery Rider have been connected in this aligned chat.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystemNotice: true,
    });
  };

  // Accept Rider Bid
  const handleAcceptBid = async (orderId: string, bid: RiderBid) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const assigned = riders.find((r) => r.id === bid.riderId) || {
      id: bid.riderId,
      name: bid.riderName,
      phone: bid.riderPhone,
      avatar: bid.riderAvatar,
      rating: bid.rating,
      vehicle: bid.vehicle,
      deliveriesCompleted: bid.deliveriesCount,
      earningsToday: 500,
      safetyScore: 99,
      status: 'on_delivery' as const,
      currentLocationName: 'Gulberg, Lahore'
    };

    const updated: Order = {
      ...order,
      status: 'preparing',
      finalDeliveryFee: bid.proposedFee,
      totalAmount: order.subtotal + bid.proposedFee + order.platformFee,
      assignedRider: assigned,
      riderBids: order.riderBids.map((b) =>
        b.riderId === bid.riderId
          ? { ...b, status: 'accepted' }
          : { ...b, status: 'rejected' }
      ),
    };

    await saveOrderToDb(updated);

    // Announce assigned rider in tri-party chat
    await saveChatMessageToDb({
      id: `sys-${order.id}-rider-${Date.now()}`,
      orderId: order.id,
      senderRole: 'system',
      senderName: 'Dispatch System',
      content: `🛵 Rider ${bid.riderName} accepted the order and joined the aligned chat! (ETA: ${bid.etaMins} mins)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystemNotice: true,
    });
  };

  // Simulate or submit rider bid for active order
  const handleSimulateRiderBid = async (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const riderToUse: Rider = riders[0] || {
      id: 'rider-quick-1',
      name: 'Zubair Ahmed',
      phone: '+92 321 9876543',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      rating: 4.96,
      vehicle: 'Honda CG 125 Motorcycle',
      deliveriesCompleted: 142,
      earningsToday: 1850,
      safetyScore: 99,
      status: 'available',
      currentLocationName: 'Gulberg Main Market, Lahore',
    };

    const newBid: RiderBid = {
      riderId: riderToUse.id,
      riderName: riderToUse.name,
      riderAvatar: riderToUse.avatar,
      riderPhone: riderToUse.phone,
      rating: riderToUse.rating,
      vehicle: riderToUse.vehicle,
      deliveriesCount: riderToUse.deliveriesCompleted,
      baseFee: order.baseDeliveryFee,
      proposedFee: order.baseDeliveryFee + 10,
      etaMins: 12,
      status: 'pending',
    };

    const updated: Order = {
      ...order,
      riderBids: [...order.riderBids.filter((b) => b.riderId !== newBid.riderId), newBid],
    };

    await saveOrderToDb(updated);
  };

  // Rider submits a bid from Rider Portal
  const handleRiderSubmitBid = async (orderId: string, rider: Rider, proposedFee: number) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const newBid: RiderBid = {
      riderId: rider.id,
      riderName: rider.name,
      riderAvatar: rider.avatar,
      riderPhone: rider.phone,
      rating: rider.rating,
      vehicle: rider.vehicle,
      deliveriesCount: rider.deliveriesCompleted,
      baseFee: order.baseDeliveryFee,
      proposedFee,
      etaMins: 12,
      status: 'pending',
    };

    const updated: Order = {
      ...order,
      riderBids: [...order.riderBids.filter((b) => b.riderId !== rider.id), newBid],
    };

    await saveOrderToDb(updated);
  };

  // Restaurant Kitchen actions
  const handleMarkOrderReady = async (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const updated: Order = {
      ...order,
      status: 'ready_for_pickup',
      restaurantReadyAt: new Date().toISOString(),
      actualPrepMins: 14,
    };
    await saveOrderToDb(updated);

    await saveChatMessageToDb({
      id: `sys-${order.id}-ready-${Date.now()}`,
      orderId: order.id,
      senderRole: 'system',
      senderName: 'Kitchen Counter',
      content: `🍳 ${order.restaurantName} marked order as Ready for Pickup on the counter!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystemNotice: true,
    });
  };

  // Rider transit actions
  const handlePickupOrder = async (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const updated: Order = {
      ...order,
      status: 'in_transit',
      pickedUpAt: new Date().toISOString(),
      transitProgressPercent: 30,
    };
    await saveOrderToDb(updated);

    await saveChatMessageToDb({
      id: `sys-${order.id}-pickup-${Date.now()}`,
      orderId: order.id,
      senderRole: 'system',
      senderName: 'Rider Transit',
      content: `🚀 Rider ${order.assignedRider?.name || 'Partner Rider'} picked up the package and is in transit to customer!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystemNotice: true,
    });
  };

  const handleDeliverOrder = async (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const updated: Order = {
      ...order,
      status: 'delivered',
      deliveredAt: new Date().toISOString(),
      transitProgressPercent: 100,
    };
    await saveOrderToDb(updated);

    await saveChatMessageToDb({
      id: `sys-${order.id}-delivered-${Date.now()}`,
      orderId: order.id,
      senderRole: 'system',
      senderName: 'MealLink Dispatch',
      content: `✅ Package delivered safely to customer! Thank you to Customer, Kitchen, and Rider for great aligned coordination.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystemNotice: true,
    });
  };

  const handleRiderExplainDelay = async (orderId: string, reason: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const updated: Order = {
      ...order,
      responsibility: 'restaurant',
      delayReason: `Rider note logged: ${reason}. Zero penalty to rider.`,
    };
    await saveOrderToDb(updated);
  };

  // Support & Incidents
  const handleSubmitIncident = async (incident: Omit<IncidentReport, 'id' | 'timestamp'>) => {
    const newInc: IncidentReport = {
      ...incident,
      id: `INC-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: 'Just now',
    };
    await saveIncidentToDb(newInc);
  };

  const handleResolveIncident = async (incidentId: string) => {
    const inc = incidents.find((i) => i.id === incidentId);
    if (!inc) return;

    const updated: IncidentReport = { ...inc, status: 'action_taken' };
    await saveIncidentToDb(updated);
  };

  const handleSubmitCustomerTicket = async (ticketData: Omit<SupportTicket, 'id' | 'createdAt'>) => {
    const newTicket: SupportTicket = {
      ...ticketData,
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: 'Just now',
    };
    await saveTicketToDb(newTicket);
  };

  const handleResolveTicket = async (ticketId: string, aiResponse: string) => {
    const tck = tickets.find((t) => t.id === ticketId);
    if (!tck) return;

    const updated: SupportTicket = {
      ...tck,
      status: 'resolved',
      aiResponse,
    };
    await saveTicketToDb(updated);
  };

  const handleEscalateTicket = async (
    ticketId: string,
    type: 'large_refund' | 'suspend_user' | 'penalty_override' | 'commission_adj',
    amount: number,
    reason: string
  ) => {
    const tck = tickets.find((t) => t.id === ticketId);
    if (!tck) return;

    const updated: SupportTicket = {
      ...tck,
      requiresAdminApproval: true,
      escalationType: type,
      escalationAmount: amount,
      escalationReason: reason,
      adminApprovalStatus: 'pending',
    };
    await saveTicketToDb(updated);
  };

  const handleAdminApproveEscalation = async (
    ticketId: string,
    approved: boolean,
    note: string
  ) => {
    const tck = tickets.find((t) => t.id === ticketId);
    if (!tck) return;

    const updated: SupportTicket = {
      ...tck,
      adminApprovalStatus: approved ? 'approved' : 'rejected',
      adminNotes: note,
      status: approved ? 'resolved' : 'investigating',
      aiResponse: approved
        ? `Admin Approved Escalation: ${note}. Action executed.`
        : `Admin Declined Escalation: ${note}. Support agent notified.`,
    };
    await saveTicketToDb(updated);
  };

  // Database Management Handlers
  const handleClearDatabase = async () => {
    await clearAllDatabaseRecords();
  };

  const handleQuickSeedDemo = async () => {
    await seedStarterDemoData();
  };

  const handleRegisterRestaurant = async (newRestaurant: Restaurant) => {
    await saveRestaurantToDb(newRestaurant);
  };

  const handleDeleteRestaurant = async (id: string) => {
    await deleteRestaurantFromDb(id);
  };

  const handleRegisterRider = async (newRider: Rider) => {
    await saveRiderToDb(newRider);
  };

  const handleDeleteRider = async (id: string) => {
    await deleteRiderFromDb(id);
  };

  const handleDeleteOrder = async (id: string) => {
    await deleteOrderFromDb(id);
  };

  const handleCreateTestTicket = async () => {
    const testTicket: SupportTicket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      userType: 'customer',
      userName: 'Ayesha Siddiqui',
      subject: 'Food delayed past kitchen timer',
      message: 'Restaurant preparation took longer than promise timer. Requesting SLA compensation.',
      status: 'open',
      slaMinutes: 2,
      createdAt: 'Just now',
      priority: 'high',
      relatedOrderId: orders[0]?.id
    };
    await saveTicketToDb(testTicket);
  };

  // Fuel Engine
  const handleUpdateFuelConfig = async (newCfg: FuelEngineConfig) => {
    setFuelConfig(newCfg);
    await saveFuelConfigToDb(newCfg);
  };

  // Simulation Handlers
  const handleSimulatePetrolSpike = async () => {
    const newCfg = { ...fuelConfig, petrolPrice: 295 };
    setFuelConfig(newCfg);
    await saveFuelConfigToDb(newCfg);
    alert('Simulated Petrol Price Surge to Rs. 295/L! Fuel Engine recalculated fees in Firestore.');
  };

  const handleSimulateKitchenDelay = async () => {
    if (orders[0]) {
      const updated: Order = {
        ...orders[0],
        responsibility: 'restaurant',
        delayReason: 'Kitchen delayed by 18 mins past promise. Responsibility attributed 100% to Restaurant.',
      };
      await saveOrderToDb(updated);
      alert('Simulated Kitchen Delay! Responsibility Timeline attributed 100% to Restaurant in Firestore.');
    } else {
      alert('Place an order first to test live kitchen delay simulations.');
    }
  };

  const handleSimulateRiderSos = async () => {
    const riderName = riders[0]?.name || 'Zubair Ahmed';
    await handleSubmitIncident({
      reportedBy: 'rider',
      reporterName: riderName,
      targetType: 'emergency',
      targetName: 'Road SOS',
      category: 'Immediate Safety Emergency',
      details: 'SOS signal sent by rider from current GPS location.',
      status: 'under_review',
      reassuranceSent: true,
    });
    alert('Rider Emergency SOS Triggered! Logged into Firestore incidents.');
  };

  const handleSimulateCustomerSlaTicket = async () => {
    const newTck: SupportTicket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      userType: 'customer',
      userName: 'Ayesha Siddiqui',
      subject: 'Missing Cold Drink Item',
      message: 'Cold drink was missing from my Broast meal package.',
      status: 'resolved',
      slaMinutes: 0.8,
      aiResponse: 'SLA Auto-Approved: Rs. 150 instant credit refunded to MealLink Wallet for the missing item. We apologize!',
      createdAt: 'Just now',
      priority: 'high',
    };
    await saveTicketToDb(newTck);
    alert('Triggered Customer Missing Item Chat! SLA Auto-approved refund in <2 minutes.');
  };

  return (
    <div className="min-h-screen bg-[#0F110E] text-[#F5F5F0] font-sans antialiased flex flex-col">
      {/* Global Header */}
      <Navbar
        viewMode={viewMode}
        setViewMode={handleSelectPortal}
        happiness={happiness}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenSideMenu={() => setIsSideMenuOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {viewMode === 'customer' && (
          <CustomerApp
            restaurants={restaurants}
            orders={orders}
            onPlaceOrder={handlePlaceOrder}
            onAcceptBid={handleAcceptBid}
            onQuickSeedDemo={handleQuickSeedDemo}
            onSimulateRiderBid={handleSimulateRiderBid}
            onSubmitTicket={handleSubmitCustomerTicket}
          />
        )}

        {viewMode === 'rider' && (
          <RiderApp
            riders={riders}
            availableOrders={orders.filter((o) => !o.assignedRider)}
            activeOrder={orders.find((o) => o.assignedRider && o.status !== 'delivered')}
            incidents={incidents}
            onSubmitBid={handleRiderSubmitBid}
            onPickupOrder={handlePickupOrder}
            onDeliverOrder={handleDeliverOrder}
            onSubmitIncident={handleSubmitIncident}
            onRiderExplainDelay={handleRiderExplainDelay}
            onRegisterRider={handleRegisterRider}
            onQuickSeedDemo={handleQuickSeedDemo}
          />
        )}

        {viewMode === 'restaurant' && (
          <RestaurantPortal
            restaurants={restaurants}
            orders={orders}
            onMarkOrderReady={handleMarkOrderReady}
            onRegisterRestaurant={handleRegisterRestaurant}
            onQuickSeedDemo={handleQuickSeedDemo}
          />
        )}

        {viewMode === 'support' && (
          <SupportPortal
            tickets={tickets}
            orders={orders}
            incidents={incidents}
            restaurants={restaurants}
            riders={riders}
            onResolveTicket={handleResolveTicket}
            onEscalateTicket={handleEscalateTicket}
            onCreateTestTicket={handleCreateTestTicket}
          />
        )}

        {viewMode === 'admin' && (
          <AdminPortal
            happiness={happiness}
            fuelConfig={fuelConfig}
            orders={orders}
            tickets={tickets}
            incidents={incidents}
            restaurants={restaurants}
            riders={riders}
            onUpdateFuelConfig={handleUpdateFuelConfig}
            onResolveTicket={handleResolveTicket}
            onResolveIncident={handleResolveIncident}
            onAdminApproveEscalation={handleAdminApproveEscalation}
            onClearDatabase={handleClearDatabase}
            onQuickSeedDemo={handleQuickSeedDemo}
            onDeleteRestaurant={handleDeleteRestaurant}
            onDeleteRider={handleDeleteRider}
            onDeleteOrder={handleDeleteOrder}
          />
        )}
      </main>

      {/* Side Menu Drawer */}
      <SideMenu
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        activeView={viewMode}
        onSelectPortal={handleSelectPortal}
        authenticatedUsers={authenticatedUsers}
        onLogoutPortal={handleLogoutPortal}
        onOpenSimulations={() => setIsSimulatorOpen(true)}
      />

      {/* Category Login Modal */}
      {loginModalTarget && (
        <PortalLoginModal
          portalRole={loginModalTarget}
          isOpen={!!loginModalTarget}
          onClose={() => setLoginModalTarget(null)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Simulator Modal */}
      <SimulationControls
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onSimulatePetrolSpike={handleSimulatePetrolSpike}
        onSimulateKitchenDelay={handleSimulateKitchenDelay}
        onSimulateRiderSos={handleSimulateRiderSos}
        onSimulateCustomerSlaTicket={handleSimulateCustomerSlaTicket}
      />

      {/* Roblox-Style Slide-Up Floating Order Tri-Party Chat */}
      <RobloxOrderChat
        orders={orders}
        chatMessages={chatMessages}
        currentViewMode={viewMode}
        currentUser={authenticatedUsers[viewMode]}
      />
    </div>
  );
}
