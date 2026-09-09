import React from "react";
import StatCard from "../components/StatCard.jsx";

const ACTIVITY = [
  {
    icon: "check_circle",
    iconBg: "bg-[#86f2e4]",
    iconColor: "text-[#006f66]",
    title: "Leave Request Approved",
    time: "2h ago",
    body: "Your request for 2 days of Annual Leave (Oct 30 - Oct 31) has been approved by Sarah Jenkins.",
  },
  {
    icon: "account_balance_wallet",
    iconBg: "bg-[#d7dff9]",
    iconColor: "text-[#5a6278]",
    title: "Salary Processed",
    time: "Oct 25",
    body: "Your salary for October 2023 has been processed and deposited to your account.",
  },
];

export default function Overview() {
  return (
    <>
      {/* Header / Greeting */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-[12px] text-[#40474f] uppercase tracking-wider mb-1">
            Thursday, Oct 26
          </p>
          <h2 className="text-[28px] md:text-[32px] font-bold text-[#191c1e]">
            Good morning, Alex.
          </h2>
          <p className="text-[15px] text-[#40474f] mt-2 max-w-2xl">
            Here's a quick overview of your current status and recent activities.
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-2 bg-white border border-[#bfc7d2] text-[#191c1e] rounded-lg text-[14px] font-medium hover:bg-[#eff4ff] transition-colors shadow-sm flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#40474f]">download</span>
            Payslip
          </button>
          <button className="flex-1 md:flex-none px-4 py-2 bg-[#006194] text-white rounded-lg text-[14px] font-medium hover:bg-[#004870] transition-colors shadow-sm active:scale-95 duration-200 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Request
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <StatCard
            title="Oct Attendance"
            icon="calendar_month"
            iconBg="bg-[#d7dff9]"
            iconColor="text-[#5a6278]"
            value={18}
            suffix="/ 22 Days"
            progress={82}
            footer="On track for perfect attendance this month."
            decorativeColor="bg-[#006194]"
          />
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#bfc7d2] flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-[2px] transition-transform duration-300">
            <div className="flex justify-between items-start z-10">
              <h3 className="text-[16px] font-semibold text-[#191c1e]">Leave Balance</h3>
              <div className="p-2 bg-[#ffdcc0] rounded-lg text-[#894d00]">
                <span className="material-symbols-outlined text-[20px]">flight_takeoff</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2 z-10">
              <span className="text-4xl font-bold tabular-nums text-[#191c1e] tracking-tight">12</span>
              <span className="text-[14px] text-[#40474f]">Days</span>
            </div>
            <div className="flex gap-2 mt-2 z-10">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#ffdcc0] text-[#894d00]">
                8 Annual
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#e6e8ea] text-[#40474f]">
                4 Sick
              </span>
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#894d00] opacity-20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500" />
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="lg:col-span-4 bg-[#006194] text-white p-6 rounded-xl shadow-sm flex flex-col gap-4 relative overflow-hidden">
          <div className="z-10 flex flex-col h-full justify-between">
            <div>
              <h3 className="text-[16px] font-semibold mb-2">Quick Actions</h3>
              <p className="text-[14px] text-white/80">
                What do you need to do today?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button className="bg-white/10 hover:bg-white/20 p-3 rounded-lg flex flex-col items-center gap-2 transition-colors border border-white/10">
                <span className="material-symbols-outlined text-[22px]">event_available</span>
                <span className="text-[12px]">Request Leave</span>
              </button>
              <button className="bg-white/10 hover:bg-white/20 p-3 rounded-lg flex flex-col items-center gap-2 transition-colors border border-white/10">
                <span className="material-symbols-outlined text-[22px]">receipt_long</span>
                <span className="text-[12px]">View Payslip</span>
              </button>
            </div>
          </div>
          <div
            className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 100% 0%, rgba(255,255,255,0.2) 0%, transparent 60%)",
            }}
          />
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-[#bfc7d2] overflow-hidden">
          <div className="p-5 border-b border-[#bfc7d2] bg-[#eff4ff] flex justify-between items-center">
            <h3 className="text-[16px] font-semibold text-[#191c1e]">Recent Activity</h3>
            <button className="text-[#006194] text-[12px] font-medium hover:underline">
              View All
            </button>
          </div>
          <div className="flex flex-col">
            {ACTIVITY.map((item) => (
              <div
                key={item.title}
                className="p-4 border-b border-[#bfc7d2] last:border-b-0 flex gap-4 hover:bg-[#eff4ff]/50 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-full ${item.iconBg} ${item.iconColor} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-[14px] font-semibold text-[#191c1e]">
                      {item.title}
                    </h4>
                    <span className="text-[12px] text-[#40474f]">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-[14px] text-[#40474f]">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
