import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import Topnav from "../component/Topnav";
import { useStore } from "../context/StoreContext";

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
  const { storeMetrics, sales, orders, products } = useStore();

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
        date: s.date || "Today",
        id: s.id,
        customer: s.customer || "Walk-in Customer",
        amount: `₹${Number(s.grandTotal || s.total || 0).toFixed(2)}`,
        status: s.status || "Paid",
      })),
      ...(orders || []).map((o) => ({
        date: o.date ? new Date(o.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "Today",
        id: o.id,
        customer: o.customer || (o.shippingAddress ? o.shippingAddress.split(",")[0] : "Online Customer"),
        amount: `₹${Number(o.total || 0).toFixed(2)}`,
        status: o.status === "Delivered" ? "Paid" : o.status || "Pending",
      })),
    ];
    return combined.slice(0, 5);
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
      <main className="ml-60 p-6 min-h-screen">
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
                        onClick={() => navigate("/sales")}
                        className="hover:bg-[#eff4ff] transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 text-sm">{tx.date}</td>
                        <td className="px-6 py-4 text-base text-[#006194] font-bold">{tx.id}</td>
                        <td className="px-6 py-4 text-sm font-medium">{tx.customer}</td>
                        <td className="px-6 py-4 text-base text-right">{tx.amount}</td>
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
      </main>
    </div>
  );
}
