import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

const NOTIF_STORAGE_KEY = "krishna_store_notifications_v1";

const DEFAULT_INITIAL_NOTIFS = [
  {
    id: "notif-1",
    type: "order",
    title: "New Online Order Received",
    message: "Order #ORD-9412 for ₹288.75 has been placed by Harsh Vardhan",
    time: "15 mins ago",
    link: "/orders",
    read: false,
    icon: "shopping_bag",
    color: "#006194"
  },
  {
    id: "notif-2",
    type: "warning",
    title: "Low Stock Alert",
    message: "Fortune Sunflower Oil 1L is below minimum threshold (8 units left)",
    time: "1 hour ago",
    link: "/product",
    read: false,
    icon: "inventory_2",
    color: "#ba1a1a"
  },
  {
    id: "notif-3",
    type: "khata",
    title: "Khata Settlement Received",
    message: "Rajesh Jha settled ₹3,200 full credit via Google Pay UPI",
    time: "3 hours ago",
    link: "/khata",
    read: true,
    icon: "payments",
    color: "#006a61"
  }
];

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(NOTIF_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load notifications:", e);
    }
    return DEFAULT_INITIAL_NOTIFS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  const addNotification = (notif) => {
    const item = {
      id: `notif-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString(),
      time: "Just now",
      read: false,
      icon: notif.icon || "notifications",
      color: notif.color || "#006194",
      ...notif
    };

    setNotifications((prev) => [item, ...prev].slice(0, 50));
    return item;
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return ctx;
}
