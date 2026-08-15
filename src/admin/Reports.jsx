import React, { useEffect, useState } from "react";
import Sidebar from "../component/Sidebar";
import { useNavigate } from "react-router-dom";

import AnalyticsTopNav from "../component/AnalyticsTopNav";

/*
  EASY-TO-EDIT VERSION
  --------------------
  Colors as Tailwind arbitrary values, e.g. text-[#006194].

  DATA:
  - SUMMARY_STATS: the 4 top stat cards
  - WEEKLY_SALES / MONTHLY_SALES: bar chart data, switched by the
    Weekly/Monthly toggle. Bars animate in from 0 on mount and again
    whenever you switch toggle, same entry effect as the original
    page's script.
  - CATEGORY_SALES: the right-side progress bars
  - PRODUCT_PROFITABILITY: the table rows
  - EXPENSE_BREAKDOWN: donut chart segments (dasharray/dashoffset
    computed automatically from each slice's percentage)
  - INSIGHT: the blue "Business Insight" callout card
*/

const SUMMARY_STATS = [
  { label: "Net Profit", icon: "payments", iconColor: "#006947", value: "\u20B94,82,900", change: "12.5%", changeNote: "vs last month", changeColor: "#006947" },
  { label: "Tax (GST)", icon: "account_balance", iconColor: "#006194", value: "\u20B986,450", change: "4.2%", changeNote: "collected this month", changeColor: "#006947" },
  { label: "Expenses", icon: "shopping_cart_checkout", iconColor: "#ba1a1a", value: "\u20B91,12,000", change: "8.1%", changeNote: "stock & operations", changeColor: "#ba1a1a" },
  { label: "Avg Margin", icon: "pie_chart", iconColor: "#565e74", value: "24.8%", progress: 24.8 },
];

const WEEKLY_SALES = [
  { label: "Mon", pct: 45 },
  { label: "Tue", pct: 65 },
  { label: "Wed", pct: 55 },
  { label: "Thu", pct: 85, highlight: true },
  { label: "Fri", pct: 72 },
  { label: "Sat", pct: 95 },
  { label: "Sun", pct: 40 },
];

const MONTHLY_SALES = [
  { label: "Jun", pct: 50 },
  { label: "Jul", pct: 60 },
  { label: "Aug", pct: 78, highlight: true },
  { label: "Sep", pct: 68 },
  { label: "Oct", pct: 90 },
];

const CATEGORY_SALES = [
  { name: "Electronics", value: "\u20B91,45,000", pct: 65, color: "#006194" },
  { name: "Home & Kitchen", value: "\u20B998,200", pct: 45, color: "#006947" },
  { name: "Apparel", value: "\u20B976,400", pct: 35, color: "#dae2fd" },
  { name: "Groceries", value: "\u20B942,100", pct: 20, color: "#bfc7d2" },
];

const PRODUCT_PROFITABILITY = [
  { name: "Smart LED TV 43\"", qty: "12 units", revenue: "\u20B93,42,000", tax: "\u20B961,560", profit: "\u20B948,200", margin: "14.1%" },
  { name: "Noise Buds Pro 2", qty: "48 units", revenue: "\u20B91,19,952", tax: "\u20B921,591", profit: "\u20B934,500", margin: "28.7%" },
  { name: "Premium Leather Sofa", qty: "2 units", revenue: "\u20B984,000", tax: "\u20B915,120", profit: "\u20B912,400", margin: "14.7%" },
  { name: "Ceramic Cookware Set", qty: "15 units", revenue: "\u20B952,500", tax: "\u20B92,625", profit: "\u20B915,750", margin: "30.0%" },
];

const EXPENSE_BREAKDOWN = [
  { label: "Inventory Purchase", pct: 65, color: "#006194" },
  { label: "Staff Wages", pct: 20, color: "#ba1a1a" },
  { label: "Utilities & Rent", pct: 15, color: "#006947" },
];
const EXPENSE_TOTAL = "\u20B91.1L";

const INSIGHT = {
  text: "Your Electronics category has seen a 22% spike in demand. However, inventory for \"Smart LED TV\" is critically low (2 units left). Re-stocking now could boost next week's profit by an estimated \u20B945,000.",
  cta: "Create Purchase Order",
};

const FOOTER_LINKS = ["Privacy Policy", "Terms of Service", "Contact Support"];

const MOBILE_NAV = [
  { icon: "dashboard", label: "Home" },
  { icon: "inventory_2", label: "Stock" },
  { icon: "receipt_long", label: "", isFab: true },
  { icon: "assessment", label: "Reports", active: true },
  { icon: "settings", label: "Menu" },
];

export default function Gridproduct() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("weekly"); // "weekly" | "monthly"
  const [barsIn, setBarsIn] = useState(false);

  const chartData = period === "weekly" ? WEEKLY_SALES : MONTHLY_SALES;

  // Bars animate from 0 to their target height on mount, and again
  // whenever the weekly/monthly toggle changes — same as the original.
  useEffect(() => {
    setBarsIn(false);
    const timer = setTimeout(() => setBarsIn(true), 100);
    return () => clearTimeout(timer);
  }, [period]);

  let cumulative = 0;
  const donutSlices = EXPENSE_BREAKDOWN.map((slice) => {
    const dashOffset = -cumulative;
    cumulative += slice.pct;
    return { ...slice, dashOffset };
  });

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
            {SUMMARY_STATS.map((stat) => (
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
                    <div className="bg-[#006194] h-full rounded-full" style={{ width: `${stat.progress}%` }} />
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
                  <h3 className="text-[20px] font-semibold">Sales Trends</h3>
                  <p className="text-sm text-[#565e74]">Revenue performance over time</p>
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
                <p className="text-sm text-[#565e74]">Top performing segments</p>
              </div>
              <div className="flex-1 space-y-6">
                {CATEGORY_SALES.map((cat) => (
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
              <button className="mt-8 text-[#006194] font-bold text-xs flex items-center justify-center gap-2 hover:underline">
                View Detailed Categories <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </section>
          </div>

          {/* Product profitability table */}
          <section className="bg-white rounded-xl shadow-sm border border-[#bfc7d2]/30 overflow-hidden">
            <div className="p-6 border-b border-[#bfc7d2]/30 flex justify-between items-center">
              <h3 className="text-[20px] font-semibold">Product Profitability</h3>
              <div className="flex gap-2">
                <button className="p-2 border border-[#bfc7d2] rounded-lg text-[#565e74] hover:bg-[#f2f4f6]">
                  <span className="material-symbols-outlined">filter_list</span>
                </button>
                <button className="p-2 border border-[#bfc7d2] rounded-lg text-[#565e74] hover:bg-[#f2f4f6]">
                  <span className="material-symbols-outlined">download</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f2f4f6]">
                  <tr>
                    <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider">Product Name</th>
                    <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider">Quantity Sold</th>
                    <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider">Tax (GST)</th>
                    <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider">Net Profit</th>
                    <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider">Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#bfc7d2]/30">
                  {PRODUCT_PROFITABILITY.map((p) => (
                    <tr key={p.name} className="hover:bg-[#f2f4f6] transition-colors">
                      <td className="px-6 py-4 font-medium">{p.name}</td>
                      <td className="px-6 py-4">{p.qty}</td>
                      <td className="px-6 py-4">{p.revenue}</td>
                      <td className="px-6 py-4">{p.tax}</td>
                      <td className="px-6 py-4 text-[#006947]">{p.profit}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#006947]/10 text-[#006947]">
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
                    <span className="text-xs font-bold">Total</span>
                    <span className="text-[10px] text-[#565e74]">{EXPENSE_TOTAL}</span>
                  </div>
                </div>
                <ul className="flex-1 space-y-3">
                  {EXPENSE_BREAKDOWN.map((item) => (
                    <li key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <span className="text-[#565e74]">{item.pct}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="bg-[#006194] text-white p-6 rounded-xl shadow-sm border border-[#007bb9] relative overflow-hidden">
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined">lightbulb</span>
                  <h3 className="text-[20px] font-semibold">Business Insight</h3>
                </div>
                <p className="text-base leading-relaxed mb-6">{INSIGHT.text}</p>
                <div className="mt-auto">
                  <button
                    onClick={() => navigate("/CreatePurchaseOrder")}
                    className="bg-white text-[#006194] px-6 py-2 rounded-lg font-bold text-xs hover:bg-opacity-90 transition-all">
                    {INSIGHT.cta}
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
              <span className="text-[20px] font-semibold text-[#006194]">Efficient Ledger</span>
              <span className="text-[#565e74] text-sm">© 2024 Efficient Ledger. All rights reserved.</span>
            </div>
            <div className="flex gap-8">
              {FOOTER_LINKS.map((link) => (
                <a key={link} className="text-[#3f4850] hover:text-[#006194] transition-colors text-sm" href="#">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#bfc7d2] flex md:hidden items-center justify-around z-50">
        {MOBILE_NAV.map((item) =>
          item.isFab ? (
            <div key="fab" className="bg-[#006194] p-3 rounded-full -mt-10 border-4 border-[#f7f9fb] shadow-lg">
              <span className="material-symbols-outlined text-white">{item.icon}</span>
            </div>
          ) : (
            <a
              key={item.label}
              href="#"
              className={`flex flex-col items-center gap-1 ${item.active ? "text-[#006194]" : "text-[#565e74]"}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-[10px] font-bold">{item.label}</span>
            </a>
          )
        )}
      </nav>
    </div>
  );
}
