import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your Firebase configuration from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCwg-1AdZVAN-DBtHLgkUYTU7cMhNbYojE",
  authDomain: "store-for-all-c42fa.firebaseapp.com",
  projectId: "store-for-all-c42fa",
  storageBucket: "store-for-all-c42fa.firebasestorage.app",
  messagingSenderId: "632956842036",
  appId: "1:632956842036:web:f96adb4be074a7468c9a61",
  measurementId: "G-S2PPY745WX"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore with offline persistence
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { app, db, auth };
export default db;
