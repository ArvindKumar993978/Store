import React from "react";
import Sidebar from "./Sidebar.jsx";
import TopNav from "./TopNav.jsx";
import MobileHeader from "./MobileHeader.jsx";
import BottomNav from "./BottomNav.jsx";
import MetricCard from "./MetricCard.jsx";
import StaffTable from "./StaffTable.jsx";

const Dashboard = ({ onNavigate }) => {
  const handleExportSummary = () => {
    const headers = ["Metric", "Value", "Status Note"];
    const rows = [
      ["Total Staff", "142", "+3 this month"],
      ["Present Today", "128", "90.1% attendance rate"],
      ["On Leave", "14", "8 approved, 6 sick"],
      ["Pending Payroll", "$42,000.00", "Due in 2 days"],
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `staff_attendance_summary.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f7f9fb] text-[#191c1e]">
      <MobileHeader />
      <Sidebar activeItem="dashboard" onNavigate={onNavigate} />
      <TopNav variant="pill" />

      <main className="flex-1 md:ml-[280px] md:mt-[64px] p-[16px] md:p-[32px] max-w-[1280px] mx-auto w-full">
        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-[32px] gap-[16px]">
          <div>
            <h2 className="text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] font-bold text-[#191c1e] tracking-[-0.01em] md:tracking-[-0.02em]">
              Overview
            </h2>
            <p className="text-[16px] text-[#40474f] mt-1">
              Today's Staff Attendance &amp; Payroll Status
            </p>
          </div>
          <div className="flex gap-[12px]">
            <button 
              onClick={handleExportSummary}
              className="px-[16px] py-[8px] bg-[#f2f4f6] text-[#191c1e] text-[12px] font-semibold tracking-[0.05em] rounded-[8px] border border-[#bfc7d2] hover:bg-[#e0e3e5] transition-colors flex items-center gap-2 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export Report
            </button>
            <button 
              onClick={() => onNavigate?.("attendance")}
              className="px-[16px] py-[8px] bg-[#004870] text-white text-[12px] font-semibold tracking-[0.05em] rounded-[8px] hover:bg-[#006194] active:scale-95 transition-all flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              Record Attendance
            </button>
          </div>
        </div>

        {/* Bento grid: key metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px] mb-[32px]">
          <div onClick={() => onNavigate?.("staff")} className="cursor-pointer">
            <MetricCard
              icon="group"
              iconBg="#cce5ff"
              iconColor="#001d31"
              label="Total Staff"
              value="142"
              footer={
                <p className="text-[14px] text-[#005035] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  +3 this month
                </p>
              }
            />
          </div>
          <div onClick={() => onNavigate?.("attendance")} className="cursor-pointer">
            <MetricCard
              icon="how_to_reg"
              iconBg="#9ff4c8"
              iconColor="#002113"
              label="Present Today"
              value="128"
              footer={<p className="text-[14px] text-[#40474f]">90.1% attendance rate</p>}
            />
          </div>
          <div onClick={() => onNavigate?.("attendance")} className="cursor-pointer">
            <MetricCard
              icon="event_busy"
              iconBg="#dae2fc"
              iconColor="#131b2e"
              label="On Leave"
              value="14"
              footer={<p className="text-[14px] text-[#40474f]">8 approved, 6 sick</p>}
            />
          </div>
          <div onClick={() => onNavigate?.("payroll")} className="cursor-pointer">
            <MetricCard
              icon="payments"
              iconBg="#ffdad6"
              iconColor="#93000a"
              label="Pending Payroll"
              value="$42k"
              accent
              footer={
                <p className="text-[14px] text-[#ba1a1a] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">warning</span>
                  Due in 2 days
                </p>
              }
            />
          </div>
        </div>

        {/* Staff table */}
        <StaffTable onNavigate={onNavigate} />
      </main>

      <BottomNav activeItem="dashboard" onNavigate={onNavigate} />
    </div>
  );
};

export default Dashboard;
