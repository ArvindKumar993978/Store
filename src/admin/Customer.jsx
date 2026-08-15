import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../component/Sidebar";
import Topnav from "../component/Topnav";

/*
  EASY-TO-EDIT VERSION
  --------------------
  Colors as Tailwind arbitrary values, e.g. text-[#006194].

  Quick color reference:
    #006194  -> primary (blue)
    #006947  -> tertiary (green, "+12%" / "₹0" outstanding)
    #565e74  -> secondary text
    #ba1a1a  -> error (red, overdue amounts)
    #f7f9fb  -> page background
    #f2f4f6  -> surface-container-low
    #bfc7d2  -> border color
    Loyalty tier badges use Tailwind's built-in purple/amber/slate
    (same as the original page): Platinum, Gold, Regular.

  DATA:
  CUSTOMERS array below feeds the table. Each row's avatar initials,
  loyalty tier, and outstanding-amount color are derived automatically
  from the row's data — edit the array to add/remove/change customers.
*/

const SUMMARY_CARDS = [
  {
    icon: "person_check",
    iconBg: "#006194",
    label: "Active Customers",
    value: "1,284",
    badge: "+12%",
    badgeColor: "#006947",
    badgeIcon: "trending_up",
    watermark: "groups",
  },
  {
    icon: "account_balance_wallet",
    iconBg: "#ba1a1a",
    label: "Total Receivables",
    value: "\u20B94,82,900",
    badge: "5 Pending",
    badgeColor: "#ba1a1a",
    badgeIcon: "priority_high",
    watermark: "currency_rupee",
  },
  {
    icon: "workspace_premium",
    iconBg: "#565e74",
    label: "Loyalty Points Issued",
    value: "85,200",
    watermark: "stars",
  },
];

const TIER_STYLES = {
  Platinum: { bg: "#f3e8ff", text: "#7e22ce", icon: "stars" },
  Gold: { bg: "#fef3c7", text: "#b45309", icon: "workspace_premium" },
  Regular: { bg: "#f1f5f9", text: "#334155", icon: "person" },
};

const AVATAR_COLORS = {
  Platinum: "#006194",
  Gold: "#894d00",
  Regular: "#565e74",
};

const CUSTOMERS = [
  {
    initials: "RJ",
    name: "Rajesh Jha",
    id: "CL-9021",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    totalPurchases: "\u20B91,42,500",
    orders: 24,
    outstanding: "\u20B912,400",
    outstandingColor: "#ba1a1a",
    tier: "Platinum",
  },
  {
    initials: "AK",
    name: "Ananya Kapoor",
    id: "CL-8562",
    phone: "+91 88822 11223",
    location: "Delhi, NCR",
    totalPurchases: "\u20B984,200",
    orders: 12,
    outstanding: "\u20B90",
    outstandingColor: "#006947",
    tier: "Gold",
  },
  {
    initials: "MS",
    name: "Mohammed Sahil",
    id: "CL-4102",
    phone: "+91 70011 22334",
    location: "Bengaluru, KA",
    totalPurchases: "\u20B922,150",
    orders: 4,
    outstanding: "\u20B91,500",
    outstandingColor: "#3f4850",
    tier: "Regular",
  },
  {
    initials: "PV",
    name: "Priya Verma",
    id: "CL-2209",
    phone: "+91 99001 88223",
    location: "Pune, MH",
    totalPurchases: "\u20B92,10,300",
    orders: 42,
    outstanding: "\u20B942,500",
    outstandingColor: "#ba1a1a",
    tier: "Platinum",
  },
  {
    initials: "PV",
    name: "Priya Verma",
    id: "CL-2209",
    phone: "+91 99001 88223",
    location: "Pune, MH",
    totalPurchases: "\u20B92,10,300",
    orders: 42,
    outstanding: "\u20B942,500",
    outstandingColor: "#ba1a1a",
    tier: "Platinum",
  },
  {
    initials: "PV",
    name: "Priya Verma",
    id: "CL-2209",
    phone: "+91 99001 88223",
    location: "Pune, MH",
    totalPurchases: "\u20B92,10,300",
    orders: 42,
    outstanding: "\u20B942,500",
    outstandingColor: "#ba1a1a",
    tier: "Platinum",
  },
];

export default function CustomerDirectoryPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(CUSTOMERS.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentCustomers = CUSTOMERS.slice(startIndex, endIndex);

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; vertical-align: middle; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>

      <Sidebar />
      <Topnav />

      <main className="ml-[240px] pt-6 min-h-screen p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Summary cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SUMMARY_CARDS.map((card) => (
              <div
                key={card.label}
                className="bg-white p-6 rounded-xl shadow-sm border border-[#bfc7d2]/50 relative overflow-hidden group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${card.iconBg}1A`, color: card.iconBg }}
                  >
                    <span className="material-symbols-outlined">{card.icon}</span>
                  </div>
                  {card.badge && (
                    <span
                      className="font-semibold text-xs flex items-center"
                      style={{ color: card.badgeColor }}
                    >
                      <span className="material-symbols-outlined text-[14px]">{card.badgeIcon}</span>
                      {card.badge}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-[#3f4850] text-xs uppercase tracking-wider mb-1">{card.label}</h3>
                  <p className="text-[32px] font-bold">{card.value}</p>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="material-symbols-outlined text-[120px]">{card.watermark}</span>
                </div>
              </div>
            ))}
          </section>

          {/* Customer table */}
          <section className="bg-white rounded-xl shadow-sm border border-[#bfc7d2]/50 overflow-hidden">
            <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-[#bfc7d2]">
              <h2 className="text-[20px] font-semibold">Customer Directory</h2>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 text-sm text-[#3f4850] bg-[#f2f4f6] rounded-lg border border-[#bfc7d2] hover:bg-[#e0e3e5] transition-colors">
                  <span className="material-symbols-outlined text-[18px]">filter_list</span>
                  Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-sm text-[#3f4850] bg-[#f2f4f6] rounded-lg border border-[#bfc7d2] hover:bg-[#e0e3e5] transition-colors">
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f7f9fb] border-b border-[#bfc7d2]">
                    <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider">Customer Name</th>
                    <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider">Contact Details</th>
                    <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider text-right">Total Purchases</th>
                    <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider text-right">Outstanding</th>
                    <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider text-center">Status</th>
                    <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#bfc7d2]">
                  {currentCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-[#f2f4f6] transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-9 w-9 rounded-full flex items-center justify-center font-bold"
                            style={{ backgroundColor: `${AVATAR_COLORS[c.tier]}1A`, color: AVATAR_COLORS[c.tier] }}
                          >
                            {c.initials}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{c.name}</p>
                            <p className="text-xs text-[#3f4850]">ID: {c.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm">{c.phone}</p>
                        <p className="text-xs text-[#3f4850]">{c.location}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-semibold text-sm">{c.totalPurchases}</p>
                        <p className="text-[10px] text-[#3f4850]">{c.orders} Orders</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-sm font-bold" style={{ color: c.outstandingColor }}>
                          {c.outstanding}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] uppercase tracking-tighter font-semibold"
                          style={{ backgroundColor: TIER_STYLES[c.tier].bg, color: TIER_STYLES[c.tier].text }}
                        >
                          <span className="material-symbols-outlined text-[14px]">{TIER_STYLES[c.tier].icon}</span>
                          {c.tier}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-[#006194] hover:bg-[#006194]/10 rounded-full transition-all" title="Message">
                            <span className="material-symbols-outlined">chat</span>
                          </button>
                          <button
                            onClick={() =>
                              navigate("/customer-profile", {
                                state: { customer: c },
                              })
                            }
                            className="px-3 py-1 bg-white border border-[#bfc7d2] rounded-lg text-sm hover:bg-[#f7f9fb] transition-all"
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-[#f7f9fb] flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-[#3f4850]">
                Showing {CUSTOMERS.length === 0 ? 0 : startIndex + 1} to{" "}
                {Math.min(endIndex, CUSTOMERS.length)} of {CUSTOMERS.length} customers
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="h-8 w-8 flex items-center justify-center rounded-lg border border-[#bfc7d2] hover:bg-[#f2f4f6] disabled:opacity-30"
                  disabled={currentPage === 1}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    chevron_left
                  </span>
                </button>

                <button
                  onClick={() => setCurrentPage(1)}
                  className={`h-8 w-8 flex items-center justify-center rounded-lg font-bold ${currentPage === 1
                    ? "bg-[#006194] text-white"
                    : "border border-[#bfc7d2] hover:bg-[#f2f4f6]"
                    }`}
                >
                  1
                </button>

                <button
                  onClick={() => setCurrentPage(2)}
                  className={`h-8 w-8 flex items-center justify-center rounded-lg font-bold ${currentPage === 2
                    ? "bg-[#006194] text-white"
                    : "border border-[#bfc7d2] hover:bg-[#f2f4f6]"
                    }`}
                >
                  2
                </button>

                <button
                  onClick={() => setCurrentPage(3)}
                  className={`h-8 w-8 flex items-center justify-center rounded-lg font-bold ${currentPage === 3
                    ? "bg-[#006194] text-white"
                    : "border border-[#bfc7d2] hover:bg-[#f2f4f6]"
                    }`}
                >
                  3
                </button>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className="h-8 w-8 flex items-center justify-center rounded-lg border border-[#bfc7d2] hover:bg-[#f2f4f6] disabled:opacity-30"
                  disabled={currentPage === totalPages}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* Retention analytics footer CTA */}
          <footer className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-[#eceef0] border border-[#bfc7d2] rounded-xl">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white rounded-full text-[#006194]">
                <span className="material-symbols-outlined text-[32px]">insights</span>
              </div>
              <div>
                <h4 className="text-[20px] font-semibold">Retention Analytics</h4>
                <p className="text-sm text-[#3f4850]">Customer return rate has increased by 5.2% this month.</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/customer-report")}
              className="group flex items-center gap-2 px-6 py-3 bg-[#006194] text-white rounded-lg font-bold hover:bg-[#007bb9] transition-all">
              Generate Customer Report
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
          </footer>
        </div>
      </main>
    </div>
  );
}
