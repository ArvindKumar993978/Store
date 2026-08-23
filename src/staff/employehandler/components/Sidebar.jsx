import React from "react";
/*
  Quick color reference:
    #004870  -> primary (deep blue)
    #006194  -> primary-container (icon boxes, buttons)
    #d7dff9  -> secondary-container (active nav item bg)
    #5a6278  -> on-secondary-container (active nav item text)
    #191c1e  -> on-surface (main dark text)
    #40474f  -> on-surface-variant (secondary/gray text)
    #f7f9fb  -> surface (page background)
    #ffffff  -> surface-container-lowest (card/nav background)
    #bfc7d2  -> outline-variant (border color)
    #e6e8ea  -> surface-container-high (hover bg)

  Shared across pages (Dashboard, Attendance Tracking, ...). Which link is
  highlighted, the primary action button, and the bottom links are all
  driven by props so every page can reuse this same file.
*/

const navItems = [
  { id: "dashboard", icon: "dashboard", label: "Dashboard" },
  { id: "attendance", icon: "calendar_today", label: "Attendance Tracking" },
  { id: "payroll", icon: "payments", label: "Payroll Processing" },
  { id: "staff", icon: "groups", label: "Staff Profiles" },
  { id: "reports", icon: "assessment", label: "Salary Reports" },
];

const NavLink = ({ icon, label, active, onClick }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      className={`flex items-center gap-3 px-[16px] py-[12px] rounded-[8px] transition-colors active:scale-95 duration-200 ${
        active
          ? "bg-[#d7dff9] text-[#5a6278] font-bold"
          : "text-[#40474f] hover:bg-[#e6e8ea]"
      }`}
    >
      <span
        className="material-symbols-outlined text-[22px]"
        style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
      >
        {icon}
      </span>
      <span className="text-[14px]">{label}</span>
    </a>
  </li>
);

const Sidebar = ({
  activeItem = "dashboard",
  onNavigate,
  subtitle = "Admin Terminal",
  showLogoBadge = true,
  forceVisible = false,
  primaryAction = {
    label: "Quick Record",
    icon: "add",
    className: "bg-[#004870] hover:bg-[#006194]",
  },
  secondaryLinks = [
    { icon: "settings", label: "Settings" },
    { icon: "logout", label: "Log Out" },
  ],
}) => {
  return (
    <nav
      className={`${
        forceVisible ? "flex" : "hidden md:flex"
      } fixed left-0 top-0 h-full w-[280px] bg-[#f7f9fb] flex-col p-[16px] shadow-sm z-20 border-r border-[#bfc7d2]`}
    >
      <div className="mb-[32px] px-[16px] py-[8px]">
        <div className="flex items-center gap-[12px] mb-[24px]">
          {showLogoBadge && (
            <div className="w-[40px] h-[40px] rounded-full bg-[#006194] flex items-center justify-center text-white font-bold">
              EL
            </div>
          )}
          <div>
            <h1 className="text-[20px] font-bold text-[#004870] leading-tight">
              Efficient Ledger
            </h1>
            <p className="text-[12px] tracking-[0.05em] font-semibold text-[#40474f]">
              {subtitle}
            </p>
          </div>
        </div>

        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            className={`w-full text-white py-[8px] px-[16px] rounded-[8px] text-[12px] font-semibold tracking-[0.05em] transition-colors shadow-sm flex items-center justify-center gap-2 mb-[24px] active:scale-95 ${primaryAction.className}`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {primaryAction.icon}
            </span>
            {primaryAction.label}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-[4px]">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeItem === item.id}
              onClick={() => onNavigate?.(item.id)}
            />
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-[16px] border-t border-[#bfc7d2]">
        <ul className="space-y-[4px]">
          {secondaryLinks.map((item) => (
            <NavLink key={item.label} icon={item.icon} label={item.label} />
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
