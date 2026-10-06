import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../component/CartContext";
import { useStore } from "../context/StoreContext";
import { sendOrderStatusUpdateSMS } from "../services/smsService";
import StorefrontNavbar from "../component/StorefrontNavbar.jsx";

const PAGE_SIZE = 6;

const STATUS_STYLES = {
  Delivered: "bg-[#6ffbbe] text-[#005236]",
  Pending: "bg-[#dae2fd] text-[#5c647a]",
  "In Transit": "bg-[#cce5ff] text-[#004b73]",
  Packed: "bg-[#fef3c7] text-[#b45309]",
  Cancelled: "bg-[#ffdad6] text-[#93000a]",
};

const inr = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  const d = new Date(isoString);
  return isNaN(d.getTime())
    ? isoString
    : d.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { orders: storeOrders, updateOrderStatus } = useStore();
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingOrder, setTrackingOrder] = useState(null);

  // Canonical orders sorted newest first
  const orders = useMemo(() => {
    return [...(storeOrders || [])].sort(
      (a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
    );
  }, [storeOrders]);

  const orderStats = useMemo(() => {
    const totalOrders = orders.length;
    const inTransit = orders.filter((o) => o.status === "In Transit" || o.status === "Pending" || o.status === "Packed").length;
    const totalSpent = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    return { totalOrders, inTransit, totalSpent };
  }, [orders]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    if (statusFilter === "ALL") return orders;
    return orders.filter((o) => o.status?.toLowerCase() === statusFilter.toLowerCase());
  }, [orders, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const visibleOrders = filteredOrders.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const rangeStart = filteredOrders.length === 0 ? 0 : page * PAGE_SIZE + 1;
  const rangeEnd = Math.min(filteredOrders.length, page * PAGE_SIZE + PAGE_SIZE);

  // Helper to format shipping address string or object
  const formatAddress = (addr) => {
    if (!addr) return "Standard Delivery Address, Bengaluru";
    if (typeof addr === "string") return addr;
    if (typeof addr === "object") {
      const parts = [addr.name, addr.address || addr.street, addr.city, addr.phone].filter(Boolean);
      return parts.join(", ") || "Standard Delivery Address";
    }
    return String(addr);
  };

  // Reorder all items
  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) return;
    order.items.forEach((it) => {
      addToCart(it, it.qty || 1);
    });
    navigate("/checkout");
  };

  // Cancel order handler
  const handleCancelOrder = (order) => {
    if (window.confirm(`Are you sure you want to cancel Order #${order.id}?`)) {
      updateOrderStatus(order.id, "Cancelled");
      sendOrderStatusUpdateSMS({
        orderId: order.id,
        customerName: order.customerName || order.customer || "Customer",
        phone: order.phone || "+91 98765 43210",
        status: "Cancelled"
      });
      if (selectedOrder?.id === order.id) {
        setSelectedOrder((prev) => ({ ...prev, status: "Cancelled" }));
      }
      alert(`Order #${order.id} has been cancelled.`);
    }
  };

  // Print invoice receipt
  const handlePrintReceipt = (order) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const itemsRows = (order.items || [])
      .map(
        (it, idx) =>
          `<tr>
            <td style="padding: 6px; border-bottom: 1px dashed #ccc;">${idx + 1}. ${it.name}</td>
            <td style="padding: 6px; text-align: center; border-bottom: 1px dashed #ccc;">${it.qty}</td>
            <td style="padding: 6px; text-align: right; border-bottom: 1px dashed #ccc;">₹${it.price.toFixed(2)}</td>
            <td style="padding: 6px; text-align: right; border-bottom: 1px dashed #ccc;">₹${(it.price * it.qty).toFixed(2)}</td>
          </tr>`
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice #${order.id} - Krishna Store</title>
          <style>
            body { font-family: 'Courier New', monospace; font-size: 13px; max-width: 360px; margin: 20px auto; padding: 10px; }
            h2, h3 { text-align: center; margin: 2px 0; }
            .dashed { border-top: 1px dashed #000; margin: 8px 0; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            .text-right { text-align: right; }
          </style>
        </head>
        <body>
          <h2>KRISHNA GENERAL STORE</h2>
          <p style="text-align: center; font-size: 11px; margin: 2px 0;">HSR Layout Sector 2, Bengaluru - 560102<br>GSTIN: 29ABCDE1234F1Z5 | Helpline: +91 98765 43210</p>
          <div class="dashed"></div>
          <p><strong>Order ID:</strong> #${order.id}<br>
          <strong>Date:</strong> ${formatDate(order.date)}<br>
          <strong>Customer:</strong> ${order.customerName || order.customer || "Walk-in"}<br>
          <strong>Payment:</strong> ${order.paymentMethod || "UPI"} (${order.paymentStatus || "Paid"})</p>
          <div class="dashed"></div>
          <table>
            <thead>
              <tr style="border-bottom: 1px solid #000;">
                <th style="text-align: left; padding: 4px;">Item</th>
                <th style="padding: 4px;">Qty</th>
                <th style="text-align: right; padding: 4px;">Rate</th>
                <th style="text-align: right; padding: 4px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>
          <div class="dashed"></div>
          <table>
            <tr><td>Subtotal:</td><td class="text-right">₹${Number(order.subtotal || order.total).toFixed(2)}</td></tr>
            ${order.discount > 0 ? `<tr><td>Discount:</td><td class="text-right">-₹${Number(order.discount).toFixed(2)}</td></tr>` : ""}
            <tr><td>GST (5%):</td><td class="text-right">₹${Number(order.gst || (order.total * 0.05)).toFixed(2)}</td></tr>
            <tr style="font-weight: bold; font-size: 14px;"><td>Grand Total:</td><td class="text-right">₹${Number(order.total).toFixed(2)}</td></tr>
          </table>
          <div class="dashed"></div>
          <p style="text-align: center; font-size: 11px;">Thank you for shopping at Krishna Store! 🙏<br>Delivery Address: ${formatAddress(order.shippingAddress || order.address)}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  // CSV Export handler
  const handleExportCSV = () => {
    if (!orders || orders.length === 0) {
      alert("No orders to export.");
      return;
    }
    const headers = ["Order ID", "Date", "Customer", "Items Count", "Total (INR)", "Status", "Payment Method"];
    const rows = orders.map((o) => [
      `"${o.id}"`,
      `"${formatDate(o.date)}"`,
      `"${o.customerName || o.customer || "Customer"}"`,
      o.items ? o.items.length : 0,
      o.total,
      `"${o.status}"`,
      `"${o.paymentMethod || "UPI"}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `krishna_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined { font-family: 'Material Symbols Outlined' !important; vertical-align: middle; }
      `}</style>

      {/* Top Navbar */}
      <StorefrontNavbar cartCount={0} />

      <main className="pt-24 pb-16 px-4 sm:px-6 max-w-[1280px] mx-auto min-h-screen">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0b1c30]">Order History & Tracking</h1>
            <p className="text-xs sm:text-sm text-[#707881] mt-1">
              Track live deliveries, review past invoices, and manage online grocery orders.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/storefront")}
              className="flex items-center gap-2 px-4 py-2 bg-[#006194] text-white rounded-xl hover:bg-[#007bb9] transition-colors text-xs sm:text-sm font-semibold shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              Browse Catalog
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-[#bfc7d2] rounded-xl text-xs sm:text-sm font-semibold hover:bg-white bg-[#f8f9ff] transition-colors text-[#3f4850]"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export CSV
            </button>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-[#bfc7d2]/30 flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <span className="p-3 bg-[#eff4ff] text-[#006194] rounded-xl">
                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              </span>
              <span className="text-xs font-semibold text-[#006194]">All Time</span>
            </div>
            <div className="mt-2">
              <p className="text-[11px] text-[#707881] uppercase tracking-wider font-semibold">Total Orders</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#0b1c30]">{String(orderStats.totalOrders).padStart(2, "0")}</p>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-[#bfc7d2]/30 flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <span className="p-3 bg-[#e0f7ef] text-[#006a61] rounded-xl">
                <span className="material-symbols-outlined text-[20px]">local_shipping</span>
              </span>
              {orderStats.inTransit > 0 && (
                <span className="text-[10px] font-bold bg-[#6ffbbe]/30 text-[#005236] px-2.5 py-1 rounded-full animate-pulse">
                  Active
                </span>
              )}
            </div>
            <div className="mt-2">
              <p className="text-[11px] text-[#707881] uppercase tracking-wider font-semibold">Active In Transit</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#006a61]">{String(orderStats.inTransit).padStart(2, "0")}</p>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-[#bfc7d2]/30 flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <span className="p-3 bg-[#fff4e5] text-[#b45309] rounded-xl">
                <span className="material-symbols-outlined text-[20px]">payments</span>
              </span>
              <span className="text-[10px] font-bold bg-[#fef3c7] text-[#92400e] px-2.5 py-1 rounded-full">
                Lifetime
              </span>
            </div>
            <div className="mt-2">
              <p className="text-[11px] text-[#707881] uppercase tracking-wider font-semibold">Total Spent</p>
              <p className="text-2xl sm:text-3xl font-bold tabular-nums text-[#0b1c30]">{inr(orderStats.totalSpent)}</p>
            </div>
          </div>
        </div>

        {/* Orders Table Container */}
        <div className="bg-white rounded-2xl shadow-xs overflow-hidden border border-[#bfc7d2]/40">
          <div className="px-6 py-4 border-b border-[#bfc7d2]/30 flex flex-wrap justify-between items-center gap-3 bg-[#f8f9ff]">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-[#0b1c30]">Your Order History</h3>
              {statusFilter !== "ALL" && (
                <span className="text-xs bg-[#eff4ff] text-[#006194] px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  Filter: {statusFilter}
                  <button onClick={() => setStatusFilter("ALL")} className="hover:text-black">
                    <span className="material-symbols-outlined text-[13px]">close</span>
                  </button>
                </span>
              )}
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-[#bfc7d2] rounded-lg text-xs font-semibold hover:bg-white transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">filter_list</span>
                Status: {statusFilter}
              </button>
              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-[#bfc7d2]/50 py-1.5 z-20 animate-in fade-in">
                  {["ALL", "Delivered", "In Transit", "Packed", "Pending", "Cancelled"].map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setStatusFilter(st);
                        setShowFilterMenu(false);
                        setPage(0);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-[#eff4ff] flex items-center justify-between ${
                        statusFilter === st ? "text-[#006194] font-bold bg-[#eff4ff]/60" : "text-[#191c1e]"
                      }`}
                    >
                      {st === "ALL" ? "All Orders" : st}
                      {statusFilter === st && (
                        <span className="material-symbols-outlined text-[15px]">check</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <span className="material-symbols-outlined text-5xl text-gray-300">receipt_long</span>
              <p className="font-bold text-base text-[#0b1c30]">No orders found</p>
              <p className="text-xs text-[#707881] max-w-sm mx-auto">
                {orders.length === 0
                  ? "You have not placed any orders yet. Add items to cart and checkout to see them here!"
                  : `No orders matching filter "${statusFilter}".`}
              </p>
              <button
                onClick={() => setStatusFilter("ALL")}
                className="text-xs font-bold text-[#006194] hover:underline"
              >
                Clear filter
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f2f4f6]/70 border-b border-[#bfc7d2]/30 text-[11px] font-bold text-[#707881] uppercase tracking-wider">
                      <th className="px-6 py-3.5">Order ID</th>
                      <th className="px-6 py-3.5">Date & Time</th>
                      <th className="px-6 py-3.5">Items</th>
                      <th className="px-6 py-3.5">Total Amount</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                    {visibleOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#f8f9ff] transition-colors">
                        <td className="px-6 py-4 font-bold tabular-nums text-[#006194]">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 text-[#3f4850]">{formatDate(order.date)}</td>
                        <td className="px-6 py-4 text-[#3f4850]">
                          <span className="font-semibold text-[#0b1c30]">
                            {order.items ? order.items.length : 1} item{order.items?.length === 1 ? "" : "s"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold tabular-nums text-[#0b1c30]">{inr(order.total)}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              STATUS_STYLES[order.status] || "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setTrackingOrder(order)}
                              className="px-2.5 py-1 bg-[#eff4ff] text-[#006194] hover:bg-[#dce9ff] rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                              title="Live Delivery Tracking"
                            >
                              <span className="material-symbols-outlined text-[14px]">near_me</span>
                              Track
                            </button>
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold transition-colors"
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="px-6 py-4 border-t border-[#bfc7d2]/30 flex justify-between items-center bg-[#f8f9ff]/50">
                <span className="text-xs text-[#707881]">
                  Showing {rangeStart}-{rangeEnd} of {filteredOrders.length} orders
                </span>
                <div className="flex gap-2">
                  <button
                    className="p-1.5 border border-[#bfc7d2] rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed text-[#3f4850]"
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  <button
                    className="p-1.5 border border-[#bfc7d2] rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed text-[#3f4850]"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* 1. Interactive Live Tracking Modal */}
      {trackingOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200 border border-[#bfc7d2]">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
              <div>
                <h3 className="font-bold text-base text-[#0b1c30]">Live Delivery Tracking</h3>
                <p className="text-xs text-[#006194] font-semibold">Order #{trackingOrder.id}</p>
              </div>
              <button onClick={() => setTrackingOrder(null)} className="p-1 rounded-full hover:bg-gray-100 text-gray-500">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Tracking Progress Bar */}
            <div className="py-4 space-y-6">
              {[
                { title: "Order Placed & Confirmed", desc: "Payment verified by store", done: true, icon: "check_circle" },
                { title: "Packed at Krishna Store", desc: "Items checked and bagged", done: trackingOrder.status !== "Pending", icon: "inventory" },
                { title: "Out for Express Delivery", desc: "Delivery partner assigned", done: trackingOrder.status === "In Transit" || trackingOrder.status === "Delivered", icon: "two_wheeler" },
                { title: "Delivered to Customer", desc: formatAddress(trackingOrder.shippingAddress || trackingOrder.address), done: trackingOrder.status === "Delivered", icon: "home" },
              ].map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 z-10 ${
                    step.done ? "bg-[#006a61]" : "bg-gray-300 text-gray-600"
                  }`}>
                    <span className="material-symbols-outlined text-[16px]">{step.icon}</span>
                  </div>
                  {idx < 3 && (
                    <div className={`absolute left-4 top-8 w-0.5 h-8 -ml-px ${
                      step.done ? "bg-[#006a61]" : "bg-gray-200"
                    }`} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold ${step.done ? "text-[#0b1c30]" : "text-gray-400"}`}>
                      {step.title}
                    </p>
                    <p className="text-[11px] text-gray-500 line-clamp-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#006194]/20 flex items-center justify-between text-xs mt-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006194] text-[18px]">support_agent</span>
                <span className="font-semibold text-[#006194]">Delivery Helpline:</span>
              </div>
              <a href="tel:+919876543210" className="font-bold text-[#006194] hover:underline">
                +91 98765 43210
              </a>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setTrackingOrder(null)}
                className="w-full py-2.5 bg-[#006194] hover:bg-[#007bb9] text-white rounded-xl text-xs font-bold transition-colors"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#bfc7d2] animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-[#bfc7d2]/30 flex items-center justify-between bg-[#f8f9ff] rounded-t-2xl">
              <div>
                <h3 className="text-base font-bold text-[#0b1c30]">Order #{selectedOrder.id}</h3>
                <p className="text-xs text-[#707881] mt-0.5">Placed on {formatDate(selectedOrder.date)}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Status Header */}
              <div className="flex items-center justify-between p-3.5 bg-[#f8f9ff] rounded-xl border border-[#bfc7d2]/30">
                <div>
                  <span className="text-[10px] text-[#707881] uppercase font-bold tracking-wider block">Status</span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mt-1 ${
                      STATUS_STYLES[selectedOrder.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#707881] uppercase font-bold tracking-wider block">Payment</span>
                  <span className="text-xs font-bold text-[#006194] mt-1 block">
                    {selectedOrder.paymentMethod || "UPI"} ({selectedOrder.paymentStatus || "Paid"})
                  </span>
                  {selectedOrder.transactionId && (
                    <span className="text-[10px] text-gray-500 font-mono block mt-0.5">
                      Ref: {selectedOrder.transactionId}
                    </span>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="font-bold uppercase tracking-wider text-gray-500 mb-2">Purchased Items</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2.5">
                          {it.image && (
                            <img src={it.image} alt={it.name} className="w-9 h-9 object-cover rounded-md border border-gray-200" />
                          )}
                          <div>
                            <p className="font-bold text-[#0b1c30]">{it.name}</p>
                            <p className="text-[11px] text-gray-500">Qty: {it.qty} × {inr(it.price)}</p>
                          </div>
                        </div>
                        <span className="font-bold text-[#0b1c30] tabular-nums">{inr(it.price * (it.qty || 1))}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No item details available.</p>
                  )}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="pt-2 border-t border-gray-100">
                <h4 className="font-bold uppercase tracking-wider text-gray-500 mb-1">Destination Address</h4>
                <p className="text-[#0b1c30] leading-relaxed bg-[#f8f9ff] p-2.5 rounded-lg border border-[#bfc7d2]/30">
                  {formatAddress(selectedOrder.shippingAddress || selectedOrder.address)}
                </p>
              </div>

              {/* Bill breakdown */}
              <div className="pt-2 border-t border-gray-100 space-y-1.5 text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-semibold">{inr(selectedOrder.subtotal || selectedOrder.total)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-[#006a61] font-semibold">
                    <span>Coupon Discount</span>
                    <span className="tabular-nums">-{inr(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="tabular-nums font-semibold">{inr(selectedOrder.gst || (selectedOrder.total * 0.05))}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#0b1c30] pt-2 border-t border-gray-200">
                  <span>Total Paid</span>
                  <span className="text-[#006194] tabular-nums">{inr(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 bg-[#f8f9ff] border-t border-[#bfc7d2]/30 flex flex-wrap items-center justify-between gap-2 rounded-b-2xl">
              <div className="flex gap-2">
                <button
                  onClick={() => handlePrintReceipt(selectedOrder)}
                  className="px-3 py-1.5 bg-white border border-[#bfc7d2] hover:bg-gray-50 rounded-lg text-xs font-bold text-[#006194] flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">print</span>
                  Print Tax Bill
                </button>
                <button
                  onClick={() => handleReorder(selectedOrder)}
                  className="px-3 py-1.5 bg-[#006194] hover:bg-[#007bb9] text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">replay</span>
                  Reorder
                </button>
              </div>

              <div className="flex gap-2">
                {selectedOrder.status !== "Delivered" && selectedOrder.status !== "Cancelled" && (
                  <button
                    onClick={() => handleCancelOrder(selectedOrder)}
                    className="px-3 py-1.5 text-xs font-bold text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-lg transition-colors"
                  >
                    Cancel Order
                  </button>
                )}
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-1.5 bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full py-8 bg-[#eceef0] border-t border-[#bfc7d2]">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-[1280px] mx-auto gap-4 text-xs text-[#3f4850]">
          <div>
            <span className="text-base font-bold text-[#006194]">Krishna General Store</span>
            <p className="text-[11px] text-gray-500 mt-0.5">© 2024 Krishna Store Ecosystem. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            <button onClick={() => navigate("/help")} className="hover:text-[#006194]">Privacy Policy</button>
            <button onClick={() => navigate("/help")} className="hover:text-[#006194]">Terms of Service</button>
            <button onClick={() => navigate("/help")} className="hover:text-[#006194] font-semibold text-[#006194]">Customer Help</button>
          </div>
        </div>
      </footer>
    </div>
  );
}