import {
  db,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  onSnapshot,
  collection,
  getDocs
} from './firebase';
import {
  Order,
  SupportTicket,
  IncidentReport,
  FuelEngineConfig,
  EcosystemHappiness,
  Restaurant,
  Rider
} from '../types';

export const DEFAULT_FUEL_CONFIG: FuelEngineConfig = {
  petrolPrice: 265,
  basePerKm: 18,
  rushMultiplier: 1.0,
  rainMultiplier: 1.0,
  nightMultiplier: 1.15
};

export const DEFAULT_HAPPINESS: EcosystemHappiness = {
  customerHappiness: 100,
  riderHappiness: 100,
  restaurantHappiness: 100,
  supportQuality: 100,
  overallScore: 100,
  status: 'optimal'
};

// Ensure basic platform config exists in Firestore without seeding fake orders/shops
export async function initializeFirestoreDatabase() {
  try {
    const fuelDocRef = doc(db, 'config', 'fuel');
    const fuelSnap = await getDoc(fuelDocRef);
    if (!fuelSnap.exists()) {
      await setDoc(fuelDocRef, DEFAULT_FUEL_CONFIG);
    }

    const happinessDocRef = doc(db, 'config', 'happiness');
    const happinessSnap = await getDoc(happinessDocRef);
    if (!happinessSnap.exists()) {
      await setDoc(happinessDocRef, DEFAULT_HAPPINESS);
    }
  } catch (err) {
    console.warn('Firestore initialization note:', err);
  }
}

// Clear all database collections in real-time
export async function clearAllDatabaseRecords() {
  const collections = ['orders', 'tickets', 'incidents', 'restaurants', 'riders'];
  for (const collName of collections) {
    const colRef = collection(db, collName);
    const snap = await getDocs(colRef);
    for (const d of snap.docs) {
      await deleteDoc(d.ref);
    }
  }

  await setDoc(doc(db, 'config', 'fuel'), DEFAULT_FUEL_CONFIG);
  await setDoc(doc(db, 'config', 'happiness'), DEFAULT_HAPPINESS);
}

// Real-time listener subscriptions (ALWAYS pass the updated list, even if empty)
export function subscribeToRestaurants(onUpdate: (restaurants: Restaurant[]) => void) {
  return onSnapshot(collection(db, 'restaurants'), (snapshot) => {
    const list: Restaurant[] = [];
    snapshot.forEach((d) => list.push(d.data() as Restaurant));
    onUpdate(list);
  }, (err) => console.warn('Restaurants listener fallback:', err));
}

export function subscribeToRiders(onUpdate: (riders: Rider[]) => void) {
  return onSnapshot(collection(db, 'riders'), (snapshot) => {
    const list: Rider[] = [];
    snapshot.forEach((d) => list.push(d.data() as Rider));
    onUpdate(list);
  }, (err) => console.warn('Riders listener fallback:', err));
}

export function subscribeToOrders(onUpdate: (orders: Order[]) => void) {
  return onSnapshot(collection(db, 'orders'), (snapshot) => {
    const list: Order[] = [];
    snapshot.forEach((d) => list.push(d.data() as Order));
    // Sort orders by newest first if createdAt exists
    list.sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });
    onUpdate(list);
  }, (err) => console.warn('Orders listener fallback:', err));
}

export function subscribeToTickets(onUpdate: (tickets: SupportTicket[]) => void) {
  return onSnapshot(collection(db, 'tickets'), (snapshot) => {
    const list: SupportTicket[] = [];
    snapshot.forEach((d) => list.push(d.data() as SupportTicket));
    onUpdate(list);
  }, (err) => console.warn('Tickets listener fallback:', err));
}

export function subscribeToIncidents(onUpdate: (incidents: IncidentReport[]) => void) {
  return onSnapshot(collection(db, 'incidents'), (snapshot) => {
    const list: IncidentReport[] = [];
    snapshot.forEach((d) => list.push(d.data() as IncidentReport));
    onUpdate(list);
  }, (err) => console.warn('Incidents listener fallback:', err));
}

export function subscribeToFuelConfig(onUpdate: (config: FuelEngineConfig) => void) {
  return onSnapshot(doc(db, 'config', 'fuel'), (docSnap) => {
    if (docSnap.exists()) {
      onUpdate(docSnap.data() as FuelEngineConfig);
    }
  }, (err) => console.warn('Fuel config listener fallback:', err));
}

export function subscribeToHappiness(onUpdate: (happiness: EcosystemHappiness) => void) {
  return onSnapshot(doc(db, 'config', 'happiness'), (docSnap) => {
    if (docSnap.exists()) {
      onUpdate(docSnap.data() as EcosystemHappiness);
    }
  }, (err) => console.warn('Happiness listener fallback:', err));
}

// DB Write Helpers
export async function saveRestaurantToDb(restaurant: Restaurant) {
  try {
    await setDoc(doc(db, 'restaurants', restaurant.id), restaurant, { merge: true });
  } catch (err) {
    console.error('Error saving restaurant to Firestore:', err);
  }
}

export async function deleteRestaurantFromDb(id: string) {
  try {
    await deleteDoc(doc(db, 'restaurants', id));
  } catch (err) {
    console.error('Error deleting restaurant from Firestore:', err);
  }
}

export async function saveRiderToDb(rider: Rider) {
  try {
    await setDoc(doc(db, 'riders', rider.id), rider, { merge: true });
  } catch (err) {
    console.error('Error saving rider to Firestore:', err);
  }
}

export async function deleteRiderFromDb(id: string) {
  try {
    await deleteDoc(doc(db, 'riders', id));
  } catch (err) {
    console.error('Error deleting rider from Firestore:', err);
  }
}

export async function saveOrderToDb(order: Order) {
  try {
    await setDoc(doc(db, 'orders', order.id), order, { merge: true });
  } catch (err) {
    console.error('Error saving order to Firestore:', err);
  }
}

export async function deleteOrderFromDb(id: string) {
  try {
    await deleteDoc(doc(db, 'orders', id));
  } catch (err) {
    console.error('Error deleting order from Firestore:', err);
  }
}

export async function saveTicketToDb(ticket: SupportTicket) {
  try {
    await setDoc(doc(db, 'tickets', ticket.id), ticket, { merge: true });
  } catch (err) {
    console.error('Error saving ticket to Firestore:', err);
  }
}

export async function saveIncidentToDb(incident: IncidentReport) {
  try {
    await setDoc(doc(db, 'incidents', incident.id), incident, { merge: true });
  } catch (err) {
    console.error('Error saving incident to Firestore:', err);
  }
}

export async function saveFuelConfigToDb(config: FuelEngineConfig) {
  try {
    await setDoc(doc(db, 'config', 'fuel'), config, { merge: true });
  } catch (err) {
    console.error('Error saving fuel config to Firestore:', err);
  }
}

export async function saveHappinessToDb(happiness: EcosystemHappiness) {
  try {
    await setDoc(doc(db, 'config', 'happiness'), happiness, { merge: true });
  } catch (err) {
    console.error('Error saving happiness score to Firestore:', err);
  }
}

// 1-Click Starter Demo Data for testing live real-time network
export async function seedStarterDemoData() {
  const starterShop: Restaurant = {
    id: 'rest-lahore-spices',
    name: 'Lahore Biryani & Grill House',
    category: 'Desi & Biryani',
    rating: 4.9,
    deliveryTimeMins: 25,
    commissionRate: 10,
    respectScore: 98,
    avgRiderWaitMins: 3.5,
    complaintFreqPer100: 0.1,
    staffBehaviorRating: 4.95,
    bannerImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    address: 'Shop 14, Main Boulevard, Gulberg III, Lahore',
    menuItems: [
      {
        id: 'item-demo-1',
        name: 'Special Chicken Dum Biryani',
        description: 'Aromatic long-grain basmati with marinated chicken, saffron, and potato.',
        price: 350,
        category: 'Mains',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60',
        popular: true,
      },
      {
        id: 'item-demo-2',
        name: 'Charcoal Seekh Kebab (4 Pcs)',
        description: 'Tender minced beef infused with coriander and whole spices, chargrilled.',
        price: 420,
        category: 'Starters',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60',
        popular: true,
      },
      {
        id: 'item-demo-3',
        name: 'Crispy Zinger Burger & Fries',
        description: 'Golden fried chicken breast fillet with spicy secret mayo on toasted brioche.',
        price: 390,
        category: 'Fast Food',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60',
        popular: true,
      },
      {
        id: 'item-demo-4',
        name: 'Gourmet Mint Margarita 500ml',
        description: 'Crushed ice with fresh garden mint, Himalayan black salt, and sparkling lemon.',
        price: 150,
        category: 'Drinks',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60',
      }
    ]
  };

  const starterRider: Rider = {
    id: 'rider-zubair-ahmed',
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

  await saveRestaurantToDb(starterShop);
  await saveRiderToDb(starterRider);
}

