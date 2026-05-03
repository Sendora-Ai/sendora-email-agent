import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { FaRegChartBar, FaRegFileAlt, FaRegUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { useAuth } from "../../hooks/useAuth";

const items = [
  { label: "Profile & Rules", path: "/profile", icon: FaRegUserCircle },
  { label: "Analytics", path: "/analytics", icon: FaRegChartBar },
  { label: "Drafts & Replies", path: "/logs", icon: FaRegFileAlt }
];

export const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sky-200 bg-sky-50 px-5 py-6 dark:border-slate-800 dark:bg-slate-950 lg:flex">
      <div className="flex items-start gap-3">
        <HiSparkles className="mt-1 h-6 w-6 text-violet-400" />
        <div>
          <p className="text-xl font-bold tracking-tight text-violet-500 dark:text-violet-300">Sendora AI</p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Intelligent Gmail</p>
        </div>
      </div>

      <nav className="mt-12 flex flex-col gap-1.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => clsx(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition",
                isActive
                  ? "bg-violet-500/15 text-violet-700 ring-1 ring-violet-400/30 dark:bg-violet-400/20 dark:text-violet-100"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={logout}
        className="mt-auto flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-sky-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
      >
        <FiLogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  );
};
