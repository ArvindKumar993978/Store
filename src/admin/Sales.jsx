import React, { useState } from "react";
import Sidebar from "../component/Sidebar";
import Topnav from "../component/Topnav";

/*
  EASY-TO-EDIT VERSION
  --------------------
  Colors as Tailwind arbitrary values, e.g. text-[#006194].

  Quick color reference:
    #006194  -> primary (blue)
    #006947  -> tertiary (green, used in the chart's "Purchases" bars/dot)
    #565e74  -> secondary/gray text
    #f7f9fb  -> page background
    #f2f4f6  -> surface-container-low
    #eceef0  -> surface-container
    #bfc7d2  -> border color
    Status badge colors kept as Tailwind's built-in emerald/amber/rose
    (same as the original page).

  DATA:
  SALES_DATA and PURCHASE_DATA below feed the table. Clicking the
  "Sales History" / "Purchase History" tab swaps which array is shown
  and relabels the "Customer"/"Supplier" column — same behavior as
  the original page's tab-switching script.
*/

const SALES_DATA = [
  { inv: "INV-8821", date: "Oct 24, 2023", entity: "Rajesh Kumar Enterprises", amount: "\u20B912,450.00", status: "Paid" },
  { inv: "INV-8820", date: "Oct 23, 2023", entity: "Priya Sharma", amount: "\u20B94,200.00", status: "Pending" },
  { inv: "INV-8819", date: "Oct 21, 2023", entity: "Amit Patel", amount: "\u20B922,100.00", status: "Overdue" },
  { inv: "INV-8818", date: "Oct 20, 2023", entity: "Green Valley Agro", amount: "\u20B98,900.00", status: "Paid" },
];

const PURCHASE_DATA = [
  { inv: "PUR-4412", date: "Oct 22, 2023", entity: "Global Logistics Ltd.", amount: "\u20B956,000.00", status: "Paid" },
  { inv: "PUR-4411", date: "Oct 19, 2023", entity: "Tech Supply Co.", amount: "\u20B912,500.00", status: "Pending" },
  { inv: "PUR-4410", date: "Oct 18, 2023", entity: "Office Depot Solutions", amount: "\u20B93,400.00", status: "Paid" },
  { inv: "PUR-4409", date: "Oct 15, 2023", entity: "National Grid", amount: "\u20B91,200.00", status: "Paid" },
];

const STATUS_CLASSES = {
  Paid: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Overdue: "bg-rose-100 text-rose-700",
};

const CASHFLOW_CHART = [
  { month: "July", sales: "3/5", purchases: "2/5", salesValue: "\u20B945k", purchasesValue: "\u20B928k", highlight: null },
  { month: "Aug", sales: "4/5", purchases: "1/2", highlight: "sales" },
  { month: "Sept", sales: "2/3", purchases: "3/4", highlight: "purchases" },
  { month: "Oct", sales: "full", purchases: "2/5", highlight: "sales" },
];

const FOOTER_LINKS = ["Privacy Policy", "Terms of Service", "Contact Support"];

export default function TransactionHistoryPage() {
  const [activeTab, setActiveTab] = useState("sales"); // "sales" | "purchases"

  const isSales = activeTab === "sales";
  const rows = isSales ? SALES_DATA : PURCHASE_DATA;
  const entityLabel = isSales ? "Customer" : "Supplier";

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; vertical-align: middle; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
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
                onClick={() => setActiveTab("sales")}
                className={
                  isSales
                    ? "px-6 py-2 rounded-lg text-sm font-semibold transition-all bg-white text-[#006194] shadow-sm"
                    : "px-6 py-2 rounded-lg text-sm font-semibold transition-all text-[#3f4850] hover:text-[#191c1e]"
                }
              >
                Sales History
              </button>
              <button
                onClick={() => setActiveTab("purchases")}
                className={
                  !isSales
                    ? "px-6 py-2 rounded-lg text-sm font-semibold transition-all bg-white text-[#006194] shadow-sm"
                    : "px-6 py-2 rounded-lg text-sm font-semibold transition-all text-[#3f4850] hover:text-[#191c1e]"
                }
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
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f7f9fb] border border-[#bfc7d2] rounded-lg text-sm focus:border-[#006194] focus:ring-0"
                    type="text"
                    defaultValue="Oct 1, 2023 - Oct 31, 2023"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#565e74] block">Payment Status</label>
                <select className="w-full px-4 py-2.5 bg-[#f7f9fb] border border-[#bfc7d2] rounded-lg text-sm focus:border-[#006194] focus:ring-0 appearance-none">
                  <option>All Statuses</option>
                  <option>Paid</option>
                  <option>Pending</option>
                  <option>Overdue</option>
                  <option>Cancelled</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#565e74] block">{entityLabel} Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707881] text-[20px]">
                    person
                  </span>
                  <input
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f7f9fb] border border-[#bfc7d2] rounded-lg text-sm focus:border-[#006194] focus:ring-0"
                    placeholder="Search name..."
                    type="text"
                  />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <button className="flex-1 bg-[#006194] text-white text-sm font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">filter_list</span>
                  Apply Filters
                </button>
                <button className="w-12 h-12 flex items-center justify-center border border-[#bfc7d2] rounded-lg hover:bg-[#eceef0] transition-all">
                  <span className="material-symbols-outlined text-[#707881]">refresh</span>
                </button>
              </div>
            </div>
          </section>

          {/* Table */}
          <section className="bg-white rounded-xl shadow-sm border border-[#bfc7d2]/30 overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f2f4f6] border-b border-[#bfc7d2]">
                    <th className="px-6 py-4 text-sm text-[#565e74] uppercase tracking-wider">Invoice #</th>
                    <th className="px-6 py-4 text-sm text-[#565e74] uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-sm text-[#565e74] uppercase tracking-wider">{entityLabel}</th>
                    <th className="px-6 py-4 text-sm text-[#565e74] uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-sm text-[#565e74] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-sm text-[#565e74] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#bfc7d2]/30">
                  {rows.map((row) => (
                    <tr key={row.inv} className="hover:bg-[#f2f4f6] transition-colors group">
                      <td className="px-6 py-4 text-sm font-semibold">{row.inv}</td>
                      <td className="px-6 py-4 text-sm text-[#3f4850]">{row.date}</td>
                      <td className="px-6 py-4 text-sm">{row.entity}</td>
                      <td className="px-6 py-4 text-sm">{row.amount}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold ${STATUS_CLASSES[row.status]}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="p-2 rounded-lg hover:bg-[#e6e8ea] text-[#707881] group-hover:text-[#006194] transition-all">
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-[#f2f4f6] flex items-center justify-between border-t border-[#bfc7d2]">
              <span className="text-sm text-[#565e74]">Showing 1 to 4 of 128 entries</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-[#bfc7d2] rounded hover:bg-white text-[#565e74] transition-all">
                  Previous
                </button>
                <button className="px-3 py-1 bg-[#006194] text-white rounded shadow-sm">1</button>
                <button className="px-3 py-1 border border-[#bfc7d2] rounded hover:bg-white text-[#565e74] transition-all">2</button>
                <button className="px-3 py-1 border border-[#bfc7d2] rounded hover:bg-white text-[#565e74] transition-all">3</button>
                <button className="px-3 py-1 border border-[#bfc7d2] rounded hover:bg-white text-[#565e74] transition-all">Next</button>
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

              {/* Simplified bar chart (heights are illustrative, same as original design) */}
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
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative z-10">
                <p className="text-xs uppercase tracking-widest text-white/80 font-semibold">Net Profit Margin</p>
                <h4 className="text-[32px] font-bold mt-2">\u20B91,24,000</h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className="material-symbols-outlined text-[18px]">trending_up</span>
                  <span className="text-sm">+14.2% vs last month</span>
                </div>
              </div>
              <div className="relative z-10 pt-6">
                <button className="w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg text-sm font-semibold backdrop-blur-md transition-all">
                  Download Report (PDF)
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
              {FOOTER_LINKS.map((link) => (
                <a key={link} className="hover:text-[#006194] transition-colors" href="#">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
