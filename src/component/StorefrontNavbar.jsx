import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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

export default function StorefrontNavbar({ cartCount = 0, searchValue = "", onSearchChange = () => { } }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showOffersNotif, setShowOffersNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();

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

          {/* User Account / Sign In */}
          {user && !user.isGuest ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-[#eff4ff] transition-all border border-[#bfc7d2]"
                title="Account Menu"
              >
                <div className="w-8 h-8 rounded-full bg-[#006a61] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                  {user.name.charAt(0)}
                </div>
                <span className="text-xs font-bold text-[#0b1c30] max-w-[90px] truncate hidden sm:inline">
                  {user.name.split(" ")[0]}
                </span>
                <span className="material-symbols-outlined text-sm text-[#707881]">expand_more</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-[#bfc7d2] p-2 z-50 animate-in fade-in">
                  <div className="px-3 py-2 border-b border-[#bfc7d2]/30 mb-1">
                    <p className="text-xs font-bold text-[#0b1c30] truncate">{user.name}</p>
                    <p className="text-[10px] text-[#707881] truncate">{user.email || user.phone}</p>
                    <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider bg-[#006a61]/10 text-[#006a61] px-2 py-0.5 rounded-full">
                      {user.roleTitle || user.role}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate("/orders");
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-[#3f4850] hover:bg-[#eff4ff] hover:text-[#006194] rounded-lg transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">local_shipping</span>
                    My Orders
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate("/");
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-[#3f4850] hover:bg-[#eff4ff] hover:text-[#006194] rounded-lg transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">storefront</span>
                    Portal Entrance
                  </button>

                  <div className="border-t border-[#bfc7d2]/30 my-1 pt-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">logout</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/login?role=customer")}
                className="px-3.5 py-1.5 bg-[#006194] hover:bg-[#007bb9] text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">login</span>
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
