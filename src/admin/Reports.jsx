import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../component/Sidebar";
import { useNavigate } from "react-router-dom";
import AnalyticsTopNav from "../component/AnalyticsTopNav";
import { useStore } from "../context/StoreContext";

const WEEKLY_SALES = [
  { label: "Mon", pct: 52 },
  { label: "Tue", pct: 68 },
  { label: "Wed", pct: 60 },
  { label: "Thu", pct: 88, highlight: true },
  { label: "Fri", pct: 75 },
  { label: "Sat", pct: 98 },
  { label: "Sun", pct: 45 },
];

const MONTHLY_SALES = [
  { label: "May", pct: 55 },
  { label: "Jun", pct: 64 },
  { label: "Jul", pct: 72 },
  { label: "Aug", pct: 85, highlight: true },
  { label: "Sep", pct: 92 },
];

export default function Reports() {
  const navigate = useNavigate();
  const { products, sales, orders, storeMetrics } = useStore();

  const [period, setPeriod] = useState("weekly"); // "weekly" | "monthly"
  const [barsIn, setBarsIn] = useState(false);

  const chartData = period === "weekly" ? WEEKLY_SALES : MONTHLY_SALES;

  useEffect(() => {
    setBarsIn(false);
    const timer = setTimeout(() => setBarsIn(true), 100);
    return () => clearTimeout(timer);
  }, [period]);

  // Dynamically compute GST from sales and orders
  const totalTax = useMemo(() => {
    const posGst = sales.reduce((sum, s) => sum + (s.cgst || 0) + (s.sgst || 0), 0);
    const onlineGst = orders.reduce((sum, o) => sum + (o.gst || 0), 0);
    const calculated = posGst + onlineGst;
    return calculated > 0 ? calculated : Math.round(storeMetrics.totalRevenue * 0.05);
  }, [sales, orders, storeMetrics.totalRevenue]);

  // Margin calculation
  const avgMargin = useMemo(() => {
    if (!storeMetrics.totalRevenue) return 24.5;
    const margin = ((storeMetrics.netProfit / storeMetrics.totalRevenue) * 100).toFixed(1);
    return Math.min(100, Math.max(5, parseFloat(margin) || 24.5));
  }, [storeMetrics]);

  const summaryStats = useMemo(() => [
    {
      label: "Net Profit",
      icon: "payments",
      iconColor: "#006947",
      value: `₹${Math.round(storeMetrics.netProfit).toLocaleString("en-IN")}`,
      change: "+14.2%",
      changeNote: "vs last month",
      changeColor: "#006947",
    },
    {
      label: "Tax (GST)",
      icon: "account_balance",
      iconColor: "#006194",
      value: `₹${Math.round(totalTax).toLocaleString("en-IN")}`,
      change: "+5.8%",
      changeNote: "collected this month",
      changeColor: "#006947",
    },
    {
      label: "Expenses (PO)",
      icon: "shopping_cart_checkout",
      iconColor: "#ba1a1a",
      value: `₹${Math.round(storeMetrics.totalExpenses).toLocaleString("en-IN")}`,
      change: "-3.2%",
      changeNote: "inventory & wholesale",
      changeColor: "#006947",
    },
    {
      label: "Avg Margin",
      icon: "pie_chart",
      iconColor: "#565e74",
      value: `${avgMargin}%`,
      progress: avgMargin,
    },
  ], [storeMetrics, totalTax, avgMargin]);

  // Grocery category sales
  const categorySales = useMemo(() => {
    return [
      { name: "Dairy & Cold Storage", value: "₹42,500", pct: 40, color: "#006194" },
      { name: "Staples & Flours", value: "₹38,200", pct: 32, color: "#006947" },
      { name: "Snacks & Packaged", value: "₹24,800", pct: 18, color: "#894d00" },
      { name: "Beverages & Spices", value: "₹14,500", pct: 10, color: "#565e74" },
    ];
  }, []);

  // Product profitability from live inventory
  const productProfitability = useMemo(() => {
    return products.slice(0, 6).map((p) => {
      const price = Number(p.price) || 50;
      const cost = Number(p.purchasePrice) || Math.round(price * 0.8);
      const profitPerUnit = Math.max(1, price - cost);
      const estSoldQty = Math.max(12, 100 - (p.stock || 10));
      const totalRev = price * estSoldQty;
      const totalProf = profitPerUnit * estSoldQty;
      const margin = `${((profitPerUnit / price) * 100).toFixed(1)}%`;
      const taxAmount = Math.round(totalRev * 0.05);

      return {
        name: p.name,
        qty: `${estSoldQty} units`,
        revenue: `₹${totalRev.toLocaleString("en-IN")}`,
        tax: `₹${taxAmount.toLocaleString("en-IN")}`,
        profit: `₹${totalProf.toLocaleString("en-IN")}`,
        margin,
      };
    });
  }, [products]);

  const expenseBreakdown = [
    { label: "Inventory Purchases", pct: 68, color: "#006194" },
    { label: "Store Operations & Utilities", pct: 18, color: "#ba1a1a" },
    { label: "Logistics & Delivery", pct: 14, color: "#006947" },
  ];

  let cumulative = 0;
  const donutSlices = expenseBreakdown.map((slice) => {
    const dashOffset = -cumulative;
    cumulative += slice.pct;
    return { ...slice, dashOffset };
  });

  const topLowStock = storeMetrics.lowStockList?.[0];

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; vertical-align: middle; }
        .chart-bar { transition: height 1s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
      `}</style>

      <Sidebar />

      <main className="md:ml-[240px] min-h-screen">
        <AnalyticsTopNav />

        <div className="p-6 max-w-[1280px] mx-auto space-y-8 animate-fade-in">
          {/* Summary stats */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {summaryStats.map((stat) => (
              <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-[#bfc7d2]/30 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-[#565e74] uppercase tracking-wider font-semibold">{stat.label}</span>
                    <span className="material-symbols-outlined" style={{ color: stat.iconColor }}>{stat.icon}</span>
                  </div>
                  <div className="text-[32px] font-bold">{stat.value}</div>
                </div>
                {stat.progress !== undefined ? (
                  <div className="mt-4 w-full bg-[#eceef0] rounded-full h-2 overflow-hidden">
                    <div className="bg-[#006194] h-full rounded-full" style={{ width: `${Math.min(100, stat.progress)}%` }} />
                  </div>
                ) : (
                  <div className="mt-4 flex items-center gap-1 text-xs">
                    <span className="flex items-center font-bold" style={{ color: stat.changeColor }}>
                      <span className="material-symbols-outlined text-sm">trending_up</span> {stat.change}
                    </span>
                    <span className="text-[#707881]">{stat.changeNote}</span>
                  </div>
                )}
              </div>
            ))}
          </section>

          {/* Sales trends + category performance */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-8 bg-white p-6 rounded-xl shadow-sm border border-[#bfc7d2]/30">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-[20px] font-semibold">Grocery Sales Trends</h3>
                  <p className="text-sm text-[#565e74]">Revenue &amp; orders turnover performance over time</p>
                </div>
                <div className="flex bg-[#f2f4f6] p-1 rounded-lg">
                  <button
                    onClick={() => setPeriod("weekly")}
                    className={
                      period === "weekly"
                        ? "px-4 py-1.5 text-sm rounded-md bg-white shadow-sm text-[#006194] font-bold"
                        : "px-4 py-1.5 text-sm rounded-md text-[#3f4850] hover:text-[#191c1e] transition-colors"
                    }
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setPeriod("monthly")}
                    className={
                      period === "monthly"
                        ? "px-4 py-1.5 text-sm rounded-md bg-white shadow-sm text-[#006194] font-bold"
                        : "px-4 py-1.5 text-sm rounded-md text-[#3f4850] hover:text-[#191c1e] transition-colors"
                    }
                  >
                    Monthly
                  </button>
                </div>
              </div>

              <div className="h-[300px] w-full flex items-end justify-between gap-4 px-2 pb-8 border-b border-[#bfc7d2] relative">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-full border-t border-[#bfc7d2]/20" />
                  ))}
                </div>
                {chartData.map((bar) => (
                  <div key={bar.label} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    <div
                      className="chart-bar w-full max-w-[40px] rounded-t-lg transition-all"
                      style={{
                        height: barsIn ? `${bar.pct}%` : "0%",
                        backgroundColor: bar.highlight ? "#006194" : "#007bb94D",
                      }}
                    />
                    <span
                      className="absolute -bottom-6 text-xs"
                      style={{ color: bar.highlight ? "#006194" : "#565e74", fontWeight: bar.highlight ? 700 : 400 }}
                    >
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="lg:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-[#bfc7d2]/30 flex flex-col">
              <div className="mb-6">
                <h3 className="text-[20px] font-semibold">Category Sales</h3>
                <p className="text-sm text-[#565e74]">Top performing grocery segments</p>
              </div>
              <div className="flex-1 space-y-6">
                {categorySales.map((cat) => (
                  <div key={cat.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{cat.name}</span>
                      <span className="font-bold">{cat.value}</span>
                    </div>
                    <div className="h-2 w-full bg-[#eceef0] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${cat.pct}%`, backgroundColor: cat.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/product")}
                className="mt-8 text-[#006194] font-bold text-xs flex items-center justify-center gap-2 hover:underline cursor-pointer"
              >
                View Catalog Inventory <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </section>
          </div>

          {/* Product profitability table */}
          <section className="bg-white rounded-xl shadow-sm border border-[#bfc7d2]/30 overflow-hidden">
            <div className="p-6 border-b border-[#bfc7d2]/30 flex justify-between items-center">
              <div>
                <h3 className="text-[20px] font-semibold">Grocery Product Profitability</h3>
                <p className="text-xs text-[#707881]">Margins and net profit per product calculated from current purchase &amp; selling prices</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const headers = ["Product Name", "Estimated Sold", "Revenue", "Tax (GST)", "Net Profit", "Margin"];
                    const rows = productProfitability.map((p) => [
                      `"${p.name}"`,
                      `"${p.qty}"`,
                      `"${p.revenue}"`,
                      `"${p.tax}"`,
                      `"${p.profit}"`,
                      `"${p.margin}"`,
                    ]);
                    const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
                    const link = document.createElement("a");
                    link.setAttribute("href", encodeURI(csv));
                    link.setAttribute("download", `grocery_profitability_${new Date().toISOString().slice(0, 10)}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  title="Download Profitability Report"
                  className="px-3 py-1.5 border border-[#bfc7d2] rounded-lg text-[#565e74] hover:bg-[#f2f4f6] cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Export CSV
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f2f4f6]">
                  <tr>
                    <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider">Product Name</th>
                    <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider">Estimated Sold</th>
                    <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider">Tax (GST)</th>
                    <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider">Net Profit</th>
                    <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider">Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#bfc7d2]/30">
                  {productProfitability.map((p) => (
                    <tr key={p.name} className="hover:bg-[#f2f4f6] transition-colors">
                      <td className="px-6 py-4 font-semibold text-sm">{p.name}</td>
                      <td className="px-6 py-4 text-sm">{p.qty}</td>
                      <td className="px-6 py-4 text-sm">{p.revenue}</td>
                      <td className="px-6 py-4 text-sm">{p.tax}</td>
                      <td className="px-6 py-4 text-[#006947] font-bold text-sm">{p.profit}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#006947]/10 text-[#006947]">
                          {p.margin}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Expense breakdown + insight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white p-6 rounded-xl shadow-sm border border-[#bfc7d2]/30">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[20px] font-semibold">Expense Breakdown</h3>
                <span className="material-symbols-outlined text-[#707881]">receipt</span>
              </div>
              <div className="flex items-center gap-8">
                <div className="relative w-32 h-32 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" fill="transparent" r="16" stroke="#e0e3e5" strokeWidth="4" />
                    {donutSlices.map((slice) => (
                      <circle
                        key={slice.label}
                        cx="18"
                        cy="18"
                        fill="transparent"
                        r="16"
                        stroke={slice.color}
                        strokeDasharray={`${slice.pct} 100`}
                        strokeDashoffset={slice.dashOffset}
                        strokeLinecap="round"
                        strokeWidth="4"
                      />
                    ))}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-xs font-bold">Total Exp</span>
                    <span className="text-[11px] font-bold text-[#565e74]">
                      ₹{Math.round(storeMetrics.totalExpenses).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
                <ul className="flex-1 space-y-3">
                  {expenseBreakdown.map((item) => (
                    <li key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <span className="text-[#565e74] font-semibold">{item.pct}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="bg-[#006194] text-white p-6 rounded-xl shadow-sm border border-[#007bb9] relative overflow-hidden">
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined">lightbulb</span>
                  <h3 className="text-[20px] font-semibold">Inventory &amp; Growth Insight</h3>
                </div>
                <p className="text-base leading-relaxed mb-6">
                  {topLowStock
                    ? `Item "${topLowStock.name}" is critically low (${topLowStock.stock} units remaining). Restock immediately through a Wholesale Purchase Order to prevent stockouts during peak retail hours.`
                    : "Dairy and staples demand remains consistently high across peak evening hours. Re-ordering with Farm Fresh Direct or Royal Grains Wholesale keeps margins above 25%."}
                </p>
                <div className="mt-auto">
                  <button
                    onClick={() => navigate("/CreatePurchaseOrder")}
                    className="bg-white text-[#006194] px-6 py-2.5 rounded-lg font-bold text-xs hover:bg-opacity-90 transition-all shadow-sm cursor-pointer"
                  >
                    Create Purchase Order
                  </button>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <span className="material-symbols-outlined text-[160px]">insights</span>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full py-8 mt-8 bg-[#eceef0] border-t border-[#bfc7d2]">
          <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-[1280px] mx-auto gap-4">
            <div className="flex flex-col items-center md:items-start gap-1">
              <span className="text-[20px] font-semibold text-[#006194]">Krishna General Store</span>
              <span className="text-[#565e74] text-sm">© 2024 Krishna General Store. All rights reserved.</span>
            </div>
            <div className="flex gap-8">
              <button
                onClick={() => alert("Privacy Policy: Reports and ledger metrics are protected.")}
                className="text-[#3f4850] hover:text-[#006194] transition-colors text-sm cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => alert("Terms of Service: Reports and analytics usage policies.")}
                className="text-[#3f4850] hover:text-[#006194] transition-colors text-sm cursor-pointer"
              >
                Terms of Service
              </button>
              <button
                onClick={() => navigate("/help")}
                className="text-[#3f4850] hover:text-[#006194] transition-colors text-sm cursor-pointer"
              >
                Contact Support
              </button>
            </div>
          </div>
        </footer>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#bfc7d2] flex md:hidden items-center justify-around z-50">
        <button
          onClick={() => navigate("/")}
          className="flex flex-col items-center gap-1 text-[#565e74] hover:text-[#006194]"
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button
          onClick={() => navigate("/product")}
          className="flex flex-col items-center gap-1 text-[#565e74] hover:text-[#006194]"
        >
          <span className="material-symbols-outlined">inventory_2</span>
          <span className="text-[10px] font-bold">Stock</span>
        </button>
        <button
          onClick={() => navigate("/billing")}
          className="bg-[#006194] p-3 rounded-full -mt-10 border-4 border-[#f7f9fb] shadow-lg text-white"
        >
          <span className="material-symbols-outlined text-white">receipt_long</span>
        </button>
        <button
          onClick={() => navigate("/reports")}
          className="flex flex-col items-center gap-1 text-[#006194]"
        >
          <span className="material-symbols-outlined">assessment</span>
          <span className="text-[10px] font-bold">Reports</span>
        </button>
        <button
          onClick={() => navigate("/settings")}
          className="flex flex-col items-center gap-1 text-[#565e74] hover:text-[#006194]"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-bold">Settings</span>
        </button>
      </nav>
    </div>
  );
}
