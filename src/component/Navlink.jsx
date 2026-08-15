import { NavLink } from "react-router-dom";

<NavLink
  to={item.path}
  className={({ isActive }) =>
    isActive
      ? "flex items-center gap-4 px-4 py-2 rounded-lg text-[#006194] font-bold border-r-4 border-[#006194] bg-[#eff4ff]"
      : "flex items-center gap-4 px-4 py-2 rounded-lg text-[#3f4850] hover:text-[#006194] hover:bg-[#e5eeff]"
  }
>
  <span className="material-symbols-outlined">{item.icon}</span>
  <span>{item.label}</span>
</NavLink>