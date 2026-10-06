/*
  SMS Notification Service for Krishna General Store
  --------------------------------------------------
  Handles SMS templating, logging, and dispatch simulation.
  Persists dispatched messages to localStorage and triggers
  live on-screen notification events for the customer UI.
*/

const SMS_STORAGE_KEY = "krishna_store_sms_logs_v1";

// Retrieve all stored SMS messages
export function getStoredSmsLogs() {
  try {
    const raw = localStorage.getItem(SMS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Could not read SMS logs:", e);
    return [];
  }
}

// Save SMS message to log and broadcast event
export function logAndDispatchSms(smsData) {
  const newSms = {
    id: `SMS-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    timestamp: new Date().toISOString(),
    formattedTime: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    formattedDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    read: false,
    ...smsData
  };

  try {
    const existing = getStoredSmsLogs();
    const updated = [newSms, ...existing].slice(0, 100); // keep last 100
    localStorage.setItem(SMS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Could not save SMS log:", e);
  }

  // Broadcast window event for live floating notification toast
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("krishna_sms_dispatched", { detail: newSms }));
  }

  return newSms;
}

// 1. Order Confirmation SMS
export function sendOrderConfirmationSMS({ orderId, customerName, phone, total, itemCount }) {
  const cleanPhone = phone || "+91 98765 43210";
  const name = customerName || "Customer";
  const amount = Number(total || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
  const text = `Dear ${name}, your order #${orderId} of ₹${amount} (${itemCount || 1} items) has been successfully placed at Krishna Store! Expected delivery: Within 2 hours. Track your order: https://store-for-all-c42fa.web.app/orders`;

  return logAndDispatchSms({
    type: "ORDER_CONFIRMATION",
    to: cleanPhone,
    recipientName: name,
    orderId,
    title: "Order Placed Successfully",
    message: text,
    amount: total
  });
}

// 2. Payment Receipt SMS
export function sendPaymentReceiptSMS({ orderId, customerName, phone, amount, paymentMethod, txnId }) {
  const cleanPhone = phone || "+91 98765 43210";
  const name = customerName || "Customer";
  const formattedAmt = Number(amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
  const text = `Dear ${name}, payment of ₹${formattedAmt} received via ${paymentMethod || "UPI"} for Order #${orderId}. Trans ID: ${txnId || `TXN-${Date.now()}`}. Thank you for shopping at Krishna Store!`;

  return logAndDispatchSms({
    type: "PAYMENT_RECEIPT",
    to: cleanPhone,
    recipientName: name,
    orderId,
    txnId,
    title: "Payment Received",
    message: text,
    amount
  });
}

// 3. Order Status Update SMS (Dispatched / Delivered / Cancelled)
export function sendOrderStatusUpdateSMS({ orderId, customerName, phone, status }) {
  const cleanPhone = phone || "+91 98765 43210";
  const name = customerName || "Customer";
  let statusText = `is now ${status}`;
  if (status === "In Transit" || status === "Dispatched") {
    statusText = "is out for delivery with our executive! Delivery expected shortly.";
  } else if (status === "Delivered") {
    statusText = "has been successfully DELIVERED. Thank you for choosing Krishna Store!";
  } else if (status === "Cancelled") {
    statusText = "has been CANCELLED. Any prepaid amount will be refunded within 24 hours.";
  }

  const text = `Dear ${name}, your order #${orderId} ${statusText} Need help? Call +91 98765 43210`;

  return logAndDispatchSms({
    type: "STATUS_UPDATE",
    to: cleanPhone,
    recipientName: name,
    orderId,
    title: `Order Status: ${status}`,
    message: text
  });
}

// 4. POS Counter Bill SMS
export function sendPosInvoiceSMS({ invoiceId, customerName, phone, grandTotal, paymentMode, itemsCount }) {
  const cleanPhone = phone || "+91 98765 43210";
  const name = customerName || "Customer";
  const amt = Number(grandTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
  const text = `Dear ${name}, thank you for your purchase at Krishna Store! Invoice #${invoiceId}: Total ₹${amt} paid via ${paymentMode} (${itemsCount || 1} items). Digital Bill: https://store-for-all-c42fa.web.app/`;

  return logAndDispatchSms({
    type: "POS_BILL",
    to: cleanPhone,
    recipientName: name,
    orderId: invoiceId,
    title: "Store Purchase Invoice",
    message: text,
    amount: grandTotal
  });
}

// 5. Khata / Udhar Balance Reminder SMS
export function sendKhataReminderSMS({ customerName, phone, dueAmount }) {
  const cleanPhone = phone || "+91 98765 43210";
  const name = customerName || "Customer";
  const amt = Number(dueAmount || 0).toLocaleString("en-IN");
  const text = `Namaste ${name}, your outstanding Khata balance at Krishna Store is ₹${amt}. Kindly settle via UPI (krishnastore@upi) or at our counter. Thank you!`;

  return logAndDispatchSms({
    type: "KHATA_REMINDER",
    to: cleanPhone,
    recipientName: name,
    title: "Udhar Payment Reminder",
    message: text,
    amount: dueAmount
  });
}

// Clear all logs
export function clearSmsLogs() {
  try {
    localStorage.removeItem(SMS_STORAGE_KEY);
  } catch (e) {}
}
