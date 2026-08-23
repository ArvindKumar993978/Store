import React from "react";
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
  return (
    <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#bfc7d2] overflow-hidden">
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
            {records.map((r) => (
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
                  <div className="flex items-center justify-end gap-[8px] opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      title="Adjust Entry"
                      className="p-[6px] text-[#40474f] hover:text-[#004870] hover:bg-[#e6e8ea] rounded-[6px] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
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
        <span className="text-[14px] text-[#40474f]">Showing 1 to 3 of 162 entries</span>
        <div className="flex gap-[4px]">
          <button
            disabled
            className="w-[32px] h-[32px] flex items-center justify-center rounded-[6px] border border-[#bfc7d2]/50 text-[#717880] disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <button className="w-[32px] h-[32px] flex items-center justify-center rounded-[6px] bg-[#006194] text-white text-[12px] font-semibold">
            1
          </button>
          <button className="w-[32px] h-[32px] flex items-center justify-center rounded-[6px] border border-[#bfc7d2]/50 text-[#191c1e] hover:bg-[#f2f4f6] text-[12px] font-semibold">
            2
          </button>
          <button className="w-[32px] h-[32px] flex items-center justify-center rounded-[6px] border border-[#bfc7d2]/50 text-[#191c1e] hover:bg-[#f2f4f6] text-[12px] font-semibold">
            3
          </button>
          <span className="w-[32px] h-[32px] flex items-center justify-center text-[#40474f]">...</span>
          <button className="w-[32px] h-[32px] flex items-center justify-center rounded-[6px] border border-[#bfc7d2]/50 text-[#191c1e] hover:bg-[#f2f4f6]">
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTable;
