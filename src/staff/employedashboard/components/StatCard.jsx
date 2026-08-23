import React from "react";

export default function StatCard({
  title,
  icon: Icon,
  iconBg = "bg-secondary-container",
  iconColor = "text-on-secondary-container",
  value,
  suffix,
  progress,
  progressColor = "bg-primary",
  footer,
  decorativeColor = "bg-primary-fixed",
}) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-[2px] transition-transform duration-300">
      <div className="flex justify-between items-start z-10">
        <h3 className="font-headline-md text-headline-md text-on-surface">{title}</h3>
        <div className={`p-2 ${iconBg} rounded-lg ${iconColor}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="flex items-baseline gap-2 z-10">
        <span className="text-4xl font-bold font-tabular-nums text-on-surface tracking-tight">
          {value}
        </span>
        {suffix && (
          <span className="font-body-md text-body-md text-on-surface-variant">{suffix}</span>
        )}
      </div>
      {typeof progress === "number" && (
        <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden z-10 mt-2">
          <div className={`${progressColor} h-full rounded-full`} style={{ width: `${progress}%` }} />
        </div>
      )}
      {footer && <p className="font-label-md text-label-md text-on-surface-variant mt-1 z-10">{footer}</p>}
      <div
        className={`absolute -bottom-8 -right-8 w-32 h-32 ${decorativeColor} opacity-20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500`}
      />
    </div>
  );
}
