import React from "react";
import {
  Download,
  Plus,
  CalendarDays,
  PlaneTakeoff,
  CalendarClock,
  Receipt,
  CheckCircle2,
  Wallet,
} from "../components/icons.jsx";
import StatCard from "../components/StatCard.jsx";

const ACTIVITY = [
  {
    icon: CheckCircle2,
    iconBg: "bg-tertiary-fixed-dim/20",
    iconColor: "text-tertiary",
    title: "Leave Request Approved",
    time: "2h ago",
    body: "Your request for 2 days of Annual Leave (Oct 30 - Oct 31) has been approved by Sarah Jenkins.",
  },
  {
    icon: Wallet,
    iconBg: "bg-primary-fixed/30",
    iconColor: "text-primary",
    title: "Salary Processed",
    time: "Oct 25",
    body: "Your salary for October 2023 has been processed and deposited to your account.",
  },
];

export default function Overview() {
  return (
    <>
      {/* Header / Greeting */}
      <div className="mb-gutter flex flex-col md:flex-row justify-between items-start md:items-end gap-stack-md">
        <div>
          <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1">
            Thursday, Oct 26
          </p>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Good morning, Alex.
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
            Here's a quick overview of your current status and recent activities.
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-2 bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg font-body-md text-body-md font-medium hover:bg-surface-container-low transition-colors shadow-sm flex items-center justify-center gap-2">
            <Download size={18} className="text-on-surface-variant" />
            Payslip
          </button>
          <button className="flex-1 md:flex-none px-4 py-2 bg-primary-container text-on-primary rounded-lg font-body-md text-body-md font-medium hover:bg-primary transition-colors shadow-sm active:scale-95 duration-200 flex items-center justify-center gap-2">
            <Plus size={18} />
            New Request
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-4">
          <StatCard
            title="Oct Attendance"
            icon={CalendarDays}
            iconBg="bg-secondary-container"
            iconColor="text-on-secondary-container"
            value={18}
            suffix="/ 22 Days"
            progress={82}
            footer="On track for perfect attendance this month."
            decorativeColor="bg-primary-fixed"
          />
        </div>

        <div className="lg:col-span-4">
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-[2px] transition-transform duration-300">
            <div className="flex justify-between items-start z-10">
              <h3 className="font-headline-md text-headline-md text-on-surface">Leave Balance</h3>
              <div className="p-2 bg-tertiary-fixed rounded-lg text-on-tertiary-fixed">
                <PlaneTakeoff size={20} />
              </div>
            </div>
            <div className="flex items-baseline gap-2 z-10">
              <span className="text-4xl font-bold font-tabular-nums text-on-surface tracking-tight">12</span>
              <span className="font-body-md text-body-md text-on-surface-variant">Days</span>
            </div>
            <div className="flex gap-2 mt-2 z-10">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-tertiary-fixed-dim/20 text-tertiary">
                8 Annual
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-surface-container-highest text-on-surface-variant">
                4 Sick
              </span>
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-tertiary-fixed opacity-20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500" />
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="lg:col-span-4 bg-primary-container text-on-primary p-6 rounded-xl shadow-sm flex flex-col gap-4 relative overflow-hidden">
          <div className="z-10 flex flex-col h-full justify-between">
            <div>
              <h3 className="font-headline-md text-headline-md mb-2">Quick Actions</h3>
              <p className="font-body-md text-body-md text-on-primary-container opacity-90">
                What do you need to do today?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button className="bg-on-primary/10 hover:bg-on-primary/20 p-3 rounded-lg flex flex-col items-center gap-2 transition-colors border border-on-primary/10">
                <CalendarClock size={22} />
                <span className="font-label-md text-label-md">Request Leave</span>
              </button>
              <button className="bg-on-primary/10 hover:bg-on-primary/20 p-3 rounded-lg flex flex-col items-center gap-2 transition-colors border border-on-primary/10">
                <Receipt size={22} />
                <span className="font-label-md text-label-md">View Payslip</span>
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
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
          <div className="p-5 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
            <h3 className="font-headline-md text-headline-md text-on-surface">Recent Activity</h3>
            <button className="text-primary font-label-md text-label-md hover:underline">
              View All
            </button>
          </div>
          <div className="flex flex-col">
            {ACTIVITY.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-4 border-b border-outline-variant last:border-b-0 flex gap-4 hover:bg-surface-container-low/50 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-full ${item.iconBg} ${item.iconColor} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-body-md text-body-md font-semibold text-on-surface">
                        {item.title}
                      </h4>
                      <span className="font-label-md text-label-md text-on-surface-variant">
                        {item.time}
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant">{item.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
