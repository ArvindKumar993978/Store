import React from "react";
import Sidebar from "../component/Sidebar";

const staffRows = [
  {
    initials: "RK",
    initialsBg: "#007bb9",
    initialsText: "#006194",
    name: "Rajesh Kumar",
    email: "rajesh.k@efficientledger.com",
    role: "Store Manager",
    roleBg: "#007bb9",
    roleText: "#006194",
    status: "Active",
    statusDot: "#00855b",
    lastLogin: "Today, 09:14 AM",
    action: "deactivate",
  },
  {
    initials: "PI",
    initialsBg: "#565e74",
    initialsText: "#565e74",
    name: "Priya Iyer",
    email: "priya.iyer@efficientledger.com",
    role: "Cashier",
    roleBg: "#565e74",
    roleText: "#565e74",
    status: "Active",
    statusDot: "#00855b",
    lastLogin: "Yesterday, 07:45 PM",
    action: "deactivate",
  },
  {
    initials: "AS",
    initialsBg: "#00855b",
    initialsText: "#006947",
    name: "Amit Singh",
    email: "amit.s@efficientledger.com",
    role: "Inventory Clerk",
    roleBg: "#00855b",
    roleText: "#006947",
    status: "Inactive",
    statusDot: "#bfc7d2",
    lastLogin: "3 days ago",
    action: "activate",
  },
  {
    initials: "SM",
    initialsBg: "#565e74",
    initialsText: "#565e74",
    name: "Sanya Malhotra",
    email: "sanya.m@efficientledger.com",
    role: "Cashier",
    roleBg: "#565e74",
    roleText: "#565e74",
    status: "Active",
    statusDot: "#00855b",
    lastLogin: "Today, 08:30 AM",
    action: "deactivate",
  },
];

export default function StaffManagement() {
  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex flex-row overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; vertical-align: middle; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>

      <Sidebar />

      {/* Main Content Wrapper */}
      <main className="flex-1 md:ml-[240px] flex flex-col h-screen overflow-y-auto custom-scrollbar bg-[#f7f9fb]">
        {/* TopNavBar */}
        <header className="sticky top-0 z-40 bg-[#f7f9fb] border-b border-[#bfc7d2] flex justify-between items-center w-full px-6 py-2 max-w-[1280px] mx-auto h-16">
          <div className="flex items-center gap-2">
            <span className="text-[20px] leading-[28px] font-bold text-[#006194]">
              Staff Management
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button className="p-2 text-[#3f4850] hover:text-[#006194] transition-colors">
                <span className="material-symbols-outlined">help</span>
              </button>
              <button className="p-2 text-[#3f4850] hover:text-[#006194] transition-colors">
                <span className="material-symbols-outlined">settings</span>
              </button>
            </div>
            <div className="h-8 w-[1px] bg-[#bfc7d2] mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[12px] tracking-[0.05em] text-[#191c1e] leading-none">
                  Anand Verma
                </p>
                <p className="text-[10px] text-[#3f4850] uppercase font-semibold">Store Owner</p>
              </div>
              <img
                className="w-10 h-10 rounded-full border-2 border-[#cce5ff] object-cover"
                alt="A professional headshot of a middle-aged South Asian businessman wearing a clean, modern white collared shirt. He has a warm, confident smile, set against a blurred background of a brightly lit, high-end corporate office. The photography is sharp with a soft depth of field, using natural lighting to emphasize a dependable and efficient persona consistent with a modern minimal UI."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnRJrX7EgB_40MOTUdEkbejlNZR2OcVFQO3XeCthVwQqwB8qLZxAOcJq91Lb71_JCQ1OTgGkljntbzl-K7r_QtNXsQJcZSjtrhMLZKuHebTaEyw4NDf1rnfcuE70arfJ3R166Oc-iFWCmSYOlcD44Tj4KHJHXlgaRu6gNlXkCttkR55HvC943eDyJAn2DXwnOPGYSX3ZtYeeNSp_4GafpN97SY6RElopBEjLFdlz002LseqW50z0B5GujIo__kxCWISt60TxzgbVjS"
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 max-w-[1280px] mx-auto w-full space-y-8">
          {/* Hero Stats & Action */}
          <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-[32px] leading-[40px] tracking-[-0.02em] font-bold text-[#191c1e]">
                Staff Directory
              </h2>
              <p className="text-[14px] leading-[20px] text-[#3f4850]">
                Manage your team, roles, and system access levels from a central dashboard.
              </p>
            </div>
            <button className="flex items-center gap-2 bg-[#006194] text-white px-6 py-3 rounded-lg text-[12px] tracking-[0.05em] font-semibold shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
              <span className="material-symbols-outlined text-[20px]">person_add</span>
              Add Staff Member
            </button>
          </section>

          {/* Bento Grid - RBAC Summaries */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Manager Summary */}
            <div className="bg-white p-6 rounded-xl border border-[#bfc7d2] shadow-[0px_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-[#007bb9] text-white rounded-lg">
                  <span className="material-symbols-outlined">admin_panel_settings</span>
                </div>
                <span className="px-2 py-1 bg-[#e0e3e5] rounded text-[10px] font-bold uppercase text-[#3f4850]">
                  Full Access
                </span>
              </div>
              <h3 className="text-[20px] leading-[28px] font-semibold text-[#191c1e] mb-1">
                Store Manager
              </h3>
              <p className="text-[14px] leading-[20px] text-[#3f4850] mb-4">
                Complete control over inventory, billing, and staff records.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#006194]">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span className="text-[12px] font-medium">Inventory &amp; Sales</span>
                </div>
                <div className="flex items-center gap-2 text-[#006194]">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span className="text-[12px] font-medium">Reporting &amp; Analytics</span>
                </div>
                <div className="flex items-center gap-2 text-[#006194]">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span className="text-[12px] font-medium">Staff Management</span>
                </div>
              </div>
            </div>

            {/* Cashier Summary */}
            <div className="bg-white p-6 rounded-xl border border-[#bfc7d2] shadow-[0px_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-[#dae2fd] text-[#5c647a] rounded-lg">
                  <span className="material-symbols-outlined">point_of_sale</span>
                </div>
                <span className="px-2 py-1 bg-[#e0e3e5] rounded text-[10px] font-bold uppercase text-[#3f4850]">
                  Restricted
                </span>
              </div>
              <h3 className="text-[20px] leading-[28px] font-semibold text-[#191c1e] mb-1">
                Cashier
              </h3>
              <p className="text-[14px] leading-[20px] text-[#3f4850] mb-4">
                Access for processing transactions and returns only.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#006194]">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span className="text-[12px] font-medium">Point of Sale (POS)</span>
                </div>
                <div className="flex items-center gap-2 text-[#ba1a1a]">
                  <span className="material-symbols-outlined text-sm">cancel</span>
                  <span className="text-[12px] font-medium">Financial Reports</span>
                </div>
                <div className="flex items-center gap-2 text-[#ba1a1a]">
                  <span className="material-symbols-outlined text-sm">cancel</span>
                  <span className="text-[12px] font-medium">Inventory Edits</span>
                </div>
              </div>
            </div>

            {/* Inventory Clerk Summary */}
            <div className="bg-white p-6 rounded-xl border border-[#bfc7d2] shadow-[0px_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-[#00855b] text-white rounded-lg">
                  <span className="material-symbols-outlined">inventory</span>
                </div>
                <span className="px-2 py-1 bg-[#e0e3e5] rounded text-[10px] font-bold uppercase text-[#3f4850]">
                  Semi-Restricted
                </span>
              </div>
              <h3 className="text-[20px] leading-[28px] font-semibold text-[#191c1e] mb-1">
                Inventory Clerk
              </h3>
              <p className="text-[14px] leading-[20px] text-[#3f4850] mb-4">
                Manage stock levels, suppliers, and incoming shipments.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#006194]">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span className="text-[12px] font-medium">Stock Management</span>
                </div>
                <div className="flex items-center gap-2 text-[#006194]">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span className="text-[12px] font-medium">Supplier Portal</span>
                </div>
                <div className="flex items-center gap-2 text-[#ba1a1a]">
                  <span className="material-symbols-outlined text-sm">cancel</span>
                  <span className="text-[12px] font-medium">Direct Billing</span>
                </div>
              </div>
            </div>
          </section>

          {/* Main Data Table Container */}
          <section className="bg-white rounded-xl border border-[#bfc7d2] shadow-[0px_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#bfc7d2] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#3f4850] text-lg">
                  search
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2 bg-[#f2f4f6] border border-[#bfc7d2] rounded-lg text-[14px] leading-[20px] focus:ring-2 focus:ring-[#006194] focus:border-transparent outline-none transition-all"
                  placeholder="Search by name, role or email..."
                  type="text"
                />
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-2 border border-[#bfc7d2] rounded-lg text-[#3f4850] text-[12px] tracking-[0.05em] font-semibold hover:bg-[#e6e8ea]">
                  <span className="material-symbols-outlined text-lg">filter_list</span>
                  Filter
                </button>
                <button className="flex items-center gap-2 px-3 py-2 border border-[#bfc7d2] rounded-lg text-[#3f4850] text-[12px] tracking-[0.05em] font-semibold hover:bg-[#e6e8ea]">
                  <span className="material-symbols-outlined text-lg">download</span>
                  Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f2f4f6]">
                  <tr>
                    <th className="px-6 py-4 text-[12px] tracking-[0.05em] font-semibold text-[#3f4850] uppercase">
                      Employee Name
                    </th>
                    <th className="px-6 py-4 text-[12px] tracking-[0.05em] font-semibold text-[#3f4850] uppercase">
                      Role
                    </th>
                    <th className="px-6 py-4 text-[12px] tracking-[0.05em] font-semibold text-[#3f4850] uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[12px] tracking-[0.05em] font-semibold text-[#3f4850] uppercase">
                      Last Login
                    </th>
                    <th className="px-6 py-4 text-[12px] tracking-[0.05em] font-semibold text-[#3f4850] uppercase text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#bfc7d2]">
                  {staffRows.map((row) => (
                    <tr
                      key={row.email}
                      className="hover:bg-[#f2f4f6]/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center font-bold"
                            style={{
                              backgroundColor: `${row.initialsBg}33`,
                              color: row.initialsText,
                            }}
                          >
                            {row.initials}
                          </div>
                          <div>
                            <p className="text-[16px] leading-[24px] text-[#191c1e]">
                              {row.name}
                            </p>
                            <p className="text-[12px] text-[#3f4850]">{row.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="px-3 py-1 rounded-full text-[12px] font-semibold"
                          style={{
                            backgroundColor: `${row.roleBg}1a`,
                            color: row.roleText,
                          }}
                        >
                          {row.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: row.statusDot }}
                          ></div>
                          <span className="text-[14px] leading-[20px] text-[#191c1e]">
                            {row.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[14px] leading-[20px] font-medium text-[#3f4850]">
                        {row.lastLogin}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-2 text-[#3f4850] hover:text-[#006194] hover:bg-[#e6e8ea] rounded-full transition-all"
                            title="Edit Role"
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          {row.action === "deactivate" ? (
                            <button
                              className="p-2 text-[#3f4850] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/20 rounded-full transition-all"
                              title="Deactivate"
                            >
                              <span className="material-symbols-outlined text-lg">person_off</span>
                            </button>
                          ) : (
                            <button
                              className="p-2 text-[#3f4850] hover:text-[#006947] hover:bg-[#00855b]/10 rounded-full transition-all"
                              title="Activate"
                            >
                              <span className="material-symbols-outlined text-lg">
                                person_check
                              </span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer/Pagination */}
            <div className="px-6 py-4 bg-[#f2f4f6] flex items-center justify-between">
              <p className="text-[12px] tracking-[0.05em] font-semibold text-[#3f4850]">
                Showing 4 of 12 employees
              </p>
              <div className="flex items-center gap-2">
                <button
                  className="p-1.5 border border-[#bfc7d2] rounded hover:bg-[#e0e3e5] disabled:opacity-50"
                  disabled
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="px-3 py-1 border border-[#006194] bg-[#006194] text-white rounded text-[12px] tracking-[0.05em] font-semibold">
                  1
                </button>
                <button className="px-3 py-1 border border-[#bfc7d2] rounded text-[12px] tracking-[0.05em] font-semibold hover:bg-[#e0e3e5]">
                  2
                </button>
                <button className="px-3 py-1 border border-[#bfc7d2] rounded text-[12px] tracking-[0.05em] font-semibold hover:bg-[#e0e3e5]">
                  3
                </button>
                <button className="p-1.5 border border-[#bfc7d2] rounded hover:bg-[#e0e3e5]">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="w-full py-4 mt-auto border-t border-[#bfc7d2] bg-white flex flex-col md:flex-row justify-between items-center px-8">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <span className="text-[12px] tracking-[0.05em] font-semibold text-[#006194]">
              Efficient Ledger
            </span>
            <span className="text-[#3f4850]/30">|</span>
            <p className="text-[12px] text-[#3f4850]">
              © 2024 Efficient Ledger. All rights reserved.
            </p>
          </div>
          <div className="flex gap-6">
            <a className="text-[12px] text-[#3f4850] hover:underline transition-all" href="#">
              Privacy Policy
            </a>
            <a className="text-[12px] text-[#3f4850] hover:underline transition-all" href="#">
              Terms of Service
            </a>
            <a className="text-[12px] text-[#3f4850] hover:underline transition-all" href="#">
              Support
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
