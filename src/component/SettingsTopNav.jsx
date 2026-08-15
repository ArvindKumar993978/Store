import React from "react";

/*
  EASY-TO-EDIT VERSION
  --------------------
  EDIT HERE:
  - SEARCH_PLACEHOLDER: search box hint text
  - PROFILE_PHOTO: top-right avatar image URL
  - hasNotification: set to false to hide the red notification dot
*/

const SEARCH_PLACEHOLDER = "Search settings...";
const PROFILE_PHOTO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDDHmAAYCCk1v7OBg2Ozi0V8tuItPFXCDxPWa5dxiCGgEja7G5VjqOlG8dgP3umqZBvIBvHipQ3qPYIiWstZssUe0EZzF-j9LH_Jd2ijDF8QTFRYD5ihGlGIbuCZxDdBGM8kSgyOBf2t5AxxBr2VvorZ09gghhD1YtblzEstDdl_VPr418x584ttDag7FhNR76GzLoYsJRy24ZuarVUshMt5zOIIEseFEG7SjrSe2LcadaXwqjX9q0HbdsI-Ht3dwp9G42AGMKJGGHV";
const hasNotification = true;

export default function SettingsTopNav() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <h2 className="text-[32px] font-bold">Settings</h2>
        <p className="text-sm text-[#3f4850]">Manage your business profile and workspace preferences.</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707881]">
            search
          </span>
          <input
            className="pl-10 pr-4 py-2 bg-[#f2f4f6] border border-[#bfc7d2] rounded-lg text-sm focus:ring-2 focus:ring-[#007bb9] outline-none w-64"
            placeholder={SEARCH_PLACEHOLDER}
            type="text"
          />
        </div>
        <button className="p-2 text-[#3f4850] hover:bg-[#e6e8ea] rounded-full transition-colors relative">
          <span className="material-symbols-outlined">notifications</span>
          {hasNotification && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#ba1a1a] rounded-full" />
          )}
        </button>
        <div className="w-10 h-10 rounded-full bg-[#dae2fd] flex items-center justify-center overflow-hidden border border-[#bfc7d2]">
          <img className="w-full h-full object-cover" alt="Profile" src={PROFILE_PHOTO} />
        </div>
      </div>
    </header>
  );
}
