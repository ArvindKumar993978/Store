import React from "react";
import { useNavigate } from "react-router-dom";
/*
  TOP NAV COMPONENT
  -----------------
  Top header bar: search box, notifications, help, and the primary
  "Add Product" action button.

  EDIT HERE:
  - SEARCH_PLACEHOLDER: change the search box hint text
  - PRIMARY_ACTION: change the label/icon of the top-right button
  - hasNotification: set to false to hide the red notification dot
*/

const SEARCH_PLACEHOLDER = "Search products, invoices, customers...";
const PRIMARY_ACTION = { icon: "add", label: "Add Product" };
const hasNotification = true;

export default function TopNav() {
   const navigate = useNavigate();
  return (
    <header className="flex justify-between items-center h-16 px-6 sticky top-0 z-40 ml-60 bg-[#f8f9ff] border-b border-[#bfc7d2] shadow-sm">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#3f4850]">
            search
          </span>
          <input
            className="w-full bg-[#eff4ff] border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#006194]/20 transition-all"
            placeholder={SEARCH_PLACEHOLDER}
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-full hover:bg-[#dce9ff] transition-all text-[#3f4850]">
            <span className="material-symbols-outlined">notifications</span>
            {hasNotification && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full border-2 border-[#f8f9ff]" />
            )}
          </button>
          <button className="text-sm font-semibold text-[#3f4850] hover:text-[#006194] transition-all">
            Help
          </button>
        </div>
        <button 
           onClick={() => navigate("/add-product")}
         className="bg-[#007bb9] text-white px-6 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-all">
          <span className="material-symbols-outlined text-[18px]">{PRIMARY_ACTION.icon}</span>
          {PRIMARY_ACTION.label}
        </button>
      </div>
    </header>
  );
}
