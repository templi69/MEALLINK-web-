import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, config.firestoreDatabaseId)
  : getFirestore(app);

async function clearCollections() {
  const collectionsToClear = ['orders', 'tickets', 'incidents', 'restaurants', 'riders'];
  console.log('Starting clear on database:', config.firestoreDatabaseId);

  for (const collName of collectionsToClear) {
    const colRef = collection(db, collName);
    const snap = await getDocs(colRef);
    console.log(`Clearing collection '${collName}': found ${snap.size} documents.`);
    for (const d of snap.docs) {
      await deleteDoc(d.ref);
    }
    console.log(`Cleared '${collName}'.`);
  }

  // Reset config/fuel to base empty or default configuration
  await setDoc(doc(db, 'config', 'fuel'), {
    petrolPrice: 265,
    basePerKm: 18,
    rushMultiplier: 1.0,
    rainMultiplier: 1.0,
    nightMultiplier: 1.15
  });

  // Reset config/happiness to fresh baseline
  await setDoc(doc(db, 'config', 'happiness'), {
    customerHappiness: 100,
    riderHappiness: 100,
    restaurantHappiness: 100,
    supportQuality: 100,
    overallScore: 100,
    status: 'optimal'
  });

  console.log('Database successfully cleared of all shop, rider, order, and incident records!');
  process.exit(0);
}

clearCollections().catch(err => {
  console.error('Error clearing database:', err);
  process.exit(1);
});
