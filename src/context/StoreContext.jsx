import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

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
  FLAT100: { code: "FLAT100", type: "FLAT", value: 100, minOrder: 600, desc: "Flat ₹100 off on ₹600+" }
};

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  // Load saved state or fall back to rich seed data
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
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
      customers: [
        { id: 1, name: "Rajesh Kumar", phone: "9876543210", visits: 14, spent: 18450, points: 240 },
        { id: 2, name: "Priya Sharma", phone: "9811223344", visits: 8, spent: 7800, points: 110 },
        { id: 3, name: "Arvind Kumar", phone: "9939780000", visits: 5, spent: 4200, points: 80 }
      ]
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
    return newProduct;
  };

  const updateProduct = (id, updatedFields) => {
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
          return merged;
        }
        return p;
      })
    }));
  };

  const deleteProduct = (id) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id)
    }));
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
      status: "Paid"
    };

    decrementStock(saleData.items);

    setData((prev) => ({
      ...prev,
      sales: [newInvoice, ...prev.sales]
    }));

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

    return newOrder;
  };

  // Update Online Order Status (e.g. Admin changes Pending -> Packed -> Delivered)
  const updateOrderStatus = (orderId, newStatus) => {
    setData((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    }));
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

  // Computed Live Store KPIs & Analytics
  const storeMetrics = useMemo(() => {
    const totalProducts = data.products.length;
    const lowStockItems = data.products.filter((p) => p.stock <= (p.lowStockThreshold || 10));
    const outOfStockItems = data.products.filter((p) => p.stock === 0);

    const posSalesTotal = data.sales.reduce((sum, s) => sum + (s.grandTotal || 0), 0);
    const onlineOrdersTotal = data.orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalRevenue = posSalesTotal + onlineOrdersTotal;

    return {
      totalProducts,
      lowStockCount: lowStockItems.length,
      outOfStockCount: outOfStockItems.length,
      lowStockList: lowStockItems,
      totalSalesCount: data.sales.length + data.orders.length,
      totalRevenue,
      todaySales: posSalesTotal > 0 ? posSalesTotal : 12450 // fallback demo seed
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
      const parsed = JSON.parse(jsonString);
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
      customers: []
    });
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = {
    products: data.products,
    sales: data.sales,
    orders: data.orders,
    customers: data.customers,
    addProduct,
    updateProduct,
    deleteProduct,
    recordPosSale,
    recordCustomerOrder,
    updateOrderStatus,
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
