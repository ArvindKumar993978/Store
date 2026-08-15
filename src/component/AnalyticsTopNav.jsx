import React from "react";

/*
  EASY-TO-EDIT VERSION
  --------------------
  EDIT HERE:
  - DATE_RANGE_LABEL: the date range pill text
  - ADMIN_NAME / PROFILE_PHOTO: top-right identity
*/

const DATE_RANGE_LABEL = "Oct 1 - Oct 31, 2024";
const ADMIN_NAME = "Rajesh Kumar";
const PROFILE_PHOTO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAfVThSTf8MaxF9U2SWT4HQI7at_R49K6MirrmpLdtHh0S7Agkp14WBRzI9tRL2BHGMflf2BVxIehKvvSL_YtCrB-fuTSwdnvEWJFywFSDFVylEnnlktB_brQ6bd-dB7qWxj0MxVV0ysZsZ9GAx_IwxYeKaB3oU9zPN8uXRkPyBqnMdjqEzOm7w1hvFsowz3xnJtd7wzVR4VpeyufK6HGYREeIOTWqYK1ek6E6DXHvn8j3E4mmF1FwZJiHVGeo0WJG09QWcH_dpdWF8";

export default function AnalyticsTopNav() {
  return (
    <header className="bg-white h-16 border-b border-[#bfc7d2] flex justify-between items-center px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h2 className="text-[20px] font-bold text-[#006194]">Reports &amp; Analytics</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-1 bg-[#f2f4f6] px-3 py-1.5 rounded-lg border border-[#bfc7d2]">
          <span className="material-symbols-outlined text-[#707881] text-[20px]">calendar_today</span>
          <span className="text-xs text-[#3f4850] font-semibold">{DATE_RANGE_LABEL}</span>
          <span className="material-symbols-outlined text-[#707881] text-[18px]">expand_more</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative text-[#3f4850] hover:bg-[#e6e8ea] p-2 rounded-lg transition-all">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#ba1a1a] rounded-full" />
          </button>
          <div className="flex items-center gap-2 cursor-pointer hover:bg-[#e6e8ea] p-1 rounded-lg transition-all">
            <img className="w-8 h-8 rounded-full border border-[#bfc7d2]" alt="Profile" src={PROFILE_PHOTO} />
            <span className="hidden sm:inline text-sm font-bold">{ADMIN_NAME}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
