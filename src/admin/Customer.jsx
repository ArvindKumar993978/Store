import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import Topnav from "../component/Topnav";
import { useStore } from "../context/StoreContext";

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

export default function CustomerDirectoryPage() {
  const navigate = useNavigate();
  const { customers, addCustomer } = useStore();

  const [selectedTier, setSelectedTier] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [messagingCustomer, setMessagingCustomer] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [newCustomerForm, setNewCustomerForm] = useState({
    name: "",
    phone: "",
    email: "",
    location: "Bengaluru, Karnataka",
    tier: "Regular",
  });

  const itemsPerPage = 6;

  // Dynamic summary stats from StoreContext customers
  const summaryCards = useMemo(() => {
    const totalCustomers = customers.length;
    const totalPoints = customers.reduce((sum, c) => sum + (Number(c.points) || 0), 0);
    const totalReceivables = customers.reduce((sum, c) => {
      if (typeof c.outstanding === "string") {
        const num = parseFloat(c.outstanding.replace(/[^0-9.]/g, "")) || 0;
        return sum + num;
      }
      return sum + (Number(c.outstanding) || 0);
    }, 0);

    return [
      {
        icon: "person_check",
        iconBg: "#006194",
        label: "Active Customers",
        value: totalCustomers.toLocaleString("en-IN"),
        badge: "+12%",
        badgeColor: "#006947",
        badgeIcon: "trending_up",
        watermark: "groups",
      },
      {
        icon: "account_balance_wallet",
        iconBg: "#ba1a1a",
        label: "Total Receivables",
        value: `₹${totalReceivables.toLocaleString("en-IN")}`,
        badge: totalReceivables > 0 ? "Pending Due" : "Settled",
        badgeColor: totalReceivables > 0 ? "#ba1a1a" : "#006947",
        badgeIcon: totalReceivables > 0 ? "priority_high" : "check_circle",
        watermark: "currency_rupee",
      },
      {
        icon: "workspace_premium",
        iconBg: "#565e74",
        label: "Loyalty Points Issued",
        value: totalPoints.toLocaleString("en-IN"),
        badge: "Reward Active",
        badgeColor: "#006194",
        badgeIcon: "stars",
        watermark: "stars",
      },
    ];
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.map((c) => {
      const tier = c.tier || "Regular";
      const initials =
        c.initials ||
        (c.name
          ? c.name
              .trim()
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
          : "CU");
      return {
        ...c,
        tier,
        initials,
        outstandingColor: c.outstanding && c.outstanding !== "₹0" ? "#ba1a1a" : "#006947",
      };
    }).filter((c) => {
      const matchTier = selectedTier === "All" || c.tier.toLowerCase() === selectedTier.toLowerCase();
      const term = searchQuery.toLowerCase().trim();
      const matchSearch =
        !term ||
        c.name.toLowerCase().includes(term) ||
        (c.phone && c.phone.includes(term)) ||
        (c.id && c.id.toLowerCase().includes(term)) ||
        (c.location && c.location.toLowerCase().includes(term));
      return matchTier && matchSearch;
    });
  }, [customers, selectedTier, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const handleExportCSV = () => {
    const headers = ["Customer ID", "Name", "Phone", "Email", "Location", "Purchases", "Orders", "Outstanding", "Tier", "Loyalty Points"];
    const rows = filteredCustomers.map((c) => [
      `"${c.id}"`,
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.email}"`,
      `"${c.location}"`,
      `"${c.totalPurchases}"`,
      c.orders || 0,
      `"${c.outstanding}"`,
      `"${c.tier}"`,
      c.points || 0,
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

  const handleCreateCustomer = (e) => {
    e.preventDefault();
    if (!newCustomerForm.name.trim() || !newCustomerForm.phone.trim()) {
      alert("Customer Name and Phone number are required!");
      return;
    }

    addCustomer({
      name: newCustomerForm.name.trim(),
      phone: newCustomerForm.phone.trim(),
      email: newCustomerForm.email.trim(),
      location: newCustomerForm.location.trim() || "Bengaluru, Karnataka",
      tier: newCustomerForm.tier,
      totalPurchases: "₹0",
      orders: 0,
      outstanding: "₹0",
      points: newCustomerForm.tier === "Platinum" ? 200 : newCustomerForm.tier === "Gold" ? 100 : 50,
    });

    setToastMessage(`Customer ${newCustomerForm.name} added successfully!`);
    setTimeout(() => setToastMessage(""), 4000);

    setNewCustomerForm({
      name: "",
      phone: "",
      email: "",
      location: "Bengaluru, Karnataka",
      tier: "Regular",
    });
    setShowAddModal(false);
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
            {summaryCards.map((card) => (
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
                <p className="text-xs text-[#707881]">Search, view loyalty tiers, and manage registered customers.</p>
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

                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-[#006194] rounded-lg hover:bg-[#007bb9] transition-all shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">person_add</span>
                  Add Customer
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
                    <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider text-center">Status / Tier</th>
                    <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#bfc7d2]">
                  {currentCustomers.map((c) => {
                    const tierStyle = TIER_STYLES[c.tier] || TIER_STYLES.Regular;
                    const avatarColor = AVATAR_COLORS[c.tier] || AVATAR_COLORS.Regular;

                    return (
                      <tr key={c.id || c.phone} className="hover:bg-[#f2f4f6] transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm"
                              style={{ backgroundColor: `${avatarColor}1A`, color: avatarColor }}
                            >
                              {c.initials}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{c.name}</p>
                              <p className="text-xs text-[#3f4850]">ID: {c.id || "CL-AUTO"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium">{c.phone}</p>
                          <p className="text-xs text-[#3f4850]">{c.location || "Bengaluru"}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="font-semibold text-sm">{c.totalPurchases || "₹0"}</p>
                          <p className="text-[10px] text-[#3f4850]">{c.orders || 0} Orders</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-sm font-bold" style={{ color: c.outstandingColor }}>
                            {c.outstanding || "₹0"}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] uppercase tracking-tighter font-semibold"
                            style={{ backgroundColor: tierStyle.bg, color: tierStyle.text }}
                          >
                            <span className="material-symbols-outlined text-[14px]">{tierStyle.icon}</span>
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
                    );
                  })}
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

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl p-6 border border-[#bfc7d2] animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <div>
                <h3 className="font-bold text-lg text-[#191c1e]">Register New Customer</h3>
                <p className="text-xs text-[#707881]">Add client details for instant POS billing & loyalty tracking</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-gray-500 hover:text-black rounded-full"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#3f4850] block uppercase mb-1">
                  Full Customer / Business Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Ramesh Patel"
                  value={newCustomerForm.name}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                  className="w-full px-3 py-2.5 border border-[#bfc7d2] rounded-lg text-sm outline-none focus:border-[#006194]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#3f4850] block uppercase mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="+91 98765 00000"
                    value={newCustomerForm.phone}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#bfc7d2] rounded-lg text-sm outline-none focus:border-[#006194]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3f4850] block uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="customer@example.com"
                    value={newCustomerForm.email}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#bfc7d2] rounded-lg text-sm outline-none focus:border-[#006194]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#3f4850] block uppercase mb-1">
                    City / Address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru, Karnataka"
                    value={newCustomerForm.location}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, location: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#bfc7d2] rounded-lg text-sm outline-none focus:border-[#006194]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3f4850] block uppercase mb-1">
                    Loyalty Tier
                  </label>
                  <select
                    value={newCustomerForm.tier}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, tier: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#bfc7d2] rounded-lg text-sm outline-none focus:border-[#006194] bg-white cursor-pointer"
                  >
                    <option value="Regular">Regular (Standard)</option>
                    <option value="Gold">Gold (5% discount tier)</option>
                    <option value="Platinum">Platinum (Priority VIP)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#006194] text-white rounded-lg text-sm font-bold hover:bg-[#007bb9] flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Save Customer
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-[#3f4850] rounded-lg text-sm font-semibold hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#006194] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 z-50 animate-in fade-in">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <p className="text-sm font-semibold">{toastMessage}</p>
        </div>
      )}
    </div>
  );
}
