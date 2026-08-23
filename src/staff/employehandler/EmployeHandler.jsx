import React, { useState } from "react";
import Dashboard from "./components/Dashboard.jsx";
import AttendanceTracking from "./components/AttendanceTracking.jsx";
import PayrollProcessing from "./components/PayrollProcessing.jsx";
import StaffProfile from "./components/StaffProfile.jsx";
import SalaryReports from "./components/SalaryReports.jsx";

// Maps each Sidebar nav item id to the page that renders it.
const pages = {
  dashboard: Dashboard,
  attendance: AttendanceTracking,
  payroll: PayrollProcessing,
  staff: StaffProfile,
  reports: SalaryReports,
};

const EmployeeHandler = () => {
  const [page, setPage] = useState("dashboard");
  const PageComponent = pages[page] || Dashboard;

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans">
      {/* Load fonts + icon font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          vertical-align: middle;
        }
        body { font-family: 'Inter', sans-serif; }
      `}</style>

      <PageComponent onNavigate={setPage} />
    </div>
  );
};

export default EmployeeHandler;
