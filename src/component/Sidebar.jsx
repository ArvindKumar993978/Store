import React from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

/*
  SIDEBAR COMPONENT
  -----------------
  Left navigation bar, extracted so it can be reused across pages
  (Dashboard, Products, Billing, etc.) and edited on its own.

  EDIT HERE:
  - NAV_ITEMS: change the menu links / icons / active tab
  - PROFILE: change the logged-in user's name, role, and photo
  - STORE_NAME / STORE_SUBTITLE: change the top logo text
*/

const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: "dashboard",
    path: "/dashboard",
    active: true,
  },
  {
    label: "Products",
    icon: "inventory",
    path: "/product",
    active: false,
  },
  { label: "Billing", icon: "receipt_long", path: "/billing", active: false },
  { label: "Sales", icon: "payments", path: "/sales", active: false },
  { label: "Reports", icon: "bar_chart", path: "/reports", active: false },
  {
    label: "Customers",
    icon: "group",
    path: "/customers",
    active: false,
  },
  {
    label: "Staff",
    icon: "badge",
    path: "/staff-management",
    active: false,
  },
  {
    label: "Settings",
    icon: "settings",
    path: "/settings",
    active: false,
  },
];

const PROFILE = {
  name: "Krishna Murthy",
  role: "Admin Level 4",
  photo:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCud5CkBYUASAGbSCh1h2HyR2xtAUt1Fa59QjWSOrxFwKIR4ReqAgyKB_q1i_4Ab5s1HiyFNwGUKg8tEykIS4dowDlg3uB6CB33wPJrUIEfgERo3c5MN3_mlUF-tJPdybd8cvJLdoxH1esWY86mEZuX5DqcO6CgFbMOYO112WxG5uve8MqgnyV86M845jNB2UAe33kRkBWQYc2nvGigRRjyy1eNXzSqMF17Vm5ObduXtD1H_unAuiIx1RodcNPPIg5Ivlj8ujUzCPgv",
};

const STORE_NAME = "Krishna Store";
const STORE_SUBTITLE = "Inventory Admin";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[#f8f9ff] border-r border-[#bfc7d2] flex flex-col py-6 px-4 z-50">
      <div 
        onClick={() => navigate("/")}
        className="mb-8 px-2 cursor-pointer hover:opacity-80 transition-opacity"
        title="Return to Main Portal"
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#006194]">storefront</span>
          <h1 className="text-[20px] font-bold text-[#006194]">{STORE_NAME}</h1>
        </div>
        <p className="text-[#3f4850] text-sm opacity-70">{STORE_SUBTITLE}</p>
      </div>

      <button 
        onClick={() => navigate("/billing")}
        className="mb-6 flex items-center justify-center gap-2 bg-[#006194] text-white py-4 px-6 rounded-xl text-sm font-semibold hover:bg-[#007bb9] active:scale-95 transition-all shadow-sm"
      >
        <span className="material-symbols-outlined">add</span>
        New Sale
      </button>

      <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "flex items-center gap-4 px-4 py-2 rounded-lg text-[#006194] font-bold border-r-4 border-[#006194] bg-[#eff4ff]"
                : "flex items-center gap-4 px-4 py-2 rounded-lg text-[#3f4850] hover:text-[#006194] hover:bg-[#e5eeff]"
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-[#bfc7d2] space-y-2">
        <button
          onClick={() => navigate("/storefront")}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-[#006194] hover:bg-[#eff4ff] rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-sm">shopping_bag</span>
          View Customer Store
        </button>
        <div 
          onClick={() => navigate("/settings")}
          className="flex items-center gap-4 px-2 py-2 rounded-xl cursor-pointer hover:bg-[#eff4ff] transition-colors"
          title="Open Settings"
        >
          <img
            className="w-10 h-10 rounded-full border border-[#bfc7d2] object-cover"
            alt="Admin profile"
            src={PROFILE.photo}
          />
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-semibold truncate">{PROFILE.name}</p>
            <p className="text-[11px] text-[#3f4850] opacity-70">{PROFILE.role}</p>
          </div>
          <span className="material-symbols-outlined text-sm text-[#707881]">settings</span>
        </div>
      </div>
    </aside>
  );
}
