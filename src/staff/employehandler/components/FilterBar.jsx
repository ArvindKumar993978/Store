import React, { useState } from "react";

const FilterBar = () => {
  const [dateRange, setDateRange] = useState("Oct 12, 2023 - Oct 12, 2023");
  const [department, setDepartment] = useState("All Departments");
  const [status, setStatus] = useState("All Statuses");

  const handleClear = () => {
    setDateRange("");
    setDepartment("All Departments");
    setStatus("All Statuses");
  };

  return (
    <div className="bg-white rounded-[12px] p-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#bfc7d2] mb-[16px] flex flex-col md:flex-row gap-[16px] items-end">
      <div className="w-full md:w-1/3">
        <label className="block text-[12px] tracking-[0.05em] font-semibold text-[#40474f] mb-2">
          Date Range
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-[12px] top-1/2 -translate-y-1/2 text-[#717880] text-[18px]">
            calendar_month
          </span>
          <input
            type="text"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full h-[40px] pl-[40px] pr-[16px] bg-[#f2f4f6] border border-[#bfc7d2] rounded-[8px] text-[14px] text-[#191c1e] focus:ring-2 focus:ring-[#004870] focus:border-transparent outline-none"
          />
        </div>
      </div>

      <div className="w-full md:w-1/4">
        <label className="block text-[12px] tracking-[0.05em] font-semibold text-[#40474f] mb-2">
          Department
        </label>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full h-[40px] px-[12px] bg-[#f2f4f6] border border-[#bfc7d2] rounded-[8px] text-[14px] text-[#191c1e] focus:ring-2 focus:ring-[#004870] focus:border-transparent appearance-none outline-none"
        >
          {["All Departments", "Sales", "Engineering", "HR"].map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="w-full md:w-1/4">
        <label className="block text-[12px] tracking-[0.05em] font-semibold text-[#40474f] mb-2">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full h-[40px] px-[12px] bg-[#f2f4f6] border border-[#bfc7d2] rounded-[8px] text-[14px] text-[#191c1e] focus:ring-2 focus:ring-[#004870] focus:border-transparent appearance-none outline-none"
        >
          {["All Statuses", "Present", "Late", "Absent", "On Leave"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="w-full md:w-auto flex gap-[8px]">
        <button
          onClick={handleClear}
          className="h-[40px] px-[16px] bg-[#f2f4f6] border border-[#bfc7d2] rounded-[8px] text-[12px] font-semibold tracking-[0.05em] text-[#191c1e] hover:bg-[#e0e3e5] transition-colors active:scale-95"
        >
          Clear
        </button>
        <button className="h-[40px] px-[24px] bg-[#006194] text-white rounded-[8px] text-[12px] font-semibold tracking-[0.05em] hover:bg-[#076396] transition-colors active:scale-95">
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
