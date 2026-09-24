import React, { useState } from "react";
/*
  Status chip colors:
    Present -> bg #026a4814 text #005035 dot #005035
    Late    -> bg #ffdad680 text #93000a dot #ba1a1a
    Absent  -> bg #e0e3e5   text #40474f dot #40474f
*/

const staff = [
  { initials: "JD", name: "Jane Doe", id: "EMP-042", dept: "Engineering", checkIn: "08:45 AM", status: "Present" },
  { initials: "JS", name: "John Smith", id: "EMP-089", dept: "Sales", checkIn: "09:15 AM", status: "Late" },
  { initials: "AW", name: "Alice Williams", id: "EMP-112", dept: "Operations", checkIn: "--:--", status: "Absent" },
  { initials: "MR", name: "Marcus Reed", id: "EMP-156", dept: "Engineering", checkIn: "08:55 AM", status: "Present" },
];

const statusStyles = {
  Present: { bg: "#026a4814", color: "#005035", border: "#026a4833", dot: "#005035" },
  Late: { bg: "#ffdad680", color: "#93000a", border: "#ffdad699", dot: "#ba1a1a" },
  Absent: { bg: "#e0e3e5", color: "#40474f", border: "#bfc7d2", dot: "#40474f" },
};

const StatusChip = ({ status }) => {
  const s = statusStyles[status];
  return (
    <span
      className="inline-flex items-center px-[8px] py-[4px] rounded-[6px] text-[12px] font-semibold gap-1 border"
      style={{ backgroundColor: s.bg, color: s.color, borderColor: s.border }}
    >
      <span className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: s.dot }} />
      {status}
    </span>
  );
};

const StaffTable = ({ onNavigate }) => {
  const [dept, setDept] = useState("All Departments");
  const [staffList, setStaffList] = useState(staff);
  const [actionMenuStaff, setActionMenuStaff] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = staffList.filter((s) => dept === "All Departments" || s.dept === dept);

  const updateStatus = (id, newStatus) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    setActionMenuStaff(null);
  };

  return (
    <div className="bg-white rounded-[12px] border border-[#bfc7d2] shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col relative">
      {/* Header */}
      <div className="px-[24px] py-[16px] border-b border-[#bfc7d2] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[16px]">
        <h3 className="text-[20px] font-bold text-[#191c1e]">Recent Staff Attendance</h3>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-[12px] top-1/2 -translate-y-1/2 text-[#40474f] text-[18px] pointer-events-none">
            filter_list
          </span>
          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            className="pl-[36px] pr-[32px] py-[8px] bg-[#f2f4f6] border border-[#bfc7d2] rounded-[8px] text-[14px] text-[#191c1e] appearance-none focus:ring-2 focus:ring-[#004870] focus:border-[#004870] outline-none"
          >
            {["All Departments", "Sales", "Engineering", "Operations"].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#f2f4f6] border-b border-[#bfc7d2]">
            <tr>
              <th className="px-[24px] py-[12px] text-[12px] tracking-[0.05em] font-semibold text-[#40474f] uppercase w-1/3">
                Employee
              </th>
              <th className="px-[24px] py-[12px] text-[12px] tracking-[0.05em] font-semibold text-[#40474f] uppercase">
                Department
              </th>
              <th className="px-[24px] py-[12px] text-[12px] tracking-[0.05em] font-semibold text-[#40474f] uppercase">
                Check In
              </th>
              <th className="px-[24px] py-[12px] text-[12px] tracking-[0.05em] font-semibold text-[#40474f] uppercase">
                Status
              </th>
              <th className="px-[24px] py-[12px] text-[12px] tracking-[0.05em] font-semibold text-[#40474f] uppercase text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#bfc7d2] text-[14px] text-[#191c1e]">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-[#f7f9fb] transition-colors">
                <td className="px-[24px] py-[16px]">
                  <div className="flex items-center gap-[12px]">
                    <div className="w-[32px] h-[32px] rounded-full bg-[#d7dff9] flex items-center justify-center text-[#5a6278] text-[12px] font-bold">
                      {s.initials}
                    </div>
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-[12px] text-[#40474f]">ID: {s.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-[24px] py-[16px] text-[#40474f]">{s.dept}</td>
                <td className="px-[24px] py-[16px] text-[#40474f]">{s.checkIn}</td>
                <td className="px-[24px] py-[16px]">
                  <StatusChip status={s.status} />
                </td>
                <td className="px-[24px] py-[16px] text-right">
                  <button 
                    onClick={() => setActionMenuStaff(s)}
                    className="text-[#40474f] hover:text-[#004870] transition-colors p-[6px] rounded-[6px] hover:bg-[#f2f4f6]"
                    title="Staff Actions"
                  >
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-[24px] py-[12px] border-t border-[#bfc7d2] flex items-center justify-between">
        <span className="text-[12px] text-[#40474f]">Showing {filtered.length} entries</span>
        <div className="flex gap-[4px]">
          <button 
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-[12px] py-[4px] border border-[#bfc7d2] rounded-[6px] text-[#40474f] hover:bg-[#f2f4f6] disabled:opacity-50"
          >
            Prev
          </button>
          <button 
            onClick={() => setCurrentPage(1)}
            className={`px-[12px] py-[4px] rounded-[6px] ${
              currentPage === 1
                ? "bg-[#004870] text-white"
                : "border border-[#bfc7d2] text-[#40474f] hover:bg-[#f2f4f6]"
            }`}
          >
            1
          </button>
          <button 
            onClick={() => setCurrentPage(2)}
            className={`px-[12px] py-[4px] rounded-[6px] ${
              currentPage === 2
                ? "bg-[#004870] text-white"
                : "border border-[#bfc7d2] text-[#40474f] hover:bg-[#f2f4f6]"
            }`}
          >
            2
          </button>
          <button 
            onClick={() => setCurrentPage(2)}
            disabled={currentPage === 2}
            className="px-[12px] py-[4px] border border-[#bfc7d2] rounded-[6px] text-[#40474f] hover:bg-[#f2f4f6] disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Action Popover Modal */}
      {actionMenuStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl p-5 w-full max-w-xs space-y-3 relative">
            <div className="flex justify-between items-center pb-2 border-b border-[#bfc7d2]">
              <span className="font-bold text-[14px] text-[#191c1e]">{actionMenuStaff.name}</span>
              <button onClick={() => setActionMenuStaff(null)} className="text-[#707881]">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-1.5 pt-1 text-[13px]">
              <button
                onClick={() => {
                  setActionMenuStaff(null);
                  onNavigate?.("staff");
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#eff4ff] text-[#006194] font-medium flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
                View Staff Profile
              </button>
              <button
                onClick={() => updateStatus(actionMenuStaff.id, "Present")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#e6f4ea] text-[#005035] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Mark as Present
              </button>
              <button
                onClick={() => updateStatus(actionMenuStaff.id, "Late")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#fff0ed] text-[#ba1a1a] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">schedule</span>
                Mark as Late
              </button>
              <button
                onClick={() => updateStatus(actionMenuStaff.id, "Absent")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#f2f4f6] text-[#40474f] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
                Mark as Absent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffTable;
