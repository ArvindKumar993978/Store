import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const STORE_NAME = "Krishna General Store";
const PROFILE_PHOTO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCazkr_gcDsEICi81nMIm--BN7BLzLSF5PJJLeSid2SH3ss_CKtpy-FtRyi5hKlK5k6o3Ear1jDyMo7Tp_gnY-P-eD40aWI8Br2cfRoFgf7B1ASO70TJQBMP-_p1zd2MQdqTPiIjQz_OOI2jRn01hOvqhIaTbYHn2wfTs9yBeXodToovdNrpw1x8SbwYgoOs6io8KsKxw3B6YAPlqWx__h_Etat9Dzcn1utZ1mMIG2z-d2ScgNBy7UdSa0wFck_N7bQAkboxFduJ4nj";

export default function PosTopNav() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [timeStr, setTimeStr] = useState(() =>
    new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex justify-between items-center h-16 px-6 sticky top-0 z-40 ml-60 bg-[#f8f9ff] border-b border-[#bfc7d2] shadow-sm">
      <div className="flex items-center gap-4 w-1/3">
        <span
          onClick={() => navigate("/")}
          className="text-[20px] font-bold text-[#006194] cursor-pointer hover:opacity-80"
        >
          {STORE_NAME}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm text-[#3f4850]">
          <span className="material-symbols-outlined text-[#006194]">schedule</span>
          <span>{timeStr}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="material-symbols-outlined text-[#3f4850] hover:text-[#006194] transition-all cursor-pointer p-1"
            >
              notifications
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#bfc7d2]/50 p-4 z-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-xs text-[#191c1e]">POS Alerts</h4>
                  <button onClick={() => setShowNotifications(false)} className="text-xs text-gray-500">
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </div>
                <div className="text-xs text-[#3f4850] p-2 bg-[#f8f9ff] rounded-lg">
                  Cash drawer balance: ₹14,250.00
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate("/help")}
            className="text-[#006194] font-bold hover:opacity-70 transition-opacity cursor-pointer text-sm"
          >
            Help
          </button>
          <button
            onClick={() => navigate("/add-product")}
            className="bg-[#006194] text-white px-4 py-1.5 rounded-lg font-semibold hover:bg-[#007bb9] transition-all flex items-center gap-1 text-sm cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Product
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="w-8 h-8 rounded-full overflow-hidden border border-[#bfc7d2] cursor-pointer hover:ring-2 hover:ring-[#006194]"
            title="Profile & Settings"
          >
            <img className="w-full h-full object-cover" alt="Profile" src={PROFILE_PHOTO} />
          </button>
        </div>
      </div>
    </header>
  );
}
