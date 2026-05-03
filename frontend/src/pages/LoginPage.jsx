import { Navigate } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { Button } from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";

export const LoginPage = () => {
  const { isAuthed, loginUrl } = useAuth();

  if (isAuthed) return <Navigate to="/profile" replace />;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <section className="w-full max-w-xl rounded-lg border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-violet-950/30">
        <div className="flex items-center gap-3">
          <HiSparkles className="h-8 w-8 text-violet-300" />
          <div>
            <h1 className="text-3xl font-bold text-violet-200">Sendora AI</h1>
            <p className="text-sm text-slate-400">Intelligent Gmail automation</p>
          </div>
        </div>

        <p className="mt-8 text-lg leading-7 text-slate-300">
          Connect Gmail to classify unread emails, create drafts or replies, and review everything from one calm dashboard.
        </p>

        <a href={loginUrl} className="mt-8 inline-flex">
          <Button variant="success">
            <FiMail className="h-4 w-4" />
            Continue with Google
          </Button>
        </a>
      </section>
    </main>
  );
};
