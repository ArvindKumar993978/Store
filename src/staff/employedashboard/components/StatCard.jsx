import React from "react";

export default function StatCard({
  title,
  icon = "info",
  iconBg = "bg-[#d7dff9]",
  iconColor = "text-[#5a6278]",
  value,
  suffix,
  progress,
  progressColor = "bg-[#006194]",
  footer,
  decorativeColor = "bg-[#006194]",
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#bfc7d2] flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-[2px] transition-transform duration-300">
      <div className="flex justify-between items-start z-10">
        <h3 className="text-[16px] font-semibold text-[#191c1e]">{title}</h3>
        <div className={`p-2 ${iconBg} rounded-lg ${iconColor}`}>
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
      </div>
      <div className="flex items-baseline gap-2 z-10">
        <span className="text-4xl font-bold tabular-nums text-[#191c1e] tracking-tight">
          {value}
        </span>
        {suffix && (
          <span className="text-[14px] text-[#40474f]">{suffix}</span>
        )}
      </div>
      {typeof progress === "number" && (
        <div className="w-full bg-[#e6e8ea] h-2 rounded-full overflow-hidden z-10 mt-2">
          <div className={`${progressColor} h-full rounded-full`} style={{ width: `${progress}%` }} />
        </div>
      )}
      {footer && <p className="text-[12px] text-[#40474f] mt-1 z-10">{footer}</p>}
      <div
        className={`absolute -bottom-8 -right-8 w-32 h-32 ${decorativeColor} opacity-20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500`}
      />
    </div>
  );
}
