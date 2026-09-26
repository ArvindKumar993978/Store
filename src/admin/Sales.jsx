import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import Topnav from "../component/Topnav";
import { useStore } from "../context/StoreContext";

/*
  Transaction History Page
  ------------------------
  - Sales & Purchase toggle
  - Working filters (Status, Entity search) + reset
  - Transaction detail inspection modal
  - Report download functionality
  - Dynamic pagination
*/

const SALES_DATA = [
  {
    inv: "INV-8821",
    date: "Oct 24, 2023",
    entity: "Rajesh Kumar Enterprises",
    amount: "₹12,450.00",
    rawAmount: 12450,
    status: "Paid",
    items: [
      { name: "Premium Basmati Rice 5kg", qty: 10, price: 450 },
      { name: "Whole Milk - 1L", qty: 80, price: 45 },
      { name: "Fortune Sunflower Oil 1L", qty: 22, price: 195 },
    ],
  },
  {
    inv: "INV-8820",
    date: "Oct 23, 2023",
    entity: "Priya Sharma",
    amount: "₹4,200.00",
    rawAmount: 4200,
    status: "Pending",
    items: [
      { name: "Honey Loops Cereal", qty: 12, price: 185 },
      { name: "Luxury Aloe Soap", qty: 30, price: 65 },
    ],
  },
  {
    inv: "INV-8819",
    date: "Oct 21, 2023",
    entity: "Amit Patel",
    amount: "₹22,100.00",
    rawAmount: 22100,
    status: "Overdue",
    items: [
      { name: "Aashirvaad Atta 5kg", qty: 40, price: 280 },
      { name: "Amul Butter 500g", qty: 30, price: 275 },
    ],
  },
  {
    inv: "INV-8818",
    date: "Oct 20, 2023",
    entity: "Green Valley Agro",
    amount: "₹8,900.00",
    rawAmount: 8900,
    status: "Paid",
    items: [
      { name: "Organic Jaggery 1kg", qty: 50, price: 90 },
      { name: "Tata Salt 1kg", qty: 176, price: 25 },
    ],
  },
];

const PURCHASE_DATA = [
  {
    inv: "PUR-4412",
    date: "Oct 22, 2023",
    entity: "Global Logistics Ltd.",
    amount: "₹56,000.00",
    rawAmount: 56000,
    status: "Paid",
    items: [{ name: "Bulk Dairy Restock - 1000L", qty: 1, price: 56000 }],
  },
  {
    inv: "PUR-4411",
    date: "Oct 19, 2023",
    entity: "Tech Supply Co.",
    amount: "₹12,500.00",
    rawAmount: 12500,
    status: "Pending",
    items: [{ name: "Thermal Receipt Paper Roll Box", qty: 5, price: 2500 }],
  },
  {
    inv: "PUR-4410",
    date: "Oct 18, 2023",
    entity: "Office Depot Solutions",
    amount: "₹3,400.00",
    rawAmount: 3400,
    status: "Paid",
    items: [{ name: "Barcode Scanner Replacement Head", qty: 2, price: 1700 }],
  },
  {
    inv: "PUR-4409",
    date: "Oct 15, 2023",
    entity: "National Grid",
    amount: "₹1,200.00",
    rawAmount: 1200,
    status: "Paid",
    items: [{ name: "Commercial Electricity Bill", qty: 1, price: 1200 }],
  },
];

const STATUS_CLASSES = {
  Paid: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Overdue: "bg-rose-100 text-rose-700",
  Cancelled: "bg-gray-100 text-gray-700",
};

export default function Sales() {
  const navigate = useNavigate();
  const { sales, orders } = useStore();
  const [activeTab, setActiveTab] = useState("sales"); // "sales" | "purchases"
  const [filterStatus, setFilterStatus] = useState("All Statuses");
  const [filterEntity, setFilterEntity] = useState("");
  const [selectedTx, setSelectedTx] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const liveSalesData = useMemo(() => {
    const posList = (sales || []).map((s) => ({
      inv: s.id || `INV-${Math.floor(Math.random() * 90000)}`,
      date: s.date || "Today",
      entity: s.customer || "Walk-in Customer",
      amount: `₹${Number(s.grandTotal || s.total || 0).toFixed(2)}`,
      rawAmount: Number(s.grandTotal || s.total || 0),
      status: s.status || "Paid",
      channel: "POS Counter",
      items: (s.items || []).map((it) => ({
        name: it.name,
        qty: it.qty,
        price: it.price,
      })),
    }));

    const onlineList = (orders || []).map((o) => ({
      inv: o.id || `ORD-${Math.floor(Math.random() * 90000)}`,
      date: o.date || "Today",
      entity: o.customer || (o.shippingAddress ? o.shippingAddress.split(",")[0] : "Online Customer"),
      amount: `₹${Number(o.total || 0).toFixed(2)}`,
      rawAmount: Number(o.total || 0),
      status: o.status === "Delivered" ? "Paid" : o.status || "Paid",
      channel: "Online Storefront",
      items: (o.items || []).map((it) => ({
        name: it.name,
        qty: it.qty,
        price: it.price,
      })),
    }));

    const combined = [...posList, ...onlineList];
    if (combined.length === 0) return SALES_DATA;
    return [...combined, ...SALES_DATA];
  }, [sales, orders]);

  const isSales = activeTab === "sales";
  const entityLabel = isSales ? "Customer" : "Supplier";
  const baseData = isSales ? liveSalesData : PURCHASE_DATA;

  // Filtered rows
  const filteredRows = useMemo(() => {
    return baseData.filter((row) => {
      const matchStatus =
        filterStatus === "All Statuses" ||
        row.status.toLowerCase() === filterStatus.toLowerCase();
      const matchEntity =
        !filterEntity.trim() ||
        row.entity.toLowerCase().includes(filterEntity.trim().toLowerCase()) ||
        row.inv.toLowerCase().includes(filterEntity.trim().toLowerCase());
      return matchStatus && matchEntity;
    });
  }, [baseData, filterStatus, filterEntity]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleRows = filteredRows.slice(startIndex, startIndex + itemsPerPage);

  const handleResetFilters = () => {
    setFilterStatus("All Statuses");
    setFilterEntity("");
    setCurrentPage(1);
  };

  const handleDownloadReport = () => {
    const headers = ["Invoice/PO #", "Date", entityLabel, "Amount", "Status"];
    const rows = filteredRows.map((r) => [
      `"${r.inv}"`,
      `"${r.date}"`,
      `"${r.entity}"`,
      `"${r.amount}"`,
      `"${r.status}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `${activeTab}_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

      <main className="md:ml-[240px] min-h-screen">
        <div className="p-6 space-y-8 max-w-[1280px] mx-auto">
          {/* Page header + tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-[32px] font-bold tracking-tight">Transaction History</h2>
              <p className="text-sm text-[#3f4850] mt-1">
                Monitor and manage all your incoming and outgoing ledger entries.
              </p>
            </div>
            <div className="flex bg-[#eceef0] rounded-xl p-1 shadow-inner">
              <button
                onClick={() => {
                  setActiveTab("sales");
                  setCurrentPage(1);
                }}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  isSales
                    ? "bg-white text-[#006194] shadow-sm"
                    : "text-[#3f4850] hover:text-[#191c1e]"
                }`}
              >
                Sales History
              </button>
              <button
                onClick={() => {
                  setActiveTab("purchases");
                  setCurrentPage(1);
                }}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  !isSales
                    ? "bg-white text-[#006194] shadow-sm"
                    : "text-[#3f4850] hover:text-[#191c1e]"
                }`}
              >
                Purchase History
              </button>
            </div>
          </div>

          {/* Filters */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-[#bfc7d2]/30">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#565e74] block">Date Range</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707881] text-[20px]">
                    calendar_today
                  </span>
                  <input
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f7f9fb] border border-[#bfc7d2] rounded-lg text-sm focus:border-[#006194] outline-none"
                    type="text"
                    defaultValue="Oct 1, 2023 - Oct 31, 2023"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#565e74] block">Payment Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2.5 bg-[#f7f9fb] border border-[#bfc7d2] rounded-lg text-sm focus:border-[#006194] outline-none"
                >
                  <option value="All Statuses">All Statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#565e74] block">{entityLabel} or Invoice #</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707881] text-[20px]">
                    search
                  </span>
                  <input
                    value={filterEntity}
                    onChange={(e) => {
                      setFilterEntity(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f7f9fb] border border-[#bfc7d2] rounded-lg text-sm focus:border-[#006194] outline-none"
                    placeholder={`Search ${entityLabel.toLowerCase()}...`}
                    type="text"
                  />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={handleDownloadReport}
                  className="flex-1 bg-[#006194] text-white text-sm font-semibold py-2.5 px-4 rounded-lg hover:bg-[#007bb9] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Export CSV
                </button>
                <button
                  onClick={handleResetFilters}
                  title="Reset Filters"
                  className="w-11 h-11 flex items-center justify-center border border-[#bfc7d2] rounded-lg hover:bg-[#eceef0] transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[#707881]">refresh</span>
                </button>
              </div>
            </div>
          </section>

          {/* Table */}
          <section className="bg-white rounded-xl shadow-sm border border-[#bfc7d2]/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f2f4f6] border-b border-[#bfc7d2]">
                    <th className="px-6 py-4 text-sm text-[#565e74] uppercase tracking-wider">
                      {isSales ? "Invoice #" : "PO #"}
                    </th>
                    <th className="px-6 py-4 text-sm text-[#565e74] uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-sm text-[#565e74] uppercase tracking-wider">{entityLabel}</th>
                    <th className="px-6 py-4 text-sm text-[#565e74] uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-sm text-[#565e74] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-sm text-[#565e74] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#bfc7d2]/30">
                  {visibleRows.map((row) => (
                    <tr key={row.inv} className="hover:bg-[#f2f4f6] transition-colors group">
                      <td className="px-6 py-4 text-sm font-bold text-[#006194]">{row.inv}</td>
                      <td className="px-6 py-4 text-sm text-[#3f4850]">{row.date}</td>
                      <td className="px-6 py-4 text-sm font-medium">{row.entity}</td>
                      <td className="px-6 py-4 text-sm font-semibold">{row.amount}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold ${
                            STATUS_CLASSES[row.status] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedTx(row)}
                          title="View Details"
                          className="p-2 rounded-lg hover:bg-[#e6e8ea] text-[#707881] group-hover:text-[#006194] transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredRows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-[#3f4850]">
                        No transactions match the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-[#f2f4f6] flex items-center justify-between border-t border-[#bfc7d2]">
              <span className="text-sm text-[#565e74]">
                Showing {filteredRows.length === 0 ? 0 : startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, filteredRows.length)} of {filteredRows.length} entries
              </span>
              <div className="flex gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 border border-[#bfc7d2] rounded hover:bg-white text-[#565e74] transition-all disabled:opacity-30 cursor-pointer"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`px-3 py-1 rounded cursor-pointer transition-all ${
                      currentPage === num
                        ? "bg-[#006194] text-white shadow-sm"
                        : "border border-[#bfc7d2] hover:bg-white text-[#565e74]"
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 border border-[#bfc7d2] rounded hover:bg-white text-[#565e74] transition-all disabled:opacity-30 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </section>

          {/* Cashflow summary */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-[#bfc7d2]/30 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-[20px] font-semibold">Cashflow Summary</h3>
                  <p className="text-sm text-[#3f4850]">Monthly comparison of revenue vs expenses</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#006194]" />
                    <span className="text-sm text-[#565e74]">Sales</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#006947]" />
                    <span className="text-sm text-[#565e74]">Purchases</span>
                  </div>
                </div>
              </div>

              {/* Bar chart */}
              <div className="flex-1 flex items-end gap-6 h-48 px-4">
                <div className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex items-end gap-1 h-full">
                    <div className="bg-[#006194]/20 w-1/2 h-3/5 rounded-t group-hover:bg-[#006194] transition-all" />
                    <div className="bg-[#006947]/20 w-1/2 h-2/5 rounded-t group-hover:bg-[#006947] transition-all" />
                  </div>
                  <span className="text-sm text-[#565e74]">July</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex items-end gap-1 h-full">
                    <div className="bg-[#006194] w-1/2 h-4/5 rounded-t" />
                    <div className="bg-[#006947]/20 w-1/2 h-1/2 rounded-t group-hover:bg-[#006947] transition-all" />
                  </div>
                  <span className="text-sm text-[#565e74]">Aug</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex items-end gap-1 h-full">
                    <div className="bg-[#006194]/20 w-1/2 h-2/3 rounded-t group-hover:bg-[#006194] transition-all" />
                    <div className="bg-[#006947] w-1/2 h-3/4 rounded-t" />
                  </div>
                  <span className="text-sm text-[#565e74]">Sept</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex items-end gap-1 h-full">
                    <div className="bg-[#006194] w-1/2 h-full rounded-t" />
                    <div className="bg-[#006947]/20 w-1/2 h-2/5 rounded-t group-hover:bg-[#006947] transition-all" />
                  </div>
                  <span className="text-sm text-[#565e74]">Oct</span>
                </div>
              </div>
            </div>

            {/* Performance card */}
            <div className="bg-[#006194] text-white rounded-xl p-6 shadow-lg flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-xs uppercase tracking-widest text-white/80 font-semibold">Net Profit Margin</p>
                <h4 className="text-[32px] font-bold mt-2">₹1,24,000</h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className="material-symbols-outlined text-[18px]">trending_up</span>
                  <span className="text-sm">+14.2% vs last month</span>
                </div>
              </div>
              <div className="relative z-10 pt-6">
                <button
                  onClick={handleDownloadReport}
                  className="w-full bg-white/20 hover:bg-white/30 text-white py-2.5 rounded-lg text-sm font-semibold backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Download Report (CSV)
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="w-full py-8 mt-8 bg-[#eceef0] border-t border-[#bfc7d2]">
          <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-[1280px] mx-auto gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[20px] font-semibold text-[#006194]">Efficient Ledger</span>
              <span className="text-sm text-[#565e74]">|</span>
              <span className="text-sm text-[#565e74]">© 2024 Efficient Ledger. All rights reserved.</span>
            </div>
            <div className="flex gap-6 text-sm text-[#3f4850]">
              <button
                onClick={() => alert("Privacy Policy: All store transactional data is confidential.")}
                className="hover:text-[#006194] transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => alert("Terms of Service: Standard transaction ledger policies apply.")}
                className="hover:text-[#006194] transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
              <button
                onClick={() => navigate("/help")}
                className="hover:text-[#006194] transition-colors cursor-pointer"
              >
                Contact Support
              </button>
            </div>
          </div>
        </footer>
      </main>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl p-6 border border-[#bfc7d2] animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <div>
                <h3 className="font-bold text-lg text-[#191c1e]">{selectedTx.inv}</h3>
                <p className="text-xs text-[#707881]">{selectedTx.date}</p>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="p-1 text-gray-500 hover:text-black rounded-full"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-[#f8f9ff] rounded-xl flex justify-between items-center">
                <div>
                  <span className="text-xs text-[#707881] block">{entityLabel}</span>
                  <span className="text-sm font-bold text-[#191c1e]">{selectedTx.entity}</span>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      STATUS_CLASSES[selectedTx.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {selectedTx.status}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#707881] uppercase mb-2">Item Breakdown</h4>
                <div className="space-y-2 text-xs">
                  {selectedTx.items?.map((it, idx) => (
                    <div key={idx} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-semibold text-[#191c1e]">{it.name}</p>
                        <p className="text-[#707881]">Qty: {it.qty} × ₹{it.price}</p>
                      </div>
                      <span className="font-bold text-[#191c1e]">₹{it.qty * it.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t flex justify-between items-center">
                <span className="text-sm font-bold text-[#191c1e]">Total Amount</span>
                <span className="text-xl font-extrabold text-[#006194]">{selectedTx.amount}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-6">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#191c1e] rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                Print Record
              </button>
              <button
                onClick={() => setSelectedTx(null)}
                className="flex-1 py-2.5 bg-[#006194] hover:bg-[#007bb9] text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
