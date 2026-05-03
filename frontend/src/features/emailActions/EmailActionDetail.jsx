import { AnimatePresence, motion } from "framer-motion";
import { FiArrowLeft, FiCheckCircle, FiFileText, FiCornerUpLeft, FiX } from "react-icons/fi";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { formatDateTime, titleCase } from "../../utils/formatters";

export const EmailActionDetail = ({ item, onClose, onToggleChecked, isSaving }) => (
  <AnimatePresence>
    {item && (
      <EmailActionDetailContent
        item={item}
        onClose={onClose}
        onToggleChecked={onToggleChecked}
        isSaving={isSaving}
      />
    )}
  </AnimatePresence>
);

const EmailActionDetailContent = ({ item, onClose, onToggleChecked, isSaving }) => {
  const MotionDiv = motion.div;
  const MotionAside = motion.aside;

  return (
      <>
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
        <MotionAside
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 280, damping: 30 }}
          className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-sky-200 bg-sky-50 shadow-2xl dark:border-slate-700 dark:bg-slate-950 sm:w-[480px]"
        >
          <header className="flex items-center justify-between border-b border-sky-200 p-4 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <button type="button" onClick={onClose} className="rounded-md p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                <FiArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-bold text-slate-950 dark:text-slate-50">
                {titleCase(item.type)} Details
              </h2>
            </div>
            <button type="button" onClick={onClose} className="rounded-md p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              <FiX className="h-5 w-5" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid gap-4 border-b border-sky-200 pb-5 dark:border-slate-800 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Subject</p>
                <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{item.subject || "No subject"}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">To</p>
                <p className="mt-2 text-slate-600 dark:text-slate-300">{item.to || "Unknown"}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Label</p>
                <Badge tone="violet" className="mt-2">{item.label || "Unlabeled"}</Badge>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-200">
                {item.type === "reply" ? <FiCornerUpLeft className="h-4 w-4" /> : <FiFileText className="h-4 w-4" />}
                Generated {item.type}
              </p>
              <p className="text-sm text-slate-400">{formatDateTime(item.createdAt)}</p>
            </div>

            <div className="mt-4 whitespace-pre-wrap rounded-lg border border-sky-200 bg-sky-100 p-4 text-sm leading-6 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              {item.body || "No generated body stored."}
            </div>

            <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Original Thread Context</p>
              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Source message id: {item.sourceMessageId || "Unavailable"}
              </p>
            </div>
          </div>

          <footer className="flex flex-col gap-3 border-t border-sky-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="ghost" onClick={onClose}>Close</Button>
            <Button
              variant={item.checked ? "ghost" : "success"}
              onClick={() => onToggleChecked(item)}
              disabled={isSaving}
            >
              <FiCheckCircle className="h-4 w-4" />
              {item.checked ? "Mark as Unchecked" : "Mark as Checked"}
            </Button>
          </footer>
        </MotionAside>
      </>
  );
};
