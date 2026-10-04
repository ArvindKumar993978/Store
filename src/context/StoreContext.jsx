import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  seedFirestoreIfEmpty,
  subscribeToProducts,
  subscribeToSales,
  subscribeToOrders,
  subscribeToCustomers,
  subscribeToKhata,
  subscribeToSettings,
  saveProductToDb,
  updateProductInDb,
  deleteProductFromDb,
  saveSaleToDb,
  saveOrderToDb,
  updateOrderStatusInDb,
  saveCustomerToDb,
  saveKhataEntryToDb,
  saveSettingsToDb,
  subscribeToStaff,
  saveStaffToDb,
  updateStaffInDb,
  deleteStaffFromDb
} from "../services/firebaseService";

/*
  StoreContext
  ------------
  Central Reactive Database for Krishna Store Ecosystem with localStorage persistence:
  - Inventory Products Catalog (Live Sync between Admin & Storefront)
  - POS Sales Invoices
  - Online Customer Orders & Tracking
  - Registered Customers & Loyalty Points
  - Promo Codes & Discounts Engine
*/

const STORAGE_KEY = "krishna_store_database_v2";

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Whole Milk - 1L",
    brand: "Farm Fresh Organics",
    sku: "MK-10293",
    hsn: "04012000",
    category: "Dairy",
    desc: "1 Litre Glass Bottle - Fresh Pure Cow Milk",
    price: 45.0,
    purchasePrice: 35.0,
    gst: "GST 5%",
    stock: 24,
    lowStockThreshold: 10,
    badge: "FRESH",
    badgeColor: "#00855b",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrYvrSJ7OcbW0gUMWUZhjsLn4Pukj0UAun_Q0tyy8ObC0B4wHpGflnCEa4tsSp497gGwtn1sDQeZ-Vw20_QRCWGl5N3f2_otUNzNAa1jJH7GNG9Nt4rqxc8GeqYLQbOvkUSsvqNtNb4L7GXkE9VbD591Dt4h4oqdsaLfVr118UO_UWOfiIn96NFzFsXO8fVFionsDy1gN94cTzEXCZ64xGXyslRYLr7YKdH6Lrctay2TGuf29M6N65JNa1zl0U9Q3QIgunWh3vzzcL"
  },
  {
    id: 2,
    name: "Honey Loops Cereal",
    brand: "Morning Joy Foods",
    sku: "SN-44582",
    hsn: "19041090",
    category: "Snacks",
    desc: "Crunchy toasted whole grain cereal with real honey",
    price: 185.0,
    purchasePrice: 140.0,
    gst: "GST 18%",
    stock: 148,
    lowStockThreshold: 15,
    badge: "POPULAR",
    badgeColor: "#ff9100",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD75B0M5a_k3dNhXaVz3cSNSoUgZgmqeaLYFxo_kaDMrvuYRRgsNLsYGny-lQYAUl5J-EWqKJs33b3yKxrU5MOZqiZcHhQmhJtpDjZo87KCl4mzkSQspLPNaC6gL2UwrLDpTph6i6Z4ahPvm7xPKzVS15ScZkuzyci3w_TBdWRNaTmcqE68RV8aY1jDbcW2Y83RuZj_74I5mr1dn3hrqfVSqWbMVUMtN1uyjy3UbCCNW_SaV5FWc5Atti8Wk7dbvtLx54vVku8dE0Ri"
  },
  {
    id: 3,
    name: "Luxury Aloe Soap",
    brand: "Pure Skin Essentials",
    sku: "PC-99012",
    hsn: "34011110",
    category: "Personal Care",
    desc: "Natural organic aloe vera bathing bar with vitamin E",
    price: 65.0,
    purchasePrice: 42.0,
    gst: "GST 18%",
    stock: 35,
    lowStockThreshold: 10,
    badge: "ORGANIC",
    badgeColor: "#006a61",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAasGleJiiZ8iAmlKWmc-EL8-CR7ZNUfGxhKx056UQh8xiWoDlmSAL-mzHkJgR4iXqs5MT3vCNAMJaBzVBXxi9eph4NmNmAMY-yqP5rty2xWP3HhaQHJ22hlAylPGbxQLR7_VQ9ov8NsOj5-eUPBFXx-IN81ToxT70AIKNcNr6IIRjdYyGDQmmS2iUGqB70BG7q0eag-IFSutG3dlQ6jg4eqFTfRwpMTylj7dtXliNJrQISzzJguYEPWbUk3aTaOyE57tK28_rgPavB"
  },
  {
    id: 4,
    name: "Premium Basmati Rice 5kg",
    brand: "Royal Grains Co.",
    sku: "ST-11223",
    hsn: "10063020",
    category: "Staples",
    desc: "Aged long grain royal basmati rice for biryani & pulao",
    price: 450.0,
    purchasePrice: 360.0,
    gst: "GST 5%",
    stock: 52,
    lowStockThreshold: 12,
    badge: "BESTSELLER",
    badgeColor: "#ba1a1a",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1yFWaAXcESGoqnqiUO8q00kspWzvzcj33bcf8VG_VyINE5Guojx3DsxfykrmlLX5CO0JIwe9KgQba-_3rFTfGB08RaWlbYR4Ef6jDsUbMYOHKYPuE-_eoS9ktU3Xw2RgreUYxXuSjElqFWu_ll3NoKUI7KCyBT_KHS7leFlPLDcV-x3iZ5CkADTI67V7sTzxduwHGa-sKCFZmjB0aE4cfcqt0ExBck1AtGjx6W7aICGDnOOKAAc1YKdJ8lFcWfOy5uORKCuf9ChbS"
  },
  {
    id: 5,
    name: "Fortune Sunflower Oil 1L",
    brand: "Fortune",
    sku: "OL-55612",
    hsn: "15121910",
    category: "Staples",
    desc: "Refined sunflower cooking oil enriched with vitamins A & D",
    price: 195.0,
    purchasePrice: 160.0,
    gst: "GST 5%",
    stock: 8,
    lowStockThreshold: 10,
    badge: "LOW STOCK",
    badgeColor: "#894d00",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 6,
    name: "Tata Salt 1kg",
    brand: "Tata Consumer",
    sku: "ST-25010",
    hsn: "25010010",
    category: "Staples",
    desc: "Vacuum evaporated iodized table salt",
    price: 25.0,
    purchasePrice: 18.0,
    gst: "GST 0%",
    stock: 85,
    lowStockThreshold: 20,
    badge: "STAPLE",
    badgeColor: "#006194",
    image: "https://images.unsplash.com/photo-1518110903495-cd99c129f128?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 7,
    name: "Maggi 2-Minute Noodles 70g",
    brand: "Nestle",
    sku: "SN-19023",
    hsn: "19023010",
    category: "Snacks",
    desc: "Classic masala instant noodles with tastemaker",
    price: 14.0,
    purchasePrice: 11.0,
    gst: "GST 12%",
    stock: 142,
    lowStockThreshold: 25,
    badge: "HOT",
    badgeColor: "#ff0055",
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 8,
    name: "Amul Butter 500g",
    brand: "Amul",
    sku: "DY-04051",
    hsn: "04051000",
    category: "Dairy",
    desc: "Pasteurized salted butter made from pure milk fat",
    price: 275.0,
    purchasePrice: 235.0,
    gst: "GST 12%",
    stock: 18,
    lowStockThreshold: 10,
    badge: "DAIRY",
    badgeColor: "#ffd600",
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=60"
  }
];

const INITIAL_SALES = [
  {
    id: "INV-8821",
    date: new Date(Date.now() - 3600000 * 2).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    customer: "Rajesh Kumar Enterprises",
    phone: "9876543210",
    paymentMode: "UPI",
    items: [
      { name: "Premium Basmati Rice 5kg", qty: 10, price: 450 },
      { name: "Whole Milk - 1L", qty: 40, price: 45 },
      { name: "Fortune Sunflower Oil 1L", qty: 12, price: 195 }
    ],
    subtotal: 8640,
    discount: 200,
    cgst: 220,
    sgst: 220,
    grandTotal: 8880,
    status: "Paid"
  },
  {
    id: "INV-8820",
    date: new Date(Date.now() - 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    customer: "Priya Sharma",
    phone: "9811223344",
    paymentMode: "CASH",
    items: [
      { name: "Honey Loops Cereal", qty: 4, price: 185 },
      { name: "Luxury Aloe Soap", qty: 10, price: 65 }
    ],
    subtotal: 1390,
    discount: 50,
    cgst: 75,
    sgst: 75,
    grandTotal: 1490,
    status: "Paid"
  }
];

const PROMO_CODES = {
  SAVE50: { code: "SAVE50", type: "FLAT", value: 50, minOrder: 300, desc: "₹50 off on orders ₹300+" },
  WELCOME10: { code: "WELCOME10", type: "PERCENT", value: 10, maxDiscount: 150, minOrder: 200, desc: "10% off up to ₹150" },
  FRESH20: { code: "FRESH20", type: "PERCENT", value: 20, maxDiscount: 100, minOrder: 250, desc: "20% off fresh items" },
  FLAT100: { code: "FLAT100", type: "FLAT", value: 100, minOrder: 600, desc: "Flat ₹100 off on ₹600+" },
  KRISHNA100: { code: "KRISHNA100", type: "FLAT", value: 100, minOrder: 500, desc: "Flat ₹100 off on ₹500+" }
};

const DEFAULT_SETTINGS = {
  storeName: "Krishna General Store",
  tagline: "Your Trusted Neighborhood Grocery Partner",
  gstin: "29AAAAA0000A1Z5",
  upiId: "krishnastore@upi",
  address: "Shop No. 12, Main Market, Sector 4, HSR Layout, Bengaluru, Karnataka - 560102",
  phone: "+91 98765 43210",
  email: "support@krishnastore.in",
  terms: "1. Payments due upon invoice presentation.\n2. Goods once sold can be returned within 48 hours with receipt."
};

const INITIAL_PURCHASES = [
  {
    id: "PO-4412",
    date: new Date(Date.now() - 86400000 * 2).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    supplier: "Farm Fresh Direct",
    items: [{ id: 1, name: "Whole Milk - 1L (Bulk Crate)", qty: 50, unitPrice: 35.0 }],
    subtotal: 1750,
    tax: 87.5,
    total: 1837.5,
    status: "Received"
  },
  {
    id: "PO-4411",
    date: new Date(Date.now() - 86400000 * 5).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    supplier: "Royal Grains Wholesale",
    items: [{ id: 5, name: "Premium Basmati Rice 25kg", qty: 15, unitPrice: 380.0 }],
    subtotal: 5700,
    tax: 285.0,
    total: 5985.0,
    status: "Received"
  }
];

const INITIAL_CUSTOMERS_LIST = [
  {
    id: "CL-9021",
    name: "Rajesh Jha",
    email: "rajesh.jha@example.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, Karnataka",
    totalPurchases: "₹1,42,500",
    orders: 24,
    outstanding: "₹0",
    creditLimit: 10000,
    tier: "Platinum",
    points: 240
  },
  {
    id: "CL-8562",
    name: "Ananya Kapoor",
    email: "ananya.kapoor@example.com",
    phone: "+91 88822 11223",
    location: "Bengaluru, Karnataka",
    totalPurchases: "₹84,200",
    orders: 12,
    outstanding: "₹850",
    creditLimit: 5000,
    tier: "Gold",
    points: 150
  },
  {
    id: "CL-4102",
    name: "Mohammed Sahil",
    email: "m.sahil@example.com",
    phone: "+91 70011 22334",
    location: "Bengaluru, Karnataka",
    totalPurchases: "₹22,150",
    orders: 4,
    outstanding: "₹1,500",
    creditLimit: 3000,
    tier: "Regular",
    points: 60
  }
];

const INITIAL_KHATA_LEDGER = [
  {
    id: "KTXN-1001",
    customerId: "CL-4102",
    customerName: "Mohammed Sahil",
    customerPhone: "+91 70011 22334",
    date: new Date(Date.now() - 86400000 * 3).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    type: "DEBIT",
    amount: 1500,
    balanceAfter: 1500,
    paymentMode: "UDHAR",
    billId: "INV-8819",
    note: "Fortnight Grocery (Atta, Butter & Oil)"
  },
  {
    id: "KTXN-1002",
    customerId: "CL-8562",
    customerName: "Ananya Kapoor",
    customerPhone: "+91 88822 11223",
    date: new Date(Date.now() - 86400000 * 2).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    type: "DEBIT",
    amount: 850,
    balanceAfter: 850,
    paymentMode: "UDHAR",
    billId: "INV-8840",
    note: "Quick dairy & snacks purchase on credit"
  },
  {
    id: "KTXN-1003",
    customerId: "CL-9021",
    customerName: "Rajesh Jha",
    customerPhone: "+91 98765 43210",
    date: new Date(Date.now() - 86400000 * 5).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    type: "DEBIT",
    amount: 3200,
    balanceAfter: 3200,
    paymentMode: "UDHAR",
    billId: "INV-8790",
    note: "Monthly Ration Package"
  },
  {
    id: "KTXN-1004",
    customerId: "CL-9021",
    customerName: "Rajesh Jha",
    customerPhone: "+91 98765 43210",
    date: new Date(Date.now() - 86400000 * 1).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    type: "CREDIT",
    amount: 3200,
    balanceAfter: 0,
    paymentMode: "UPI",
    billId: "PAY-5521",
    note: "Google Pay UPI Payment Received (Full settlement)"
  }
];

const INITIAL_STAFF_LIST = [
  { id: 1, name: "Rajesh Kumar", email: "rajesh.k@krishnastore.in", role: "Store Manager", status: "Active", lastLogin: "Today, 09:14 AM" },
  { id: 2, name: "Priya Iyer", email: "priya.i@krishnastore.in", role: "Cashier", status: "Active", lastLogin: "Yesterday, 07:45 PM" },
  { id: 3, name: "Amit Singh", email: "amit.s@krishnastore.in", role: "Inventory Clerk", status: "Inactive", lastLogin: "3 days ago" },
  { id: 4, name: "Sanya Malhotra", email: "sanya.m@krishnastore.in", role: "Cashier", status: "Active", lastLogin: "Today, 08:30 AM" }
];

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  // Load saved state or fall back to rich seed data
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          products: parsed.products || INITIAL_PRODUCTS,
          sales: parsed.sales || INITIAL_SALES,
          orders: parsed.orders || [],
          customers: parsed.customers && parsed.customers.length > 0 ? parsed.customers : INITIAL_CUSTOMERS_LIST,
          purchases: parsed.purchases && parsed.purchases.length > 0 ? parsed.purchases : INITIAL_PURCHASES,
          settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
          staff: parsed.staff && parsed.staff.length > 0 ? parsed.staff : INITIAL_STAFF_LIST,
          khataLedger: parsed.khataLedger && parsed.khataLedger.length > 0 ? parsed.khataLedger : INITIAL_KHATA_LEDGER,
        };
      }
    } catch (e) {
      console.warn("Store database load failed", e);
    }
    return {
      products: INITIAL_PRODUCTS,
      sales: INITIAL_SALES,
      orders: [
        {
          id: "ORD-9412",
          date: new Date(Date.now() - 3600000 * 5).toISOString(),
          customerName: "Arvind Kumar",
          address: "Flat 402, Green Valley Apartments, Bengaluru",
          phone: "9939780000",
          items: [
            { id: 1, name: "Whole Milk - 1L", price: 45, qty: 2, image: INITIAL_PRODUCTS[0].image },
            { id: 2, name: "Honey Loops Cereal", price: 185, qty: 1, image: INITIAL_PRODUCTS[1].image }
          ],
          subtotal: 275,
          discount: 0,
          promoCode: null,
          gst: 13.75,
          total: 288.75,
          status: "In Transit",
          paymentMethod: "upi"
        }
      ],
      customers: INITIAL_CUSTOMERS_LIST,
      purchases: INITIAL_PURCHASES,
      settings: DEFAULT_SETTINGS,
      staff: INITIAL_STAFF_LIST,
      khataLedger: INITIAL_KHATA_LEDGER,
    };
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Store database save failed", e);
    }
  }, [data]);

  // Real-time Cloud Firestore synchronization & auto-seeding
  useEffect(() => {
    seedFirestoreIfEmpty({
      products: INITIAL_PRODUCTS,
      customers: INITIAL_CUSTOMERS_LIST,
      khataLedger: INITIAL_KHATA_LEDGER,
      sales: INITIAL_SALES,
      settings: DEFAULT_SETTINGS,
      staff: INITIAL_STAFF_LIST
    });

    const unsubProducts = subscribeToProducts((cloudProducts) => {
      if (cloudProducts && cloudProducts.length > 0) {
        setData((prev) => ({ ...prev, products: cloudProducts }));
      }
    });

    const unsubSales = subscribeToSales((cloudSales) => {
      if (cloudSales && cloudSales.length > 0) {
        setData((prev) => ({ ...prev, sales: cloudSales }));
      }
    });

    const unsubOrders = subscribeToOrders((cloudOrders) => {
      setData((prev) => ({ ...prev, orders: cloudOrders }));
    });

    const unsubCustomers = subscribeToCustomers((cloudCustomers) => {
      if (cloudCustomers && cloudCustomers.length > 0) {
        setData((prev) => ({ ...prev, customers: cloudCustomers }));
      }
    });

    const unsubKhata = subscribeToKhata((cloudKhata) => {
      if (cloudKhata && cloudKhata.length > 0) {
        setData((prev) => ({ ...prev, khataLedger: cloudKhata }));
      }
    });

    const unsubSettings = subscribeToSettings((cloudSettings) => {
      if (cloudSettings) {
        setData((prev) => ({ ...prev, settings: { ...DEFAULT_SETTINGS, ...cloudSettings } }));
      }
    });

    const unsubStaff = subscribeToStaff((cloudStaff) => {
      if (cloudStaff && cloudStaff.length > 0) {
        setData((prev) => ({ ...prev, staff: cloudStaff }));
      }
    });

    return () => {
      if (unsubProducts) unsubProducts();
      if (unsubSales) unsubSales();
      if (unsubOrders) unsubOrders();
      if (unsubCustomers) unsubCustomers();
      if (unsubKhata) unsubKhata();
      if (unsubSettings) unsubSettings();
      if (unsubStaff) unsubStaff();
    };
  }, []);

  // Product Operations
  const addProduct = (productData) => {
    const newProduct = {
      id: Date.now(),
      name: productData.name.trim(),
      brand: productData.brand ? productData.brand.trim() : "Store Brand",
      sku: productData.sku || `SKU-${Math.floor(10000 + Math.random() * 90000)}`,
      hsn: productData.hsn || "19040000",
      category: productData.category || "Groceries",
      desc: productData.description || `${productData.name} - Quality Retail Product`,
      price: parseFloat(productData.sellingPrice || productData.price || 0),
      purchasePrice: parseFloat(productData.purchasePrice || 0),
      gst: productData.gst || "GST 5%",
      stock: parseInt(productData.initialStock || productData.stock || 0, 10),
      lowStockThreshold: parseInt(productData.lowStockThreshold || 10, 10),
      badge: productData.badge || (parseInt(productData.initialStock || productData.stock || 0, 10) <= 5 ? "LOW STOCK" : "NEW"),
      badgeColor: productData.badgeColor || "#006194",
      image: productData.imagePreview || productData.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60"
    };

    setData((prev) => ({
      ...prev,
      products: [newProduct, ...prev.products]
    }));
    saveProductToDb(newProduct);
    return newProduct;
  };

  const updateProduct = (id, updatedFields) => {
    let updatedItem = null;
    setData((prev) => ({
      ...prev,
      products: prev.products.map((p) => {
        if (p.id === id) {
          const merged = { ...p, ...updatedFields };
          // Auto update status/badge if stock changed
          if (merged.stock <= 0) {
            merged.badge = "OUT OF STOCK";
            merged.badgeColor = "#ba1a1a";
          } else if (merged.stock <= (merged.lowStockThreshold || 10)) {
            merged.badge = "LOW STOCK";
            merged.badgeColor = "#894d00";
          }
          updatedItem = merged;
          return merged;
        }
        return p;
      })
    }));
    if (updatedItem) {
      updateProductInDb(id, updatedItem);
    }
  };

  const deleteProduct = (id) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id)
    }));
    deleteProductFromDb(id);
  };

  // Decrement Stock helper
  const decrementStock = (itemsToDeduct) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.map((p) => {
        const matching = itemsToDeduct.find((it) => it.id === p.id || it.name.toLowerCase() === p.name.toLowerCase());
        if (matching) {
          const newStock = Math.max(0, p.stock - (matching.qty || 1));
          return {
            ...p,
            stock: newStock,
            badge: newStock === 0 ? "OUT OF STOCK" : newStock <= p.lowStockThreshold ? "LOW STOCK" : p.badge,
            badgeColor: newStock === 0 ? "#ba1a1a" : newStock <= p.lowStockThreshold ? "#894d00" : p.badgeColor
          };
        }
        return p;
      })
    }));
  };

  // POS Sale Completion
  const recordPosSale = (saleData) => {
    const isCredit = saleData.paymentMode === "CREDIT" || saleData.paymentMode === "UDHAR";
    const newInvoice = {
      id: saleData.id || `INV-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      customer: saleData.customer || "Walk-in Customer",
      phone: saleData.phone || "N/A",
      paymentMode: saleData.paymentMode || "UPI",
      items: saleData.items,
      subtotal: saleData.subtotal,
      discount: saleData.discount || 0,
      cgst: saleData.cgst || 0,
      sgst: saleData.sgst || 0,
      grandTotal: saleData.grandTotal,
      status: isCredit ? "Unpaid (Khata)" : "Paid"
    };

    decrementStock(saleData.items);

    let customerToSync = null;
    let khataToSync = null;

    setData((prev) => {
      let updatedCustomers = [...(prev.customers || [])];
      let updatedKhata = [...(prev.khataLedger || [])];

      if (isCredit && saleData.customer && saleData.customer !== "Walk-in Customer") {
        const custIdx = updatedCustomers.findIndex(
          (c) => c.name.toLowerCase() === saleData.customer.toLowerCase() || (saleData.phone && saleData.phone !== "N/A" && c.phone === saleData.phone)
        );

        let custId = `CL-${Math.floor(1000 + Math.random() * 9000)}`;
        let previousDue = 0;

        if (custIdx !== -1) {
          custId = updatedCustomers[custIdx].id;
          const currentOut = typeof updatedCustomers[custIdx].outstanding === "string"
            ? parseFloat(updatedCustomers[custIdx].outstanding.replace(/[^0-9.]/g, "")) || 0
            : Number(updatedCustomers[custIdx].outstanding) || 0;
          previousDue = currentOut;
          const newDue = currentOut + saleData.grandTotal;
          updatedCustomers[custIdx] = {
            ...updatedCustomers[custIdx],
            outstanding: `₹${newDue.toLocaleString("en-IN")}`,
            orders: (updatedCustomers[custIdx].orders || 0) + 1
          };
          customerToSync = updatedCustomers[custIdx];
        } else {
          // Auto register new customer with credit
          customerToSync = {
            id: custId,
            name: saleData.customer,
            phone: saleData.phone || "+91 98000 00000",
            email: `${saleData.customer.toLowerCase().replace(/[^a-z0-9]/g, "")}@example.com`,
            location: "Bengaluru, Karnataka",
            totalPurchases: `₹${saleData.grandTotal.toLocaleString("en-IN")}`,
            orders: 1,
            outstanding: `₹${saleData.grandTotal.toLocaleString("en-IN")}`,
            creditLimit: 5000,
            tier: "Regular",
            points: 50
          };
          updatedCustomers = [customerToSync, ...updatedCustomers];
        }

        khataToSync = {
          id: `KTXN-${Date.now()}`,
          customerId: custId,
          customerName: saleData.customer,
          customerPhone: saleData.phone || "N/A",
          date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
          type: "DEBIT", // Udhar Diya
          amount: saleData.grandTotal,
          balanceAfter: previousDue + saleData.grandTotal,
          paymentMode: "UDHAR",
          billId: newInvoice.id,
          note: `POS Grocery Bill #${newInvoice.id} (${saleData.items.length} items)`
        };
        updatedKhata = [khataToSync, ...updatedKhata];
      }

      return {
        ...prev,
        sales: [newInvoice, ...prev.sales],
        customers: updatedCustomers,
        khataLedger: updatedKhata
      };
    });

    // Cloud Firestore Sync
    const updatedProductsList = (data.products || []).map((p) => {
      const it = (saleData.items || []).find((x) => x.id === p.id);
      return it ? { ...p, stock: Math.max(0, p.stock - (it.qty || 1)) } : p;
    });
    saveSaleToDb(newInvoice, updatedProductsList);

    if (customerToSync) saveCustomerToDb(customerToSync);
    if (khataToSync) saveKhataEntryToDb(khataToSync);

    return newInvoice;
  };

  // Online Customer Order Placement
  const recordCustomerOrder = (orderInfo) => {
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      customerName: orderInfo.customerName || "Customer",
      address: orderInfo.address || "Main Market, Bengaluru",
      phone: orderInfo.phone || "N/A",
      items: orderInfo.items,
      subtotal: orderInfo.subtotal,
      discount: orderInfo.discount || 0,
      promoCode: orderInfo.promoCode || null,
      gst: orderInfo.gst,
      total: orderInfo.total,
      status: "Pending", // Pending -> Packed -> In Transit -> Delivered
      paymentMethod: orderInfo.paymentMethod || "upi"
    };

    decrementStock(orderInfo.items);

    setData((prev) => ({
      ...prev,
      orders: [newOrder, ...prev.orders]
    }));

    saveOrderToDb(newOrder);
    return newOrder;
  };

  // Update Online Order Status (e.g. Admin changes Pending -> Packed -> Delivered)
  const updateOrderStatus = (orderId, newStatus) => {
    setData((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    }));
    updateOrderStatusInDb(orderId, newStatus);
  };

  // Validate Promo Code
  const applyPromoCode = (code, subtotal) => {
    if (!code) return { valid: false, message: "Please enter a coupon code" };
    const upper = code.trim().toUpperCase();
    const promo = PROMO_CODES[upper];

    if (!promo) {
      return { valid: false, message: "Invalid coupon code! Try SAVE50 or WELCOME10" };
    }

    if (subtotal < promo.minOrder) {
      return { valid: false, message: `Minimum order value for ${promo.code} is ₹${promo.minOrder}` };
    }

    let discountAmount = 0;
    if (promo.type === "FLAT") {
      discountAmount = promo.value;
    } else {
      discountAmount = Math.min(promo.maxDiscount || Infinity, (subtotal * promo.value) / 100);
    }

    return {
      valid: true,
      code: promo.code,
      discount: discountAmount,
      desc: promo.desc,
      message: `Coupon ${promo.code} applied! Saved ₹${discountAmount.toFixed(2)}`
    };
  };

  // Purchase Order & Restock Operations
  const recordPurchaseOrder = (poData) => {
    const newPO = {
      id: poData.id || `PO-${Math.floor(10000 + Math.random() * 90000)}`,
      date: poData.date || new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      supplier: poData.supplier || "Wholesale Distributor",
      items: poData.items || [],
      subtotal: poData.subtotal || 0,
      tax: poData.tax || 0,
      total: poData.total || 0,
      status: "Received"
    };

    setData((prev) => {
      const updatedProducts = prev.products.map((p) => {
        const itemInPO = (poData.items || []).find(
          (it) =>
            it.id === p.id ||
            (it.name && p.name && (it.name.toLowerCase().includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(it.name.toLowerCase())))
        );
        if (itemInPO) {
          const addedQty = Number(itemInPO.qty) || 0;
          const updatedStock = (p.stock || 0) + addedQty;
          return {
            ...p,
            stock: updatedStock,
            badge: updatedStock <= (p.lowStockThreshold || 10) ? "LOW STOCK" : (p.badge === "LOW STOCK" || p.badge === "OUT OF STOCK" ? "FRESH" : p.badge)
          };
        }
        return p;
      });

      return {
        ...prev,
        purchases: [newPO, ...(prev.purchases || [])],
        products: updatedProducts
      };
    });

    return newPO;
  };

  // Customer Management
  const addCustomer = (customerData) => {
    const newCustomer = {
      id: customerData.id || `CL-${Math.floor(1000 + Math.random() * 9000)}`,
      name: customerData.name.trim(),
      email: customerData.email ? customerData.email.trim() : `${customerData.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@example.com`,
      phone: customerData.phone ? customerData.phone.trim() : "+91 98765 00000",
      location: customerData.location ? customerData.location.trim() : "Bengaluru, Karnataka",
      totalPurchases: customerData.totalPurchases || "₹0",
      orders: Number(customerData.orders) || 0,
      outstanding: customerData.outstanding || "₹0",
      tier: customerData.tier || "Regular",
      points: Number(customerData.points) || 50
    };

    let savedCust = newCustomer;

    setData((prev) => {
      const existingIdx = (prev.customers || []).findIndex((c) => c.phone === newCustomer.phone && newCustomer.phone !== "N/A");
      if (existingIdx !== -1) {
        const updated = [...prev.customers];
        savedCust = { ...updated[existingIdx], ...newCustomer, id: updated[existingIdx].id };
        updated[existingIdx] = savedCust;
        return { ...prev, customers: updated };
      }
      return { ...prev, customers: [newCustomer, ...(prev.customers || [])] };
    });

    saveCustomerToDb(savedCust);
    return savedCust;
  };

  // Khata Book / Credit Operations
  const recordKhataPayment = ({ customerId, amount, paymentMode = "CASH", note = "Payment Received (Jama)" }) => {
    const payAmount = Math.max(0, parseFloat(amount) || 0);
    if (payAmount <= 0) return { success: false, message: "Invalid payment amount" };

    let updatedCustomerName = "";
    let updatedCustomerPhone = "";
    let remainingBalance = 0;
    let customerToSync = null;
    let khataEntryToSync = null;

    setData((prev) => {
      const updatedCustomers = (prev.customers || []).map((c) => {
        if (c.id === customerId || c.phone === customerId || c.name === customerId) {
          updatedCustomerName = c.name;
          updatedCustomerPhone = c.phone;
          const currentOut = typeof c.outstanding === "string" 
            ? parseFloat(c.outstanding.replace(/[^0-9.]/g, "")) || 0
            : Number(c.outstanding) || 0;
          remainingBalance = Math.max(0, currentOut - payAmount);
          const updated = {
            ...c,
            outstanding: `₹${remainingBalance.toLocaleString("en-IN")}`
          };
          customerToSync = updated;
          return updated;
        }
        return c;
      });

      khataEntryToSync = {
        id: `KTXN-${Date.now()}`,
        customerId,
        customerName: updatedCustomerName || "Customer",
        customerPhone: updatedCustomerPhone || "N/A",
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        type: "CREDIT", // Jama
        amount: payAmount,
        balanceAfter: remainingBalance,
        paymentMode,
        billId: `RCPT-${Math.floor(1000 + Math.random() * 9000)}`,
        note: note || "Cash/UPI Payment Received (Jama)"
      };

      return {
        ...prev,
        customers: updatedCustomers,
        khataLedger: [khataEntryToSync, ...(prev.khataLedger || [])]
      };
    });

    if (khataEntryToSync) saveKhataEntryToDb(khataEntryToSync);
    if (customerToSync) saveCustomerToDb(customerToSync);

    return { success: true, message: `Recorded payment of ₹${payAmount.toLocaleString("en-IN")}!` };
  };

  const recordKhataDebit = ({ customerId, amount, note = "Udhar Added", billId }) => {
    const debitAmount = Math.max(0, parseFloat(amount) || 0);
    if (debitAmount <= 0) return { success: false, message: "Invalid amount" };

    let updatedCustomerName = "";
    let updatedCustomerPhone = "";
    let newBalance = 0;
    let customerToSync = null;
    let khataEntryToSync = null;

    setData((prev) => {
      const updatedCustomers = (prev.customers || []).map((c) => {
        if (c.id === customerId || c.phone === customerId || c.name === customerId) {
          updatedCustomerName = c.name;
          updatedCustomerPhone = c.phone;
          const currentOut = typeof c.outstanding === "string" 
            ? parseFloat(c.outstanding.replace(/[^0-9.]/g, "")) || 0
            : Number(c.outstanding) || 0;
          newBalance = currentOut + debitAmount;
          const updated = {
            ...c,
            outstanding: `₹${newBalance.toLocaleString("en-IN")}`
          };
          customerToSync = updated;
          return updated;
        }
        return c;
      });

      khataEntryToSync = {
        id: `KTXN-${Date.now()}`,
        customerId,
        customerName: updatedCustomerName || "Customer",
        customerPhone: updatedCustomerPhone || "N/A",
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        type: "DEBIT", // Udhar Diya
        amount: debitAmount,
        balanceAfter: newBalance,
        paymentMode: "UDHAR",
        billId: billId || `UDH-${Math.floor(1000 + Math.random() * 9000)}`,
        note: note || "Store Credit Given"
      };

      return {
        ...prev,
        customers: updatedCustomers,
        khataLedger: [khataEntryToSync, ...(prev.khataLedger || [])]
      };
    });

    if (khataEntryToSync) saveKhataEntryToDb(khataEntryToSync);
    if (customerToSync) saveCustomerToDb(customerToSync);

    return { success: true, message: `Recorded udhar of ₹${debitAmount.toLocaleString("en-IN")}!` };
  };

  const updateCustomerCreditLimit = (customerId, newLimit) => {
    const limitNum = Math.max(0, parseFloat(newLimit) || 0);
    setData((prev) => ({
      ...prev,
      customers: (prev.customers || []).map((c) =>
        c.id === customerId || c.phone === customerId || c.name === customerId ? { ...c, creditLimit: limitNum } : c
      )
    }));
  };

  // Store Profile Settings
  const updateSettings = (newSettings) => {
    const merged = { ...(data.settings || DEFAULT_SETTINGS), ...newSettings };
    setData((prev) => ({
      ...prev,
      settings: merged
    }));
    saveSettingsToDb(merged);
  };

  // Staff Management
  const addStaff = (staffMember) => {
    const newStaff = {
      id: Date.now(),
      name: staffMember.name.trim(),
      email: staffMember.email.trim(),
      role: staffMember.role || "Cashier",
      status: "Active",
      lastLogin: "Just now",
      phone: staffMember.phone || "+91 98000 00000",
      dept: staffMember.dept || (staffMember.role === "Store Manager" ? "Operations" : staffMember.role === "Inventory Clerk" ? "Inventory" : "Sales")
    };
    setData((prev) => ({
      ...prev,
      staff: [newStaff, ...(prev.staff || [])]
    }));
    saveStaffToDb(newStaff);
    return newStaff;
  };

  const updateStaff = (id, updatedFields) => {
    let syncedMember = null;
    setData((prev) => {
      const updatedList = (prev.staff || []).map((s) => {
        if (s.id === id || s.email === id) {
          syncedMember = { ...s, ...updatedFields };
          return syncedMember;
        }
        return s;
      });
      return { ...prev, staff: updatedList };
    });
    if (syncedMember) {
      updateStaffInDb(syncedMember.id || id, updatedFields);
    }
  };

  const toggleStaffStatus = (identifier) => {
    let syncedMember = null;
    setData((prev) => {
      const updatedList = (prev.staff || []).map((s) => {
        if (s.id === identifier || s.email === identifier) {
          const nextStatus = s.status === "Active" ? "Inactive" : "Active";
          syncedMember = { ...s, status: nextStatus };
          return syncedMember;
        }
        return s;
      });
      return { ...prev, staff: updatedList };
    });
    if (syncedMember) {
      updateStaffInDb(syncedMember.id || identifier, { status: syncedMember.status });
    }
  };

  const deleteStaff = (id) => {
    setData((prev) => ({
      ...prev,
      staff: (prev.staff || []).filter((s) => s.id !== id && s.email !== id)
    }));
    deleteStaffFromDb(id);
  };

  // Computed Live Store KPIs & Analytics
  const storeMetrics = useMemo(() => {
    const totalProducts = data.products.length;
    const lowStockItems = data.products.filter((p) => p.stock <= (p.lowStockThreshold || 10));
    const outOfStockItems = data.products.filter((p) => p.stock === 0);

    const posSalesTotal = data.sales.reduce((sum, s) => sum + (s.grandTotal || 0), 0);
    const onlineOrdersTotal = data.orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalRevenue = posSalesTotal + onlineOrdersTotal;
    const totalExpenses = (data.purchases || []).reduce((sum, p) => sum + (p.total || 0), 0);
    const netProfit = Math.max(0, totalRevenue - totalExpenses);

    const totalKhataOutstanding = (data.customers || []).reduce((sum, c) => {
      if (typeof c.outstanding === "string") {
        return sum + (parseFloat(c.outstanding.replace(/[^0-9.]/g, "")) || 0);
      }
      return sum + (Number(c.outstanding) || 0);
    }, 0);

    const totalKhataCollected = (data.khataLedger || [])
      .filter((k) => k.type === "CREDIT")
      .reduce((sum, k) => sum + (Number(k.amount) || 0), 0);

    const khataCustomerCount = (data.customers || []).filter((c) => {
      const due = typeof c.outstanding === "string" 
        ? parseFloat(c.outstanding.replace(/[^0-9.]/g, "")) || 0
        : Number(c.outstanding) || 0;
      return due > 0;
    }).length;

    return {
      totalProducts,
      lowStockCount: lowStockItems.length,
      outOfStockCount: outOfStockItems.length,
      lowStockList: lowStockItems,
      totalSalesCount: data.sales.length + data.orders.length,
      totalRevenue,
      todaySales: posSalesTotal > 0 ? posSalesTotal : 12450,
      totalExpenses,
      netProfit,
      totalKhataOutstanding,
      totalKhataCollected,
      khataCustomerCount
    };
  }, [data]);

  // Backup & Restore
  const exportBackupJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `krishna_store_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBackupJSON = (jsonString) => {
    try {
      const parsed = typeof jsonString === "string" ? JSON.parse(jsonString) : jsonString;
      if (parsed.products && Array.isArray(parsed.products)) {
        setData(parsed);
        return { success: true, message: "Database restored successfully!" };
      }
      return { success: false, message: "Invalid backup format: 'products' array missing." };
    } catch (e) {
      return { success: false, message: `Parse error: ${e.message}` };
    }
  };

  const resetToSeedData = () => {
    setData({
      products: INITIAL_PRODUCTS,
      sales: INITIAL_SALES,
      orders: [],
      customers: INITIAL_CUSTOMERS_LIST,
      purchases: INITIAL_PURCHASES,
      settings: DEFAULT_SETTINGS,
      staff: INITIAL_STAFF_LIST,
      khataLedger: INITIAL_KHATA_LEDGER,
    });
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = {
    products: data.products,
    sales: data.sales,
    orders: data.orders,
    customers: data.customers,
    purchases: data.purchases || [],
    settings: data.settings || DEFAULT_SETTINGS,
    staff: data.staff || [],
    khataLedger: data.khataLedger || [],
    addProduct,
    updateProduct,
    deleteProduct,
    recordPosSale,
    recordCustomerOrder,
    updateOrderStatus,
    recordPurchaseOrder,
    addCustomer,
    recordKhataPayment,
    recordKhataDebit,
    updateCustomerCreditLimit,
    updateSettings,
    addStaff,
    updateStaff,
    toggleStaffStatus,
    deleteStaff,
    applyPromoCode,
    promoCodes: PROMO_CODES,
    storeMetrics,
    exportBackupJSON,
    importBackupJSON,
    resetToSeedData
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a <StoreProvider>");
  }
  return context;
}
