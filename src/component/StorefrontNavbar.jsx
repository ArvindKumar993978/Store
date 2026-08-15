import React, { useState } from "react";
import { useNavigate ,useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
/*
  EASY-TO-EDIT VERSION
  --------------------
  EDIT HERE:
  - NAV_LINKS: Storefront / Orders / Help links
  - PROFILE_PHOTO: top-right avatar image URL

  cartCount / onSearchFocusChange are passed in as props from the
  parent page so the cart badge number and search-box focus effect
  can be driven from outside this component.
*/

const NAV_LINKS = [
  { label: "Storefront", path: "/storefront" },
  { label: "Orders", path: "/orders" },
  { label: "Help", path: "/help" },
];

const PROFILE_PHOTO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBcvAusUP-IBF_JMOGPVKGsvWAdr87Yxc02IRU4FsucsbGb8fY78gidZSfj_wP9za6T-LhaaRDYp4PJbCceHFmEcEmnB1oZyP_rnliWGLKPTQgPvcvLpR45BvKb739Zfrl-r_tM3mMvGxqfQ_E2a3Nf40ZNJX-xrOtPkvkSHSCkYcg4h1FnOE1uIlZDlw65opnnNB5xjOEku1nZxR7LiwqdaTJFQXaE-VxEmIvEZx1SX4QV-p9xzt8yvtBn2_3E1AKN4xySnOrlQlKZ";

export default function StorefrontNavbar({ cartCount = 0, searchValue = "", onSearchChange = () => { } }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm h-20 flex items-center">
      <nav className="max-w-[1280px] mx-auto w-full px-8 flex justify-between items-center h-full">
        <div className="flex items-center gap-8">
          <h1 className="text-[32px] font-bold text-[#006194] tracking-tight">Krishna Store</h1>
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`font-medium transition-all ${isActive
                      ? "text-[#006194] font-bold border-b-2 border-[#006194] pb-1"
                      : "text-[#3f4850] hover:text-[#006194]"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex-1 max-w-md mx-6 hidden lg:block">
          <div className={`relative transition-transform ${searchFocused ? "scale-[1.02]" : ""}`}>
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707881]">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-[#f2f4f6] border-none rounded-lg focus:ring-2 focus:ring-[#006194] text-sm transition-all"
              placeholder="Search for groceries..."
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/shop")} className="p-2 text-[#3f4850] hover:text-[#006194] transition-colors relative">
            <span className="material-symbols-outlined">shopping_cart</span>
            <span className="absolute top-0 right-0 bg-[#006194] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          </button>
          <button className="p-2 text-[#3f4850] hover:text-[#006194] transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-[#dae2fd] flex items-center justify-center overflow-hidden border border-[#bfc7d2]">
            <img className="w-full h-full object-cover" alt="Profile" src={PROFILE_PHOTO} />
          </div>
        </div>
      </nav>
    </header>
  );
}
