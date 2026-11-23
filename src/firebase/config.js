import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

/**
 * Firebase Client Web Configuration
 * Sourced strictly from Vite environment variables (prefixed with VITE_)
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

/**
 * Check if the Firebase configuration contains real, non-placeholder credentials
 */
export const checkFirebaseConfigStatus = () => {
  const missingVars = [];
  const requiredVars = [
    { name: 'VITE_FIREBASE_API_KEY', value: firebaseConfig.apiKey },
    { name: 'VITE_FIREBASE_AUTH_DOMAIN', value: firebaseConfig.authDomain },
    { name: 'VITE_FIREBASE_PROJECT_ID', value: firebaseConfig.projectId },
    { name: 'VITE_FIREBASE_STORAGE_BUCKET', value: firebaseConfig.storageBucket },
    { name: 'VITE_FIREBASE_MESSAGING_SENDER_ID', value: firebaseConfig.messagingSenderId },
    { name: 'VITE_FIREBASE_APP_ID', value: firebaseConfig.appId },
  ];

  for (const v of requiredVars) {
    if (!v.value || v.value.includes('ExampleKey') || v.value.includes('DummyDevKey') || v.value === '123456789012') {
      missingVars.push(v.name);
    }
  }

  const isConfigured = missingVars.length === 0;

  return {
    isConfigured,
    missingVars
  };
};

export const isFirebaseConfigured = checkFirebaseConfigStatus().isConfigured;

// Initialize Firebase App safely as a singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Export Firebase Authentication & Firestore Database
export const auth = getAuth(app);
export const db = getFirestore(app);

// Optional Analytics initialization in browser
export let analytics = null;
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics is optional and non-blocking
  });
}

export default app;
