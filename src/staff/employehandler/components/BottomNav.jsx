import React from "react";

const items = [
  { icon: "dashboard", label: "Dashboard", active: true },
  { icon: "how_to_reg", label: "Attendance" },
];
const itemsRight = [
  { icon: "payments", label: "Payroll" },
  { icon: "settings", label: "Settings" },
];

const NavItem = ({ icon, label, active }) => (
  <a
    href="#"
    className={`flex flex-col items-center p-[8px] transition-colors ${
      active ? "text-[#004870] font-bold" : "text-[#40474f] hover:text-[#004870]"
    }`}
  >
    <span className="material-symbols-outlined text-[22px]">{icon}</span>
    <span className="text-[10px] mt-1">{label}</span>
  </a>
);

const BottomNav = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#f7f9fb] border-t border-[#bfc7d2] z-20 pb-safe">
      <ul className="flex justify-around items-center h-[64px]">
        {items.map((item) => (
          <li key={item.label} className="flex-1 flex justify-center">
            <NavItem {...item} />
          </li>
        ))}
        <li className="flex-1 flex justify-center relative -top-[16px]">
          <button className="w-[48px] h-[48px] rounded-full bg-[#004870] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform">
            <span className="material-symbols-outlined">add</span>
          </button>
        </li>
        {itemsRight.map((item) => (
          <li key={item.label} className="flex-1 flex justify-center">
            <NavItem {...item} />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNav;
