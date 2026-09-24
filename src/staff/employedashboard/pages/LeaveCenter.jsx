import React, { useState } from "react";
import StatCard from "../components/StatCard.jsx";

const REQUESTS = [
  {
    type: "Earned Leave",
    dot: "bg-[#006194]",
    dates: "Oct 12 - Oct 15",
    days: 4,
    status: "Approved",
    statusClass: "bg-[#86f2e4] text-[#006f66]",
  },
  {
    type: "Sick Leave",
    dot: "bg-[#ba1a1a]",
    dates: "Nov 02 - Nov 03",
    days: 2,
    status: "Pending",
    statusClass: "bg-[#d7dff9] text-[#5a6278]",
  },
  {
    type: "Casual Leave",
    dot: "bg-[#bfc7d2]",
    dates: "Sep 05 - Sep 05",
    days: 1,
    status: "Rejected",
    statusClass: "bg-[#ffdad6] text-[#93000a]",
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
  const [requests, setRequests] = useState(REQUESTS);
  const [selectedReq, setSelectedReq] = useState(null);
  const [successToast, setSuccessToast] = useState(null);
  const [monthIndex, setMonthIndex] = useState(0);

  const months = ["November 2023", "December 2023", "January 2024"];

  // Form fields
  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const startFormatted = start.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
    const endFormatted = end.toLocaleDateString("en-US", { month: "short", day: "2-digit" });

    const newReq = {
      type: leaveType,
      dot: leaveType === "Sick Leave" ? "bg-[#ba1a1a]" : leaveType === "Casual Leave" ? "bg-[#bfc7d2]" : "bg-[#006194]",
      dates: `${startFormatted} - ${endFormatted}`,
      days: diffDays,
      status: "Pending",
      statusClass: "bg-[#d7dff9] text-[#5a6278]",
      reason: reason || "No notes provided.",
    };

    setRequests([newReq, ...requests]);
    setModalOpen(false);
    setStartDate("");
    setEndDate("");
    setReason("");
    setSuccessToast(`Leave request for ${diffDays} day(s) submitted for approval.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="flex flex-col gap-8 relative">
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed top-4 right-4 z-50 bg-[#004870] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-[#86f2e4]">check_circle</span>
          <span className="text-[14px] font-medium">{successToast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#191c1e]">
            Leave Center
          </h1>
          <p className="text-[14px] text-[#40474f] mt-1">
            Manage your time off requests and view balances.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#006194] text-white py-2 px-4 rounded-xl text-[14px] font-semibold flex items-center gap-2 hover:bg-[#004870] active:scale-95 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Request Leave
        </button>
      </div>

      {/* Balances Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Casual Leave"
          icon="local_cafe"
          iconBg="bg-[#d7dff9]"
          iconColor="text-[#5a6278]"
          value={8}
          suffix="/ 12 days"
          progress={67}
          progressColor="bg-[#006194]"
          decorativeColor="bg-[#006194]"
        />
        <StatCard
          title="Sick Leave"
          icon="medical_services"
          iconBg="bg-[#ffdcc0]"
          iconColor="text-[#894d00]"
          value={4}
          suffix="/ 10 days"
          progress={40}
          progressColor="bg-[#894d00]"
          decorativeColor="bg-[#894d00]"
        />
        <StatCard
          title="Earned Leave"
          icon="beach_access"
          iconBg="bg-[#86f2e4]"
          iconColor="text-[#006f66]"
          value={15}
          suffix="/ 20 days"
          progress={75}
          progressColor="bg-[#006a61]"
          decorativeColor="bg-[#006a61]"
        />
      </section>

      {/* Main Layout: 2 Columns */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Leave History */}
        <div className="flex-1 flex flex-col gap-4">
          <h3 className="text-[16px] font-semibold text-[#191c1e] mb-2">Recent Requests</h3>
          <div className="bg-white rounded-xl shadow-sm border border-[#bfc7d2] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#eff4ff] border-b border-[#bfc7d2]">
                    <th className="p-4 text-[12px] text-[#40474f] uppercase tracking-wider">Type</th>
                    <th className="p-4 text-[12px] text-[#40474f] uppercase tracking-wider">Dates</th>
                    <th className="p-4 text-[12px] text-[#40474f] uppercase tracking-wider">Days</th>
                    <th className="p-4 text-[12px] text-[#40474f] uppercase tracking-wider">Status</th>
                    <th className="p-4 text-[12px] text-[#40474f] uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="text-[14px]">
                  {requests.map((req, idx) => (
                    <tr
                      key={idx}
                      className="border-b last:border-b-0 border-[#bfc7d2] hover:bg-[#eff4ff] transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${req.dot}`} />
                          {req.type}
                        </div>
                      </td>
                      <td className="p-4 tabular-nums">{req.dates}</td>
                      <td className="p-4 tabular-nums">{req.days}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium ${req.statusClass}`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => setSelectedReq(req)}
                          className="text-[#5a6278] hover:text-[#006194] transition-colors p-1.5 rounded-lg hover:bg-[#eff4ff]"
                          title="View Request Details"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
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
        <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
          <h3 className="text-[16px] font-semibold text-[#191c1e] mb-2">Upcoming Calendar</h3>
          <div className="bg-white rounded-xl shadow-sm border border-[#bfc7d2] p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setMonthIndex((prev) => (prev > 0 ? prev - 1 : months.length - 1))}
                className="text-[#40474f] hover:text-[#006194] p-1 rounded hover:bg-[#eff4ff]"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <span className="text-[14px] font-semibold text-[#191c1e]">{months[monthIndex]}</span>
              <button 
                onClick={() => setMonthIndex((prev) => (prev < months.length - 1 ? prev + 1 : 0))}
                className="text-[#40474f] hover:text-[#006194] p-1 rounded hover:bg-[#eff4ff]"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[12px] text-[#40474f] mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center tabular-nums text-[#191c1e]">
              {CALENDAR_DAYS.map((d, i) => (
                <div
                  key={i}
                  className={`py-1 rounded relative group cursor-pointer ${
                    d.muted
                      ? "text-[#bfc7d2]"
                      : d.tag
                      ? "bg-[#d7dff9] text-[#5a6278] font-bold"
                      : "hover:bg-[#e6e8ea]"
                  }`}
                >
                  {d.day}
                  {d.tag && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block w-max p-1 bg-[#191c1e] text-white text-[10px] rounded">
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
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-[#40474f] hover:text-[#006194]"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <h3 className="text-[16px] font-semibold text-[#191c1e] mb-4">Request Leave</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-[12px] text-[#40474f] mb-1 block">Leave Type</label>
                <select 
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full h-[44px] px-3 rounded-lg border border-[#bfc7d2] bg-white text-[14px] text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#006194]"
                >
                  <option>Casual Leave</option>
                  <option>Sick Leave</option>
                  <option>Earned Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] text-[#40474f] mb-1 block">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-[44px] px-3 rounded-lg border border-[#bfc7d2] bg-white text-[14px] text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#006194]"
                  />
                </div>
                <div>
                  <label className="text-[12px] text-[#40474f] mb-1 block">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-[44px] px-3 rounded-lg border border-[#bfc7d2] bg-white text-[14px] text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#006194]"
                  />
                </div>
              </div>
              <div>
                <label className="text-[12px] text-[#40474f] mb-1 block">Reason</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full py-2 px-3 h-24 rounded-lg border border-[#bfc7d2] bg-white text-[14px] text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#006194]"
                  placeholder="Optional note for your manager"
                />
              </div>
              <button
                type="submit"
                className="bg-[#006194] text-white py-2.5 rounded-lg text-[14px] font-semibold hover:bg-[#004870] transition-colors mt-2 shadow-sm"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Request Details Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
            <div className="flex justify-between items-center pb-3 border-b border-[#bfc7d2]">
              <h3 className="text-[16px] font-bold text-[#191c1e]">Leave Details</h3>
              <button
                onClick={() => setSelectedReq(null)}
                className="text-[#40474f] hover:text-[#006194]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="py-4 space-y-3 text-[14px]">
              <div className="flex justify-between">
                <span className="text-[#40474f]">Leave Type:</span>
                <span className="font-semibold text-[#191c1e]">{selectedReq.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#40474f]">Duration:</span>
                <span className="font-medium text-[#191c1e]">{selectedReq.dates} ({selectedReq.days} days)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#40474f]">Status:</span>
                <span className={`px-2 py-0.5 rounded-full text-[12px] font-semibold ${selectedReq.statusClass}`}>
                  {selectedReq.status}
                </span>
              </div>
              {selectedReq.reason && (
                <div className="pt-2">
                  <span className="text-[#40474f] block text-[12px] mb-1">Reason / Notes:</span>
                  <p className="bg-[#eff4ff] p-3 rounded-lg text-[13px] text-[#191c1e]">
                    {selectedReq.reason}
                  </p>
                </div>
              )}
            </div>
            <div className="pt-3 border-t border-[#bfc7d2] flex justify-end">
              <button
                onClick={() => setSelectedReq(null)}
                className="px-4 py-2 bg-[#006194] text-white rounded-lg text-[13px] font-semibold hover:bg-[#004870]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
