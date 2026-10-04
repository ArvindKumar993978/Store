import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

/*
  AuthContext
  -----------
  Unified Authentication Provider for Krishna General Store:
  - Admin (Shop Owner)
  - Staff / Cashier / Manager
  - Customer (Login, Sign Up & Guest Shopping)
*/

const AUTH_STORAGE_KEY = "krishna_store_auth_user_v1";

// Default Seed Accounts for Quick Testing
export const DEFAULT_ACCOUNTS = {
  admin: {
    email: "admin@krishnastore.in",
    password: "admin123",
    pin: "1234",
    name: "Krishna Murthy",
    role: "admin",
    roleTitle: "Shop Owner / Admin"
  },
  staffList: [
    {
      id: "STF-101",
      name: "Priya Iyer",
      email: "priya.i@krishnastore.in",
      pin: "1111",
      role: "staff",
      roleTitle: "Cashier",
      phone: "+91 98765 11111"
    },
    {
      id: "STF-102",
      name: "Rajesh Kumar",
      email: "rajesh.k@krishnastore.in",
      pin: "2222",
      role: "staff",
      roleTitle: "Store Manager",
      phone: "+91 98765 22222"
    },
    {
      id: "STF-103",
      name: "Amit Singh",
      email: "amit.s@krishnastore.in",
      pin: "3333",
      role: "staff",
      roleTitle: "Inventory Clerk",
      phone: "+91 98765 33333"
    }
  ],
  demoCustomer: {
    name: "Arvind Kumar",
    email: "arvind@krishnastore.in",
    phone: "9939780000",
    password: "customer123",
    role: "customer"
  }
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Sync session changes to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setCurrentUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: data.name || firebaseUser.displayName || "User",
              phone: data.phone || "",
              role: data.role || "customer",
              roleTitle: data.roleTitle || "Customer"
            });
          }
        } catch (err) {
          console.warn("Could not fetch user Firestore profile:", err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 1. Admin Login
  const loginAdmin = async (emailOrPin, password) => {
    const input = (emailOrPin || "").trim().toLowerCase();
    
    // Quick PIN Access
    if (input === DEFAULT_ACCOUNTS.admin.pin || password === DEFAULT_ACCOUNTS.admin.pin) {
      const user = {
        uid: "admin-local-master",
        email: DEFAULT_ACCOUNTS.admin.email,
        name: DEFAULT_ACCOUNTS.admin.name,
        role: "admin",
        roleTitle: DEFAULT_ACCOUNTS.admin.roleTitle
      };
      setCurrentUser(user);
      return { success: true, user };
    }

    // Default Demo Credentials
    if (
      (input === DEFAULT_ACCOUNTS.admin.email || input === "admin") &&
      password === DEFAULT_ACCOUNTS.admin.password
    ) {
      const user = {
        uid: "admin-local-master",
        email: DEFAULT_ACCOUNTS.admin.email,
        name: DEFAULT_ACCOUNTS.admin.name,
        role: "admin",
        roleTitle: DEFAULT_ACCOUNTS.admin.roleTitle
      };
      setCurrentUser(user);
      return { success: true, user };
    }

    // Attempt Firebase Authentication
    try {
      const res = await signInWithEmailAndPassword(auth, emailOrPin, password);
      const user = {
        uid: res.user.uid,
        email: res.user.email,
        name: res.user.displayName || "Store Admin",
        role: "admin",
        roleTitle: "Shop Owner / Admin"
      };
      setCurrentUser(user);
      return { success: true, user };
    } catch (err) {
      // Return clear error
      return {
        success: false,
        message: "Invalid admin credentials or PIN. Use default admin@krishnastore.in / admin123 or PIN 1234."
      };
    }
  };

  // 2. Staff / Employee Login
  const loginStaff = async ({ emailOrStaffId, pin }) => {
    const input = (emailOrStaffId || "").trim().toLowerCase();
    const pinStr = (pin || "").trim();

    // Match in staff directory
    const matchingStaff = DEFAULT_ACCOUNTS.staffList.find(
      (s) =>
        s.email.toLowerCase() === input ||
        s.id.toLowerCase() === input ||
        s.name.toLowerCase() === input ||
        s.phone.replace(/[^0-9]/g, "") === input.replace(/[^0-9]/g, "")
    );

    if (matchingStaff) {
      if (matchingStaff.pin === pinStr || pinStr === "1234") {
        const user = {
          uid: matchingStaff.id,
          name: matchingStaff.name,
          email: matchingStaff.email,
          phone: matchingStaff.phone,
          role: "staff",
          roleTitle: matchingStaff.roleTitle
        };
        setCurrentUser(user);
        return { success: true, user };
      }
      return { success: false, message: `Incorrect PIN for ${matchingStaff.name}. Default PIN: ${matchingStaff.pin}` };
    }

    // Also allow any PIN match directly
    const pinMatch = DEFAULT_ACCOUNTS.staffList.find((s) => s.pin === pinStr);
    if (pinMatch) {
      const user = {
        uid: pinMatch.id,
        name: pinMatch.name,
        email: pinMatch.email,
        phone: pinMatch.phone,
        role: "staff",
        roleTitle: pinMatch.roleTitle
      };
      setCurrentUser(user);
      return { success: true, user };
    }

    // Check dynamic staff created from Admin Portal / Firestore
    try {
      const savedStore = localStorage.getItem("krishna_store_db_v2");
      if (savedStore) {
        const parsed = JSON.parse(savedStore);
        const dynamicList = parsed.staff || [];
        const dynamicStaff = dynamicList.find(
          (s) =>
            (s.email && s.email.toLowerCase() === input) ||
            (s.id && s.id.toString().toLowerCase() === input) ||
            (s.name && s.name.toLowerCase() === input) ||
            (s.phone && s.phone.replace(/[^0-9]/g, "") === input.replace(/[^0-9]/g, ""))
        );
        if (dynamicStaff) {
          const user = {
            uid: dynamicStaff.id.toString(),
            name: dynamicStaff.name,
            email: dynamicStaff.email,
            phone: dynamicStaff.phone || "",
            role: "staff",
            roleTitle: dynamicStaff.role || "Staff Member"
          };
          setCurrentUser(user);
          return { success: true, user };
        }
      }
    } catch (e) {}

    return {
      success: false,
      message: "Staff member not found. Select an employee from the list or enter a valid staff PIN (e.g. 1111 for Cashier)."
    };
  };

  // 3. Customer Login
  const loginCustomer = async (emailOrPhone, password) => {
    const input = (emailOrPhone || "").trim().toLowerCase();

    // Check Demo Customer
    if (
      (input === DEFAULT_ACCOUNTS.demoCustomer.email ||
        input === DEFAULT_ACCOUNTS.demoCustomer.phone) &&
      password === DEFAULT_ACCOUNTS.demoCustomer.password
    ) {
      const user = {
        uid: "cust-demo-1",
        email: DEFAULT_ACCOUNTS.demoCustomer.email,
        phone: DEFAULT_ACCOUNTS.demoCustomer.phone,
        name: DEFAULT_ACCOUNTS.demoCustomer.name,
        role: "customer",
        roleTitle: "Registered Customer"
      };
      setCurrentUser(user);
      return { success: true, user };
    }

    // Check stored customers
    try {
      const localStoreData = localStorage.getItem("krishna_store_database_v2");
      if (localStoreData) {
        const parsed = JSON.parse(localStoreData);
        const customer = (parsed.customers || []).find(
          (c) =>
            (c.email && c.email.toLowerCase() === input) ||
            (c.phone && c.phone.replace(/[^0-9]/g, "").includes(input.replace(/[^0-9]/g, "")))
        );
        if (customer) {
          const user = {
            uid: customer.id,
            email: customer.email,
            phone: customer.phone,
            name: customer.name,
            role: "customer",
            roleTitle: "Registered Customer"
          };
          setCurrentUser(user);
          return { success: true, user };
        }
      }
    } catch (e) {
      console.warn("Local customer check error:", e);
    }

    // Firebase Auth Login
    try {
      const res = await signInWithEmailAndPassword(auth, emailOrPhone, password);
      const user = {
        uid: res.user.uid,
        email: res.user.email,
        name: res.user.displayName || "Customer",
        role: "customer",
        roleTitle: "Registered Customer"
      };
      setCurrentUser(user);
      return { success: true, user };
    } catch (err) {
      return {
        success: false,
        message: "Invalid customer credentials. Please check your email/phone and password, or sign up."
      };
    }
  };

  // 4. Customer Sign Up
  const signupCustomer = async ({ name, email, phone, password }) => {
    if (!name || (!email && !phone) || !password) {
      return { success: false, message: "Please fill in all required fields (Name, Email/Phone, Password)." };
    }

    const cleanEmail = email && email.trim() ? email.trim().toLowerCase() : `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}@customer.krishnastore.in`;
    const cleanPhone = phone ? phone.trim() : "";
    const cleanName = name.trim();

    // 1. Create in Firebase Auth (if valid email format)
    let firebaseUid = `cust-${Date.now()}`;
    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      firebaseUid = cred.user.uid;
      // Save profile in Firestore
      await setDoc(doc(db, "users", firebaseUid), {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        role: "customer",
        roleTitle: "Registered Customer",
        createdAt: new Date().toISOString()
      });
    } catch (firebaseErr) {
      console.warn("Firebase signup notice (continuing with store profile):", firebaseErr.message);
    }

    // 2. Register customer in Store CRM
    const newCustomerUser = {
      uid: firebaseUid,
      id: `CL-${Math.floor(1000 + Math.random() * 9000)}`,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone || "+91 98000 00000",
      role: "customer",
      roleTitle: "Registered Customer"
    };

    setCurrentUser(newCustomerUser);
    return { success: true, user: newCustomerUser };
  };

  // 5. Continue as Guest (Customer)
  const continueAsGuest = () => {
    const guestUser = {
      uid: `guest-${Date.now()}`,
      name: "Guest Shopper",
      email: "guest@krishnastore.in",
      role: "customer",
      roleTitle: "Guest Shopper",
      isGuest: true
    };
    setCurrentUser(guestUser);
    return guestUser;
  };

  // 6. Sign Out
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // ignore
    }
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const value = {
    currentUser,
    user: currentUser,
    loading,
    isAuthenticated: Boolean(currentUser && !currentUser.isGuest),
    isAdmin: currentUser?.role === "admin",
    isStaff: currentUser?.role === "staff" || currentUser?.role === "admin",
    isCustomer: currentUser?.role === "customer",
    isGuest: Boolean(currentUser?.isGuest),
    loginAdmin,
    loginStaff,
    loginCustomer,
    signupCustomer,
    continueAsGuest,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
