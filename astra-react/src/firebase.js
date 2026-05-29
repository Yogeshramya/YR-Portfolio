import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// =========================================================================
// YR Digital Enterprises - Firebase Client Configuration
// Reads dynamically from Vite environment variables (defined in your .env file).
// If empty, the system automatically falls back to secure Local Sandbox Mode!
// =========================================================================
// Clean utility to check and sanitize keys
const cleanEnvValue = (val) => {
  if (!val) return "";
  const cleaned = val.trim().replace(/^["']|["']$/g, ''); // Strip leading/trailing double or single quotes
  return cleaned === "" || cleaned.includes("YOUR_") ? "" : cleaned;
};

const firebaseConfig = {
  apiKey: cleanEnvValue(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: cleanEnvValue(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: cleanEnvValue(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: cleanEnvValue(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanEnvValue(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: cleanEnvValue(import.meta.env.VITE_FIREBASE_APP_ID)
};

// Verify if the configuration keys are valid active credentials
const isFirebaseConfigured = 
  firebaseConfig.apiKey && 
  firebaseConfig.authDomain && 
  firebaseConfig.projectId;

let app;
let auth = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("🚀 Google Firebase client connected successfully via Environment Variables!");
  } catch (error) {
    console.warn("Failed to initialize Firebase SDK client. Falling back to Local Mock Database.", error);
  }
}

export { app, auth, db, isFirebaseConfigured };
