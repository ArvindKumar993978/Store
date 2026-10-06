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

// Helper to strip undefined values so Firestore does not reject writes
export function sanitizeForFirestore(obj) {
  if (!obj || typeof obj !== "object") return obj;
  const clean = {};
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    if (val === undefined) {
      clean[key] = null;
    } else if (Array.isArray(val)) {
      clean[key] = val.map((item) => (typeof item === "object" && item !== null ? sanitizeForFirestore(item) : item));
    } else if (val !== null && typeof val === "object" && !(val instanceof Date)) {
      clean[key] = sanitizeForFirestore(val);
    } else {
      clean[key] = val;
    }
  });
  return clean;
}

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
        batch.set(ref, sanitizeForFirestore(p));
      });

      // Seed Customers
      if (seedData.customers) {
        seedData.customers.forEach((c) => {
          const ref = doc(db, "customers", c.id.toString());
          batch.set(ref, sanitizeForFirestore(c));
        });
      }

      // Seed Khata Ledger
      if (seedData.khataLedger) {
        seedData.khataLedger.forEach((k) => {
          const ref = doc(db, "khataLedger", k.id.toString());
          batch.set(ref, sanitizeForFirestore(k));
        });
      }

      // Seed Sales
      if (seedData.sales) {
        seedData.sales.forEach((s) => {
          const ref = doc(db, "sales", s.id.toString());
          batch.set(ref, sanitizeForFirestore(s));
        });
      }

      // Seed Settings
      if (seedData.settings) {
        const settingsRef = doc(db, "metadata", "settings");
        batch.set(settingsRef, sanitizeForFirestore(seedData.settings));
      }

      // Seed Staff
      if (seedData.staff) {
        seedData.staff.forEach((st) => {
          const ref = doc(db, "staff", st.id.toString());
          batch.set(ref, sanitizeForFirestore(st));
        });
      }

      // Seed Orders
      if (seedData.orders && seedData.orders.length > 0) {
        seedData.orders.forEach((ord) => {
          const ref = doc(db, "orders", ord.id.toString());
          batch.set(ref, sanitizeForFirestore(ord));
        });
      }

      await batch.commit();
      console.log("Firestore successfully seeded with initial store catalog & orders!");
    } else {
      // If products exist, check if staff collection needs standalone seeding
      const staffSnap = await getDocs(collection(db, "staff"));
      if (staffSnap.empty && seedData.staff && seedData.staff.length > 0) {
        const staffBatch = writeBatch(db);
        seedData.staff.forEach((st) => {
          const ref = doc(db, "staff", st.id.toString());
          staffBatch.set(ref, sanitizeForFirestore(st));
        });
        await staffBatch.commit();
        console.log("Firestore seeded with staff directory.");
      }

      // Check if orders collection needs standalone seeding
      const ordersSnap = await getDocs(collection(db, "orders"));
      if (ordersSnap.empty && seedData.orders && seedData.orders.length > 0) {
        const orderBatch = writeBatch(db);
        seedData.orders.forEach((ord) => {
          const ref = doc(db, "orders", ord.id.toString());
          orderBatch.set(ref, sanitizeForFirestore(ord));
        });
        await orderBatch.commit();
        console.log("Firestore seeded with customer orders.");
      }
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
      if (!snapshot.empty) {
        const items = snapshot.docs.map((d) => d.data());
        callback(items);
      }
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

export function subscribeToStaff(callback) {
  try {
    return onSnapshot(collection(db, "staff"), (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((d) => d.data());
        callback(items);
      }
    }, (err) => console.warn("Staff sync warning:", err));
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
    const cleanOrder = sanitizeForFirestore(order);
    await setDoc(doc(db, "orders", order.id.toString()), cleanOrder, { merge: true });
    console.log("Order saved to Cloud Firestore successfully:", order.id);
    return true;
  } catch (err) {
    console.warn("Cloud save order failed, saved locally:", err);
    return false;
  }
}

export async function updateOrderStatusInDb(orderId, newStatus) {
  try {
    await updateDoc(doc(db, "orders", orderId.toString()), { 
      status: newStatus,
      updatedAt: new Date().toISOString()
    });
    console.log(`Order ${orderId} status updated to ${newStatus} in Cloud Firestore`);
    return true;
  } catch (err) {
    console.warn("Cloud update order status failed:", err);
    return false;
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

export async function saveStaffToDb(staffMember) {
  try {
    const id = staffMember.id ? staffMember.id.toString() : Date.now().toString();
    await setDoc(doc(db, "staff", id), staffMember, { merge: true });
  } catch (err) {
    console.warn("Cloud save staff failed:", err);
  }
}

export async function updateStaffInDb(id, fields) {
  try {
    await updateDoc(doc(db, "staff", id.toString()), fields);
  } catch (err) {
    console.warn("Cloud update staff failed:", err);
  }
}

export async function deleteStaffFromDb(id) {
  try {
    await deleteDoc(doc(db, "staff", id.toString()));
  } catch (err) {
    console.warn("Cloud delete staff failed:", err);
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
