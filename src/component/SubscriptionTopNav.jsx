import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SubscriptionTopNav() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="flex justify-between items-center h-16 px-8 w-full sticky top-0 bg-white border-b border-[#bfc7d2] shadow-sm z-40 ml-60 max-w-[calc(100%-15rem)]">
      <div className="flex items-center gap-6">
        <span
          onClick={() => navigate("/")}
          className="text-[20px] leading-[28px] font-bold text-[#006194] cursor-pointer"
        >
          Efficient Ledger
        </span>
        <nav className="hidden md:flex gap-6 items-center ml-8">
          <button
            onClick={() => navigate("/storefront")}
            className="text-[14px] text-[#3f4850] hover:text-[#006194] transition-all cursor-pointer font-medium"
          >
            Storefront
          </button>
          <button
            onClick={() => navigate("/sales")}
            className="text-[14px] text-[#3f4850] hover:text-[#006194] transition-all cursor-pointer font-medium"
          >
            Orders
          </button>
          <button
            onClick={() => navigate("/help")}
            className="text-[14px] text-[#3f4850] hover:text-[#006194] transition-all cursor-pointer font-medium"
          >
            Help
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/billing")}
          className="flex items-center gap-2 bg-[#006194] text-white px-4 py-2 rounded-lg text-[12px] tracking-[0.05em] font-semibold hover:bg-[#007bb9] active:scale-95 transition-all cursor-pointer shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Invoice
        </button>
        <div className="relative flex gap-1">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full text-[#3f4850] hover:bg-[#e0e3e5] cursor-pointer"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-xl border border-[#bfc7d2]/50 p-3 z-50 text-xs">
              <p className="font-bold text-[#191c1e] mb-1">Billing Notice</p>
              <p className="text-[#3f4850]">Annual Business Pro plan renewal is in 12 days.</p>
            </div>
          )}
          <button
            onClick={() => navigate("/settings")}
            className="p-2 rounded-full text-[#3f4850] hover:bg-[#e0e3e5] cursor-pointer"
            title="Settings"
          >
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
}
