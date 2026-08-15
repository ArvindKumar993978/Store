import React, { useEffect, useState } from "react";

/*
  EASY-TO-EDIT VERSION
  --------------------
  EDIT HERE:
  - STORE_NAME: heading text on the left
  - PROFILE_PHOTO: top-right avatar image URL

  The clock in the middle updates automatically every minute, same
  as the original page's script.
*/

const STORE_NAME = "Krishna General Store";
const PROFILE_PHOTO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCazkr_gcDsEICi81nMIm--BN7BLzLSF5PJJLeSid2SH3ss_CKtpy-FtRyi5hKlK5k6o3Ear1jDyMo7Tp_gnY-P-eD40aWI8Br2cfRoFgf7B1ASO70TJQBMP-_p1zd2MQdqTPiIjQz_OOI2jRn01hOvqhIaTbYHn2wfTs9yBeXodToovdNrpw1x8SbwYgoOs6io8KsKxw3B6YAPlqWx__h_Etat9Dzcn1utZ1mMIG2z-d2ScgNBy7UdSa0wFck_N7bQAkboxFduJ4nj";

export default function PosTopNav() {
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
        <span className="text-[20px] font-bold">{STORE_NAME}</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm text-[#3f4850]">
          <span className="material-symbols-outlined text-[#006194]">schedule</span>
          <span>{timeStr}</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-[#3f4850] hover:text-[#006194] transition-all cursor-pointer">
            notifications
          </button>
          <button className="text-[#006194] font-bold hover:opacity-70 transition-opacity">Help</button>
          <button className="bg-[#006194] text-white px-4 py-1 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-1">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Add Product
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#bfc7d2]">
            <img className="w-full h-full object-cover" alt="Profile" src={PROFILE_PHOTO} />
          </div>
        </div>
      </div>
    </header>
  );
}
