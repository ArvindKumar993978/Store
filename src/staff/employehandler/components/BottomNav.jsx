import React from "react";
import { useNavigate } from "react-router-dom";

const items = [
  { id: "dashboard", icon: "dashboard", label: "Dashboard" },
  { id: "attendance", icon: "how_to_reg", label: "Attendance" },
];
const itemsRight = [
  { id: "payroll", icon: "payments", label: "Payroll" },
  { id: "settings", icon: "settings", label: "Settings" },
];

const NavItem = ({ icon, label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex flex-col items-center p-[8px] transition-colors ${
      active ? "text-[#004870] font-bold" : "text-[#40474f] hover:text-[#004870]"
    }`}
  >
    <span className="material-symbols-outlined text-[22px]">{icon}</span>
    <span className="text-[10px] mt-1">{label}</span>
  </button>
);

const BottomNav = ({ activeItem = "dashboard", onNavigate }) => {
  const navigate = useNavigate();

  const handleNav = (id) => {
    if (id === "settings") {
      navigate("/settings");
    } else {
      onNavigate?.(id);
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#f7f9fb] border-t border-[#bfc7d2] z-20 pb-safe">
      <ul className="flex justify-around items-center h-[64px]">
        {items.map((item) => (
          <li key={item.id} className="flex-1 flex justify-center">
            <NavItem
              {...item}
              active={activeItem === item.id}
              onClick={() => handleNav(item.id)}
            />
          </li>
        ))}
        <li className="flex-1 flex justify-center relative -top-[16px]">
          <button
            onClick={() => onNavigate?.("attendance")}
            title="Quick Attendance"
            className="w-[48px] h-[48px] rounded-full bg-[#004870] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform hover:bg-[#006194]"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </li>
        {itemsRight.map((item) => (
          <li key={item.id} className="flex-1 flex justify-center">
            <NavItem
              {...item}
              active={activeItem === item.id}
              onClick={() => handleNav(item.id)}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNav;
