import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { FaRegChartBar, FaRegFileAlt, FaRegUserCircle } from "react-icons/fa";

const items = [
  { label: "Profile", path: "/profile", icon: FaRegUserCircle },
  { label: "Analytics", path: "/analytics", icon: FaRegChartBar },
  { label: "Logs", path: "/logs", icon: FaRegFileAlt }
];

export const MobileNav = () => (
  <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-sky-200 bg-sky-50/95 px-3 py-1.5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 lg:hidden">
    {items.map((item) => {
      const Icon = item.icon;
      return (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => clsx(
            "flex flex-col items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-semibold transition",
            isActive
              ? "bg-violet-500/15 text-violet-600 dark:text-violet-200"
              : "text-slate-500 dark:text-slate-400"
          )}
        >
          <Icon className="h-4 w-4" />
          {item.label}
        </NavLink>
      );
    })}
  </nav>
);
