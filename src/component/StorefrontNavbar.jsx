import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

const NAV_LINKS = [
  { label: "Storefront", path: "/storefront", icon: "storefront" },
  { label: "My Orders", path: "/orders", icon: "local_shipping" },
  { label: "Special Offers", path: "/offers", icon: "sell" },
  { label: "Help & Support", path: "/help", icon: "help" },
];

export default function StorefrontNavbar({ cartCount = 0, searchValue = "", onSearchChange = () => {} }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm h-20 flex items-center border-b border-[#bfc7d2]/30">
        <nav className="max-w-[1280px] mx-auto w-full px-4 sm:px-8 flex justify-between items-center h-full">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <div 
              onClick={() => navigate("/storefront")}
              className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
              title="Krishna Store Home"
            >
              <div className="w-10 h-10 rounded-xl bg-[#006194] text-white flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-[24px]">shopping_basket</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#006194] tracking-tight leading-none">
                  Krishna Store
                </h1>
                <span className="text-[10px] text-[#006a61] font-semibold tracking-wider uppercase block mt-0.5">
                  Supermarket & POS
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-5">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    className={`font-semibold text-sm transition-all px-2.5 py-1 rounded-lg ${
                      isActive
                        ? "text-[#006194] bg-[#eff4ff]"
                        : "text-[#3f4850] hover:text-[#006194] hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="flex-1 max-w-sm mx-4 hidden md:block">
            <div className={`relative transition-all ${searchFocused ? "ring-2 ring-[#006194]" : ""} rounded-full bg-[#f2f4f6]`}>
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#707881] text-[18px]">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-transparent border-none rounded-full text-xs sm:text-sm focus:outline-none transition-all placeholder:text-gray-400"
                placeholder="Search fresh groceries & staples..."
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3 relative">
            {/* Shopping Cart Button */}
            <button
              onClick={() => navigate("/shop")} 
              className="p-2 text-[#3f4850] hover:text-[#006194] hover:bg-[#eff4ff] rounded-xl transition-all relative"
              title="View Basket"
            >
              <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ba1a1a] text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-bold px-1 shadow-sm animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
            
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications((prev) => !prev)}
                className="p-2 text-[#3f4850] hover:text-[#006194] hover:bg-[#eff4ff] rounded-xl transition-all relative"
                title="Notifications"
              >
                <span className="material-symbols-outlined text-[24px]">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#006194] rounded-full border-2 border-white ring-1 ring-[#006194]" />
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="fixed sm:absolute right-4 sm:right-0 top-20 sm:top-12 w-[calc(100vw-2rem)] sm:w-80 bg-white rounded-2xl shadow-2xl border border-[#bfc7d2] p-4 z-[100] animate-in fade-in max-h-[80vh] flex flex-col">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#bfc7d2]/30">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#006194]">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-[#6ffbbe] text-[#005236] font-bold px-2 py-0.5 rounded-full">
                          {unreadCount} New
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] font-semibold text-[#006194] hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 text-xs text-[#3f4850] overflow-y-auto max-h-[50vh] pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-center py-6 text-gray-400">No notifications yet</p>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markAsRead(n.id);
                            setShowNotifications(false);
                            if (n.link) navigate(n.link);
                          }}
                          className={`p-2.5 rounded-xl transition-colors cursor-pointer flex items-start gap-2.5 ${
                            n.read ? "bg-[#f8f9ff] hover:bg-[#eff4ff]" : "bg-[#eef4ff] hover:bg-[#dce9ff] font-medium"
                          }`}
                        >
                          <span
                            className="material-symbols-outlined text-[16px] p-1.5 rounded-md text-white flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: n.color || "#006194" }}
                          >
                            {n.icon || "info"}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[#0b1c30] truncate">{n.title}</p>
                            <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{n.message}</p>
                            <span className="text-[9px] text-gray-400 mt-1 block">{n.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <button
                    onClick={() => { setShowNotifications(false); navigate("/orders"); }}
                    className="w-full mt-3 py-2 bg-[#006194] text-white rounded-lg text-xs font-bold hover:bg-[#007bb9] transition-colors"
                  >
                    View Order Updates
                  </button>
                </div>
              )}
            </div>

            {/* User Profile / Sign In */}
            {user && !user.isGuest ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 p-1 rounded-full hover:bg-[#eff4ff] transition-all border border-[#bfc7d2]"
                  title="Account Menu"
                >
                  <div className="w-8 h-8 rounded-full bg-[#006a61] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-[#0b1c30] max-w-[80px] truncate hidden sm:inline">
                    {user.name.split(" ")[0]}
                  </span>
                  <span className="material-symbols-outlined text-sm text-[#707881]">expand_more</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-[#bfc7d2] p-2 z-[100] animate-in fade-in">
                    <div className="px-3 py-2 border-b border-[#bfc7d2]/30 mb-1">
                      <p className="text-xs font-bold text-[#0b1c30] truncate">{user.name}</p>
                      <p className="text-[10px] text-[#707881] truncate">{user.email || user.phone}</p>
                      <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider bg-[#006a61]/10 text-[#006a61] px-2 py-0.5 rounded-full">
                        {user.roleTitle || user.role}
                      </span>
                    </div>

                    <button
                      onClick={() => { setShowUserMenu(false); navigate("/orders"); }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-[#3f4850] hover:bg-[#eff4ff] hover:text-[#006194] rounded-lg transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">local_shipping</span>
                      Order History
                    </button>

                    <button
                      onClick={() => { setShowUserMenu(false); navigate("/"); }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-[#3f4850] hover:bg-[#eff4ff] hover:text-[#006194] rounded-lg transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">storefront</span>
                      All Portals
                    </button>

                    <div className="border-t border-[#bfc7d2]/30 my-1 pt-1">
                      <button
                        onClick={() => { setShowUserMenu(false); logout(); }}
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
              <button
                onClick={() => navigate("/login?role=customer")}
                className="px-3.5 py-1.5 bg-[#006194] hover:bg-[#007bb9] text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">login</span>
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#3f4850] hover:text-[#006194] hover:bg-[#eff4ff] rounded-xl transition-colors ml-1"
              title="Menu"
            >
              <span className="material-symbols-outlined text-[26px]">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden pt-20 animate-in fade-in">
          <div className="bg-white border-b border-[#bfc7d2] px-6 py-6 space-y-4 shadow-2xl">
            {/* Mobile Search */}
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707881] text-[18px]">
                search
              </span>
              <input
                className="w-full pl-9 pr-4 py-2 bg-[#f2f4f6] rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#006194]"
                placeholder="Search groceries..."
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>

            {/* Links */}
            <div className="space-y-1 pt-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm ${
                    location.pathname === link.path
                      ? "bg-[#eff4ff] text-[#006194]"
                      : "text-[#3f4850] hover:bg-gray-50"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
              <button
                onClick={() => { setMobileMenuOpen(false); navigate("/shop"); }}
                className="flex items-center gap-2 text-xs font-bold text-[#006194] bg-[#eff4ff] px-4 py-2 rounded-xl"
              >
                <span className="material-symbols-outlined text-sm">shopping_cart</span>
                View Cart ({cartCount})
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); navigate("/"); }}
                className="text-xs font-semibold text-[#707881] hover:underline"
              >
                Switch Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
