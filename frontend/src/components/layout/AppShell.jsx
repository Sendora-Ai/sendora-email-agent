import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNav } from "./MobileNav";
import { useAuth } from "../../hooks/useAuth";
import { useProfileSettings } from "../../hooks/useProfileSettings";

export const AppShell = () => {
  const { isAuthed } = useAuth();
  const location = useLocation();
  const { data } = useProfileSettings();
  const MotionDiv = motion.div;

  if (!isAuthed) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-sky-100 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar />
      <Topbar email={data?.profile?.email} />
      <main className="pb-20 pt-4 lg:ml-64 lg:pb-8">
        <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-7">
          <AnimatePresence mode="wait">
            <MotionDiv
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </MotionDiv>
          </AnimatePresence>
        </div>
      </main>
      <MobileNav />
    </div>
  );
};
