import React, { useState, useMemo } from "react";
import Sidebar from "./Sidebar.jsx";
import TopNav from "./TopNav.jsx";
import MetricCard from "./MetricCard.jsx";

/*
  Salary Reports page. Mirrors the Attendance Tracking page shell
  (Sidebar + bordered TopNav + mobile drawer) but adds:
    - Period/Department filter row
    - 4-card bento summary (gross pay, deductions, net payout, employer contrib.)
    - Payroll-by-department bar chart (CSS bars, no chart lib)
    - Past payroll cycles list with download actions
    - All cycles history modal
    - Employee earnings breakdown table with live search, department filtering, and CSV export
    - Print to PDF export
*/

const deptBars = [
  { label: "Eng", value: "$140k", heightPct: 80, color: "#006194" },
  { label: "Sales", value: "$105k", heightPct: 60, color: "#93ccff" },
  { label: "Mktg", value: "$70k", heightPct: 40, color: "#d7dff9" },
  { label: "Ops", value: "$85k", heightPct: 50, color: "#076396" },
  { label: "HR", value: "$25k", heightPct: 20, color: "#026a48" },
];

const initialCycles = [
  { period: "September 2023", processed: "Oct 1, 2023", employees: 44, total: "$332,100.00", status: "Paid" },
  { period: "August 2023", processed: "Sep 1, 2023", employees: 43, total: "$325,400.00", status: "Paid" },
  { period: "July 2023", processed: "Aug 1, 2023", employees: 42, total: "$319,800.00", status: "Paid" },
];

const allCyclesList = [
  { period: "October 2023", processed: "Nov 1, 2023", employees: 45, total: "$339,750.00", status: "Processing" },
  { period: "September 2023", processed: "Oct 1, 2023", employees: 44, total: "$332,100.00", status: "Paid" },
  { period: "August 2023", processed: "Sep 1, 2023", employees: 43, total: "$325,400.00", status: "Paid" },
  { period: "July 2023", processed: "Aug 1, 2023", employees: 42, total: "$319,800.00", status: "Paid" },
  { period: "June 2023", processed: "Jul 1, 2023", employees: 41, total: "$310,500.00", status: "Paid" },
  { period: "May 2023", processed: "Jun 1, 2023", employees: 40, total: "$305,200.00", status: "Paid" },
  { period: "April 2023", processed: "May 1, 2023", employees: 39, total: "$298,900.00", status: "Paid" },
  { period: "March 2023", processed: "Apr 1, 2023", employees: 38, total: "$290,000.00", status: "Paid" },
  { period: "February 2023", processed: "Mar 1, 2023", employees: 38, total: "$288,500.00", status: "Paid" },
  { period: "January 2023", processed: "Feb 1, 2023", employees: 37, total: "$280,000.00", status: "Paid" },
];

const allEarnings = [
  { initials: "AS", name: "Alice Smith", dept: "Engineering", basic: "$8,500.00", bonus: "+$500.00", deductions: "-$1,800.00", net: "$7,200.00", status: "Processing", bg: "#cce5ff", color: "#001d31" },
  { initials: "BJ", name: "Bob Jones", dept: "Sales", basic: "$6,200.00", bonus: "+$1,200.00", deductions: "-$1,450.00", net: "$5,950.00", status: "Processing", bg: "#9ff4c8", color: "#002113" },
  { initials: "CD", name: "Carol Davis", dept: "HR", basic: "$5,800.00", bonus: "-", deductions: "-$1,100.00", net: "$4,700.00", status: "Processing", bg: "#93ccff", color: "#001d31" },
  { initials: "DW", name: "David Wilson", dept: "Engineering", basic: "$9,200.00", bonus: "+$800.00", deductions: "-$2,100.00", net: "$7,900.00", status: "Processing", bg: "#d7dff9", color: "#191c1e" },
  { initials: "EM", name: "Emma Miller", dept: "Sales", basic: "$5,900.00", bonus: "+$1,500.00", deductions: "-$1,350.00", net: "$6,050.00", status: "Processing", bg: "#ffe082", color: "#3e2723" },
  { initials: "FK", name: "Frank Knight", dept: "Operations", basic: "$6,500.00", bonus: "+$300.00", deductions: "-$1,200.00", net: "$5,600.00", status: "Processing", bg: "#c8e6c9", color: "#1b5e20" },
  { initials: "GL", name: "Grace Lee", dept: "Marketing", basic: "$6,800.00", bonus: "+$600.00", deductions: "-$1,400.00", net: "$6,000.00", status: "Processing", bg: "#f8bbd0", color: "#880e4f" },
  { initials: "HP", name: "Henry Patel", dept: "Engineering", basic: "$7,800.00", bonus: "+$400.00", deductions: "-$1,650.00", net: "$6,550.00", status: "Processing", bg: "#e1bee7", color: "#4a148c" },
];

const SalaryReports = ({ onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [period, setPeriod] = useState("October 2023");
  const [dept, setDept] = useState("All Departments");
  const [appliedDept, setAppliedDept] = useState("All Departments");
  const [searchQuery, setSearchQuery] = useState("");
  const [allCyclesModalOpen, setAllCyclesModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleApplyFilters = () => {
    setAppliedDept(dept);
    setPage(1);
    showToast(`Filters applied: ${dept} (${period})`);
  };

  const downloadCSV = (rows, filename = "salary_report.csv") => {
    const headers = ["Employee", "Department", "Basic Pay", "Bonus/Overtime", "Deductions", "Net Pay", "Status"];
    const csvData = [
      headers.join(","),
      ...rows.map(
        (r) =>
          `"${r.name}","${r.dept}","${r.basic}","${r.bonus}","${r.deductions}","${r.net}","${r.status}"`
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${filename}`);
  };

  const handleExportCSV = () => {
    downloadCSV(filteredEarnings, `Salary_Report_${period.replace(/\s+/g, "_")}.csv`);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleDownloadCycle = (c) => {
    const mockCycleRows = allEarnings.map((e) => ({
      ...e,
      status: c.status,
    }));
    downloadCSV(mockCycleRows, `Payroll_Cycle_${c.period.replace(/\s+/g, "_")}.csv`);
  };

  // Filtered earnings
  const filteredEarnings = useMemo(() => {
    return allEarnings.filter((e) => {
      const matchDept = appliedDept === "All Departments" || e.dept.toLowerCase() === appliedDept.toLowerCase();
      const matchSearch =
        !searchQuery ||
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.dept.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDept && matchSearch;
    });
  }, [appliedDept, searchQuery]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredEarnings.length / itemsPerPage) || 1;
  const paginatedEarnings = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredEarnings.slice(start, start + itemsPerPage);
  }, [filteredEarnings, page]);

  return (
    <div className="flex min-h-screen w-full bg-[#f7f9fb] text-[#191c1e]">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#001d31] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 border border-[#006194]/40 animate-fade-in">
          <span className="material-symbols-outlined text-[#8cd0ff] text-[20px]">info</span>
          <span className="text-[14px] font-medium">{toast}</span>
        </div>
      )}

      <Sidebar
        activeItem="reports"
        onNavigate={onNavigate}
        subtitle="Admin Portal"
        primaryAction={{
          label: "Export Data",
          icon: "download",
          className: "bg-[#006194] hover:bg-[#076396]",
          onClick: handleExportCSV,
        }}
        secondaryLinks={[
          { icon: "settings", label: "Settings" },
          { icon: "help", label: "Help" },
        ]}
      />

      <div className="flex-1 flex flex-col md:ml-[280px] min-h-screen">
        <TopNav
          variant="bordered"
          avatarLabel="Help"
          onAvatarClick={() => onNavigate?.("help")}
          onMobileMenuClick={() => setMobileMenuOpen((v) => !v)}
        />

        <main className="flex-1 pt-[96px] px-[16px] md:px-[32px] pb-[48px] w-full max-w-[1280px] mx-auto">
          {/* Page header & actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-[16px] mb-[32px]">
            <div>
              <h2 className="text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] font-bold text-[#191c1e] tracking-[-0.01em] md:tracking-[-0.02em]">
                Salary Reports
              </h2>
              <p className="text-[14px] text-[#40474f] mt-1">
                Comprehensive financial overview and payroll distribution for current period.
              </p>
            </div>
            <div className="flex gap-[12px]">
              <button
                onClick={handleExportPDF}
                className="px-[16px] py-[8px] bg-white text-[#191c1e] text-[14px] rounded-[8px] border border-[#bfc7d2] hover:bg-[#f2f4f6] transition-colors flex items-center gap-2 active:scale-95 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                Export PDF
              </button>
              <button
                onClick={handleExportCSV}
                className="px-[16px] py-[8px] bg-[#004870] text-white text-[14px] rounded-[8px] hover:bg-[#006194] transition-colors flex items-center gap-2 active:scale-95 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">csv</span>
                Export CSV
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-[16px] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#bfc7d2] mb-[32px] flex flex-col md:flex-row gap-[16px] items-end">
            <div className="flex-1 w-full">
              <label className="block text-[12px] tracking-[0.05em] font-semibold text-[#40474f] mb-2">
                Period
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full h-[40px] px-[12px] bg-[#f2f4f6] border border-[#bfc7d2] rounded-[8px] text-[14px] text-[#191c1e] focus:ring-2 focus:ring-[#004870] focus:border-transparent outline-none cursor-pointer"
              >
                {["October 2023", "September 2023", "August 2023", "July 2023"].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-[12px] tracking-[0.05em] font-semibold text-[#40474f] mb-2">
                Department
              </label>
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="w-full h-[40px] px-[12px] bg-[#f2f4f6] border border-[#bfc7d2] rounded-[8px] text-[14px] text-[#191c1e] focus:ring-2 focus:ring-[#004870] focus:border-transparent outline-none cursor-pointer"
              >
                {["All Departments", "Engineering", "Sales", "HR", "Operations", "Marketing"].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleApplyFilters}
              className="h-[40px] px-[24px] w-full md:w-auto bg-[#004870] text-white rounded-[8px] text-[14px] font-semibold hover:bg-[#006194] transition-colors active:scale-95 shadow-sm cursor-pointer"
            >
              Apply Filters
            </button>
          </div>

          {/* Summary bento */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px] mb-[32px]">
            <MetricCard
              icon="account_balance_wallet"
              iconBg="#cce5ff"
              iconColor="#004870"
              iconShape="rounded"
              iconSize={32}
              label="Total Gross Pay"
              value="$425,000.00"
              footer={
                <p className="text-[12px] text-[#005035] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  +2.4% vs last month
                </p>
              }
            />
            <MetricCard
              icon="money_off"
              iconBg="#ffdad6"
              iconColor="#ba1a1a"
              iconShape="rounded"
              iconSize={32}
              label="Total Deductions"
              value="$85,250.00"
              footer={<p className="text-[12px] text-[#40474f]">Taxes, Benefits, 401k</p>}
            />
            <MetricCard
              icon="payments"
              iconBg="#006194"
              iconColor="#ffffff"
              iconShape="rounded"
              iconSize={32}
              label="Total Net Payout"
              value="$339,750.00"
              footer={<p className="text-[12px] text-[#40474f]">Scheduled for Oct 31</p>}
            />
            <MetricCard
              icon="handshake"
              iconBg="#d7dff9"
              iconColor="#5a6278"
              iconShape="rounded"
              iconSize={32}
              label="Employer Contributions"
              value="$42,500.00"
              footer={<p className="text-[12px] text-[#40474f]">10% match avg</p>}
            />
          </div>

          {/* Chart + Cycles split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px] mb-[32px]">
            <div className="lg:col-span-2 bg-white p-[24px] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#bfc7d2] flex flex-col h-[400px]">
              <h3 className="text-[20px] font-semibold text-[#191c1e] mb-[16px] flex items-center justify-between">
                Payroll Distribution by Department
                <span className="text-[12px] font-normal text-[#40474f] bg-[#f2f4f6] px-3 py-1 rounded-full border border-[#bfc7d2]">
                  Oct 2023
                </span>
              </h3>
              <div className="flex-1 relative w-full rounded-[8px] overflow-hidden bg-[#f2f4f6]/50 border border-[#bfc7d2]/30 flex items-end gap-[8px] p-[24px] justify-around">
                {deptBars.map((bar) => (
                  <div
                    key={bar.label}
                    className="w-[64px] rounded-t-[4px] relative group transition-all cursor-pointer"
                    style={{ height: `${bar.heightPct}%`, backgroundColor: bar.color }}
                  >
                    <span className="absolute -top-[24px] left-1/2 -translate-x-1/2 text-[12px] font-semibold text-[#191c1e] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white px-2 py-0.5 rounded shadow-sm">
                      {bar.value}
                    </span>
                    <span className="absolute -bottom-[24px] left-1/2 -translate-x-1/2 text-[12px] text-[#40474f] font-medium">
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1 bg-white p-[24px] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#bfc7d2] flex flex-col h-[400px]">
              <h3 className="text-[20px] font-semibold text-[#191c1e] mb-[16px]">
                Past Payroll Cycles
              </h3>
              <div className="flex-1 overflow-y-auto pr-[8px] flex flex-col gap-[12px]">
                {initialCycles.map((c) => (
                  <div
                    key={c.period}
                    className="p-[12px] border border-[#bfc7d2] rounded-[8px] flex items-center justify-between hover:bg-[#f2f4f6] transition-colors group"
                  >
                    <div>
                      <p className="text-[14px] font-semibold text-[#191c1e]">{c.period}</p>
                      <p className="text-[12px] text-[#40474f] mt-1">Processed: {c.processed}</p>
                    </div>
                    <div className="flex items-center gap-[12px]">
                      <span className="px-[8px] py-[4px] rounded-[6px] text-[10px] font-bold uppercase tracking-wider bg-[#026a4814] text-[#005035]">
                        {c.status}
                      </span>
                      <button
                        onClick={() => handleDownloadCycle(c)}
                        title="Download Cycle Report"
                        className="text-[#40474f] hover:text-[#004870] p-1 rounded hover:bg-[#e0e3e5] transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setAllCyclesModalOpen(true)}
                className="mt-[16px] w-full py-[8px] text-[#004870] text-[12px] font-semibold hover:bg-[#f2f4f6] rounded-[8px] transition-colors border border-[#bfc7d2] cursor-pointer"
              >
                View All Cycles
              </button>
            </div>
          </div>

          {/* Employee earnings breakdown table */}
          <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#bfc7d2] overflow-hidden">
            <div className="p-[16px] border-b border-[#bfc7d2] bg-[#f2f4f6] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[16px]">
              <div>
                <h3 className="text-[20px] font-semibold text-[#191c1e]">Employee Earnings Breakdown</h3>
                {appliedDept !== "All Departments" && (
                  <span className="text-[12px] text-[#004870] font-medium">Filtered by: {appliedDept}</span>
                )}
              </div>
              <div className="relative w-full sm:w-[256px]">
                <span className="material-symbols-outlined absolute left-[12px] top-1/2 -translate-y-1/2 text-[#40474f] text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search employee..."
                  className="w-full h-[32px] pl-[36px] pr-[12px] rounded-[6px] bg-white border border-[#bfc7d2] focus:ring-1 focus:ring-[#004870] focus:border-[#004870] outline-none text-[14px]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#bfc7d2]">
                    <th className="p-[16px] text-[12px] tracking-[0.05em] font-semibold text-[#40474f]">Employee</th>
                    <th className="p-[16px] text-[12px] tracking-[0.05em] font-semibold text-[#40474f]">Department</th>
                    <th className="p-[16px] text-[12px] tracking-[0.05em] font-semibold text-[#40474f] text-right">Basic Pay</th>
                    <th className="p-[16px] text-[12px] tracking-[0.05em] font-semibold text-[#40474f] text-right">Bonus/Overtime</th>
                    <th className="p-[16px] text-[12px] tracking-[0.05em] font-semibold text-[#40474f] text-right">Deductions</th>
                    <th className="p-[16px] text-[12px] tracking-[0.05em] font-semibold text-[#40474f] text-right">Net Pay</th>
                    <th className="p-[16px] text-[12px] tracking-[0.05em] font-semibold text-[#40474f] text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-[14px]">
                  {paginatedEarnings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-[32px] text-center text-[#40474f]">
                        No employee records found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedEarnings.map((e) => (
                      <tr key={e.name} className="border-b border-[#bfc7d2]/50 hover:bg-[#f2f4f6]/50 transition-colors">
                        <td className="p-[16px] flex items-center gap-[12px]">
                          <div
                            className="w-[32px] h-[32px] rounded-full flex items-center justify-center font-bold text-[12px]"
                            style={{ backgroundColor: e.bg, color: e.color }}
                          >
                            {e.initials}
                          </div>
                          <span className="font-medium text-[#191c1e]">{e.name}</span>
                        </td>
                        <td className="p-[16px] text-[#40474f]">{e.dept}</td>
                        <td className="p-[16px] text-right">{e.basic}</td>
                        <td className="p-[16px] text-right text-[#005035]">{e.bonus}</td>
                        <td className="p-[16px] text-right text-[#ba1a1a]">{e.deductions}</td>
                        <td className="p-[16px] text-right font-semibold text-[#191c1e]">{e.net}</td>
                        <td className="p-[16px] text-center">
                          <span className="px-[8px] py-[4px] rounded-[6px] text-[10px] font-bold uppercase tracking-wider bg-[#d7dff9]/50 text-[#5a6278]">
                            {e.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-[12px] border-t border-[#bfc7d2] flex justify-end items-center gap-[16px] text-[14px] text-[#40474f]">
              <span>Rows per page: {itemsPerPage}</span>
              <span>
                {filteredEarnings.length === 0
                  ? "0 of 0"
                  : `${(page - 1) * itemsPerPage + 1}-${Math.min(page * itemsPerPage, filteredEarnings.length)} of ${filteredEarnings.length}`}
              </span>
              <div className="flex gap-[4px]">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-[4px] hover:bg-[#f2f4f6] rounded-[6px] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-[4px] hover:bg-[#f2f4f6] rounded-[6px] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* View All Cycles Modal */}
      {allCyclesModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setAllCyclesModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-[#bfc7d2]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#bfc7d2] flex items-center justify-between bg-[#f7f9fb]">
              <div>
                <h3 className="text-[20px] font-bold text-[#191c1e]">Historical Payroll Cycles</h3>
                <p className="text-[14px] text-[#40474f]">Complete archive of company salary payouts.</p>
              </div>
              <button
                onClick={() => setAllCyclesModalOpen(false)}
                className="p-1 rounded-full text-[#40474f] hover:bg-[#e0e3e5] transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#bfc7d2] text-[12px] text-[#40474f] font-semibold">
                    <th className="pb-3">Period</th>
                    <th className="pb-3">Processed Date</th>
                    <th className="pb-3 text-center">Staff Count</th>
                    <th className="pb-3 text-right">Total Paid</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-[14px]">
                  {allCyclesList.map((c) => (
                    <tr key={c.period} className="border-b border-[#bfc7d2]/40 hover:bg-[#f2f4f6]/50">
                      <td className="py-3 font-semibold text-[#191c1e]">{c.period}</td>
                      <td className="py-3 text-[#40474f]">{c.processed}</td>
                      <td className="py-3 text-center text-[#40474f]">{c.employees}</td>
                      <td className="py-3 text-right font-medium text-[#191c1e]">{c.total}</td>
                      <td className="py-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            c.status === "Paid" ? "bg-[#026a4814] text-[#005035]" : "bg-[#cce5ff] text-[#004870]"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDownloadCycle(c)}
                          className="px-2.5 py-1 text-[12px] text-[#004870] font-medium bg-[#f2f4f6] hover:bg-[#d7dff9] rounded border border-[#bfc7d2] flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">download</span>
                          CSV
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-[#bfc7d2] bg-[#f7f9fb] flex justify-end">
              <button
                onClick={() => setAllCyclesModalOpen(false)}
                className="px-5 py-2 bg-[#004870] text-white text-[14px] font-medium rounded-lg hover:bg-[#006194] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
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
              activeItem="reports"
              forceVisible
              onNavigate={(id) => {
                setMobileMenuOpen(false);
                onNavigate?.(id);
              }}
              subtitle="Admin Portal"
              primaryAction={{
                label: "Export Data",
                icon: "download",
                className: "bg-[#006194] hover:bg-[#076396]",
                onClick: handleExportCSV,
              }}
              secondaryLinks={[
                { icon: "settings", label: "Settings" },
                { icon: "help", label: "Help" },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryReports;
