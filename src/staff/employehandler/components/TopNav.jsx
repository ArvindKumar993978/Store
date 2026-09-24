import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
/*
  Quick color reference:
    #004870  -> primary
    #f2f4f6  -> surface-container-low (search pill/box bg)
    #40474f  -> on-surface-variant (icon/placeholder color)
    #ba1a1a  -> error (notification dot)
    #bfc7d2  -> outline-variant (border)
    #f7f9fb  -> surface (bar background)

  Two variants share this file:
    "pill"     -> Dashboard page: rounded-full search, no mobile toggle
                  here (a separate MobileHeader handles small screens),
                  bell + help icon buttons + avatar.
    "bordered" -> Attendance Tracking page: bordered search box, an
                  inline mobile menu button, a divider, and an
                  avatar + label instead of a separate help icon.
*/

const TopNav = ({ variant = "pill", onMobileMenuClick, avatarLabel = "Help" }) => {
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  if (variant === "bordered") {
    return (
      <header className="fixed top-0 right-0 w-full md:w-[calc(100%-280px)] h-[64px] bg-[#f7f9fb] border-b border-[#bfc7d2] flex justify-between items-center px-[24px] z-10">
        <div className="flex items-center gap-[16px] flex-1">
          <button
            onClick={onMobileMenuClick}
            className="md:hidden text-[#40474f]"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <div className="relative w-full max-w-md hidden sm:block">
            <span className="material-symbols-outlined absolute left-[12px] top-1/2 -translate-y-1/2 text-[#717880] text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search attendance records..."
              className="w-full h-[40px] pl-[40px] pr-[16px] bg-[#f2f4f6] border border-[#bfc7d2] rounded-[8px] text-[14px] text-[#191c1e] placeholder-[#717880] focus:outline-none focus:ring-2 focus:ring-[#004870] focus:border-transparent transition-shadow"
            />
          </div>
        </div>

        <div className="flex items-center gap-[16px] relative">
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="text-[#40474f] hover:text-[#004870] transition-colors p-[8px] rounded-full hover:bg-[#f2f4f6] active:scale-95 relative"
            title="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-[6px] right-[6px] w-[8px] h-[8px] bg-[#ba1a1a] rounded-full" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-12 top-12 w-72 bg-white rounded-xl shadow-xl border border-[#bfc7d2] p-3 z-50 text-[13px]">
              <div className="font-semibold text-[#191c1e] pb-2 border-b border-[#bfc7d2]">Live System Alerts</div>
              <div className="py-2 text-[#40474f]">8 employees marked present this morning.</div>
              <div className="py-2 text-[#40474f] border-t border-[#bfc7d2]">Payroll processing cycle is due in 2 days.</div>
            </div>
          )}

          <div className="w-px h-[24px] bg-[#bfc7d2]/50 hidden sm:block" />
          <div 
            onClick={() => navigate("/help")}
            className="flex items-center gap-[12px] cursor-pointer group"
            title="Help Desk"
          >
            <div className="w-[32px] h-[32px] rounded-full bg-[#d7dff9] overflow-hidden border border-[#bfc7d2]/30">
              <img
                alt="Admin User Profile"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDId90Aff4-kj22Hc7dYlBGVPXbm4iNW0XEvxqv9jkgegh1LTfnY8DMG63mnXOVr7p85_7hU128nhr-WIDplLB4ARm0K_ft0BUtwmB6bzFCH8-5TEhewSUgOSenpAUDal-iN1KkzSiSJ7FxslhlQbX-CfjX_WfAKtmHfAlZUmq6ZiozuKCcSR-psMlXTB5YLwPleQ0OEorFyo49QvDs0EHCjEFoy9fXIdqjyM10FHqPFjoFILXgFRisDQ"
              />
            </div>
            <span className="text-[12px] tracking-[0.05em] font-semibold text-[#40474f] group-hover:text-[#004870] transition-colors hidden sm:block">
              {avatarLabel}
            </span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="hidden md:flex fixed top-0 right-0 w-[calc(100%-280px)] h-[64px] bg-[#f7f9fb] border-b border-[#bfc7d2] z-10 justify-between items-center px-[32px]">
      <div className="flex items-center bg-[#f2f4f6] rounded-full px-[16px] py-[8px] w-[256px] focus-within:ring-2 focus-within:ring-[#004870] transition-all">
        <span className="material-symbols-outlined text-[#40474f] mr-2 text-[20px]">
          search
        </span>
        <input
          type="text"
          placeholder="Search staff or records..."
          className="bg-transparent border-none outline-none w-full text-[14px] text-[#191c1e] placeholder-[#40474f]"
        />
      </div>

      <div className="flex items-center gap-[16px] relative">
        <button 
          onClick={() => setNotificationsOpen(!notificationsOpen)}
          className="p-[8px] text-[#40474f] hover:bg-[#f2f4f6] rounded-full transition-colors relative"
          title="Notifications"
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-[8px] right-[8px] w-[8px] h-[8px] bg-[#ba1a1a] rounded-full" />
        </button>

        {notificationsOpen && (
          <div className="absolute right-16 top-12 w-72 bg-white rounded-xl shadow-xl border border-[#bfc7d2] p-3 z-50 text-[13px]">
            <div className="font-semibold text-[#191c1e] pb-2 border-b border-[#bfc7d2]">System Alerts</div>
            <div className="py-2 text-[#40474f]">128 staff clocked in today.</div>
            <div className="py-2 text-[#40474f] border-t border-[#bfc7d2]">Pending payroll for October is ready to review.</div>
          </div>
        )}

        <button 
          onClick={() => navigate("/help")}
          className="p-[8px] text-[#40474f] hover:bg-[#f2f4f6] rounded-full transition-colors"
          title="Help & Support"
        >
          <span className="material-symbols-outlined">help_outline</span>
        </button>
        <div 
          onClick={() => navigate("/settings")}
          className="w-[32px] h-[32px] rounded-full overflow-hidden bg-[#e0e3e5] border border-[#bfc7d2] cursor-pointer hover:ring-2 hover:ring-[#004870] transition-all"
          title="Settings"
        >
          <img
            alt="Admin User Avatar"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAO_viKuKUAESJPPSV9aKUbautYtXwVqmh3AiLsav_mpyr1sgNLG2XiBkXJWhJwrOaZiUeGUFKsF5kfb0Y7vPM_zEdrcG0GAsyCwlaNP2tE4jAWJNGNFCYlAdDu--J8mWWIw8MVO6KyIKnFJZ3MxRFrU_fcE5Scvljr-JXcuFucm-baP-qJyBns3V5FCnyvitDNf6mrFzBNvtj3pe_XtbIeT0tXQvXp7TA2VWNDmYSl4y6ANT3G42QNFA"
          />
        </div>
      </div>
    </header>
  );
};

export default TopNav;
