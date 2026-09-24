import React from "react";
import { useNavigate } from "react-router-dom";

const MobileHeader = ({ onMenuClick }) => {
  const navigate = useNavigate();

  return (
    <header className="md:hidden flex items-center justify-between p-[16px] bg-[#f7f9fb] border-b border-[#bfc7d2] sticky top-0 z-30 shadow-sm">
      <div
        onClick={() => navigate("/")}
        className="text-[20px] font-bold text-[#004870] cursor-pointer hover:opacity-80"
      >
        Efficient Ledger
      </div>
      <button
        onClick={onMenuClick}
        className="p-[8px] text-[#40474f] hover:text-[#004870] hover:bg-[#e0e3e5] rounded-lg transition-colors cursor-pointer"
        aria-label="Open mobile menu"
      >
        <span className="material-symbols-outlined text-[24px]">menu</span>
      </button>
    </header>
  );
};

export default MobileHeader;
