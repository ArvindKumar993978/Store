import React from "react";
/*
  Shared bento-grid stat card, used by both the Dashboard and the
  Attendance Tracking summary rows.

  - iconPosition "left"  -> icon first, label on the right (Dashboard)
  - iconPosition "right" -> label first, icon on the right (Attendance)
  - delta: pass { text, colorClass, direction } to show the change
    inline next to the value (Attendance style). Omit it and pass
    `footer` instead to show a line underneath the value (Dashboard
    style).
*/

const MetricCard = ({
  icon,
  iconBg,
  iconColor,
  iconShape = "circle",
  iconSize = 40,
  iconPosition = "left",
  uppercaseLabel = false,
  label,
  value,
  delta,
  footer,
  accent,
}) => {
  const iconBox = (
    <div
      className={`flex items-center justify-center flex-shrink-0 ${
        iconShape === "circle" ? "rounded-full" : "rounded-[8px]"
      }`}
      style={{
        backgroundColor: iconBg,
        color: iconColor,
        width: iconSize,
        height: iconSize,
      }}
    >
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
    </div>
  );

  const labelEl = (
    <span
      className={`text-[12px] tracking-[0.05em] font-semibold text-[#40474f] ${
        uppercaseLabel ? "uppercase" : ""
      }`}
    >
      {label}
    </span>
  );

  const roomy = iconSize >= 40;

  return (
    <div
      className={`bg-white ${
        roomy ? "p-[24px]" : "p-[20px]"
      } rounded-[12px] border border-[#bfc7d2] shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:-translate-y-[2px] hover:shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-200 ${
        accent ? "border-l-4 border-l-[#ba1a1a] relative overflow-hidden" : ""
      }`}
    >
      <div className={`flex justify-between items-start ${roomy ? "mb-[16px]" : "mb-[12px]"}`}>
        {iconPosition === "left" ? (
          <>
            {iconBox}
            {labelEl}
          </>
        ) : (
          <>
            {labelEl}
            {iconBox}
          </>
        )}
      </div>

      {delta ? (
        <div className="flex items-baseline gap-2">
          <h3 className="text-[32px] leading-[40px] font-bold text-[#191c1e] tracking-[-0.02em]">
            {value}
          </h3>
          <span className={`text-[14px] flex items-center ${delta.colorClass}`}>
            <span className="material-symbols-outlined text-[16px]">
              {delta.direction === "down" ? "arrow_downward" : "arrow_upward"}
            </span>
            {delta.text}
          </span>
        </div>
      ) : (
        <>
          <div className="text-[32px] leading-[40px] font-bold text-[#191c1e] tracking-[-0.02em]">
            {value}
          </div>
          {footer && <div className="mt-2">{footer}</div>}
        </>
      )}
    </div>
  );
};

export default MetricCard;
