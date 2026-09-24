import React, { useState } from "react";
import AppShell from "./components/AppShell.jsx";
import Overview from "./pages/Overview.jsx";
import Payslips from "./pages/Payslips.jsx";
import LeaveCenter from "./pages/LeaveCenter.jsx";
import Profile from "./pages/Profile.jsx";

const PAGES = {
  overview: Overview,
  salary: Payslips,
  leave: LeaveCenter,
  profile: Profile,
};

export default function Employee() {
  const [page, setPage] = useState("overview");
  const Page = PAGES[page] ?? Overview;

  return (
    <>
      {/* Load fonts + icon font (same convention used across the app) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          vertical-align: middle;
        }
      `}</style>
      <div className="font-sans">
        <AppShell page={page} onNavigate={setPage}>
          <Page onNavigate={setPage} />
        </AppShell>
      </div>
    </>
  );
}
