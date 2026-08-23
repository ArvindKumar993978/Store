import React, { useState } from "react";
import {
  LayoutDashboard,
  Wallet,
  CalendarX,
  Settings,
  Clock,
  Headset,
  LogOut,
  Bell,
  Menu,
  HelpCircle,
} from "./icons.jsx";

const NAV_ITEMS = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "salary", label: "My Salary", icon: Wallet },
  { key: "leave", label: "Leave Center", icon: CalendarX },
  { key: "profile", label: "Settings", icon: Settings },
];

const AVATAR_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC8To_BqVmh_iSlVZHSbczbq2SCnpkIikg_lNFEZwg-aQVaZqpLNA2LoG4vRbEXbMRf-a7EZTLJmYuI08YFRWHMt3FokDnY8uyz7ZC__-moeWBVjEQEYF2bVjSEfxw5qq8p7NNRej1INts7fuyN8oP1IwBDp6xEjZ-s2JKyAQmxAerk7kxjW051RG1ENNS_T9W9a2xCZGB-Pb4us8OwHL3QP3xS5ApkDQUboF3gncp95XLSq3oSG7SAWw";

function NavLink({ item, active, onClick, mobile }) {
  const Icon = item.icon;
  const base = mobile
    ? "text-body-md font-body-md pb-1 pt-3 px-4 flex-shrink-0 border-b-2"
    : "flex items-center gap-3 px-4 py-3 rounded-lg font-body-lg text-body-lg active:scale-95 duration-200 transition-all";

  if (mobile) {
    return (
      <button
        onClick={onClick}
        className={`${base} ${
          active
            ? "text-primary border-primary font-bold"
            : "text-on-surface-variant border-transparent hover:text-primary"
        }`}
      >
        {item.label}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${base} ${
        active
          ? "bg-secondary-container text-on-secondary-container font-bold"
          : "text-on-surface-variant hover:bg-surface-container-high"
      }`}
    >
      <Icon size={22} strokeWidth={active ? 2.4 : 2} />
      <span>{item.label}</span>
    </button>
  );
}

export default function AppShell({ page, onNavigate, children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col md:flex-row antialiased">
      {/* Top Navigation (Mobile) */}
      <header className="md:hidden bg-surface border-b border-outline-variant shadow-sm w-full sticky top-0 z-50">
        <div className="flex justify-between items-center px-margin-mobile h-16 w-full">
          <span className="font-headline-md text-headline-md font-bold text-primary">
            Efficient Ledger ESS
          </span>
          <div className="flex gap-stack-md">
            <button className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-high">
              <Bell size={22} />
            </button>
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-high"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
        <nav className="flex px-margin-mobile overflow-x-auto border-t border-outline-variant">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.key}
              item={item}
              mobile
              active={page === item.key}
              onClick={() => onNavigate(item.key)}
            />
          ))}
        </nav>
      </header>

      {/* Side Navigation (Desktop) */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-[280px] bg-surface-container-lowest border-r border-outline-variant shadow-sm flex-col gap-stack-md p-gutter z-40">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold">
            EL
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary leading-tight">
              Employee Portal
            </h1>
            <p className="font-label-md text-label-md text-on-surface-variant">
              Efficient Ledger
            </p>
          </div>
        </div>

        <div className="flex-grow flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.key}
              item={item}
              active={page === item.key}
              onClick={() => onNavigate(item.key)}
            />
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-4">
          <button className="w-full bg-primary-container text-on-primary font-body-md text-body-md font-semibold py-3 rounded-lg hover:bg-primary transition-colors active:scale-95 duration-200 shadow-sm flex justify-center items-center gap-2">
            <Clock size={18} />
            Clock In / Out
          </button>

          <div className="border-t border-outline-variant pt-4 flex flex-col gap-2">
            <button className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg font-body-lg text-body-lg transition-all">
              <Headset size={20} />
              <span>Help Support</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg font-body-lg text-body-lg transition-all">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>

          <div className="flex items-center gap-3 mt-2 px-2">
            <img
              src={AVATAR_URL}
              alt="Employee avatar"
              className="w-10 h-10 rounded-full object-cover border border-outline-variant"
            />
            <div className="flex flex-col">
              <span className="font-body-md text-body-md font-semibold text-on-surface">
                Alex Carter
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">
                Sr. Analyst
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[280px] p-margin-mobile md:p-margin-desktop w-full max-w-container-max mx-auto overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
