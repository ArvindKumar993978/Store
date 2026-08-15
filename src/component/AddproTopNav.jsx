import React from "react";

/*
  EASY-TO-EDIT VERSION
  --------------------
  EDIT HERE:
  - PAGE_TITLE: heading text next to the mobile menu icon
  - SEARCH_PLACEHOLDER: search box hint text
  - USER_INITIALS: text shown in the round avatar (top-right)
*/

const PAGE_TITLE = "Add New Product";
const SEARCH_PLACEHOLDER = "Global Search...";
const USER_INITIALS = "JD";

export default function AddproTopNav() {
  return (
    <header className="flex justify-between items-center h-16 px-6 md:ml-[240px] bg-white border-b border-[#bfc7d2] sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-[#3f4850]">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="text-[20px] font-bold text-[#006194]">{PAGE_TITLE}</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center bg-[#f2f4f6] px-3 py-1.5 rounded-lg border border-[#bfc7d2]">
          <span className="material-symbols-outlined text-[#3f4850] text-xl mr-2">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 text-sm w-48"
            placeholder={SEARCH_PLACEHOLDER}
            type="text"
          />
        </div>
        <button className="text-[#3f4850] hover:text-[#006194] transition-colors active:scale-95 duration-100">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="text-[#3f4850] hover:text-[#006194] transition-colors active:scale-95 duration-100">
          <span className="material-symbols-outlined">help_outline</span>
        </button>
        {/* <div className="h-8 w-8 rounded-full bg-[#007bb9] flex items-center justify-center text-white font-bold text-xs">
          {USER_INITIALS}
        </div> */}
      </div>
    </header>
  );
}
