import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { icon: "dashboard", label: "Dashboard", path: "/admin" },
  { icon: "inventory_2", label: "Inventory", path: "/product" },
  { icon: "receipt_long", label: "Billing/POS", path: "/billing" },
  { icon: "trending_up", label: "Sales", path: "/sales" },
  { icon: "assessment", label: "Reports", path: "/reports" },
  { icon: "groups", label: "Customers", path: "/customers" },
  { icon: "settings", label: "Settings", path: "/settings" },
];

export default function PurchaseOrderSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-[#bfc7d2] shadow-sm flex flex-col py-6 z-50">
      <div className="px-6 mb-8 cursor-pointer" onClick={() => navigate("/")}>
        <h1 className="text-xl font-bold text-[#006194]">Efficient Ledger</h1>
        <p className="text-xs text-[#565e74]">Admin Portal</p>
      </div>

      <nav className="flex-1 flex flex-col px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path || (item.path === "/product" && location.pathname === "/CreatePurchaseOrder");
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all text-left w-full cursor-pointer ${
                isActive
                  ? "text-[#006194] font-bold bg-[#e5eeff] border-r-4 border-[#006194]"
                  : "text-[#565e74] hover:bg-[#f2f4f6] font-medium"
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-6 mt-auto">
        <button
          onClick={() => navigate("/billing")}
          className="w-full py-3 bg-[#006194] hover:bg-[#007bb9] text-white rounded-lg font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md cursor-pointer text-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Bill
        </button>
      </div>
    </aside>
  );
}
