import React, { createContext, useContext, useState, useMemo, useEffect } from "react";

/*
  CartContext
  -----------
  Persistent shopping cart & order manager with localStorage sync.
*/

export const GST_RATE = 0.05; // 5%
const CART_STORAGE_KEY = "krishna_store_cart_items_v2";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // Load saved cart items from localStorage
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to load cart items", e);
    }
    return [];
  });

  // Save cart items to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to save cart items", e);
    }
  }, [items]);

  // Active Promo Code State
  const [appliedPromo, setAppliedPromo] = useState(null); // { code, discount, desc }

  const addToCart = (product, quantity = 1) => {
    const priceNum = typeof product.price === "number" ? product.price : parseFloat(String(product.price).replace(/[^0-9.]/g, "") || 0);

    setItems((prev) => {
      const existing = prev.find((it) => it.id === product.id);
      if (existing) {
        return prev.map((it) =>
          it.id === product.id ? { ...it, qty: it.qty + quantity } : it
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          desc: product.desc || product.name,
          price: priceNum,
          image: product.image,
          stock: product.stock !== undefined ? product.stock : 99,
          qty: quantity
        }
      ];
    });
  };

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev
        .map((it) => {
          if (it.id === id) {
            const nextQty = it.qty + delta;
            return nextQty > 0 ? { ...it, qty: nextQty } : null;
          }
          return it;
        })
        .filter(Boolean)
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedPromo(null);
  };

  const cartCount = useMemo(
    () => items.reduce((sum, it) => sum + it.qty, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.qty, 0),
    [items]
  );

  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    return appliedPromo.discount || 0;
  }, [appliedPromo]);

  const gst = useMemo(() => {
    const taxable = Math.max(0, subtotal - discountAmount);
    return taxable * GST_RATE;
  }, [subtotal, discountAmount]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + gst);
  }, [subtotal, discountAmount, gst]);

  // Load saved orders from localStorage
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem("krishna_store_orders_v2");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to load orders", e);
    }
    return [
      {
        id: "ORD-9412",
        date: new Date(Date.now() - 3600000 * 4).toISOString(),
        customer: "Harsh Vardhan",
        shippingAddress: "402, Sapphire Heights, HSR Layout, Bengaluru",
        items: [
          { id: 1, name: "Whole Milk - 1L", price: 45, qty: 2 },
          { id: 2, name: "Honey Loops Cereal", price: 185, qty: 1 }
        ],
        subtotal: 275,
        discount: 0,
        gst: 13.75,
        total: 288.75,
        status: "In Transit",
        paymentMethod: "UPI"
      }
    ];
  });

  // Save orders to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("krishna_store_orders_v2", JSON.stringify(orders));
    } catch (e) {
      console.warn("Failed to save orders", e);
    }
  }, [orders]);

  const placeOrder = (paymentMethod = "UPI", extraDetails = {}) => {
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      customer: extraDetails.customer || "Online Customer",
      shippingAddress: extraDetails.shippingAddress || "Main Market, Bengaluru",
      items: [...items],
      subtotal: subtotal,
      discount: discountAmount,
      gst: gst,
      total: grandTotal,
      status: "In Transit",
      paymentMethod: paymentMethod
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const orderStats = useMemo(() => {
    const totalOrders = orders.length;
    const inTransit = orders.filter((o) => o.status === "In Transit" || o.status === "Pending").length;
    const totalSpent = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    return { totalOrders, inTransit, totalSpent };
  }, [orders]);

  const value = {
    items,
    addToCart,
    updateQty,
    removeItem,
    clearCart,
    cartCount,
    subtotal,
    appliedPromo,
    setAppliedPromo,
    discountAmount,
    gst,
    grandTotal,
    orders,
    orderStats,
    placeOrder
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a <CartProvider>");
  }
  return ctx;
}