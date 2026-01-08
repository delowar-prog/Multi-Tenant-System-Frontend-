"use client";

import { useState } from "react";
import { useAuth } from "src/context/authContext";
import { login } from "src/services/authService";
import Link from "next/link";

export default function LoginForm() {
  const { setUser } = useAuth();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const data = await login(email, password);
      setUser(data.user);
      // Redirect based on Super Admin or Tenant
      if (data.user.is_super_admin) {
        window.location.href = "/superadmin/dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-emerald-100 bg-white/90 p-8 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
      <h2 className="mb-6 text-center text-2xl font-bold text-slate-900 dark:text-slate-100">
        Sign in to your account
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-slate-900 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder-slate-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-400">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-slate-900 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder-slate-500"
            placeholder="Enter your password"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-200">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-600 py-2.5 font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Don't have an account?{" "}
        <a href="/register" className="text-emerald-700 hover:underline dark:text-emerald-400">
          Register
        </a>
      </p>
    </div>
  );
}
