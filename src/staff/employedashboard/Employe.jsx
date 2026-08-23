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
    <AppShell page={page} onNavigate={setPage}>
      <Page />
    </AppShell>
  );
}
