import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PAGE_TITLE = "Add New Product";
const SEARCH_PLACEHOLDER = "Search inventory...";

export default function AddproTopNav() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchValue.trim()) {
      navigate(`/product?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <header className="flex justify-between items-center h-16 px-6 md:ml-[240px] bg-white border-b border-[#bfc7d2] sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/product")}
          className="p-1.5 text-[#3f4850] hover:text-[#006194] hover:bg-[#eff4ff] rounded-lg transition-colors flex items-center gap-1 text-sm font-semibold cursor-pointer"
          title="Back to Product Inventory"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span className="hidden sm:inline">Back</span>
        </button>
        <span className="text-gray-300">|</span>
        <h2 className="text-[20px] font-bold text-[#006194]">{PAGE_TITLE}</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center bg-[#f2f4f6] px-3 py-1.5 rounded-lg border border-[#bfc7d2]">
          <span className="material-symbols-outlined text-[#3f4850] text-xl mr-2">search</span>
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="bg-transparent border-none focus:ring-0 text-sm w-48 outline-none"
            placeholder={SEARCH_PLACEHOLDER}
            type="text"
          />
        </div>

        {/* Notifications toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-[#3f4850] hover:text-[#006194] transition-colors active:scale-95 duration-100 p-1.5 rounded-lg relative cursor-pointer"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#bfc7d2]/50 p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-sm text-[#191c1e]">Notifications</h4>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-[#707881] hover:text-[#191c1e]"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-[#eff4ff] border border-[#bfc7d2]/30">
                  <p className="font-semibold text-[#006194]">Low Stock Alert</p>
                  <p className="text-[#3f4850] mt-0.5">Whole Milk - 1L has only 12 units remaining.</p>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                  <p className="font-semibold text-[#191c1e]">New Online Order</p>
                  <p className="text-[#707881] mt-0.5">Order #9823 received via storefront.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help button */}
        <button
          onClick={() => navigate("/help")}
          className="text-[#3f4850] hover:text-[#006194] transition-colors active:scale-95 duration-100 p-1.5 rounded-lg cursor-pointer"
          title="Help & Support"
        >
          <span className="material-symbols-outlined">help_outline</span>
        </button>
      </div>
    </header>
  );
}
