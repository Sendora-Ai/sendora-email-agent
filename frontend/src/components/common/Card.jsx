import clsx from "clsx";

export const Card = ({ children, className }) => (
  <section
    className={clsx(
      "rounded-lg border border-sky-200 bg-sky-50/90 shadow-sm shadow-sky-100/60 dark:border-slate-700/80 dark:bg-slate-900/80 dark:shadow-none",
      className
    )}
  >
    {children}
  </section>
);
