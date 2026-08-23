import React from "react";

const MobileHeader = () => {
  return (
    <header className="md:hidden flex items-center justify-between p-[16px] bg-[#f7f9fb] border-b border-[#bfc7d2]">
      <div className="text-[20px] font-bold text-[#004870]">Efficient Ledger</div>
      <button className="p-[8px] text-[#40474f]">
        <span className="material-symbols-outlined">menu</span>
      </button>
    </header>
  );
};

export default MobileHeader;
