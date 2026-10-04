import { db, auth } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  writeBatch
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

/*
  Firebase Cloud Service for Krishna General Store
  ------------------------------------------------
  Provides real-time cloud synchronization for:
  - Products catalog & live stock counts
  - POS Billing invoices & thermal receipt data
  - Customer online orders
  - Customers CRM & loyalty points
  - Digital Khata Book (Udhar Ledger)
  - Store metadata & tax settings
*/

// Check and seed initial store data if Firestore is fresh
export async function seedFirestoreIfEmpty(seedData) {
  try {
    const productsSnap = await getDocs(collection(db, "products"));
    if (productsSnap.empty && seedData.products && seedData.products.length > 0) {
      console.log("Seeding initial store data to Cloud Firestore...");
      const batch = writeBatch(db);

      // Seed Products
      seedData.products.forEach((p) => {
        const ref = doc(db, "products", p.id.toString());
        batch.set(ref, p);
      });

      // Seed Customers
      if (seedData.customers) {
        seedData.customers.forEach((c) => {
          const ref = doc(db, "customers", c.id.toString());
          batch.set(ref, c);
        });
      }

      // Seed Khata Ledger
      if (seedData.khataLedger) {
        seedData.khataLedger.forEach((k) => {
          const ref = doc(db, "khataLedger", k.id.toString());
          batch.set(ref, k);
        });
      }

      // Seed Sales
      if (seedData.sales) {
        seedData.sales.forEach((s) => {
          const ref = doc(db, "sales", s.id.toString());
          batch.set(ref, s);
        });
      }

      // Seed Settings
      if (seedData.settings) {
        const settingsRef = doc(db, "metadata", "settings");
        batch.set(settingsRef, seedData.settings);
      }

      await batch.commit();
      console.log("Firestore successfully seeded with initial store catalog!");
    }
  } catch (err) {
    console.warn("Firestore seed check encountered an issue (using local state fallback):", err);
  }
}

// Real-Time Subscriptions
export function subscribeToProducts(callback) {
  try {
    return onSnapshot(collection(db, "products"), (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((d) => d.data());
        callback(items);
      }
    }, (err) => console.warn("Products sync warning:", err));
  } catch (e) {
    console.warn("Product listener initialization failed", e);
    return () => {};
  }
}

export function subscribeToSales(callback) {
  try {
    return onSnapshot(collection(db, "sales"), (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((d) => d.data());
        callback(items);
      }
    }, (err) => console.warn("Sales sync warning:", err));
  } catch (e) {
    return () => {};
  }
}

export function subscribeToOrders(callback) {
  try {
    return onSnapshot(collection(db, "orders"), (snapshot) => {
      const items = snapshot.docs.map((d) => d.data());
      callback(items);
    }, (err) => console.warn("Orders sync warning:", err));
  } catch (e) {
    return () => {};
  }
}

export function subscribeToCustomers(callback) {
  try {
    return onSnapshot(collection(db, "customers"), (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((d) => d.data());
        callback(items);
      }
    }, (err) => console.warn("Customers sync warning:", err));
  } catch (e) {
    return () => {};
  }
}

export function subscribeToKhata(callback) {
  try {
    return onSnapshot(collection(db, "khataLedger"), (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((d) => d.data());
        callback(items);
      }
    }, (err) => console.warn("Khata sync warning:", err));
  } catch (e) {
    return () => {};
  }
}

export function subscribeToSettings(callback) {
  try {
    return onSnapshot(doc(db, "metadata", "settings"), (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      }
    }, (err) => console.warn("Settings sync warning:", err));
  } catch (e) {
    return () => {};
  }
}

// Database Write Operations (Safe with local fallback)
export async function saveProductToDb(product) {
  try {
    await setDoc(doc(db, "products", product.id.toString()), product);
  } catch (err) {
    console.warn("Cloud save product failed, kept locally:", err);
  }
}

export async function updateProductInDb(id, fields) {
  try {
    await updateDoc(doc(db, "products", id.toString()), fields);
  } catch (err) {
    console.warn("Cloud update product failed, updated locally:", err);
  }
}

export async function deleteProductFromDb(id) {
  try {
    await deleteDoc(doc(db, "products", id.toString()));
  } catch (err) {
    console.warn("Cloud delete product failed:", err);
  }
}

export async function saveSaleToDb(sale, updatedProducts = []) {
  try {
    const batch = writeBatch(db);
    batch.set(doc(db, "sales", sale.id.toString()), sale);
    
    // Batch update depleted stocks in products
    updatedProducts.forEach((p) => {
      batch.set(doc(db, "products", p.id.toString()), p, { merge: true });
    });

    await batch.commit();
  } catch (err) {
    console.warn("Cloud save sale failed, recorded locally:", err);
  }
}

export async function saveOrderToDb(order) {
  try {
    await setDoc(doc(db, "orders", order.id.toString()), order);
  } catch (err) {
    console.warn("Cloud save order failed, saved locally:", err);
  }
}

export async function updateOrderStatusInDb(orderId, newStatus) {
  try {
    await updateDoc(doc(db, "orders", orderId.toString()), { status: newStatus });
  } catch (err) {
    console.warn("Cloud update order status failed:", err);
  }
}

export async function saveCustomerToDb(customer) {
  try {
    await setDoc(doc(db, "customers", customer.id.toString()), customer);
  } catch (err) {
    console.warn("Cloud save customer failed:", err);
  }
}

export async function saveKhataEntryToDb(entry) {
  try {
    await setDoc(doc(db, "khataLedger", entry.id.toString()), entry);
  } catch (err) {
    console.warn("Cloud save khata entry failed:", err);
  }
}

export async function saveSettingsToDb(settings) {
  try {
    await setDoc(doc(db, "metadata", "settings"), settings);
  } catch (err) {
    console.warn("Cloud save settings failed:", err);
  }
}

// Authentication Helpers
export async function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function registerUser(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function logoutUser() {
  return signOut(auth);
}

export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, callback);
}
