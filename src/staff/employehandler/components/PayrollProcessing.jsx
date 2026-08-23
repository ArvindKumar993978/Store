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

  return (
    <div className="flex min-h-screen w-full bg-[#f7f9fb] text-[#191c1e]">
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
              <button className="flex-1 md:flex-none px-[24px] py-[12px] rounded-[8px] border border-[#bfc7d2] text-[#191c1e] text-[12px] font-semibold tracking-[0.05em] hover:bg-[#f2f4f6] transition-colors active:scale-95">
                Export Report
              </button>
              <button className="flex-1 md:flex-none px-[24px] py-[12px] rounded-[8px] bg-[#004870] text-white text-[12px] font-semibold tracking-[0.05em] hover:opacity-90 transition-opacity active:scale-95 flex items-center justify-center gap-2 shadow-sm">
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
                  {payrollRows.map((r) => (
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
                        <button className="text-[#40474f] hover:text-[#004870] opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="material-symbols-outlined text-[20px]">
                            {r.status === "Paid" ? "visibility" : "edit"}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-[16px] border-t border-[#bfc7d2] flex flex-col sm:flex-row justify-between items-center gap-[12px] text-[14px] text-[#40474f]">
              <span>Showing 1 to 3 of 124 entries</span>
              <div className="flex gap-[8px]">
                <button className="px-[12px] py-[4px] rounded-[6px] border border-[#bfc7d2] hover:bg-[#f2f4f6] disabled:opacity-50" disabled>
                  Prev
                </button>
                <button className="px-[12px] py-[4px] rounded-[6px] bg-[#004870] text-white">1</button>
                <button className="px-[12px] py-[4px] rounded-[6px] border border-[#bfc7d2] hover:bg-[#f2f4f6]">2</button>
                <button className="px-[12px] py-[4px] rounded-[6px] border border-[#bfc7d2] hover:bg-[#f2f4f6]">3</button>
                <span className="px-[8px] py-[4px]">...</span>
                <button className="px-[12px] py-[4px] rounded-[6px] border border-[#bfc7d2] hover:bg-[#f2f4f6]">Next</button>
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
