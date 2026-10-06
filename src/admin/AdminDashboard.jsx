import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import Topnav from "../component/Topnav";
import { useStore } from "../context/StoreContext";
import { sendOrderStatusUpdateSMS } from "../services/smsService";

const STATUS_STYLES = {
  Paid: { bg: "#86f2e4", text: "#006f66" },
  Pending: { bg: "#ac6200", text: "#fffbff" },
  Cancelled: { bg: "#ffdad6", text: "#93000a" },
  "In Transit": { bg: "#cce5ff", text: "#004b73" },
};

const QUICK_ACTIONS = [
  { icon: "point_of_sale", bg: "#cce5ff", color: "#001d31", label: "New Sale", sub: "Process POS checkout", path: "/billing" },
  { icon: "shopping_bag", bg: "#89f5e7", color: "#00201d", label: "New Purchase", sub: "Restock inventory", path: "/CreatePurchaseOrder" },
  { icon: "add_box", bg: "#ffdcc0", color: "#2d1600", label: "Add Product", sub: "List a new item", path: "/add-product" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { storeMetrics, sales, orders, products, updateOrderStatus } = useStore();
  const [selectedTx, setSelectedTx] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const dynamicStats = useMemo(() => {
    return [
      {
        icon: "payments",
        iconBg: "#007bb9",
        label: "Today's Sales",
        value: `₹${Number(storeMetrics.todaySales || 0).toLocaleString("en-IN")}`,
        sub: `${sales.length} transactions recorded`,
        change: "+12.4%",
        changeColor: "#006a61",
      },
      {
        icon: "account_balance_wallet",
        iconBg: "#006a61",
        label: "Total Revenue",
        value: `₹${Number(storeMetrics.totalRevenue || 0).toLocaleString("en-IN")}`,
        sub: "POS + Online Storefront",
        change: "+8.4%",
        changeColor: "#006a61",
      },
      {
        icon: "percent",
        iconBg: "#894d00",
        label: "Profit Margin",
        value: "18.5%",
        sub: "Average across categories",
        change: "+1.2%",
        changeColor: "#006a61",
      },
      {
        icon: "inventory",
        iconBg: "#bfc7d2",
        label: "Active Stock",
        value: String(products.length),
        sub: `${storeMetrics.lowStockCount} items need attention`,
        change: storeMetrics.lowStockCount > 0 ? `${storeMetrics.lowStockCount} Low` : "Healthy",
        changeColor: storeMetrics.lowStockCount > 0 ? "#ba1a1a" : "#006a61",
      },
    ];
  }, [storeMetrics, sales, products]);

  const recentTransactions = useMemo(() => {
    const combined = [
      ...(sales || []).map((s) => ({
        ...s,
        isOnlineOrder: false,
        date: s.date || "Today",
        id: s.id,
        customer: s.customer || "Walk-in Customer",
        amount: `₹${Number(s.grandTotal || s.total || 0).toFixed(2)}`,
        status: s.status || "Paid",
      })),
      ...(orders || []).map((o) => ({
        ...o,
        isOnlineOrder: true,
        date: o.date ? new Date(o.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "Today",
        id: o.id,
        customer: o.customerName || o.customer || (o.shippingAddress ? String(o.shippingAddress).split(",")[0] : "Online Customer"),
        amount: `₹${Number(o.total || 0).toFixed(2)}`,
        status: o.status || "Pending",
      })),
    ];
    return combined.slice(0, 8);
  }, [sales, orders]);

  const dynamicLowStock = useMemo(() => {
    if (storeMetrics.lowStockList && storeMetrics.lowStockList.length > 0) {
      return storeMetrics.lowStockList.slice(0, 4).map((p) => ({
        name: p.name,
        note: p.stock === 0 ? "Out of stock" : `Only ${p.stock} units left`,
        noteColor: p.stock === 0 ? "#ba1a1a" : "#894d00",
      }));
    }
    return [
      { name: "Amul Butter 500g", note: "Only 2 units left", noteColor: "#ba1a1a" },
      { name: "Parle-G 20pk", note: "Only 5 units left", noteColor: "#ba1a1a" },
      { name: "Fortune Sunflower Oil 1L", note: "Out of stock", noteColor: "#ba1a1a" },
    ];
  }, [storeMetrics.lowStockList]);
  // Card hover lift + button press-scale (same behavior as the original <script>)
  useEffect(() => {
    const cards = document.querySelectorAll(".glass-card");
    const cardCleanup = [];
    cards.forEach((card) => {
      const onEnter = () => {
        card.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
        card.style.transform = "translateY(-2px)";
      };
      const onLeave = () => {
        card.style.boxShadow = "";
        card.style.transform = "translateY(0px)";
      };
      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);
      cardCleanup.push(() => {
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    const buttons = document.querySelectorAll("button");
    const btnCleanup = [];
    buttons.forEach((btn) => {
      const onDown = () => (btn.style.transform = "scale(0.95)");
      const onUp = () => (btn.style.transform = "scale(1)");
      btn.addEventListener("mousedown", onDown);
      btn.addEventListener("mouseup", onUp);
      btn.addEventListener("mouseleave", onUp);
      btnCleanup.push(() => {
        btn.removeEventListener("mousedown", onDown);
        btn.removeEventListener("mouseup", onUp);
        btn.removeEventListener("mouseleave", onUp);
      });
    });

    return () => {
      cardCleanup.forEach((fn) => fn());
      btnCleanup.forEach((fn) => fn());
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; vertical-align: middle; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #bfc7d2; border-radius: 10px; }
        .glass-card {
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(226,232,240,0.8);
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
      `}</style>

      {/* ---------- Side Nav ---------- */}
      <Sidebar />

      {/* ---------- Top Nav ---------- */}
      <Topnav />

      {/* ---------- Main Content ---------- */}
      <main className="md:ml-60 ml-0 p-4 sm:p-6 min-h-screen transition-all duration-300">
        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dynamicStats.map((stat) => (
            <div key={stat.label} className="glass-card p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${stat.iconBg}1A`, color: stat.iconBg }}
                >
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </div>
                <span className="flex items-center gap-1 text-[12px] font-bold" style={{ color: stat.changeColor }}>
                  {stat.change !== "Stable" && (
                    <span className="material-symbols-outlined text-[14px]">
                      {stat.changeColor === "#ba1a1a" ? "trending_down" : "trending_up"}
                    </span>
                  )}
                  {stat.change}
                </span>
              </div>
              <h3 className="text-[#3f4850] text-sm uppercase tracking-wider mb-1">{stat.label}</h3>
              <p className="text-[28px] font-bold leading-tight">{stat.value}</p>
              <p className="text-sm text-[#3f4850] opacity-60 mt-2">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Khata Book Highlights Banner */}
        <div className="mb-8 p-5 bg-gradient-to-r from-[#006194] to-[#007bb9] rounded-2xl text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <span className="material-symbols-outlined text-3xl">menu_book</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg">Digital Khata Book (उधार खाता)</h3>
                <span className="px-2 py-0.5 bg-amber-400 text-amber-950 font-black text-[10px] rounded uppercase">
                  Active Ledger
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                Market Pending Due:{" "}
                <strong className="text-white text-sm">
                  ₹{Number(storeMetrics.totalKhataOutstanding || 0).toLocaleString("en-IN")}
                </strong>{" "}
                across {storeMetrics.khataCustomerCount || 0} customer accounts • Collected: ₹{Number(storeMetrics.totalKhataCollected || 0).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/khata")}
            className="px-5 py-2.5 bg-white text-[#006194] hover:bg-blue-50 font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Manage Khata &amp; Send Reminders</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Recent Transactions */}
          <div className="col-span-12 lg:col-span-8 glass-card rounded-xl shadow-sm flex flex-col">
            <div className="p-6 border-b border-[#bfc7d2]/30 flex justify-between items-center">
              <h2 className="text-[18px] font-semibold">Recent Transactions</h2>
              <button
                onClick={() => navigate("/sales")}
                className="text-[#006194] text-sm font-semibold hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left">
                <thead className="bg-[#eff4ff]/50">
                  <tr>
                    <th className="px-6 py-4 text-sm text-[#3f4850] uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-sm text-[#3f4850] uppercase tracking-wider">Invoice ID</th>
                    <th className="px-6 py-4 text-sm text-[#3f4850] uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-sm text-[#3f4850] uppercase tracking-wider text-right">Amount</th>
                    <th className="px-6 py-4 text-sm text-[#3f4850] uppercase tracking-wider text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#bfc7d2]/20">
                  {recentTransactions.map((tx) => {
                    const statusStyle = STATUS_STYLES[tx.status] || { bg: "#eff4ff", text: "#006194" };
                    return (
                      <tr
                        key={tx.id}
                        onClick={() => setSelectedTx(tx)}
                        className="hover:bg-[#eff4ff] transition-colors cursor-pointer"
                        title="Click to view details and update order status"
                      >
                        <td className="px-6 py-4 text-sm">{tx.date}</td>
                        <td className="px-6 py-4 text-base text-[#006194] font-bold">
                          <span className="flex items-center gap-1.5">
                            {tx.id}
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                              tx.isOnlineOrder ? "bg-[#cce5ff] text-[#004b73]" : "bg-gray-100 text-gray-600"
                            }`}>
                              {tx.isOnlineOrder ? "Online" : "POS"}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">{tx.customer}</td>
                        <td className="px-6 py-4 text-base text-right font-semibold">{tx.amount}</td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className="px-4 py-1 rounded-full text-[12px] font-semibold"
                            style={{
                              backgroundColor: statusStyle.bg,
                              color: statusStyle.text,
                            }}
                          >
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar widgets */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Quick actions */}
            <div className="glass-card rounded-xl p-6 shadow-sm">
              <h2 className="text-[18px] font-semibold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 gap-4">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#e5eeff] transition-all border border-[#bfc7d2]/20 text-left cursor-pointer"
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: action.bg, color: action.color }}
                    >
                      <span className="material-symbols-outlined">{action.icon}</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold">{action.label}</p>
                      <p className="text-sm text-[#3f4850] opacity-70">{action.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Low stock alerts */}
            <div className="glass-card rounded-xl p-6 shadow-sm border-l-4 border-[#ba1a1a]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[18px] font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ba1a1a]">warning</span>
                  Low Stock
                </h2>
                <span className="bg-[#ffdad6] text-[#93000a] px-2 py-1 rounded-md text-[12px] font-bold">
                  {dynamicLowStock.length} Alerts
                </span>
              </div>
              <div className="space-y-4">
                {dynamicLowStock.map((item) => (
                  <div
                    key={item.name}
                    className="flex justify-between items-center p-2 rounded-lg hover:bg-[#eff4ff]"
                  >
                    <div>
                      <p className="text-base font-medium">{item.name}</p>
                      <p className="text-sm font-bold" style={{ color: item.noteColor }}>
                        {item.note}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate("/CreatePurchaseOrder")}
                      title="Restock this item"
                      className="p-2 text-[#006194] hover:bg-[#007bb9]/20 rounded-full transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined">refresh</span>
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/CreatePurchaseOrder")}
                className="w-full mt-6 py-2 text-[#006194] text-sm font-semibold border border-[#006194]/20 rounded-lg hover:bg-[#006194] hover:text-white transition-all cursor-pointer"
              >
                Restock All Low Items
              </button>
            </div>

            {/* Goal progress */}
            <div className="glass-card rounded-xl p-6 shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-sm uppercase tracking-widest text-[#3f4850] mb-4">Goal Progress</h2>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-[28px] font-bold">72%</span>
                  <span className="text-sm text-[#3f4850] pb-1.5">of Monthly Goal Reached</span>
                </div>
                <div className="w-full bg-[#d3e4fe] rounded-full h-2.5 mb-6 overflow-hidden">
                  <div
                    className="bg-[#006194] h-full rounded-full transition-all duration-1000"
                    style={{ width: "72%", boxShadow: "0 0 10px rgba(0,97,148,0.5)" }}
                  />
                </div>
                <p className="text-sm text-[#3f4850] opacity-70">Need \u20B990,000 more to hit October target.</p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-[18px] text-[#006194]">analytics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction / Order Inspector Modal */}
        {selectedTx && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#bfc7d2] animate-in zoom-in-95 duration-200">
              <div className="p-5 border-b border-[#bfc7d2]/30 flex items-center justify-between bg-[#f8f9ff] rounded-t-2xl">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#0b1c30]">
                      {selectedTx.isOnlineOrder ? `Customer Order #${selectedTx.id}` : `POS Invoice #${selectedTx.id}`}
                    </h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      selectedTx.isOnlineOrder ? "bg-[#cce5ff] text-[#004b73]" : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {selectedTx.isOnlineOrder ? "Online Delivery" : "Store Counter"}
                    </span>
                  </div>
                  <p className="text-xs text-[#707881] mt-0.5">{selectedTx.date}</p>
                </div>
                <button
                  onClick={() => setSelectedTx(null)}
                  className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                {/* Status bar */}
                <div className="flex items-center justify-between p-3 bg-[#f8f9ff] rounded-xl border border-[#bfc7d2]/30">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">Status</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mt-1 ${
                      STATUS_STYLES[selectedTx.status] || "bg-gray-100 text-gray-800"
                    }`}>
                      {selectedTx.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">Total Amount</span>
                    <span className="text-base font-bold text-[#006194] mt-0.5 block">{selectedTx.amount}</span>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
                  <p className="font-bold text-[#0b1c30]">Customer: {selectedTx.customer}</p>
                  {selectedTx.phone && (
                    <p className="text-gray-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">phone</span>
                      {selectedTx.phone}
                    </p>
                  )}
                  {selectedTx.shippingAddress && (
                    <p className="text-gray-500 flex items-start gap-1">
                      <span className="material-symbols-outlined text-[14px] mt-0.5">location_on</span>
                      {typeof selectedTx.shippingAddress === "string" ? selectedTx.shippingAddress : "Delivery Address"}
                    </p>
                  )}
                </div>

                {/* Items */}
                {selectedTx.items && selectedTx.items.length > 0 && (
                  <div>
                    <h4 className="font-bold uppercase tracking-wider text-gray-500 mb-2">Order Items</h4>
                    <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                      {selectedTx.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between p-2 bg-gray-50 rounded-lg">
                          <span>{it.name} × {it.qty || 1}</span>
                          <span className="font-semibold tabular-nums">₹{((it.price || 0) * (it.qty || 1)).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Online Order Status Changer (Admin controls) */}
                {selectedTx.isOnlineOrder && (
                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    <h4 className="font-bold text-[#0b1c30]">Update Order Status & Dispatch SMS</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {["Packed", "In Transit", "Delivered", "Cancelled"].map((st) => (
                        <button
                          key={st}
                          onClick={() => {
                            updateOrderStatus(selectedTx.id, st);
                            setSelectedTx((prev) => ({ ...prev, status: st }));
                            sendOrderStatusUpdateSMS({
                              orderId: selectedTx.id,
                              customerName: selectedTx.customer,
                              phone: selectedTx.phone || "+91 98765 43210",
                              status: st
                            });
                            showToast(`Status updated to "${st}" & SMS dispatched!`);
                          }}
                          className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                            selectedTx.status === st
                              ? "bg-[#006194] text-white shadow-sm"
                              : "bg-[#f2f4f6] text-[#3f4850] hover:bg-[#e0e3e5]"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-[#f8f9ff] border-t border-[#bfc7d2]/30 flex justify-end gap-2 rounded-b-2xl">
                <button
                  onClick={() => setSelectedTx(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 text-xs font-bold rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Toast */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 bg-[#006194] text-white px-5 py-3 rounded-2xl shadow-2xl z-50 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            {toastMsg}
          </div>
        )}
      </main>
    </div>
  );
}
