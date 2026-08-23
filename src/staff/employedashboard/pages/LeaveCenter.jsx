import React, { useState } from "react";
import { Plus, Coffee, Stethoscope, Umbrella, Eye, ChevronLeft, ChevronRight, X } from "../components/icons.jsx";
import StatCard from "../components/StatCard.jsx";

const REQUESTS = [
  {
    type: "Earned Leave",
    dot: "bg-primary-container",
    dates: "Oct 12 - Oct 15",
    days: 4,
    status: "Approved",
    statusClass: "bg-tertiary/10 text-tertiary",
  },
  {
    type: "Sick Leave",
    dot: "bg-error",
    dates: "Nov 02 - Nov 03",
    days: 2,
    status: "Pending",
    statusClass: "bg-secondary/10 text-secondary",
  },
  {
    type: "Casual Leave",
    dot: "bg-outline",
    dates: "Sep 05 - Sep 05",
    days: 1,
    status: "Rejected",
    statusClass: "bg-error/10 text-error",
  },
];

const CALENDAR_DAYS = [
  { day: 29, muted: true },
  { day: 30, muted: true },
  { day: 31, muted: true },
  { day: 1 },
  { day: 2, tag: "Sick Leave (Pending)" },
  { day: 3, tag: "Sick Leave (Pending)" },
  { day: 4 },
  { day: 5 },
  { day: 6 },
  { day: 7 },
  { day: 8 },
];

export default function LeaveCenter() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-stack-lg">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Leave Center
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Manage your time off requests and view balances.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-primary-container text-on-primary py-2 px-4 rounded-xl font-body-md text-body-md font-semibold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-sm"
        >
          <Plus size={20} />
          Request Leave
        </button>
      </div>

      {/* Balances Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <StatCard
          title="Casual Leave"
          icon={Coffee}
          iconBg="bg-transparent"
          iconColor="text-secondary"
          value={8}
          suffix="/ 12 days"
          progress={67}
          progressColor="bg-primary-container"
          decorativeColor="bg-secondary"
        />
        <StatCard
          title="Sick Leave"
          icon={Stethoscope}
          iconBg="bg-transparent"
          iconColor="text-tertiary"
          value={4}
          suffix="/ 10 days"
          progress={40}
          progressColor="bg-tertiary"
          decorativeColor="bg-tertiary"
        />
        <StatCard
          title="Earned Leave"
          icon={Umbrella}
          iconBg="bg-transparent"
          iconColor="text-primary"
          value={15}
          suffix="/ 20 days"
          progress={75}
          progressColor="bg-primary-fixed-dim"
          decorativeColor="bg-primary"
        />
      </section>

      {/* Main Layout: 2 Columns */}
      <div className="flex flex-col lg:flex-row gap-gutter">
        {/* Left Column: Leave History */}
        <div className="flex-1 flex flex-col gap-stack-md">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Recent Requests</h3>
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="p-4 font-label-md text-label-md text-on-surface-variant">Type</th>
                    <th className="p-4 font-label-md text-label-md text-on-surface-variant">Dates</th>
                    <th className="p-4 font-label-md text-label-md text-on-surface-variant">Days</th>
                    <th className="p-4 font-label-md text-label-md text-on-surface-variant">Status</th>
                    <th className="p-4 font-label-md text-label-md text-on-surface-variant">Action</th>
                  </tr>
                </thead>
                <tbody className="font-body-md text-body-md">
                  {REQUESTS.map((req) => (
                    <tr
                      key={`${req.type}-${req.dates}`}
                      className="border-b last:border-b-0 border-outline-variant hover:bg-surface-container-low transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${req.dot}`} />
                          {req.type}
                        </div>
                      </td>
                      <td className="p-4 font-tabular-nums">{req.dates}</td>
                      <td className="p-4 font-tabular-nums">{req.days}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-label-md text-label-md ${req.statusClass}`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button className="text-secondary hover:text-primary transition-colors">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Calendar */}
        <div className="w-full lg:w-80 flex flex-col gap-stack-md shrink-0">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Upcoming Calendar</h3>
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <button className="text-on-surface-variant hover:text-primary">
                <ChevronLeft size={20} />
              </button>
              <span className="font-body-md text-body-md font-semibold">November 2023</span>
              <button className="text-on-surface-variant hover:text-primary">
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center font-label-md text-label-md text-on-surface-variant mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center font-tabular-nums text-on-surface">
              {CALENDAR_DAYS.map((d, i) => (
                <div
                  key={i}
                  className={`py-1 rounded relative group cursor-pointer ${
                    d.muted
                      ? "text-outline"
                      : d.tag
                      ? "bg-secondary/10 text-secondary font-bold"
                      : "hover:bg-surface-container-high"
                  }`}
                >
                  {d.day}
                  {d.tag && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block w-max p-1 bg-inverse-surface text-inverse-on-surface text-[10px] rounded">
                      {d.tag}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Request Leave Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary"
            >
              <X size={20} />
            </button>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Request Leave</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="input-label">Leave Type</label>
                <select className="input-field">
                  <option>Casual Leave</option>
                  <option>Sick Leave</option>
                  <option>Earned Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Start Date</label>
                  <input type="date" className="input-field" />
                </div>
                <div>
                  <label className="input-label">End Date</label>
                  <input type="date" className="input-field" />
                </div>
              </div>
              <div>
                <label className="input-label">Reason</label>
                <textarea className="input-field h-24 py-2" placeholder="Optional note for your manager" />
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="bg-primary-container text-on-primary py-2 rounded-lg font-body-md font-semibold hover:bg-primary transition-colors mt-2"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
