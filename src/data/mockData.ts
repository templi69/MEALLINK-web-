import { Restaurant, Rider, Order, FuelEngineConfig, SupportTicket, IncidentReport } from '../types';

export const INITIAL_FUEL_CONFIG: FuelEngineConfig = {
  petrolPrice: 275, // Rs. 275/L
  basePerKm: 22,    // Rs. 22/km
  rushMultiplier: 1.2,
  rainMultiplier: 1.15,
  nightMultiplier: 1.0,
};

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Karachi Zinger & Broast',
    category: 'Burgers & Fried Chicken',
    rating: 4.8,
    deliveryTimeMins: 20,
    commissionRate: 10, // 10% vs 30% traditional
    respectScore: 96,
    avgRiderWaitMins: 3.2,
    complaintFreqPer100: 0.5,
    staffBehaviorRating: 4.9,
    bannerImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    address: 'Gulberg III, Main Boulevard, Lahore',
    menuItems: [
      {
        id: 'm1',
        name: 'Mighty Club Zinger Supreme',
        description: 'Crispy double fried fillet with secret cheese sauce & jalapeños',
        price: 690,
        category: 'Burgers',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',
        popular: true,
      },
      {
        id: 'm2',
        name: 'Crispy Broast (Quarter)',
        description: '2 Pieces golden broast with garlic mayo and dinner roll',
        price: 520,
        category: 'Chicken',
        image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=300&q=80',
        popular: true,
      },
      {
        id: 'm3',
        name: 'Loaded Pizza Fries',
        description: 'Crispy fries layered with melted mozzarella, pepperoni & oregano',
        price: 450,
        category: 'Sides',
        image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=300&q=80',
      }
    ],
  },
  {
    id: 'rest-2',
    name: 'Khan Biryani & Karahi House',
    category: 'Desi Cuisine',
    rating: 4.7,
    deliveryTimeMins: 25,
    commissionRate: 8, // 8% commission
    respectScore: 92,
    avgRiderWaitMins: 4.5,
    complaintFreqPer100: 1.1,
    staffBehaviorRating: 4.7,
    bannerImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    address: 'MM Alam Road, Gulberg, Lahore',
    menuItems: [
      {
        id: 'm4',
        name: 'Special Chicken Dum Biryani',
        description: 'Aromatic basmati rice cooked with spiced tender chicken leg piece',
        price: 480,
        category: 'Biryani',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80',
        popular: true,
      },
      {
        id: 'm5',
        name: 'Desi Ghee Mutton Karahi (Half)',
        description: 'Fresh mutton cooked in wok with ginger, tomatoes and green chilies',
        price: 1850,
        category: 'Karahi',
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=300&q=80',
        popular: true,
      },
      {
        id: 'm6',
        name: 'Garlic Roghani Naan (2 pcs)',
        description: 'Oven baked tandoori naan brushed with fresh butter & sesame',
        price: 120,
        category: 'Breads',
        image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=300&q=80',
      }
    ],
  },
  {
    id: 'rest-3',
    name: 'Artisan Woodfire Pizza',
    category: 'Italian & Artisan Pizza',
    rating: 4.9,
    deliveryTimeMins: 18,
    commissionRate: 10,
    respectScore: 98,
    avgRiderWaitMins: 2.1,
    complaintFreqPer100: 0.2,
    staffBehaviorRating: 5.0,
    bannerImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    address: 'DHA Phase 5, Commercial Area, Lahore',
    menuItems: [
      {
        id: 'm7',
        name: 'Truffle Mushroom & Smoked Chicken',
        description: 'Hand-tossed sourdough pizza with truffle cream & fresh basil',
        price: 1390,
        category: 'Pizzas',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80',
        popular: true,
      },
      {
        id: 'm8',
        name: 'Classico Pepperoni Burst',
        description: 'Double beef pepperoni with buffalo mozzarella and spicy honey drizzle',
        price: 1250,
        category: 'Pizzas',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=300&q=80',
      },
      {
        id: 'm9',
        name: 'Nutella Calzone Bites',
        description: 'Warm oven baked dough stuffed with hazelnut Nutella & powdered sugar',
        price: 490,
        category: 'Dessert',
        image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=300&q=80',
      }
    ],
  }
];

export const INITIAL_RIDERS: Rider[] = [
  {
    id: 'rider-101',
    name: 'Tariq Mehmood',
    phone: '+92 301 8849201',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 4.9,
    vehicle: 'Honda CD70 Red (LHR-4921)',
    deliveriesCompleted: 1420,
    earningsToday: 3450,
    safetyScore: 99,
    status: 'available',
    currentLocationName: 'Gulberg III, Near Main Market',
  },
  {
    id: 'rider-102',
    name: 'Usman Ali Khan',
    phone: '+92 321 7731920',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 4.8,
    vehicle: 'Yamaha YBR 125 Black (LHR-8810)',
    deliveriesCompleted: 890,
    earningsToday: 2890,
    safetyScore: 97,
    status: 'available',
    currentLocationName: 'DHA Phase 3, Y Block',
  },
  {
    id: 'rider-103',
    name: 'Hamza Shahid',
    phone: '+92 333 4410982',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 4.95,
    vehicle: 'Suzuki GS150 Blue (LHR-1102)',
    deliveriesCompleted: 2100,
    earningsToday: 4120,
    safetyScore: 100,
    status: 'available',
    currentLocationName: 'Model Town, Link Road',
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-8921',
    customerName: 'Ayesha Siddiqui',
    customerPhone: '+92 300 5512390',
    deliveryAddress: 'House 42, Block B, Model Town, Lahore',
    restaurantId: 'rest-1',
    restaurantName: 'Karachi Zinger & Broast',
    restaurantImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',
    items: [
      {
        item: {
          id: 'm1',
          name: 'Mighty Club Zinger Supreme',
          description: 'Crispy double fried fillet with secret cheese sauce',
          price: 690,
          category: 'Burgers',
          image: '',
        },
        quantity: 2,
      },
      {
        item: {
          id: 'm3',
          name: 'Loaded Pizza Fries',
          description: 'Crispy fries with cheese & pepperoni',
          price: 450,
          category: 'Sides',
          image: '',
        },
        quantity: 1,
      }
    ],
    subtotal: 1830,
    baseDeliveryFee: 110,
    finalDeliveryFee: 125, // InDrive bid accepted!
    platformFee: 15,
    totalAmount: 1970,
    status: 'in_transit',
    
    // Responsibility Timeline
    restaurantPromiseMins: 15,
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(), // 18 mins ago
    restaurantReadyAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    pickedUpAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    estimatedDeliveryMins: 12,
    actualPrepMins: 12,
    actualTransitMins: 4,
    responsibility: 'none',
    transitProgressPercent: 65,
    
    riderBids: [
      {
        riderId: 'rider-101',
        riderName: 'Tariq Mehmood',
        riderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        riderPhone: '+92 301 8849201',
        rating: 4.9,
        vehicle: 'Honda CD70',
        deliveriesCount: 1420,
        baseFee: 110,
        proposedFee: 125,
        etaMins: 12,
        status: 'accepted',
      },
      {
        riderId: 'rider-102',
        riderName: 'Usman Ali Khan',
        riderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        riderPhone: '+92 321 7731920',
        rating: 4.8,
        vehicle: 'Yamaha YBR 125',
        deliveriesCount: 890,
        baseFee: 110,
        proposedFee: 110,
        etaMins: 15,
        status: 'rejected',
      }
    ],
    assignedRider: INITIAL_RIDERS[0],
  },
  {
    id: 'ORD-8922',
    customerName: 'Zain Malik',
    customerPhone: '+92 322 9912044',
    deliveryAddress: 'Flat 301, Pace Tower, Gulberg III',
    restaurantId: 'rest-2',
    restaurantName: 'Khan Biryani & Karahi House',
    restaurantImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80',
    items: [
      {
        item: {
          id: 'm4',
          name: 'Special Chicken Dum Biryani',
          description: 'Aromatic basmati rice cooked with chicken',
          price: 480,
          category: 'Biryani',
          image: '',
        },
        quantity: 2,
      }
    ],
    subtotal: 960,
    baseDeliveryFee: 90,
    finalDeliveryFee: 90,
    platformFee: 15,
    totalAmount: 1065,
    status: 'preparing',
    restaurantPromiseMins: 18,
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    estimatedDeliveryMins: 15,
    responsibility: 'none',
    transitProgressPercent: 0,
    riderBids: [
      {
        riderId: 'rider-102',
        riderName: 'Usman Ali Khan',
        riderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        riderPhone: '+92 321 7731920',
        rating: 4.8,
        vehicle: 'Yamaha YBR 125',
        deliveriesCount: 890,
        baseFee: 90,
        proposedFee: 100,
        etaMins: 14,
        status: 'pending',
      },
      {
        riderId: 'rider-103',
        riderName: 'Hamza Shahid',
        riderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        riderPhone: '+92 333 4410982',
        rating: 4.95,
        vehicle: 'Suzuki GS150',
        deliveriesCount: 2100,
        baseFee: 90,
        proposedFee: 90,
        etaMins: 12,
        status: 'pending',
      }
    ],
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-1092',
    userType: 'rider',
    userName: 'Tariq Mehmood',
    subject: 'Excessive Wait Time at Restaurant',
    message: 'Restaurant kitchen was delayed by 25 mins past promise time. Please verify responsibility log so my rider score is protected.',
    status: 'resolved',
    slaMinutes: 0,
    aiResponse: 'Relax. Your report has been verified against kitchen timestamps. Delay attributed 100% to Restaurant. Zero penalty applied to rider.',
    createdAt: '10 mins ago',
    priority: 'medium',
  },
  {
    id: 'TCK-1093',
    userType: 'customer',
    userName: 'Farhan Zaidi',
    subject: 'Missing Drink Item',
    message: 'Cold drink was missing from my Broast meal package.',
    status: 'investigating',
    slaMinutes: 1.5, // SLA < 2 min
    aiResponse: 'SLA Auto-Approved: Rs. 150 instant credit refunded to MealLink Wallet for the missing item. We sincerely apologize!',
    createdAt: '1 min ago',
    priority: 'high',
  }
];

export const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    id: 'INC-701',
    reportedBy: 'rider',
    reporterName: 'Usman Ali Khan',
    targetType: 'restaurant',
    targetName: 'Royal Spice Kitchen',
    category: 'Rude staff & seating denial',
    details: 'Rider seating bench was blocked by boxes and staff refused drinking water access during 42°C heat.',
    status: 'action_taken',
    reassuranceSent: true,
    timestamp: '25 mins ago',
  }
];
