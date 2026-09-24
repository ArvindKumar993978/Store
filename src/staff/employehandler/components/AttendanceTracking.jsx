import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import TopNav from "./TopNav.jsx";
import MetricCard from "./MetricCard.jsx";
import FilterBar from "./FilterBar.jsx";
import AttendanceTable from "./AttendanceTable.jsx";

const AttendanceTracking = ({ onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleExportAttendance = () => {
    const headers = ["Employee", "ID", "Department", "Clock In", "Clock Out", "Total Hours", "Status"];
    const rows = [
      ["John Doe", "EMP-001", "Engineering", "08:55 AM", "05:30 PM", "8h 35m", "PRESENT"],
      ["Jane Smith", "EMP-042", "Sales", "09:15 AM", "06:00 PM", "8h 45m", "LATE"],
      ["Robert Johnson", "EMP-088", "HR", "--:--", "--:--", "0h 0m", "ON LEAVE"],
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `daily_attendance_record.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f7f9fb] text-[#191c1e]">
      <Sidebar
        activeItem="attendance"
        onNavigate={onNavigate}
        subtitle="Admin Portal"
        primaryAction={{
          label: "Export Data",
          icon: "download",
          className: "bg-[#006194] hover:bg-[#076396]",
          onClick: handleExportAttendance,
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[16px] mb-[32px]">
            <div>
              <h2 className="text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] font-bold text-[#191c1e] tracking-[-0.01em] md:tracking-[-0.02em]">
                Attendance Tracking
              </h2>
              <p className="text-[14px] text-[#40474f] mt-1">
                Monitor staff presence and manage daily records.
              </p>
            </div>
            <button 
              onClick={handleExportAttendance}
              className="bg-[#006194] text-white text-[12px] font-semibold tracking-[0.05em] py-[10px] px-[20px] rounded-[8px] active:scale-95 transition-transform shadow-sm hover:bg-[#076396] flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export Attendance
            </button>
          </div>

          {/* Summary bento grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px] mb-[32px]">
            <MetricCard
              icon="check_circle"
              iconBg="#026a481a"
              iconColor="#026a48"
              iconShape="rounded"
              iconSize={32}
              iconPosition="right"
              uppercaseLabel
              label="Present Today"
              value="142"
              delta={{ text: "2%", direction: "up", colorClass: "text-[#026a48]" }}
            />
            <MetricCard
              icon="beach_access"
              iconBg="#d7dff9"
              iconColor="#5a6278"
              iconShape="rounded"
              iconSize={32}
              iconPosition="right"
              uppercaseLabel
              label="On Leave"
              value="12"
            />
            <MetricCard
              icon="schedule"
              iconBg="#ffdad64d"
              iconColor="#ba1a1a"
              iconShape="rounded"
              iconSize={32}
              iconPosition="right"
              uppercaseLabel
              label="Late Arrivals"
              value="8"
              delta={{ text: "5%", direction: "up", colorClass: "text-[#ba1a1a]" }}
            />
            <MetricCard
              icon="groups"
              iconBg="#cce5ff"
              iconColor="#001d31"
              iconShape="rounded"
              iconSize={32}
              iconPosition="right"
              uppercaseLabel
              label="Total Staff"
              value="162"
            />
          </div>

          <FilterBar />
          <AttendanceTable />
        </main>
      </div>

      {/* Simple mobile drawer for the sidebar links, since this page's
          TopNav carries its own menu toggle instead of a separate
          MobileHeader/BottomNav pair. */}
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
              activeItem="attendance"
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

export default AttendanceTracking;
