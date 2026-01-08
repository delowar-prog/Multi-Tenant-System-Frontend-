import Link from "next/link";
import DarkModeToggle from "src/app/darkModeToggle";

// src/app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F4F8F2] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.15),_transparent_60%)]" />
      <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-gradient-to-br from-emerald-200 via-teal-100 to-transparent opacity-70 blur-3xl dark:from-emerald-500/10 dark:via-cyan-500/5" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-gradient-to-br from-amber-100 via-white to-transparent opacity-70 blur-3xl dark:from-amber-500/10 dark:via-transparent" />

      <div className="absolute right-6 top-6 z-20 flex items-center gap-3">
        <Link
          href="/"
          className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-xs font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-800 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:text-white sm:inline-flex"
        >
          Back to landing
        </Link>
        <DarkModeToggle />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  );
}
