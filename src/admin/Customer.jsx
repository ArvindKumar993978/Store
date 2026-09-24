import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import Topnav from "../component/Topnav";

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
    value: "₹4,82,900",
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

const INITIAL_CUSTOMERS = [
  {
    initials: "RJ",
    name: "Rajesh Jha",
    id: "CL-9021",
    email: "rajesh.jha@example.com",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    totalPurchases: "₹1,42,500",
    orders: 24,
    outstanding: "₹12,400",
    outstandingColor: "#ba1a1a",
    tier: "Platinum",
  },
  {
    initials: "AK",
    name: "Ananya Kapoor",
    id: "CL-8562",
    email: "ananya.kapoor@example.com",
    phone: "+91 88822 11223",
    location: "Delhi, NCR",
    totalPurchases: "₹84,200",
    orders: 12,
    outstanding: "₹0",
    outstandingColor: "#006947",
    tier: "Gold",
  },
  {
    initials: "MS",
    name: "Mohammed Sahil",
    id: "CL-4102",
    email: "m.sahil@example.com",
    phone: "+91 70011 22334",
    location: "Bengaluru, KA",
    totalPurchases: "₹22,150",
    orders: 4,
    outstanding: "₹1,500",
    outstandingColor: "#3f4850",
    tier: "Regular",
  },
  {
    initials: "PV",
    name: "Priya Verma",
    id: "CL-2209",
    email: "priya.verma@example.com",
    phone: "+91 99001 88223",
    location: "Pune, MH",
    totalPurchases: "₹2,10,300",
    orders: 42,
    outstanding: "₹42,500",
    outstandingColor: "#ba1a1a",
    tier: "Platinum",
  },
  {
    initials: "SG",
    name: "Suresh Gupta",
    id: "CL-1192",
    email: "suresh.g@example.com",
    phone: "+91 98112 33445",
    location: "Kolkata, WB",
    totalPurchases: "₹56,400",
    orders: 18,
    outstanding: "₹0",
    outstandingColor: "#006947",
    tier: "Gold",
  },
];

export default function CustomerDirectoryPage() {
  const navigate = useNavigate();
  const [customers] = useState(INITIAL_CUSTOMERS);
  const [selectedTier, setSelectedTier] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [messagingCustomer, setMessagingCustomer] = useState(null);
  const [messageText, setMessageText] = useState("");
  const itemsPerPage = 4;

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchTier = selectedTier === "All" || c.tier.toLowerCase() === selectedTier.toLowerCase();
      const term = searchQuery.toLowerCase().trim();
      const matchSearch =
        !term ||
        c.name.toLowerCase().includes(term) ||
        c.phone.includes(term) ||
        c.id.toLowerCase().includes(term) ||
        c.location.toLowerCase().includes(term);
      return matchTier && matchSearch;
    });
  }, [customers, selectedTier, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const handleExportCSV = () => {
    const headers = ["Customer ID", "Name", "Phone", "Email", "Location", "Purchases", "Orders", "Outstanding", "Tier"];
    const rows = filteredCustomers.map((c) => [
      `"${c.id}"`,
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.email}"`,
      `"${c.location}"`,
      `"${c.totalPurchases}"`,
      c.orders,
      `"${c.outstanding}"`,
      `"${c.tier}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `customers_directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    alert(`Message dispatched to ${messagingCustomer.name} (${messagingCustomer.phone}):\n\n"${messageText}"`);
    setMessagingCustomer(null);
    setMessageText("");
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; vertical-align: middle; }
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
              <div>
                <h2 className="text-[20px] font-semibold text-[#191c1e]">Customer Directory</h2>
                <p className="text-xs text-[#707881]">Search, view loyalty tiers, and message registered customers.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {/* Search input */}
                <div className="flex items-center bg-[#f2f4f6] px-3 py-1.5 rounded-lg border border-[#bfc7d2]">
                  <span className="material-symbols-outlined text-[#707881] text-[18px] mr-1.5">search</span>
                  <input
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search name, phone, ID..."
                    className="bg-transparent border-none text-xs outline-none w-36 sm:w-48"
                  />
                </div>

                {/* Tier filter */}
                <select
                  value={selectedTier}
                  onChange={(e) => {
                    setSelectedTier(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 text-xs text-[#3f4850] bg-[#f2f4f6] rounded-lg border border-[#bfc7d2] outline-none cursor-pointer"
                >
                  <option value="All">All Tiers</option>
                  <option value="Platinum">Platinum</option>
                  <option value="Gold">Gold</option>
                  <option value="Regular">Regular</option>
                </select>

                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#3f4850] bg-[#f2f4f6] rounded-lg border border-[#bfc7d2] hover:bg-[#e0e3e5] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
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
                            className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm"
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
                          <button
                            onClick={() => setMessagingCustomer(c)}
                            className="p-2 text-[#006194] hover:bg-[#006194]/10 rounded-full transition-all cursor-pointer"
                            title={`Send Message to ${c.name}`}
                          >
                            <span className="material-symbols-outlined text-[20px]">chat</span>
                          </button>
                          <button
                            onClick={() =>
                              navigate("/customer-profile", {
                                state: { customer: c },
                              })
                            }
                            className="px-3 py-1 bg-white border border-[#bfc7d2] rounded-lg text-xs font-semibold hover:bg-[#006194] hover:text-white transition-all cursor-pointer"
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-[#707881]">
                        No customers match the current search or tier filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-[#f7f9fb] flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-[#bfc7d2]">
              <p className="text-sm text-[#3f4850]">
                Showing {filteredCustomers.length === 0 ? 0 : startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="h-8 w-8 flex items-center justify-center rounded-lg border border-[#bfc7d2] hover:bg-[#f2f4f6] disabled:opacity-30 cursor-pointer"
                  disabled={currentPage === 1}
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-8 w-8 flex items-center justify-center rounded-lg font-bold text-sm cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-[#006194] text-white"
                        : "border border-[#bfc7d2] hover:bg-[#f2f4f6] text-[#3f4850]"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="h-8 w-8 flex items-center justify-center rounded-lg border border-[#bfc7d2] hover:bg-[#f2f4f6] disabled:opacity-30 cursor-pointer"
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
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
              className="group flex items-center gap-2 px-6 py-3 bg-[#006194] text-white rounded-lg font-bold hover:bg-[#007bb9] transition-all cursor-pointer shadow-sm"
            >
              Generate Customer Report
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
          </footer>
        </div>
      </main>

      {/* Quick Message Modal */}
      {messagingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 border border-[#bfc7d2] animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-[#191c1e]">Message {messagingCustomer.name}</h3>
                <p className="text-xs text-[#707881]">Direct SMS / WhatsApp communication</p>
              </div>
              <button
                onClick={() => setMessagingCustomer(null)}
                className="p-1 text-gray-500 hover:text-black rounded-full"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#3f4850] block uppercase mb-1">Recipient Phone</label>
                <input
                  type="text"
                  readOnly
                  value={messagingCustomer.phone}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[#565e74]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#3f4850] block uppercase mb-1">Message Content</label>
                <textarea
                  required
                  rows={4}
                  placeholder={`Hi ${messagingCustomer.name}, your invoice or loyalty reward is ready...`}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full px-3 py-2 border border-[#bfc7d2] rounded-lg text-sm outline-none focus:border-[#006194] resize-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#006194] text-white rounded-lg text-sm font-semibold hover:bg-[#007bb9] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  Send Message
                </button>
                <button
                  type="button"
                  onClick={() => setMessagingCustomer(null)}
                  className="flex-1 py-2.5 bg-gray-100 text-[#3f4850] rounded-lg text-sm font-semibold hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
