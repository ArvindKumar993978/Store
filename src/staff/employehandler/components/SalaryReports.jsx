import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import TopNav from "./TopNav.jsx";
import MetricCard from "./MetricCard.jsx";

/*
  Salary Reports page. Mirrors the Attendance Tracking page shell
  (Sidebar + bordered TopNav + mobile drawer) but adds:
    - Period/Department filter row
    - 4-card bento summary (gross pay, deductions, net payout, employer contrib.)
    - Payroll-by-department bar chart (CSS bars, no chart lib)
    - Past payroll cycles list
    - Employee earnings breakdown table
*/

const deptBars = [
  { label: "Eng", value: "$140k", heightPct: 80, color: "#006194" },
  { label: "Sales", value: "$105k", heightPct: 60, color: "#93ccff" },
  { label: "Mktg", value: "$70k", heightPct: 40, color: "#d7dff9" },
  { label: "Ops", value: "$85k", heightPct: 50, color: "#076396" },
  { label: "HR", value: "$25k", heightPct: 20, color: "#026a48" },
];

const cycles = [
  { period: "September 2023", processed: "Oct 1", status: "Paid" },
  { period: "August 2023", processed: "Sep 1", status: "Paid" },
  { period: "July 2023", processed: "Aug 1", status: "Paid" },
];

const earnings = [
  { initials: "AS", name: "Alice Smith", dept: "Engineering", basic: "$8,500.00", bonus: "+$500.00", deductions: "-$1,800.00", net: "$7,200.00", status: "Processing", bg: "#cce5ff", color: "#001d31" },
  { initials: "BJ", name: "Bob Jones", dept: "Sales", basic: "$6,200.00", bonus: "+$1,200.00", deductions: "-$1,450.00", net: "$5,950.00", status: "Processing", bg: "#9ff4c8", color: "#002113" },
  { initials: "CD", name: "Carol Davis", dept: "HR", basic: "$5,800.00", bonus: "-", deductions: "-$1,100.00", net: "$4,700.00", status: "Processing", bg: "#93ccff", color: "#001d31" },
];

const SalaryReports = ({ onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [period, setPeriod] = useState("October 2023");
  const [dept, setDept] = useState("All Departments");

  return (
    <div className="flex min-h-screen w-full bg-[#f7f9fb] text-[#191c1e]">
      <Sidebar
        activeItem="reports"
        onNavigate={onNavigate}
        subtitle="Admin Portal"
        primaryAction={{
          label: "Export Data",
          icon: "download",
          className: "bg-[#006194] hover:bg-[#076396]",
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
              <button className="px-[16px] py-[8px] bg-white text-[#191c1e] text-[14px] rounded-[8px] border border-[#bfc7d2] hover:bg-[#f2f4f6] transition-colors flex items-center gap-2 active:scale-95">
                <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                Export PDF
              </button>
              <button className="px-[16px] py-[8px] bg-[#004870] text-white text-[14px] rounded-[8px] hover:bg-[#006194] transition-colors flex items-center gap-2 active:scale-95 shadow-sm">
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
                className="w-full h-[40px] px-[12px] bg-[#f2f4f6] border border-[#bfc7d2] rounded-[8px] text-[14px] text-[#191c1e] focus:ring-2 focus:ring-[#004870] focus:border-transparent appearance-none outline-none"
              >
                {["October 2023", "September 2023", "August 2023"].map((p) => (
                  <option key={p}>{p}</option>
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
                className="w-full h-[40px] px-[12px] bg-[#f2f4f6] border border-[#bfc7d2] rounded-[8px] text-[14px] text-[#191c1e] focus:ring-2 focus:ring-[#004870] focus:border-transparent appearance-none outline-none"
              >
                {["All Departments", "Engineering", "Sales", "HR"].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <button className="h-[40px] px-[24px] w-full md:w-auto bg-[#d7dff9] text-[#5a6278] rounded-[8px] text-[14px] font-semibold hover:opacity-90 transition-opacity active:scale-95">
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
                <button className="text-[#40474f] hover:text-[#004870] transition-colors">
                  <span className="material-symbols-outlined text-[18px]">more_vert</span>
                </button>
              </h3>
              <div className="flex-1 relative w-full rounded-[8px] overflow-hidden bg-[#f2f4f6]/50 border border-[#bfc7d2]/30 flex items-end gap-[8px] p-[24px] justify-around">
                {deptBars.map((bar) => (
                  <div
                    key={bar.label}
                    className="w-[64px] rounded-t-[4px] relative group transition-all"
                    style={{ height: `${bar.heightPct}%`, backgroundColor: bar.color }}
                  >
                    <span className="absolute -top-[24px] left-1/2 -translate-x-1/2 text-[12px] text-[#191c1e] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {bar.value}
                    </span>
                    <span className="absolute -bottom-[24px] left-1/2 -translate-x-1/2 text-[12px] text-[#40474f]">
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
                {cycles.map((c) => (
                  <div
                    key={c.period}
                    className="p-[12px] border border-[#bfc7d2] rounded-[8px] flex items-center justify-between hover:bg-[#f2f4f6] transition-colors cursor-pointer group"
                  >
                    <div>
                      <p className="text-[14px] font-semibold text-[#191c1e]">{c.period}</p>
                      <p className="text-[12px] text-[#40474f] mt-1">Processed: {c.processed}</p>
                    </div>
                    <div className="flex items-center gap-[12px]">
                      <span className="px-[8px] py-[4px] rounded-[6px] text-[10px] font-bold uppercase tracking-wider bg-[#026a4814] text-[#005035]">
                        {c.status}
                      </span>
                      <button className="text-[#40474f] group-hover:text-[#004870]">
                        <span className="material-symbols-outlined text-[18px]">download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-[16px] w-full py-[8px] text-[#004870] text-[12px] font-semibold hover:bg-[#f2f4f6] rounded-[8px] transition-colors">
                View All Cycles
              </button>
            </div>
          </div>

          {/* Employee earnings breakdown table */}
          <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#bfc7d2] overflow-hidden">
            <div className="p-[16px] border-b border-[#bfc7d2] bg-[#f2f4f6] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[16px]">
              <h3 className="text-[20px] font-semibold text-[#191c1e]">Employee Earnings Breakdown</h3>
              <div className="relative w-full sm:w-[256px]">
                <span className="material-symbols-outlined absolute left-[12px] top-1/2 -translate-y-1/2 text-[#40474f] text-[18px]">
                  search
                </span>
                <input
                  type="text"
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
                  {earnings.map((e) => (
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
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-[12px] border-t border-[#bfc7d2] flex justify-end items-center gap-[16px] text-[14px] text-[#40474f]">
              <span>Rows per page: 10</span>
              <span>1-3 of 45</span>
              <div className="flex gap-[4px]">
                <button className="p-[4px] hover:bg-[#f2f4f6] rounded-[6px]">
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button className="p-[4px] hover:bg-[#f2f4f6] rounded-[6px]">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

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
