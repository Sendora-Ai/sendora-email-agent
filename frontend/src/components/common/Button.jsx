import clsx from "clsx";

const variants = {
  primary: "bg-violet-300 text-violet-950 hover:bg-violet-200 dark:bg-violet-300 dark:text-violet-950",
  success: "bg-emerald-400 text-emerald-950 hover:bg-emerald-300",
  ghost: "border border-sky-200 bg-sky-50 text-slate-700 hover:bg-sky-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
  subtle: "bg-sky-100 text-slate-700 hover:bg-sky-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
};

export const Button = ({ children, className, variant = "primary", ...props }) => (
  <button
    type="button"
    className={clsx(
      "inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
      variants[variant],
      className
    )}
    {...props}
  >
    {children}
  </button>
);
