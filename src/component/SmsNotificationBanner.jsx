import React, { useState, useEffect } from "react";
import { getStoredSmsLogs, clearSmsLogs } from "../services/smsService";

export default function SmsNotificationBanner() {
  const [activeBanner, setActiveBanner] = useState(null);
  const [showInboxModal, setShowInboxModal] = useState(false);
  const [smsList, setSmsList] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  // Play subtle SMS alert chime
  const playSmsChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Dual-tone SMS beep
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5
      gain1.gain.setValueAtTime(0.08, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.12);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.14); // D6
      gain2.gain.setValueAtTime(0.09, ctx.currentTime + 0.14);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.14);
      osc2.stop(ctx.currentTime + 0.28);
    } catch (e) {}
  };

  // Load existing logs on mount
  useEffect(() => {
    setSmsList(getStoredSmsLogs());

    const handleSmsDispatched = (e) => {
      const sms = e.detail;
      setActiveBanner(sms);
      setSmsList(getStoredSmsLogs());
      playSmsChime();

      // Auto dismiss banner after 6 seconds
      setTimeout(() => {
        setActiveBanner((current) => (current?.id === sms.id ? null : current));
      }, 6000);
    };

    window.addEventListener("krishna_sms_dispatched", handleSmsDispatched);
    return () => window.removeEventListener("krishna_sms_dispatched", handleSmsDispatched);
  }, []);

  const handleCopyText = (sms) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(sms.message);
      setCopiedId(sms.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleClearHistory = () => {
    clearSmsLogs();
    setSmsList([]);
    setActiveBanner(null);
  };

  return (
    <>
      {/* 1. Floating Top Notification Banner */}
      {activeBanner && (
        <div className="fixed top-4 right-4 z-[9999] max-w-sm w-full animate-in slide-in-from-top-4 duration-300 pointer-events-auto">
          <div className="bg-[#0b1c30] text-white rounded-2xl p-4 shadow-2xl border border-white/10 flex items-start gap-3 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-[#006194] flex items-center justify-center flex-shrink-0 text-white shadow-md">
              <span className="material-symbols-outlined text-[22px]">sms</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[11px] font-bold text-[#86f2e4] uppercase tracking-wider">
                  SMS Sent • {activeBanner.to}
                </span>
                <span className="text-[10px] text-gray-400">{activeBanner.formattedTime}</span>
              </div>
              <p className="text-xs font-bold text-white mb-0.5">{activeBanner.title}</p>
              <p className="text-[11px] text-gray-300 line-clamp-2 leading-relaxed">
                {activeBanner.message}
              </p>
              <div className="mt-2.5 flex items-center gap-2 pt-1 border-t border-white/10">
                <button
                  onClick={() => setShowInboxModal(true)}
                  className="text-[11px] font-bold text-[#86f2e4] hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[13px]">visibility</span>
                  View SMS Inbox
                </button>
                <span className="text-gray-500">•</span>
                <button
                  onClick={() => setActiveBanner(null)}
                  className="text-[11px] font-medium text-gray-400 hover:text-white"
                >
                  Dismiss
                </button>
              </div>
            </div>
            <button
              onClick={() => setActiveBanner(null)}
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10"
              title="Close"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Floating Quick Trigger Pill (Sticky Bottom-Right) */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setShowInboxModal(true)}
          className="bg-[#006194] hover:bg-[#007bb9] text-white px-3.5 py-2 rounded-full shadow-lg flex items-center gap-2 text-xs font-bold transition-all hover:scale-105 active:scale-95 border-2 border-white/40"
          title="Open SMS Logs & Live Inbox"
        >
          <span className="material-symbols-outlined text-[18px]">chat</span>
          <span className="hidden sm:inline">SMS Log</span>
          {smsList.length > 0 && (
            <span className="bg-[#ba1a1a] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {smsList.length}
            </span>
          )}
        </button>
      </div>

      {/* 3. Comprehensive SMS Message Center Modal */}
      {showInboxModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-[#bfc7d2] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#bfc7d2]/30 flex items-center justify-between bg-[#f8f9ff] rounded-t-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#006194] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">sms</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#0b1c30]">Customer SMS Notifications</h3>
                  <p className="text-[11px] text-[#707881]">Real-time message logs sent to customer phones</p>
                </div>
              </div>
              <button
                onClick={() => setShowInboxModal(false)}
                className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* List */}
            <div className="p-4 overflow-y-auto flex-1 space-y-3 divide-y divide-gray-100">
              {smsList.length === 0 ? (
                <div className="py-12 text-center text-[#707881]">
                  <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">mark_chat_unread</span>
                  <p className="text-sm font-semibold">No SMS messages dispatched yet</p>
                  <p className="text-xs text-gray-400 mt-1">
                    When you place an order, make a payment, or issue a POS invoice, the SMS will appear here!
                  </p>
                </div>
              ) : (
                smsList.map((sms) => {
                  const rawPhone = (sms.to || "").replace(/[^0-9]/g, "");
                  const cleanPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
                  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(sms.message)}`;
                  const smsUrl = `sms:${sms.to}?body=${encodeURIComponent(sms.message)}`;

                  return (
                    <div key={sms.id} className="pt-3 first:pt-0">
                      <div className="p-3.5 bg-[#f8f9ff] hover:bg-[#eff4ff] rounded-xl border border-[#bfc7d2]/30 transition-all">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#006194] bg-[#eff4ff] px-2 py-0.5 rounded-full border border-[#006194]/20">
                            {sms.type?.replace("_", " ") || "SMS"}
                          </span>
                          <span className="text-[11px] text-[#707881]">{sms.formattedTime} • {sms.formattedDate}</span>
                        </div>
                        <div className="mb-2">
                          <p className="text-xs font-bold text-[#0b1c30]">
                            To: {sms.recipientName || "Customer"} ({sms.to})
                          </p>
                          <p className="text-xs text-[#3f4850] mt-1 bg-white p-2.5 rounded-lg border border-[#bfc7d2]/30 font-sans leading-relaxed">
                            {sms.message}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-end gap-2 text-xs pt-1">
                          <button
                            onClick={() => handleCopyText(sms)}
                            className="px-2.5 py-1 bg-white hover:bg-gray-50 border border-[#bfc7d2] rounded-md font-semibold text-[#3f4850] flex items-center gap-1 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[13px]">
                              {copiedId === sms.id ? "check" : "content_copy"}
                            </span>
                            {copiedId === sms.id ? "Copied" : "Copy"}
                          </button>
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-md font-semibold flex items-center gap-1 shadow-sm transition-colors"
                          >
                            <span className="material-symbols-outlined text-[13px]">chat</span>
                            WhatsApp
                          </a>
                          <a
                            href={smsUrl}
                            className="px-2.5 py-1 bg-[#006194] hover:bg-[#007bb9] text-white rounded-md font-semibold flex items-center gap-1 shadow-sm transition-colors"
                          >
                            <span className="material-symbols-outlined text-[13px]">send</span>
                            Open SMS App
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-[#bfc7d2]/30 bg-[#f8f9ff] flex items-center justify-between rounded-b-2xl">
              <span className="text-xs text-[#707881] font-medium">
                {smsList.length} total message{smsList.length === 1 ? "" : "s"} logged
              </span>
              <div className="flex gap-2">
                {smsList.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="px-3 py-1.5 text-xs text-[#ba1a1a] hover:bg-[#ffdad6]/40 font-semibold rounded-lg transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setShowInboxModal(false)}
                  className="px-4 py-1.5 bg-[#006194] text-white text-xs font-bold rounded-lg hover:bg-[#007bb9] transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
