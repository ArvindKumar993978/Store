import React from "react";

/*
  EASY-TO-EDIT VERSION
  --------------------
  EDIT HERE:
  - NAV_ITEMS: change menu links / icons / active tab
*/

const NAV_ITEMS = [
  { icon: "dashboard", label: "Dashboard" },
  { icon: "inventory_2", label: "Inventory", active: true },
  { icon: "receipt_long", label: "Billing/POS" },
  { icon: "trending_up", label: "Sales" },
  { icon: "assessment", label: "Reports" },
  { icon: "groups", label: "Customers" },
  { icon: "settings", label: "Settings" },
];

export default function PurchaseOrderSidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-surface-container-lowest shadow-sm flex flex-col py-6 z-50">
      <div className="px-6 mb-8">
        <h1 className="text-headline-md font-headline-md text-primary font-bold">Efficient Ledger</h1>
        <p className="text-label-md font-label-md text-secondary">Admin Portal</p>
      </div>

      <nav className="flex-1 flex flex-col px-3 space-y-1">
        {NAV_ITEMS.map((item) =>
          item.active ? (
            <a
              key={item.label}
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-primary font-bold border-r-4 border-primary bg-primary-fixed transition-all"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </a>
          ) : (
            <a
              key={item.label}
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-secondary hover:bg-surface-container-low transition-colors rounded-lg group"
            >
              <span className="material-symbols-outlined group-hover:text-primary">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </a>
          )
        )}
      </nav>

      <div className="px-6 mt-auto">
        <button className="w-full py-3 bg-primary text-on-primary rounded-lg font-semibold flex items-center justify-center gap-2 active:scale-95 duration-150 shadow-md">
          <span className="material-symbols-outlined">add</span>
          New Bill
        </button>
      </div>
    </aside>
  );
}
