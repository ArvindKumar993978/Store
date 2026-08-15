import React from "react";

export default function SubscriptionTopNav() {
  return (
    <header className="flex justify-between items-center h-16 px-8 w-full sticky top-0 bg-white border-b border-[#bfc7d2] shadow-sm z-40 ml-60 max-w-[calc(100%-15rem)]">
      <div className="flex items-center gap-6">
        <span className="text-[20px] leading-[28px] font-bold text-[#006194]">StockFlow India</span>
        <nav className="hidden md:flex gap-6 items-center ml-8">
          <a className="text-[14px] text-[#3f4850] hover:text-[#006194] transition-all" href="#">
            Storefront
          </a>
          <a className="text-[14px] text-[#3f4850] hover:text-[#006194] transition-all" href="#">
            Orders
          </a>
          <a className="text-[14px] text-[#3f4850] hover:text-[#006194] transition-all" href="#">
            Help
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-[#eceef0] p-1 rounded-full px-4 mr-4">
          <span className="material-symbols-outlined text-[20px] text-[#3f4850]">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 text-[14px] leading-[20px] w-48"
            placeholder="Quick search..."
            type="text"
          />
        </div>
        <button className="flex items-center gap-2 bg-[#006194] text-white px-4 py-2 rounded-lg text-[12px] tracking-[0.05em] font-semibold hover:opacity-90 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Invoice
        </button>
        <div className="flex gap-2">
          <button className="p-2 rounded-full text-[#3f4850] hover:bg-[#e0e3e5]">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 rounded-full text-[#3f4850] hover:bg-[#e0e3e5]">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
}
