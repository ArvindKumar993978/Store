import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import TopNav from "./TopNav.jsx";
import MetricCard from "./MetricCard.jsx";

/*
  Payroll Processing page. Same shell as Attendance Tracking / Salary
  Reports, plus a "Run Payroll" primary action and a staff payroll
  register table with per-row status pills (Draft / Processed / Paid).
*/

const statusStyles = {
  Draft: { bg: "#e0e3e5", color: "#40474f" },
  Processed: { bg: "#026a4833", color: "#005035" },
  Paid: { bg: "#e6f4ea", color: "#137333" },
};

const StatusPill = ({ status }) => {
  const s = statusStyles[status];
  return (
    <span
      className="inline-flex items-center px-[10px] py-[2px] rounded-full text-[12px] font-semibold"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {status}
    </span>
  );
};

const payrollRows = [
  { initials: "JD", name: "John Doe", role: "Store Manager", base: "$4,500.00", attendance: "22/22 days", bonus: "+$500.00", deductions: "-$150.00", net: "$4,850.00", status: "Draft" },
  { initials: "AS", name: "Alice Smith", role: "Sales Associate", base: "$3,200.00", attendance: "20/22 days", bonus: "$0.00", deductions: "-$290.00", net: "$2,910.00", status: "Processed" },
  { initials: "MJ", name: "Michael Johnson", role: "Inventory Clerk", base: "$2,800.00", attendance: "22/22 days", bonus: "+$150.00", deductions: "-$50.00", net: "$2,900.00", status: "Paid" },
];

const PayrollProcessing = ({ onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rows, setRows] = useState(payrollRows);
  const [search, setSearch] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRows = rows.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.role.toLowerCase().includes(search.toLowerCase()) ||
      r.status.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportPayroll = () => {
    const headers = ["Employee", "Role", "Base Salary", "Attendance", "Bonus", "Deductions", "Net Pay", "Status"];
    const exportData = filteredRows.map((r) => [
      r.name,
      r.role,
      `"${r.base}"`,
      r.attendance,
      `"${r.bonus}"`,
      `"${r.deductions}"`,
      `"${r.net}"`,
      r.status,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...exportData.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `payroll_register_october_2024.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const executeRunPayroll = () => {
    setRows((prev) => prev.map((r) => ({ ...r, status: "Paid" })));
    setConfirmModal(false);
    setToast("Payroll run executed successfully! All salaries marked as Paid.");
    setTimeout(() => setToast(null), 4000);
  };

  const handleSaveAdjustment = (e) => {
    e.preventDefault();
    if (!editingRow) return;
    setRows((prev) =>
      prev.map((r) => (r.name === editingRow.name ? editingRow : r))
    );
    setEditingRow(null);
    setToast("Employee payroll record adjusted!");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f7f9fb] text-[#191c1e] relative">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#004870] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-[#86f2e4]">check_circle</span>
          <span className="text-[14px] font-medium">{toast}</span>
        </div>
      )}

      <Sidebar activeItem="payroll" onNavigate={onNavigate} subtitle="Admin Terminal" />

      <div className="flex-1 flex flex-col md:ml-[280px] min-h-screen">
        <TopNav
          variant="bordered"
          avatarLabel="Help"
          onMobileMenuClick={() => setMobileMenuOpen((v) => !v)}
        />

        <main className="flex-1 pt-[96px] px-[16px] md:px-[32px] pb-[48px] w-full max-w-[1280px] mx-auto">
          {/* Page header & actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-[16px] mb-[32px]">
            <div>
              <h2 className="text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] font-bold text-[#191c1e] tracking-[-0.01em] md:tracking-[-0.02em] mb-2">
                Payroll Processing
              </h2>
              <p className="text-[16px] text-[#40474f]">
                Review and process salaries for October 2024
              </p>
            </div>
            <div className="flex gap-[16px] w-full md:w-auto">
              <button 
                onClick={handleExportPayroll}
                className="flex-1 md:flex-none px-[24px] py-[12px] rounded-[8px] border border-[#bfc7d2] text-[#191c1e] text-[12px] font-semibold tracking-[0.05em] hover:bg-[#f2f4f6] transition-colors active:scale-95"
              >
                Export Report
              </button>
              <button 
                onClick={() => setConfirmModal(true)}
                className="flex-1 md:flex-none px-[24px] py-[12px] rounded-[8px] bg-[#004870] text-white text-[12px] font-semibold tracking-[0.05em] hover:opacity-90 transition-opacity active:scale-95 flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
                Run Payroll
              </button>
            </div>
          </div>

          {/* Bento grid stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px] mb-[32px]">
            <MetricCard
              icon="calendar_month"
              iconBg="#d7dff9"
              iconColor="#5a6278"
              iconSize={32}
              label="Period"
              value="October 2024"
            />
            <MetricCard
              icon="group"
              iconBg="#d7dff9"
              iconColor="#5a6278"
              iconSize={32}
              label="Total Staff"
              value="124"
            />
            <MetricCard
              icon="money_off"
              iconBg="#ffdad6"
              iconColor="#93000a"
              iconSize={32}
              label="Total Deductions"
              value="$4,250.00"
            />
            <MetricCard
              icon="account_balance"
              iconBg="#006194"
              iconColor="#ffffff"
              iconSize={32}
              label="Net Payout"
              value="$142,850.00"
            />
          </div>

          {/* Payroll table */}
          <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#bfc7d2] overflow-hidden">
            <div className="p-[24px] border-b border-[#bfc7d2] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[16px] bg-[#f7f9fb]">
              <h3 className="text-[20px] font-bold text-[#191c1e]">Staff Payroll Register</h3>
              <div className="relative w-full sm:w-[256px]">
                <span className="material-symbols-outlined absolute left-[12px] top-1/2 -translate-y-1/2 text-[#40474f] text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter staff..."
                  className="w-full h-[36px] pl-[40px] pr-[16px] rounded-[8px] bg-white border border-[#bfc7d2] focus:ring-2 focus:ring-[#004870] outline-none text-[14px]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f2f4f6] border-b border-[#bfc7d2] text-[12px] tracking-[0.05em] font-semibold text-[#40474f]">
                    <th className="p-[16px]">Employee</th>
                    <th className="p-[16px]">Base Salary</th>
                    <th className="p-[16px]">Attendance</th>
                    <th className="p-[16px]">Bonus</th>
                    <th className="p-[16px]">Deductions</th>
                    <th className="p-[16px] text-right">Net Pay</th>
                    <th className="p-[16px] text-center">Status</th>
                    <th className="p-[16px]"></th>
                  </tr>
                </thead>
                <tbody className="text-[14px] text-[#191c1e]">
                  {filteredRows.map((r) => (
                    <tr key={r.name} className="border-b border-[#bfc7d2] hover:bg-[#f2f4f6] transition-colors group">
                      <td className="p-[16px]">
                        <div className="flex items-center gap-[12px]">
                          <div className="w-[32px] h-[32px] rounded-full bg-[#d7dff9] flex items-center justify-center text-[#5a6278] text-[12px] font-semibold">
                            {r.initials}
                          </div>
                          <div>
                            <div className="font-medium">{r.name}</div>
                            <div className="text-[12px] text-[#40474f]">{r.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-[16px]">{r.base}</td>
                      <td className="p-[16px]">{r.attendance}</td>
                      <td className="p-[16px] text-[#005035]">{r.bonus}</td>
                      <td className="p-[16px] text-[#ba1a1a]">{r.deductions}</td>
                      <td className="p-[16px] text-right font-medium">{r.net}</td>
                      <td className="p-[16px] text-center">
                        <StatusPill status={r.status} />
                      </td>
                      <td className="p-[16px] text-right">
                        <button 
                          onClick={() => setEditingRow({ ...r })}
                          className="text-[#40474f] hover:text-[#004870] p-1.5 rounded-lg hover:bg-white transition-all"
                          title="Inspect / Edit Record"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {r.status === "Paid" ? "visibility" : "edit"}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredRows.length === 0 && (
                    <tr>
                      <td colSpan="8" className="p-8 text-center text-[#707881]">
                        No staff records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-[16px] border-t border-[#bfc7d2] flex flex-col sm:flex-row justify-between items-center gap-[12px] text-[14px] text-[#40474f]">
              <span>Showing 1 to {filteredRows.length} of 124 entries</span>
              <div className="flex gap-[8px]">
                <button 
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-[12px] py-[4px] rounded-[6px] border border-[#bfc7d2] hover:bg-[#f2f4f6] disabled:opacity-50"
                >
                  Prev
                </button>
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`px-[12px] py-[4px] rounded-[6px] ${
                      currentPage === p
                        ? "bg-[#004870] text-white"
                        : "border border-[#bfc7d2] hover:bg-[#f2f4f6]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button 
                  onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
                  disabled={currentPage === 3}
                  className="px-[12px] py-[4px] rounded-[6px] border border-[#bfc7d2] hover:bg-[#f2f4f6] disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Confirm Run Payroll Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
            <h3 className="text-[18px] font-bold text-[#191c1e] mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006194]">payments</span>
              Confirm Payroll Execution
            </h3>
            <p className="text-[14px] text-[#40474f] mb-4">
              Are you sure you want to process and disburse salaries for October 2024? This will mark all pending employee drafts as Paid.
            </p>
            <div className="bg-[#eff4ff] p-4 rounded-xl border border-[#bfc7d2] mb-6 space-y-2 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#40474f]">Total Payout:</span>
                <span className="font-bold text-[#006194]">$142,850.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#40474f]">Staff Members:</span>
                <span className="font-semibold text-[#191c1e]">124 Employees</span>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmModal(false)}
                className="px-4 py-2 border border-[#bfc7d2] rounded-lg text-[13px] font-medium hover:bg-[#f2f4f6]"
              >
                Cancel
              </button>
              <button
                onClick={executeRunPayroll}
                className="px-4 py-2 bg-[#004870] text-white rounded-lg text-[13px] font-semibold hover:bg-[#006194] shadow-sm"
              >
                Confirm &amp; Disburse
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Inspect Payroll Row Modal */}
      {editingRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
            <div className="flex justify-between items-center pb-3 border-b border-[#bfc7d2]">
              <h3 className="text-[18px] font-bold text-[#191c1e]">Salary Details &bull; {editingRow.name}</h3>
              <button onClick={() => setEditingRow(null)} className="text-[#707881]">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveAdjustment} className="py-4 space-y-4 text-[13px]">
              <div>
                <label className="text-[#40474f] block font-medium mb-1">Base Salary</label>
                <input
                  type="text"
                  value={editingRow.base}
                  onChange={(e) => setEditingRow({ ...editingRow, base: e.target.value })}
                  className="w-full px-3 py-2 border border-[#bfc7d2] rounded-lg outline-none focus:ring-2 focus:ring-[#004870]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#40474f] block font-medium mb-1">Bonus</label>
                  <input
                    type="text"
                    value={editingRow.bonus}
                    onChange={(e) => setEditingRow({ ...editingRow, bonus: e.target.value })}
                    className="w-full px-3 py-2 border border-[#bfc7d2] rounded-lg outline-none focus:ring-2 focus:ring-[#004870]"
                  />
                </div>
                <div>
                  <label className="text-[#40474f] block font-medium mb-1">Deductions</label>
                  <input
                    type="text"
                    value={editingRow.deductions}
                    onChange={(e) => setEditingRow({ ...editingRow, deductions: e.target.value })}
                    className="w-full px-3 py-2 border border-[#bfc7d2] rounded-lg outline-none focus:ring-2 focus:ring-[#004870]"
                  />
                </div>
              </div>
              <div>
                <label className="text-[#40474f] block font-medium mb-1">Status</label>
                <select
                  value={editingRow.status}
                  onChange={(e) => setEditingRow({ ...editingRow, status: e.target.value })}
                  className="w-full px-3 py-2 border border-[#bfc7d2] rounded-lg outline-none focus:ring-2 focus:ring-[#004870] bg-white"
                >
                  <option value="Draft">Draft</option>
                  <option value="Processed">Processed</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t border-[#bfc7d2]">
                <button
                  type="button"
                  onClick={() => setEditingRow(null)}
                  className="px-3 py-2 border border-[#bfc7d2] rounded-lg hover:bg-[#f2f4f6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#004870] text-white rounded-lg font-semibold hover:bg-[#006194]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute left-0 top-0 h-full w-[280px] bg-[#f7f9fb]"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar
              activeItem="payroll"
              forceVisible
              onNavigate={(id) => {
                setMobileMenuOpen(false);
                onNavigate?.(id);
              }}
              subtitle="Admin Terminal"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollProcessing;
