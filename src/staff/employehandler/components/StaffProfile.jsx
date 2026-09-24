import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import TopNav from "./TopNav.jsx";

/*
  Single staff member's profile page: ID card, contact info, a mini
  attendance calendar, performance notes, and a salary history table.
  Reuses the Sidebar/TopNav shell used across the other pages.
*/

const calendarDays = [
  { day: 1, state: "present" },
  { day: 2, state: "present" },
  { day: 3, state: "present" },
  { day: 4, state: "none" },
  { day: 5, state: "none" },
  { day: 6, state: "none" },
  { day: 7, state: "present" },
  { day: 8, state: "late" },
  { day: 9, state: "present" },
  { day: 10, state: "present" },
  { day: 11, state: "leave" },
  { day: 12, state: "none" },
];

const dayStyles = {
  present: "bg-[#026a4833] text-[#005035] font-medium",
  late: "bg-[#ffdad680] text-[#ba1a1a] font-medium",
  leave: "bg-[#cce5ff] text-[#004870] font-medium",
  none: "bg-[#f2f4f6] text-[#40474f]",
};
const dotStyles = { present: "#005035", late: "#ba1a1a", leave: "#004870" };

const notes = [
  {
    title: "Q3 Quarterly Review",
    date: "Sep 30, 2023",
    body: "Exceeded floor management targets. Handled high-stress holiday weekend efficiently with minimal staff disputes. Recommended for managerial track.",
    accent: "#005035",
  },
  {
    title: "Inventory Audit Completion",
    date: "Aug 15, 2023",
    body: "Successfully led the mid-year inventory audit. Identified discrepancies early and implemented corrective measures.",
    accent: "#717880",
  },
];

const salaryHistory = [
  { period: "Sep 01 - Sep 30, 2023", base: "$4,200.00", bonus: "+$350.00", net: "$3,945.50", status: "Paid" },
  { period: "Aug 01 - Aug 31, 2023", base: "$4,200.00", bonus: "+$120.00", net: "$3,760.80", status: "Paid" },
  { period: "Jul 01 - Jul 31, 2023", base: "$4,000.00", bonus: "+$0.00", net: "$3,520.00", status: "Paid" },
];

const StaffProfile = ({ onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notesList, setNotesList] = useState(notes);
  const [editModal, setEditModal] = useState(false);
  const [messageModal, setMessageModal] = useState(false);
  const [noteModal, setNoteModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [month, setMonth] = useState("October 2023");

  // Profile editable info
  const [info, setInfo] = useState({
    name: "Eleanor Vance",
    role: "Senior Floor Manager",
    email: "e.vance@company.com",
    phone: "+1 (555) 019-8372",
    address: "428 Park Avenue, Apt 4B, Metropolis, NY 10022",
    emergency: "Mark Vance (Spouse) - +1 (555) 832-9011",
  });

  // Modal forms
  const [msgText, setMsgText] = useState("");
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteBody, setNewNoteBody] = useState("");

  const handleExportSalary = () => {
    const headers = ["Pay Period", "Base Salary", "Overtime/Bonus", "Net Payout", "Status"];
    const rows = salaryHistory.map((s) => [
      s.period,
      `"${s.base}"`,
      `"${s.bonus}"`,
      `"${s.net}"`,
      s.status,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `salary_history_eleanor_vance.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    setMessageModal(false);
    setMsgText("");
    setToast("Message sent to Eleanor Vance successfully.");
    setTimeout(() => setToast(null), 4000);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteTitle || !newNoteBody) return;
    setNotesList([
      {
        title: newNoteTitle,
        date: "Today",
        body: newNoteBody,
        accent: "#004870",
      },
      ...notesList,
    ]);
    setNoteModal(false);
    setNewNoteTitle("");
    setNewNoteBody("");
    setToast("Performance note added.");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f7f9fb] text-[#191c1e] relative">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#004870] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-[#86f2e4]">check_circle</span>
          <span className="text-[14px] font-medium">{toast}</span>
        </div>
      )}

      <Sidebar activeItem="staff" onNavigate={onNavigate} subtitle="Admin Terminal" />

      <div className="flex-1 flex flex-col md:ml-[280px] min-h-screen">
        <TopNav
          variant="bordered"
          avatarLabel="Help"
          onMobileMenuClick={() => setMobileMenuOpen((v) => !v)}
        />

        <main className="flex-1 pt-[96px] px-[16px] md:px-[32px] pb-[48px] w-full max-w-[1280px] mx-auto">
          {/* Breadcrumbs & header actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[16px] mb-[32px]">
            <div>
              <div className="flex items-center gap-2 text-[#40474f] text-[14px] mb-1">
                <button onClick={() => onNavigate?.("staff")} className="hover:text-[#004870] transition-colors">
                  Staff Profiles
                </button>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span className="text-[#191c1e] font-medium">{info.name}</span>
              </div>
              <h2 className="text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] font-bold text-[#191c1e] tracking-[-0.01em] md:tracking-[-0.02em]">
                Staff Profile
              </h2>
            </div>
            <div className="flex items-center gap-[12px]">
              <button 
                onClick={() => setEditModal(true)}
                className="px-[16px] py-[8px] border border-[#bfc7d2] text-[#191c1e] text-[14px] rounded-[8px] hover:bg-[#f2f4f6] transition-colors flex items-center gap-2 active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                Edit Profile
              </button>
              <button 
                onClick={() => setMessageModal(true)}
                className="px-[16px] py-[8px] bg-[#004870] text-white text-[14px] rounded-[8px] hover:bg-[#006194] active:scale-95 transition-all shadow-sm flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">mail</span>
                Message
              </button>
            </div>
          </div>

          {/* Profile overview bento layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px] mb-[24px]">
            {/* ID card */}
            <div className="lg:col-span-4 bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#bfc7d2] p-[24px] flex flex-col items-center text-center hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:-translate-y-[1px] transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[96px] bg-[#f2f4f6] z-0" />
              <div className="w-[96px] h-[96px] rounded-full border-4 border-white overflow-hidden bg-[#e0e3e5] z-10 mb-[16px] shadow-sm flex items-center justify-center">
                <span className="material-symbols-outlined text-[#40474f] text-[40px]">person</span>
              </div>
              <h3 className="text-[20px] font-semibold text-[#191c1e] mb-1 z-10">Eleanor Vance</h3>
              <p className="text-[14px] text-[#40474f] mb-[16px] z-10 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">work</span>
                Senior Floor Manager
              </p>
              <div className="inline-flex items-center gap-[6px] px-[12px] py-[4px] bg-[#026a481a] text-[#005035] rounded-full text-[12px] font-semibold mb-[24px]">
                <span className="w-[8px] h-[8px] rounded-full bg-[#005035]" />
                Active Employee
              </div>
              <div className="w-full border-t border-[#bfc7d2] pt-[16px] mt-auto">
                <div className="grid grid-cols-2 gap-[16px] text-left">
                  <div>
                    <p className="text-[12px] tracking-[0.05em] font-semibold text-[#40474f] uppercase mb-1">Employee ID</p>
                    <p className="text-[14px] text-[#191c1e]">#EMP-8472</p>
                  </div>
                  <div>
                    <p className="text-[12px] tracking-[0.05em] font-semibold text-[#40474f] uppercase mb-1">Hire Date</p>
                    <p className="text-[14px] text-[#191c1e]">Oct 12, 2021</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & information */}
            <div className="lg:col-span-8 bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#bfc7d2] p-[24px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300">
              <h3 className="text-[20px] font-semibold text-[#191c1e] border-b border-[#bfc7d2] pb-[12px] mb-[16px]">
                Contact &amp; Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-[24px] gap-x-[32px]">
                <div className="flex items-start gap-[12px]">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#cce5ff]/50 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[#004870]">mail</span>
                  </div>
                  <div>
                    <p className="text-[12px] tracking-[0.05em] font-semibold text-[#40474f] uppercase mb-0.5">Email Address</p>
                    <a href="mailto:e.vance@company.com" className="text-[16px] text-[#191c1e] hover:text-[#004870] transition-colors">
                      e.vance@company.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-[12px]">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#cce5ff]/50 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[#004870]">phone</span>
                  </div>
                  <div>
                    <p className="text-[12px] tracking-[0.05em] font-semibold text-[#40474f] uppercase mb-0.5">Phone Number</p>
                    <a href="tel:+15550198" className="text-[16px] text-[#191c1e] hover:text-[#004870] transition-colors">
                      +1 (555) 019-8372
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-[12px]">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#e0e3e5] flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[#40474f]">location_on</span>
                  </div>
                  <div>
                    <p className="text-[12px] tracking-[0.05em] font-semibold text-[#40474f] uppercase mb-0.5">Home Address</p>
                    <p className="text-[14px] text-[#191c1e]">
                      428 Park Avenue, Apt 4B
                      <br />
                      Metropolis, NY 10022
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-[12px]">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#e0e3e5] flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[#40474f]">emergency</span>
                  </div>
                  <div>
                    <p className="text-[12px] tracking-[0.05em] font-semibold text-[#40474f] uppercase mb-0.5">Emergency Contact</p>
                    <p className="text-[14px] text-[#191c1e]">
                      Mark Vance (Spouse)
                      <br />
                      +1 (555) 832-9011
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance & performance grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-[24px] mb-[24px]">
            {/* Mini attendance calendar */}
            <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#bfc7d2] p-[24px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300">
              <div className="flex items-center justify-between border-b border-[#bfc7d2] pb-[12px] mb-[16px]">
                <h3 className="text-[20px] font-semibold text-[#191c1e] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#004870]">calendar_month</span>
                  Attendance Record
                </h3>
                <div className="flex items-center gap-2 text-[#40474f]">
                  <button 
                    onClick={() => setMonth(month === "October 2023" ? "September 2023" : "October 2023")}
                    className="p-1 hover:bg-[#f2f4f6] rounded-[6px] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>
                  <span className="text-[12px] font-medium">{month}</span>
                  <button 
                    onClick={() => setMonth(month === "October 2023" ? "November 2023" : "October 2023")}
                    className="p-1 hover:bg-[#f2f4f6] rounded-[6px] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-[4px] mb-[16px] text-center">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <div key={i} className="text-[12px] font-semibold text-[#40474f] py-2">
                    {d}
                  </div>
                ))}
                <div className="p-2" />
                <div className="p-2" />
                {calendarDays.map((d) => (
                  <div
                    key={d.day}
                    className={`p-2 text-[14px] rounded-[8px] relative cursor-pointer ${dayStyles[d.state]}`}
                  >
                    {d.day}
                    {d.state !== "none" && (
                      <div
                        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[4px] h-[4px] rounded-full"
                        style={{ backgroundColor: dotStyles[d.state] }}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-[16px] text-[12px] text-[#40474f] justify-center pt-2 border-t border-[#bfc7d2]">
                <div className="flex items-center gap-1">
                  <span className="w-[8px] h-[8px] rounded-full bg-[#005035]" /> Present
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-[8px] h-[8px] rounded-full bg-[#ba1a1a]" /> Late/Issues
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-[8px] h-[8px] rounded-full bg-[#004870]" /> Leave
                </div>
              </div>
            </div>

            {/* Performance notes */}
            <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#bfc7d2] p-[24px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col">
              <div className="flex items-center justify-between border-b border-[#bfc7d2] pb-[12px] mb-[16px]">
                <h3 className="text-[20px] font-semibold text-[#191c1e] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#004870]">rate_review</span>
                  Performance Notes
                </h3>
                <button 
                  onClick={() => setNoteModal(true)}
                  className="text-[#004870] hover:opacity-80 transition-opacity text-[12px] font-semibold flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span> Add Note
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 space-y-[16px] max-h-[250px]">
                {notesList.map((n, i) => (
                  <div key={i} className="border-l-4 pl-[16px] py-1" style={{ borderColor: n.accent }}>
                    <div className="flex justify-between items-start mb-1 gap-[8px]">
                      <h4 className="text-[14px] font-semibold text-[#191c1e]">{n.title}</h4>
                      <span className="text-[12px] text-[#40474f] whitespace-nowrap">{n.date}</span>
                    </div>
                    <p className="text-[14px] text-[#40474f] leading-relaxed">{n.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Salary & payroll history */}
          <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#bfc7d2] overflow-hidden">
            <div className="p-[24px] border-b border-[#bfc7d2] flex justify-between items-center">
              <h3 className="text-[20px] font-semibold text-[#191c1e] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#004870]">account_balance_wallet</span>
                Salary &amp; Compensation History
              </h3>
              <button 
                onClick={handleExportSalary}
                className="text-[#40474f] hover:text-[#004870] p-1.5 rounded-lg hover:bg-[#f2f4f6] transition-colors"
                title="Download CSV"
              >
                <span className="material-symbols-outlined">download</span>
              </button>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-[#f2f4f6] text-[#40474f] text-[12px] font-semibold uppercase tracking-wider">
                    <th className="py-3 px-[24px]">Pay Period</th>
                    <th className="py-3 px-[24px]">Base Salary</th>
                    <th className="py-3 px-[24px]">Overtime/Bonus</th>
                    <th className="py-3 px-[24px] text-right">Net Payout</th>
                    <th className="py-3 px-[24px] text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-[14px] text-[#191c1e] divide-y divide-[#bfc7d2]">
                  {salaryHistory.map((s) => (
                    <tr key={s.period} className="hover:bg-[#f2f4f6]/50 transition-colors">
                      <td className="py-4 px-[24px] font-medium">{s.period}</td>
                      <td className="py-4 px-[24px]">{s.base}</td>
                      <td className="py-4 px-[24px] text-[#005035]">{s.bonus}</td>
                      <td className="py-4 px-[24px] text-right font-semibold">{s.net}</td>
                      <td className="py-4 px-[24px] text-center">
                        <span className="inline-flex items-center px-[10px] py-[2px] rounded-full text-[12px] font-semibold bg-[#026a4833] text-[#005035]">
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Profile Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
            <div className="flex justify-between items-center pb-3 border-b border-[#bfc7d2]">
              <h3 className="text-[18px] font-bold text-[#191c1e]">Edit Profile Details</h3>
              <button onClick={() => setEditModal(false)} className="text-[#707881]">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="py-4 space-y-3 text-[13px]">
              <div>
                <label className="text-[#40474f] block font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={info.name}
                  onChange={(e) => setInfo({ ...info, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#bfc7d2] rounded-lg outline-none focus:ring-2 focus:ring-[#004870]"
                />
              </div>
              <div>
                <label className="text-[#40474f] block font-medium mb-1">Job Title</label>
                <input
                  type="text"
                  value={info.role}
                  onChange={(e) => setInfo({ ...info, role: e.target.value })}
                  className="w-full px-3 py-2 border border-[#bfc7d2] rounded-lg outline-none focus:ring-2 focus:ring-[#004870]"
                />
              </div>
              <div>
                <label className="text-[#40474f] block font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={info.email}
                  onChange={(e) => setInfo({ ...info, email: e.target.value })}
                  className="w-full px-3 py-2 border border-[#bfc7d2] rounded-lg outline-none focus:ring-2 focus:ring-[#004870]"
                />
              </div>
              <div>
                <label className="text-[#40474f] block font-medium mb-1">Phone</label>
                <input
                  type="text"
                  value={info.phone}
                  onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-[#bfc7d2] rounded-lg outline-none focus:ring-2 focus:ring-[#004870]"
                />
              </div>
            </div>
            <div className="pt-3 border-t border-[#bfc7d2] flex justify-end gap-2">
              <button
                onClick={() => setEditModal(false)}
                className="px-4 py-2 border border-[#bfc7d2] rounded-lg text-[13px] hover:bg-[#f2f4f6]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setEditModal(false);
                  setToast("Profile details updated!");
                  setTimeout(() => setToast(null), 3000);
                }}
                className="px-4 py-2 bg-[#004870] text-white rounded-lg text-[13px] font-semibold hover:bg-[#006194]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {messageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
            <div className="flex justify-between items-center pb-3 border-b border-[#bfc7d2]">
              <h3 className="text-[18px] font-bold text-[#191c1e]">Send Message to {info.name}</h3>
              <button onClick={() => setMessageModal(false)} className="text-[#707881]">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <form onSubmit={handleSendMessage} className="py-4 space-y-3 text-[13px]">
              <div>
                <label className="text-[#40474f] block font-medium mb-1">Message Content</label>
                <textarea
                  required
                  rows={4}
                  value={msgText}
                  onChange={(e) => setMsgText(e.target.value)}
                  placeholder="Type your announcement or memo..."
                  className="w-full px-3 py-2 border border-[#bfc7d2] rounded-lg outline-none focus:ring-2 focus:ring-[#004870]"
                />
              </div>
              <div className="pt-2 border-t border-[#bfc7d2] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMessageModal(false)}
                  className="px-4 py-2 border border-[#bfc7d2] rounded-lg text-[13px] hover:bg-[#f2f4f6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#004870] text-white rounded-lg text-[13px] font-semibold hover:bg-[#006194] flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Performance Note Modal */}
      {noteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
            <div className="flex justify-between items-center pb-3 border-b border-[#bfc7d2]">
              <h3 className="text-[18px] font-bold text-[#191c1e]">Add Performance Note</h3>
              <button onClick={() => setNoteModal(false)} className="text-[#707881]">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <form onSubmit={handleAddNote} className="py-4 space-y-3 text-[13px]">
              <div>
                <label className="text-[#40474f] block font-medium mb-1">Title / Milestone</label>
                <input
                  required
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="e.g. Q4 Target Achievement"
                  className="w-full px-3 py-2 border border-[#bfc7d2] rounded-lg outline-none focus:ring-2 focus:ring-[#004870]"
                />
              </div>
              <div>
                <label className="text-[#40474f] block font-medium mb-1">Details</label>
                <textarea
                  required
                  rows={3}
                  value={newNoteBody}
                  onChange={(e) => setNewNoteBody(e.target.value)}
                  placeholder="Describe employee performance note..."
                  className="w-full px-3 py-2 border border-[#bfc7d2] rounded-lg outline-none focus:ring-2 focus:ring-[#004870]"
                />
              </div>
              <div className="pt-2 border-t border-[#bfc7d2] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNoteModal(false)}
                  className="px-4 py-2 border border-[#bfc7d2] rounded-lg text-[13px] hover:bg-[#f2f4f6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#004870] text-white rounded-lg text-[13px] font-semibold hover:bg-[#006194]"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              activeItem="staff"
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

export default StaffProfile;
