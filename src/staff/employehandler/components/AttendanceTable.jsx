import React, { useState } from "react";
/*
  Status pill colors:
    PRESENT  -> bg #026a481a text #026a48
    LATE     -> bg #ffdad64d text #ba1a1a
    ON LEAVE -> bg #e0e3e5   text #40474f
*/

const records = [
  {
    initials: "JD",
    name: "John Doe",
    id: "EMP-001",
    dept: "Engineering",
    clockIn: "08:55 AM",
    clockOut: "05:30 PM",
    lateIn: false,
    hours: "8h 35m",
    status: "PRESENT",
  },
  {
    initials: "JS",
    name: "Jane Smith",
    id: "EMP-042",
    dept: "Sales",
    clockIn: "09:15 AM",
    clockOut: "06:00 PM",
    lateIn: true,
    hours: "8h 45m",
    status: "LATE",
  },
  {
    initials: "RJ",
    name: "Robert Johnson",
    id: "EMP-088",
    dept: "HR",
    clockIn: "--:--",
    clockOut: "--:--",
    lateIn: false,
    hours: "0h 0m",
    status: "ON LEAVE",
    dimmed: true,
  },
];

const statusStyles = {
  PRESENT: { bg: "#026a481a", color: "#026a48" },
  LATE: { bg: "#ffdad64d", color: "#ba1a1a" },
  "ON LEAVE": { bg: "#e0e3e5", color: "#40474f" },
};

const StatusPill = ({ status }) => {
  const s = statusStyles[status];
  return (
    <span
      className="inline-flex items-center px-[8px] py-[4px] rounded-full text-[11px] font-bold tracking-wide"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {status}
    </span>
  );
};

const AttendanceTable = () => {
  const [data, setData] = useState(records);
  const [adjusting, setAdjusting] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [page, setPage] = useState(1);

  const [editClockIn, setEditClockIn] = useState("");
  const [editClockOut, setEditClockOut] = useState("");
  const [editStatus, setEditStatus] = useState("PRESENT");

  const startAdjust = (r) => {
    setAdjusting(r);
    setEditClockIn(r.clockIn);
    setEditClockOut(r.clockOut);
    setEditStatus(r.status);
  };

  const handleSaveAdjust = (e) => {
    e.preventDefault();
    if (!adjusting) return;
    setData((prev) =>
      prev.map((item) =>
        item.id === adjusting.id
          ? {
              ...item,
              clockIn: editClockIn,
              clockOut: editClockOut,
              status: editStatus,
              lateIn: editStatus === "LATE",
              dimmed: editStatus === "ON LEAVE",
            }
          : item
      )
    );
    setAdjusting(null);
  };

  return (
    <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#bfc7d2] overflow-hidden relative">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f2f4f6] border-b border-[#bfc7d2]/50">
              <th className="p-[16px] text-[12px] tracking-[0.05em] font-semibold text-[#40474f] uppercase">
                Employee
              </th>
              <th className="p-[16px] text-[12px] tracking-[0.05em] font-semibold text-[#40474f] uppercase">
                Department
              </th>
              <th className="p-[16px] text-[12px] tracking-[0.05em] font-semibold text-[#40474f] uppercase">
                Clock In/Out
              </th>
              <th className="p-[16px] text-[12px] tracking-[0.05em] font-semibold text-[#40474f] uppercase">
                Total Hours
              </th>
              <th className="p-[16px] text-[12px] tracking-[0.05em] font-semibold text-[#40474f] uppercase">
                Status
              </th>
              <th className="p-[16px] text-[12px] tracking-[0.05em] font-semibold text-[#40474f] uppercase text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-[14px] text-[#191c1e] divide-y divide-[#bfc7d2]/20">
            {data.map((r) => (
              <tr key={r.id} className="hover:bg-[#f2f4f6]/50 transition-colors group">
                <td className="p-[16px]">
                  <div className="flex items-center gap-[12px]">
                    <div className="w-[32px] h-[32px] rounded-full bg-[#d7dff9] flex items-center justify-center text-[#5a6278] font-bold text-[12px]">
                      {r.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-[#191c1e]">{r.name}</div>
                      <div className="text-[#40474f] text-[12px]">{r.id}</div>
                    </div>
                  </div>
                </td>
                <td className="p-[16px] text-[#40474f]">{r.dept}</td>
                <td className="p-[16px]">
                  <div className={r.dimmed ? "text-[#717880]" : r.lateIn ? "text-[#ba1a1a]" : "text-[#191c1e]"}>
                    {r.clockIn}
                  </div>
                  <div className={`text-[12px] ${r.dimmed ? "text-[#717880]" : "text-[#40474f]"}`}>
                    {r.clockOut}
                  </div>
                </td>
                <td className={`p-[16px] ${r.dimmed ? "text-[#717880]" : "text-[#191c1e]"}`}>{r.hours}</td>
                <td className="p-[16px]">
                  <StatusPill status={r.status} />
                </td>
                <td className="p-[16px] text-right">
                  <div className="flex items-center justify-end gap-[8px]">
                    <button
                      onClick={() => startAdjust(r)}
                      title="Adjust Entry"
                      className="p-[6px] text-[#40474f] hover:text-[#004870] hover:bg-[#e6e8ea] rounded-[6px] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={() => setViewing(r)}
                      title="View Details"
                      className="p-[6px] text-[#40474f] hover:text-[#004870] hover:bg-[#e6e8ea] rounded-[6px] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-[16px] border-t border-[#bfc7d2]/30 flex items-center justify-between">
        <span className="text-[14px] text-[#40474f]">Showing 1 to {data.length} entries</span>
        <div className="flex gap-[4px]">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-[32px] h-[32px] flex items-center justify-center rounded-[6px] border border-[#bfc7d2]/50 text-[#717880] disabled:opacity-50 hover:bg-[#f2f4f6]"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-[32px] h-[32px] flex items-center justify-center rounded-[6px] text-[12px] font-semibold ${
                page === p
                  ? "bg-[#006194] text-white"
                  : "border border-[#bfc7d2]/50 text-[#191c1e] hover:bg-[#f2f4f6]"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(3, p + 1))}
            disabled={page === 3}
            className="w-[32px] h-[32px] flex items-center justify-center rounded-[6px] border border-[#bfc7d2]/50 text-[#191c1e] hover:bg-[#f2f4f6] disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Adjust Entry Modal */}
      {adjusting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm relative">
            <div className="flex justify-between items-center pb-3 border-b border-[#bfc7d2]">
              <h3 className="text-[16px] font-bold text-[#191c1e]">Adjust Attendance Entry</h3>
              <button onClick={() => setAdjusting(null)} className="text-[#707881]">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveAdjust} className="space-y-4 pt-3 text-[13px]">
              <div>
                <label className="text-[#40474f] block font-medium mb-1">Employee</label>
                <div className="font-semibold text-[#191c1e]">{adjusting.name} ({adjusting.id})</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#40474f] block font-medium mb-1">Clock In</label>
                  <input
                    type="text"
                    value={editClockIn}
                    onChange={(e) => setEditClockIn(e.target.value)}
                    className="w-full px-3 py-2 border border-[#bfc7d2] rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-[#006194]"
                  />
                </div>
                <div>
                  <label className="text-[#40474f] block font-medium mb-1">Clock Out</label>
                  <input
                    type="text"
                    value={editClockOut}
                    onChange={(e) => setEditClockOut(e.target.value)}
                    className="w-full px-3 py-2 border border-[#bfc7d2] rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-[#006194]"
                  />
                </div>
              </div>
              <div>
                <label className="text-[#40474f] block font-medium mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-[#bfc7d2] rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-[#006194] bg-white"
                >
                  <option value="PRESENT">PRESENT</option>
                  <option value="LATE">LATE</option>
                  <option value="ON LEAVE">ON LEAVE</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjusting(null)}
                  className="px-3 py-2 border border-[#bfc7d2] rounded-lg text-[13px] hover:bg-[#f2f4f6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#006194] text-white rounded-lg text-[13px] font-semibold hover:bg-[#004870]"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm relative">
            <div className="flex justify-between items-center pb-3 border-b border-[#bfc7d2]">
              <h3 className="text-[16px] font-bold text-[#191c1e]">Attendance Details</h3>
              <button onClick={() => setViewing(null)} className="text-[#707881]">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="py-4 space-y-3 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#40474f]">Name:</span>
                <span className="font-semibold text-[#191c1e]">{viewing.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#40474f]">Employee ID:</span>
                <span className="font-medium text-[#191c1e]">{viewing.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#40474f]">Department:</span>
                <span className="font-medium text-[#191c1e]">{viewing.dept}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#40474f]">Clock In Time:</span>
                <span className="font-medium text-[#191c1e]">{viewing.clockIn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#40474f]">Clock Out Time:</span>
                <span className="font-medium text-[#191c1e]">{viewing.clockOut}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#40474f]">Total Hours Logged:</span>
                <span className="font-bold text-[#006194]">{viewing.hours}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[#40474f]">Status:</span>
                <StatusPill status={viewing.status} />
              </div>
            </div>
            <div className="pt-3 border-t border-[#bfc7d2] flex justify-end">
              <button
                onClick={() => setViewing(null)}
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
};

export default AttendanceTable;
