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
  const [showOffersNotif, setShowOffersNotif] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm h-20 flex items-center">
      <nav className="max-w-[1280px] mx-auto w-full px-8 flex justify-between items-center h-full">
        <div className="flex items-center gap-8">
          <div 
            onClick={() => navigate("/storefront")}
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
            title="Krishna Store Home"
          >
            <span className="material-symbols-outlined text-[#006194] text-3xl">shopping_basket</span>
            <h1 className="text-[28px] md:text-[32px] font-bold text-[#006194] tracking-tight">Krishna Store</h1>
          </div>
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

        <div className="flex items-center gap-4 relative">
          <button
            onClick={() => navigate("/shop")} 
            className="p-2 text-[#3f4850] hover:text-[#006194] transition-colors relative"
            title="View Basket"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            <span className="absolute top-0 right-0 bg-[#006194] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
              {cartCount}
            </span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowOffersNotif((prev) => !prev)}
              className="p-2 text-[#3f4850] hover:text-[#006194] transition-colors relative"
              title="Offers & Alerts"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00855b] rounded-full" />
            </button>

            {showOffersNotif && (
              <div className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-xl border border-[#bfc7d2] p-4 z-50">
                <div className="flex justify-between items-center mb-2 pb-2 border-b border-[#bfc7d2]/30">
                  <span className="font-bold text-sm text-[#006194]">Special Offers</span>
                  <span className="text-[10px] bg-[#6ffbbe] text-[#005236] font-bold px-2 py-0.5 rounded-full">Active</span>
                </div>
                <div className="space-y-2 text-xs text-[#3f4850]">
                  <div className="p-2 bg-[#f7f9fb] rounded-lg">
                    <p className="font-bold text-[#191c1e]">Flat ₹100 Off</p>
                    <p>Use code <span className="font-mono font-bold text-[#006194]">KRISHNA100</span> on checkout</p>
                  </div>
                  <div className="p-2 bg-[#f7f9fb] rounded-lg">
                    <p className="font-bold text-[#191c1e]">Free Express Delivery</p>
                    <p>On all organic produce & dairy orders</p>
                  </div>
                </div>
                <button
                  onClick={() => { setShowOffersNotif(false); navigate("/offers"); }}
                  className="w-full mt-3 py-1.5 bg-[#006194] text-white rounded-lg text-xs font-bold hover:bg-[#007bb9] transition-colors"
                >
                  View All Offers
                </button>
              </div>
            )}
          </div>

          <div 
            onClick={() => navigate("/orders")}
            className="w-10 h-10 rounded-full bg-[#dae2fd] flex items-center justify-center overflow-hidden border border-[#bfc7d2] cursor-pointer hover:ring-2 hover:ring-[#006194] transition-all"
            title="My Orders & Profile"
          >
            <img className="w-full h-full object-cover" alt="Profile" src={PROFILE_PHOTO} />
          </div>
        </div>
      </nav>
    </header>
  );
}
