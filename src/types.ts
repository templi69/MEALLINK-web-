export type ViewMode = 'customer' | 'rider' | 'restaurant' | 'admin' | 'support';

export type UserRole = 'customer' | 'rider' | 'restaurant' | 'support' | 'admin';

export interface PortalUser {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  portalName: string;
  avatar?: string;
}

export type OrderStatus =
  | 'placed'
  | 'bidding'
  | 'accepted'
  | 'preparing'
  | 'ready_for_pickup'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export type DelayResponsibility =
  | 'none'
  | 'restaurant'
  | 'rider'
  | 'traffic'
  | 'customer';

export interface RiderBid {
  riderId: string;
  riderName: string;
  riderAvatar: string;
  riderPhone: string;
  rating: number;
  vehicle: string;
  deliveriesCount: number;
  baseFee: number;
  proposedFee: number;
  etaMins: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  popular?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  rating: number;
  deliveryTimeMins: number;
  commissionRate: number; // e.g. 10 (for 10%)
  respectScore: number; // 0 - 100
  avgRiderWaitMins: number;
  complaintFreqPer100: number;
  staffBehaviorRating: number;
  bannerImage: string;
  address: string;
  menuItems: MenuItem[];
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  rating: number;
  vehicle: string;
  deliveriesCompleted: number;
  earningsToday: number;
  safetyScore: number;
  status: 'available' | 'bidding' | 'delivering' | 'offline';
  currentLocationName: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  items: { item: MenuItem; quantity: number }[];
  subtotal: number;
  baseDeliveryFee: number;
  finalDeliveryFee: number;
  platformFee: number;
  totalAmount: number;
  status: OrderStatus;
  
  // Responsibility Timeline
  restaurantPromiseMins: number;
  createdAt: string;
  restaurantReadyAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  estimatedDeliveryMins: number;
  actualPrepMins?: number;
  actualTransitMins?: number;
  responsibility: DelayResponsibility;
  delayReason?: string;
  
  // InDrive Bidding
  riderBids: RiderBid[];
  assignedRider?: Rider;

  // Real-time position (0% to 100% on route)
  transitProgressPercent: number;
}

export interface FuelEngineConfig {
  petrolPrice: number; // e.g. 275 (Rs/L)
  basePerKm: number; // e.g. 22
  rushMultiplier: number; // e.g. 1.2
  rainMultiplier: number; // e.g. 1.15
  nightMultiplier: number; // e.g. 1.05
}

export interface EcosystemHappiness {
  customerHappiness: number; // 0 - 100
  riderHappiness: number; // 0 - 100
  restaurantHappiness: number; // 0 - 100
  supportQuality: number; // 0 - 100
  overallScore: number; // Weighted calculation
  status: 'optimal' | 'warning' | 'critical';
}

export interface SupportTicket {
  id: string;
  userType: 'customer' | 'rider' | 'restaurant';
  userName: string;
  subject: string;
  message: string;
  status: 'open' | 'investigating' | 'resolved';
  slaMinutes: number; // SLA countdown
  aiResponse?: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  
  // Escalation & Investigation Fields
  assignedAgent?: string;
  relatedOrderId?: string;
  requiresAdminApproval?: boolean;
  escalationReason?: string;
  escalationType?: 'large_refund' | 'suspend_user' | 'penalty_override' | 'commission_adj';
  escalationAmount?: number;
  adminApprovalStatus?: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  investigationNotes?: string[];
}

export interface IncidentReport {
  id: string;
  reportedBy: 'rider' | 'restaurant' | 'customer';
  reporterName: string;
  targetType: 'restaurant' | 'customer' | 'road' | 'emergency';
  targetName: string;
  category: string; // e.g. "Rude staff", "Customer fake pin", "Accident / SOS", "Long wait"
  details: string;
  status: 'under_review' | 'action_taken' | 'dismissed';
  reassuranceSent: boolean;
  timestamp: string;
}
