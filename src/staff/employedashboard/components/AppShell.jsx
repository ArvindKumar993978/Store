import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
/*
  Quick color reference (matches the Staff Handler / rest of the app):
    #004870  -> primary (deep blue)
    #006194  -> primary-container (buttons, active icons)
    #d7dff9  -> secondary-container (active nav item bg)
    #5a6278  -> on-secondary-container (active nav item text)
    #191c1e  -> on-surface (main dark text)
    #40474f  -> on-surface-variant (secondary/gray text)
    #f7f9fb  -> surface (page background)
    #ffffff  -> surface-container-lowest (card/nav background)
    #bfc7d2  -> outline-variant (border color)
    #e6e8ea  -> surface-container-high (hover bg)
*/

const NAV_ITEMS = [
  { key: "overview", label: "Overview", icon: "dashboard" },
  { key: "salary", label: "My Salary", icon: "account_balance_wallet" },
  { key: "leave", label: "Leave Center", icon: "event_busy" },
  { key: "profile", label: "Settings", icon: "settings" },
];

const AVATAR_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC8To_BqVmh_iSlVZHSbczbq2SCnpkIikg_lNFEZwg-aQVaZqpLNA2LoG4vRbEXbMRf-a7EZTLJmYuI08YFRWHMt3FokDnY8uyz7ZC__-moeWBVjEQEYF2bVjSEfxw5qq8p7NNRej1INts7fuyN8oP1IwBDp6xEjZ-s2JKyAQmxAerk7kxjW051RG1ENNS_T9W9a2xCZGB-Pb4us8OwHL3QP3xS5ApkDQUboF3gncp95XLSq3oSG7SAWw";

function NavLink({ item, active, onClick, mobile }) {
  if (mobile) {
    return (
      <button
        onClick={onClick}
        className={`text-[14px] pb-[10px] pt-[12px] px-[16px] flex-shrink-0 border-b-2 transition-colors ${
          active
            ? "text-[#004870] border-[#004870] font-bold"
            : "text-[#40474f] border-transparent hover:text-[#004870]"
        }`}
      >
        {item.label}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-[16px] py-[12px] rounded-[8px] text-[14px] active:scale-95 duration-200 transition-all ${
        active
          ? "bg-[#d7dff9] text-[#5a6278] font-bold"
          : "text-[#40474f] hover:bg-[#e6e8ea]"
      }`}
    >
      <span
        className="material-symbols-outlined text-[22px]"
        style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
      >
        {item.icon}
      </span>
      <span>{item.label}</span>
    </button>
  );
}

export default function AppShell({ page, onNavigate, children }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [lastClockTime, setLastClockTime] = useState(null);
  const [clockToast, setClockToast] = useState(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleClockToggle = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (!isClockedIn) {
      setIsClockedIn(true);
      setLastClockTime(timeStr);
      setClockToast(`Successfully Clocked In at ${timeStr}`);
    } else {
      setIsClockedIn(false);
      setClockToast(`Successfully Clocked Out at ${timeStr}`);
    }
    setTimeout(() => setClockToast(null), 4000);
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex flex-col md:flex-row antialiased relative">
      {/* Toast Notification */}
      {clockToast && (
        <div className="fixed top-4 right-4 z-50 bg-[#004870] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-[#86f2e4]">check_circle</span>
          <span className="text-[14px] font-medium">{clockToast}</span>
        </div>
      )}

      {/* Top Navigation (Mobile) */}
      <header className="md:hidden bg-white border-b border-[#bfc7d2] shadow-sm w-full sticky top-0 z-50">
        <div className="flex justify-between items-center px-[16px] h-16 w-full">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-left"
            title="Return to Main Portal"
          >
            <span className="text-[18px] font-bold text-[#004870]">
              Employee Portal
            </span>
          </button>
          <div className="flex gap-2 relative">
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="text-[#40474f] hover:text-[#004870] transition-colors p-2 rounded-full hover:bg-[#e6e8ea]"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="text-[#40474f] hover:text-[#004870] transition-colors p-2 rounded-full hover:bg-[#e6e8ea]"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>

            {/* Mobile notifications dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-xl border border-[#bfc7d2] p-3 z-50 text-[13px]">
                <div className="font-semibold text-[#191c1e] pb-2 border-b border-[#bfc7d2]">Notifications</div>
                <div className="py-2 text-[#40474f]">Leave request approved for Oct 30 - 31.</div>
                <div className="py-2 text-[#40474f] border-t border-[#bfc7d2]">October 2023 payslip is ready.</div>
              </div>
            )}
          </div>
        </div>
        <nav className="flex px-[16px] overflow-x-auto border-t border-[#bfc7d2]">
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
        {mobileMenuOpen && (
          <div className="border-t border-[#bfc7d2] p-[16px] flex flex-col gap-2 bg-white">
            <button
              onClick={handleClockToggle}
              className={`w-full py-2.5 px-4 rounded-lg text-white font-semibold text-[13px] flex items-center justify-center gap-2 ${
                isClockedIn ? "bg-[#ba1a1a] hover:bg-[#93000a]" : "bg-[#006194] hover:bg-[#004870]"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">schedule</span>
              {isClockedIn ? "Clock Out" : "Clock In"}
            </button>
            <button 
              onClick={() => navigate("/help")}
              className="flex items-center gap-3 px-4 py-2 text-[#40474f] hover:bg-[#e6e8ea] rounded-lg text-[14px] transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">support_agent</span>
              <span>Help Support</span>
            </button>
            <button 
              onClick={() => navigate("/")}
              className="flex items-center gap-3 px-4 py-2 text-[#40474f] hover:bg-[#e6e8ea] rounded-lg text-[14px] transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span>Logout</span>
            </button>
          </div>
        )}
      </header>

      {/* Side Navigation (Desktop) */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-[280px] bg-white border-r border-[#bfc7d2] shadow-sm flex-col gap-3 p-[16px] z-40">
        <div 
          onClick={() => navigate("/")}
          className="flex items-center gap-3 mb-8 px-2 cursor-pointer hover:opacity-85 transition-opacity"
          title="Return to Main Portal"
        >
          <div className="w-10 h-10 rounded-lg bg-[#006194] flex items-center justify-center text-white font-bold">
            EL
          </div>
          <div>
            <h1 className="text-[18px] font-bold text-[#004870] leading-tight">
              Employee Portal
            </h1>
            <p className="text-[12px] text-[#40474f]">
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
          {/* Live Clock Button */}
          <button 
            onClick={handleClockToggle}
            className={`w-full text-white text-[14px] font-semibold py-3 rounded-lg transition-colors active:scale-95 duration-200 shadow-sm flex justify-center items-center gap-2 ${
              isClockedIn ? "bg-[#ba1a1a] hover:bg-[#93000a]" : "bg-[#006194] hover:bg-[#004870]"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isClockedIn ? "logout" : "schedule"}
            </span>
            {isClockedIn ? "Clock Out" : "Clock In"}
          </button>
          {isClockedIn && lastClockTime && (
            <p className="text-[11px] text-[#006f66] text-center font-medium bg-[#86f2e4]/30 py-1 rounded">
              Clocked in today at {lastClockTime}
            </p>
          )}

          <div className="border-t border-[#bfc7d2] pt-4 flex flex-col gap-2">
            <button 
              onClick={() => navigate("/help")}
              className="flex items-center gap-3 px-4 py-2 text-[#40474f] hover:bg-[#e6e8ea] rounded-lg text-[14px] transition-all text-left"
            >
              <span className="material-symbols-outlined text-[20px]">support_agent</span>
              <span>Help Support</span>
            </button>
            <button 
              onClick={() => navigate("/")}
              className="flex items-center gap-3 px-4 py-2 text-[#40474f] hover:bg-[#e6e8ea] rounded-lg text-[14px] transition-all text-left"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span>Logout</span>
            </button>
          </div>

          <div 
            onClick={() => onNavigate("profile")}
            className="flex items-center gap-3 mt-2 px-2 py-2 rounded-lg cursor-pointer hover:bg-[#eff4ff] transition-colors"
            title="View Profile Settings"
          >
            <img
              src={AVATAR_URL}
              alt="Employee avatar"
              className="w-10 h-10 rounded-full object-cover border border-[#bfc7d2]"
            />
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-[#191c1e]">
                Alex Carter
              </span>
              <span className="text-[12px] text-[#40474f]">
                Sr. Analyst
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[280px] p-[16px] md:p-[32px] w-full max-w-[1440px] mx-auto overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
