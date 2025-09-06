import admin from 'firebase-admin';

// Import your service account JSON file
import serviceAccount from './service.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: "odoo-549b4.firebasestorage.app",
  });
}

// Admin services
const adminDb = admin.firestore();
const adminAuth = admin.auth();
const adminStorage = admin.storage();

export { adminDb as db, adminAuth as auth, adminStorage as storage, admin };
