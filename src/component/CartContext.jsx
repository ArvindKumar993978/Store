import React, { createContext, useContext, useState, useMemo } from "react";

/*
  CartContext
  -----------
  Single source of truth for the cart AND order history, shared across
  StorefrontPage (adds items), ShoppingCart (reviews items), Checkout
  (places the order), and OrderHistory (reads past orders).

  Wrap your app once, near the top (e.g. in App.jsx / main.jsx):

    import { CartProvider } from "./context/CartContext";

    <CartProvider>
      <BrowserRouter>
        <Routes>...</Routes>
      </BrowserRouter>
    </CartProvider>

  Then anywhere below it, call useCart() to read/update the cart or orders.
*/

// Shared so ShoppingCart, Checkout, and OrderHistory compute totals identically.
export const GST_RATE = 0.05; // 5%

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // Each cart item: { id, name, desc, price (number), image, qty }
  const [items, setItems] = useState([]);

  // Each order: { id, date, items, subtotal, gst, total, status, paymentMethod }
  const [orders, setOrders] = useState([]);

  const addToCart = (product) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.id === product.id);
      if (existing) {
        return prev.map((it) =>
          it.id === product.id ? { ...it, qty: it.qty + 1 } : it
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it
      )
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const clearCart = () => setItems([]);

  const cartCount = useMemo(
    () => items.reduce((sum, it) => sum + it.qty, 0),
    [items]
  );

  // Turns the current cart into an order record, appends it to order
  // history, and empties the cart. Called from Checkout on success.
  const placeOrder = (paymentMethod) => {
    if (items.length === 0) return null;

    const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
    const gst = subtotal * GST_RATE;
    const total = subtotal + gst;

    const order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      items: items.map((it) => ({ ...it })),
      subtotal,
      gst,
      total,
      status: "Pending",
      paymentMethod: paymentMethod || "upi",
    };

    setOrders((prev) => [order, ...prev]);
    setItems([]);
    return order;
  };

  const orderStats = useMemo(() => {
    const totalOrders = orders.length;
    const inTransit = orders.filter(
      (o) => o.status === "Pending" || o.status === "In Transit"
    ).length;
    const totalSpent = orders
      .filter((o) => o.status !== "Cancelled")
      .reduce((sum, o) => sum + o.total, 0);
    return { totalOrders, inTransit, totalSpent };
  }, [orders]);

  const value = {
    items,
    addToCart,
    updateQty,
    removeItem,
    clearCart,
    cartCount,
    orders,
    placeOrder,
    orderStats,
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