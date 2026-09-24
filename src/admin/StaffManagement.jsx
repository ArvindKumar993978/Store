import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";

const INITIAL_STAFF = [
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
  },
];

const ROLES = ["Store Manager", "Cashier", "Inventory Clerk"];

export default function StaffManagement() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [newStaffForm, setNewStaffForm] = useState({
    name: "",
    email: "",
    role: "Cashier",
  });

  // Filtered staff
  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const matchRole = selectedRole === "All" || s.role.toLowerCase() === selectedRole.toLowerCase();
      const term = searchQuery.toLowerCase().trim();
      const matchSearch =
        !term ||
        s.name.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.role.toLowerCase().includes(term);
      return matchRole && matchSearch;
    });
  }, [staff, selectedRole, searchQuery]);

  const toggleStatus = (email) => {
    setStaff((prev) =>
      prev.map((s) => {
        if (s.email === email) {
          const newStatus = s.status === "Active" ? "Inactive" : "Active";
          return {
            ...s,
            status: newStatus,
            statusDot: newStatus === "Active" ? "#00855b" : "#bfc7d2",
          };
        }
        return s;
      })
    );
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaffForm.name.trim() || !newStaffForm.email.trim()) return;

    const initials = newStaffForm.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const newMember = {
      initials,
      initialsBg: "#007bb9",
      initialsText: "#006194",
      name: newStaffForm.name.trim(),
      email: newStaffForm.email.trim(),
      role: newStaffForm.role,
      roleBg: newStaffForm.role === "Store Manager" ? "#007bb9" : newStaffForm.role === "Cashier" ? "#565e74" : "#00855b",
      roleText: newStaffForm.role === "Store Manager" ? "#006194" : newStaffForm.role === "Cashier" ? "#565e74" : "#006947",
      status: "Active",
      statusDot: "#00855b",
      lastLogin: "Never",
    };

    setStaff((prev) => [newMember, ...prev]);
    setShowAddModal(false);
    setNewStaffForm({ name: "", email: "", role: "Cashier" });
  };

  const handleUpdateRole = (e) => {
    e.preventDefault();
    if (!editingStaff) return;

    setStaff((prev) =>
      prev.map((s) =>
        s.email === editingStaff.email
          ? {
              ...s,
              role: editingStaff.role,
              roleBg: editingStaff.role === "Store Manager" ? "#007bb9" : editingStaff.role === "Cashier" ? "#565e74" : "#00855b",
              roleText: editingStaff.role === "Store Manager" ? "#006194" : editingStaff.role === "Cashier" ? "#565e74" : "#006947",
            }
          : s
      )
    );
    setEditingStaff(null);
  };

  const handleExportCSV = () => {
    const headers = ["Employee Name", "Email", "Role", "Status", "Last Login"];
    const rows = filteredStaff.map((s) => [
      `"${s.name}"`,
      `"${s.email}"`,
      `"${s.role}"`,
      `"${s.status}"`,
      `"${s.lastLogin}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `staff_directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex flex-row overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; vertical-align: middle; }
      `}</style>

      <Sidebar />

      {/* Main Content Wrapper */}
      <main className="flex-1 md:ml-[240px] flex flex-col h-screen overflow-y-auto bg-[#f7f9fb]">
        {/* TopNavBar */}
        <header className="sticky top-0 z-40 bg-[#f7f9fb] border-b border-[#bfc7d2] flex justify-between items-center w-full px-6 py-2 max-w-[1280px] mx-auto h-16">
          <div className="flex items-center gap-2">
            <span className="text-[20px] leading-[28px] font-bold text-[#006194]">
              Staff Management
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate("/help")}
                className="p-2 text-[#3f4850] hover:text-[#006194] transition-colors cursor-pointer"
                title="Help Center"
              >
                <span className="material-symbols-outlined">help</span>
              </button>
              <button
                onClick={() => navigate("/settings")}
                className="p-2 text-[#3f4850] hover:text-[#006194] transition-colors cursor-pointer"
                title="Settings"
              >
                <span className="material-symbols-outlined">settings</span>
              </button>
            </div>
            <div className="h-8 w-[1px] bg-[#bfc7d2] mx-2" />
            <div
              onClick={() => navigate("/settings")}
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="text-right hidden sm:block">
                <p className="text-[12px] tracking-[0.05em] text-[#191c1e] font-semibold leading-none">
                  Anand Verma
                </p>
                <p className="text-[10px] text-[#3f4850] uppercase font-semibold">Store Owner</p>
              </div>
              <img
                className="w-10 h-10 rounded-full border-2 border-[#cce5ff] object-cover"
                alt="Store Owner"
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
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-[#006194] text-white px-6 py-3 rounded-lg text-[12px] tracking-[0.05em] font-semibold shadow-sm hover:bg-[#007bb9] transition-all active:scale-[0.98] cursor-pointer"
            >
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#f2f4f6] border border-[#bfc7d2] rounded-lg text-[14px] focus:ring-2 focus:ring-[#006194] outline-none"
                  placeholder="Search by name, role or email..."
                  type="text"
                />
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-3 py-2 border border-[#bfc7d2] rounded-lg text-[#3f4850] text-xs font-semibold bg-[#f2f4f6] outline-none cursor-pointer"
                >
                  <option value="All">All Roles</option>
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-3 py-2 border border-[#bfc7d2] rounded-lg text-[#3f4850] text-[12px] tracking-[0.05em] font-semibold hover:bg-[#e6e8ea] cursor-pointer"
                >
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
                  {filteredStaff.map((row) => (
                    <tr
                      key={row.email}
                      className="hover:bg-[#f2f4f6]/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                            style={{
                              backgroundColor: `${row.initialsBg}33`,
                              color: row.initialsText,
                            }}
                          >
                            {row.initials}
                          </div>
                          <div>
                            <p className="text-[15px] font-semibold text-[#191c1e]">
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
                          />
                          <span className="text-[14px] leading-[20px] text-[#191c1e]">
                            {row.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[14px] leading-[20px] font-medium text-[#3f4850]">
                        {row.lastLogin}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingStaff(row)}
                            className="p-2 text-[#3f4850] hover:text-[#006194] hover:bg-[#e6e8ea] rounded-full transition-all cursor-pointer"
                            title="Edit Role"
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button
                            onClick={() => toggleStatus(row.email)}
                            className={`p-2 rounded-full transition-all cursor-pointer ${
                              row.status === "Active"
                                ? "text-[#3f4850] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40"
                                : "text-[#3f4850] hover:text-[#00855b] hover:bg-[#00855b]/20"
                            }`}
                            title={row.status === "Active" ? "Deactivate Employee" : "Activate Employee"}
                          >
                            <span className="material-symbols-outlined text-lg">
                              {row.status === "Active" ? "person_off" : "person_check"}
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredStaff.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-[#707881]">
                        No staff members found matching the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-6 py-4 bg-[#f2f4f6] flex items-center justify-between border-t border-[#bfc7d2]">
              <p className="text-[12px] tracking-[0.05em] font-semibold text-[#3f4850]">
                Showing {filteredStaff.length} employees
              </p>
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
            <button
              onClick={() => alert("Privacy Policy: Staff records are confidential.")}
              className="text-[12px] text-[#3f4850] hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => alert("Terms of Service: Internal staff access terms.")}
              className="text-[12px] text-[#3f4850] hover:underline cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => navigate("/help")}
              className="text-[12px] text-[#3f4850] hover:underline cursor-pointer"
            >
              Support
            </button>
          </div>
        </footer>
      </main>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 border border-[#bfc7d2] animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="font-bold text-lg text-[#191c1e]">Add New Staff Member</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-black">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#3f4850] block uppercase mb-1">Full Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Ramesh Verma"
                  value={newStaffForm.name}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-[#006194]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#3f4850] block uppercase mb-1">Work Email *</label>
                <input
                  required
                  type="email"
                  placeholder="ramesh.v@efficientledger.com"
                  value={newStaffForm.email}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-[#006194]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#3f4850] block uppercase mb-1">Assign Role *</label>
                <select
                  value={newStaffForm.role}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-[#006194]"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#006194] text-white rounded-lg text-sm font-semibold hover:bg-[#007bb9]"
                >
                  Create Member
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-[#3f4850] rounded-lg text-sm font-semibold hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 border border-[#bfc7d2] animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="font-bold text-lg text-[#191c1e]">Edit Role: {editingStaff.name}</h3>
              <button onClick={() => setEditingStaff(null)} className="text-gray-500 hover:text-black">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleUpdateRole} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#3f4850] block uppercase mb-1">Select Role</label>
                <select
                  value={editingStaff.role}
                  onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-[#006194]"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#006194] text-white rounded-lg text-sm font-semibold hover:bg-[#007bb9]"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="flex-1 py-2.5 bg-gray-100 text-[#3f4850] rounded-lg text-sm font-semibold hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
