import React, { useEffect, useRef, useState } from "react";

/*
  ReportProgress
  --------------
  Only the "Generating Your Report..." overlay from the progress-page
  mock — NOT the dashboard/sidebar behind it. Meant to be dropped in
  as a modal/overlay from anywhere in the app (e.g. shown right after
  "Generate Report" is clicked in ExportModal).

  Props:
    isOpen         -> boolean, controls visibility
    itemsAnalyzed  -> number shown in the summary card (default 1284)
    targetFormat   -> label shown in the summary card (default "Excel (.xlsx)")
    onCancel       -> called when user clicks "Cancel Generation"
    onComplete     -> called once the simulated progress hits 100%
*/

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ReportProgress({
  isOpen,
  itemsAnalyzed = 1284,
  targetFormat = "Excel (.xlsx)",
  onCancel,
  onComplete,
}) {
  const [progress, setProgress] = useState(48);
  const [timeRemaining, setTimeRemaining] = useState(12);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    // reset whenever the overlay opens again
    setProgress(48);
    setTimeRemaining(12);
    completedRef.current = false;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99) return prev;
        let next = prev + (Math.floor(Math.random() * 3) + 1);
        if (next > 99) next = 99;
        return next;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (progress % 10 === 0 && timeRemaining > 1) {
      setTimeRemaining((t) => t - 1);
    }
    if (progress >= 99 && !completedRef.current) {
      completedRef.current = true;
      const timeout = setTimeout(() => {
        onComplete && onComplete();
      }, 900);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, isOpen]);

  if (!isOpen) return null;

  const handleCancel = () => {
    onCancel && onCancel();
    
  };

  const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;
  const isFinishing = progress >= 99;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backdropFilter: "blur(8px)", backgroundColor: "rgba(248, 249, 255, 0.85)" }}
    >
      <div className="bg-white w-full max-w-md mx-4 p-8 rounded-2xl border border-[#bfc7d2] shadow-2xl flex flex-col items-center text-center">
        {/* Animated circular progress */}
        <div className="relative w-48 h-48 mb-6">
          <svg className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
            <circle
              cx="96"
              cy="96"
              r={RADIUS}
              fill="transparent"
              stroke="#dce9ff"
              strokeWidth="12"
            />
            <circle
              cx="96"
              cy="96"
              r={RADIUS}
              fill="transparent"
              stroke="#006194"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 0.4s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-[#006194] tabular-nums">
              {isFinishing ? "..." : `${progress}%`}
            </span>
            <span className="text-xs font-semibold text-[#707881] uppercase tracking-wider">
              {isFinishing ? "Finishing" : "Processing"}
            </span>
          </div>
        </div>

        {/* Status messaging */}
        <div className="space-y-1 mb-8">
          <h3 className="text-xl font-semibold text-[#0b1c30]">Generating Your Report...</h3>
          <p className="text-base text-[#3f4850] max-w-[280px] mx-auto">
            Please wait while we compile the inventory data for export.
          </p>
        </div>

        {/* Summary card */}
        <div className="w-full bg-[#eff4ff] p-4 rounded-xl border border-[#bfc7d2] mb-8 flex flex-col gap-2">
          <div className="flex justify-between items-center px-2">
            <span className="text-sm text-[#707881]">Items Analyzed</span>
            <span className="text-sm font-semibold text-[#0b1c30]">
              {itemsAnalyzed.toLocaleString()} items
            </span>
          </div>
          <div className="h-px bg-[#bfc7d2] mx-2" />
          <div className="flex justify-between items-center px-2">
            <span className="text-sm text-[#707881]">Target Format</span>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[#006a61] text-sm">table_view</span>
              <span className="text-sm font-semibold text-[#0b1c30]">{targetFormat}</span>
            </div>
          </div>
          <div className="h-px bg-[#bfc7d2] mx-2" />
          <div className="flex justify-between items-center px-2">
            <span className="text-sm text-[#707881]">Est. Time Remaining</span>
            <span className="text-sm font-semibold text-[#0b1c30]">
              {isFinishing ? "Finalizing file..." : `~ ${timeRemaining} seconds`}
            </span>
          </div>
        </div>

        {/* Cancel button */}
        <button
          onClick={onCancel}
          className="group flex items-center justify-center gap-2 w-full py-3 px-4 text-[#ba1a1a] hover:bg-[#ffdad6]/40 border border-[#ba1a1a]/20 rounded-lg transition-all active:scale-95"
        >
          <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">
            close
          </span>
          <span className="text-sm font-semibold">Cancel Generation</span>
        </button>
      </div>
    </div>
  );
}
