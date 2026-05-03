import clsx from "clsx";

const controlClass =
  "w-full rounded-md border border-sky-200 bg-sky-50 px-2.5 py-1.5 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500";

export const Input = ({ className, ...props }) => (
  <input className={clsx(controlClass, className)} {...props} />
);

export const Textarea = ({ className, ...props }) => (
  <textarea className={clsx(controlClass, "min-h-28 resize-y leading-5", className)} {...props} />
);

export const Select = ({ className, children, ...props }) => (
  <select className={clsx(controlClass, className)} {...props}>
    {children}
  </select>
);

export const Toggle = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={clsx(
      "relative h-5 w-9 rounded-full transition disabled:cursor-not-allowed disabled:opacity-50",
      checked ? "bg-emerald-400" : "bg-slate-300 dark:bg-slate-700"
    )}
    aria-pressed={checked}
  >
    <span
      className={clsx(
        "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition",
        checked ? "left-[18px]" : "left-0.5"
      )}
    />
  </button>
);
