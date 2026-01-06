"use client";

import { useState } from "react";
import type { ElementType, FormEvent } from "react";
import Link from "next/link";
import { changePassword } from "src/services/authService";
import {
  Bell,
  CreditCard,
  Globe2,
  KeyRound,
  Lock,
  Mail,
  PlugZap,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Trash2,
  User,
  Users,
} from "lucide-react";

type Section = {
  id: string;
  label: string;
  description: string;
  icon: ElementType<{ className?: string }>;
};

type ToggleProps = {
  id: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
};

type Status = "idle" | "loading" | "success" | "error";

const getErrorMessage = (err: unknown) => {
  if (typeof err === "object" && err !== null) {
    const maybeResponse = err as { response?: { data?: { message?: string } } };
    if (maybeResponse.response?.data?.message) return maybeResponse.response.data.message;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
};

const sections: Section[] = [
  { id: "profile", label: "Profile", description: "Name, photo, contact", icon: User },
  { id: "security", label: "Security", description: "Password, 2FA, sessions", icon: ShieldCheck },
  { id: "privacy", label: "Privacy", description: "Visibility, data sharing", icon: SlidersHorizontal },
  { id: "notifications", label: "Notifications", description: "Email, push, digest", icon: Bell },
  { id: "billing", label: "Billing", description: "Plan, invoices, usage", icon: CreditCard },
  { id: "apps", label: "Connected Apps", description: "Integrations, API keys", icon: PlugZap },
  { id: "locale", label: "Language & Timezone", description: "Locale, time, region", icon: Globe2 },
  { id: "account", label: "Account", description: "Deactivate or delete", icon: Trash2 },
];

const Toggle = ({ id, label, description, defaultChecked }: ToggleProps) => (
  <label
    htmlFor={id}
    className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
  >
    <span>
      <span className="block font-semibold text-slate-900 dark:text-slate-100">{label}</span>
      <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{description}</span>
    </span>
    <span className="relative inline-flex h-6 w-11 flex-shrink-0 items-center">
      <input id={id} type="checkbox" className="peer sr-only" defaultChecked={defaultChecked} />
      <span className="absolute inset-0 rounded-full bg-slate-200 transition peer-checked:bg-emerald-500 dark:bg-slate-700" />
      <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5 dark:bg-slate-100" />
    </span>
  </label>
);

export default function AccountSettingsPage() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const hasPasswordInput = Boolean(currentPassword || newPassword || confirmPassword);

  const validationError = (() => {
    if (!currentPassword && !newPassword && !confirmPassword) return "";
    if (!currentPassword || !newPassword || !confirmPassword) return "Please fill out all password fields.";
    if (newPassword.length < 8) return "Password must be at least 8 characters.";
    if (newPassword !== confirmPassword) return "New passwords do not match.";
    return "";
  })();

  const handleChangePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validationError) {
      setStatus("error");
      setMessage("");
      return;
    }

    setStatus("loading");
    setMessage("");
    try {
      await changePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      setStatus("success");
      setMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setStatus("error");
      setMessage(getErrorMessage(err));
    }
  };

  const resetFeedback = () => {
    if (status !== "idle") {
      setStatus("idle");
      setMessage("");
    }
  };

  return (
    <div className="space-y-6">
      <header className="profile-reveal profile-stagger-1 relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.15),_transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.3),_transparent_60%)]" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-sky-200 via-emerald-100 to-transparent opacity-70 blur-2xl dark:from-sky-500/20 dark:via-emerald-500/20" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-gradient-to-br from-amber-100 via-white to-transparent opacity-70 blur-2xl dark:from-amber-500/10 dark:via-transparent" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Account settings</p>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Run your account like a pro</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-300">
              Keep profile, security, privacy, and billing in sync for every workspace you manage.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              Save changes
            </button>
            <Link
              href="/profile"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              View profile
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Security</p>
            <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">Healthy</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">2FA enabled, 3 active sessions</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Plan</p>
            <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">Pro workspace</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Renews Feb 12, 2026</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Notifications</p>
            <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">Tailored</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Email and push are on</p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="profile-reveal profile-stagger-2 h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:sticky lg:top-20">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Sections</p>
          <nav className="mt-3 space-y-1">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="group flex items-start gap-3 rounded-xl border border-transparent px-3 py-2 text-sm text-slate-600 transition hover:border-slate-200 hover:bg-slate-50 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800"
              >
                <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition group-hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:group-hover:text-white">
                  <section.icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block font-medium text-slate-900 dark:text-white">{section.label}</span>
                  <span className="block text-xs text-slate-400">{section.description}</span>
                </span>
              </a>
            ))}
          </nav>
        </aside>

        <div className="space-y-6">
          <section
            id="profile"
            className="profile-reveal profile-stagger-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Profile</p>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Personal information</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                  Update the details your team sees across the workspace.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Update profile
              </button>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[160px_minmax(0,1fr)]">
              <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-xl font-semibold text-white shadow-sm dark:bg-white dark:text-slate-900">
                  AR
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Amina Rahman</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Tenant Admin</p>
                </div>
                <button type="button" className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300">
                  Change photo
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="full-name" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Full name
                  </label>
                  <input
                    id="full-name"
                    name="full-name"
                    defaultValue="Amina Rahman"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label htmlFor="work-email" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Work email
                  </label>
                  <input
                    id="work-email"
                    name="work-email"
                    defaultValue="amina.rahman@workspace.com"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    defaultValue="+880 1711 000 000"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    defaultValue="Dhaka, BD"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>
          </section>
          <section
            id="security"
            className="profile-reveal rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Security</p>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Protect your account</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                  Add layers of verification and monitor active sessions.
                </p>
              </div>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
                2FA enabled
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {[
                {
                  icon: KeyRound,
                  title: "Password",
                  description: "Last updated 30 days ago",
                  action: (
                    <button
                      type="button"
                      onClick={() => setShowChangePassword((prev) => !prev)}
                      aria-expanded={showChangePassword}
                      aria-controls="change-password-panel"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Change password
                    </button>
                  ),
                },
                {
                  icon: ShieldCheck,
                  title: "Two-factor authentication",
                  description: "Authenticator app and backup codes",
                  action: (
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Review setup
                    </button>
                  ),
                },
                {
                  icon: Smartphone,
                  title: "Active sessions",
                  description: "3 devices currently signed in",
                  action: (
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Manage sessions
                    </button>
                  ),
                },
              ].map(({ icon: Icon, title, description, action }) => (
                <div
                  key={title}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
                    </div>
                  </div>
                  {action}
                </div>
              ))}
            </div>

            <div
              id="change-password-panel"
              className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                showChangePassword ? "mt-6 max-h-[560px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <form
                onSubmit={handleChangePassword}
                className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/80"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Change password</p>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">Update your password</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                      Use at least 8 characters with a mix of letters and numbers.
                    </p>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="current-password" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Current password
                    </label>
                    <input
                      id="current-password"
                      name="current-password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(event) => {
                        setCurrentPassword(event.target.value);
                        resetFeedback();
                      }}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="new-password" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      New password
                    </label>
                    <input
                      id="new-password"
                      name="new-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Create a new password"
                      value={newPassword}
                      onChange={(event) => {
                        setNewPassword(event.target.value);
                        resetFeedback();
                      }}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Confirm password
                    </label>
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(event) => {
                        setConfirmPassword(event.target.value);
                        resetFeedback();
                      }}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100"
                    />
                  </div>
                </div>

                {hasPasswordInput && validationError && status !== "success" && (
                  <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-200">
                    {validationError}
                  </p>
                )}

                {message && (
                  <p
                    className={`mt-4 rounded-lg px-3 py-2 text-xs ${
                      status === "success"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200"
                        : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-200"
                    }`}
                    role="status"
                  >
                    {message}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    You will be asked to sign in again after updating.
                  </p>
                  <button
                    type="submit"
                    disabled={status === "loading" || (hasPasswordInput && !!validationError)}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                  >
                    {status === "loading" ? "Updating..." : "Update password"}
                  </button>
                </div>
              </form>
            </div>
          </section>

          <section
            id="privacy"
            className="profile-reveal rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Privacy</p>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Control your visibility</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                  Decide what your teammates and integrations can access.
                </p>
              </div>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                Workspace scoped
              </span>
            </div>

            <div className="mt-5 grid gap-3">
              <Toggle
                id="public-profile"
                label="Public profile"
                description="Show name, role, and avatar to everyone in your tenant."
                defaultChecked
              />
              <Toggle
                id="share-usage"
                label="Share usage analytics"
                description="Help improve the platform by sharing anonymous analytics."
              />
              <Toggle
                id="discoverable"
                label="Allow team discovery"
                description="Let admins find you in the people directory."
                defaultChecked
              />
            </div>
          </section>
          <section
            id="notifications"
            className="profile-reveal rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Notifications</p>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Stay informed</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                  Choose how and when we should reach you.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Manage channels
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                {
                  id: "notify-product",
                  label: "Product updates",
                  description: "Monthly release notes and feature updates.",
                  defaultChecked: true,
                },
                {
                  id: "notify-security",
                  label: "Security alerts",
                  description: "Critical security events and suspicious logins.",
                  defaultChecked: true,
                },
                {
                  id: "notify-billing",
                  label: "Billing activity",
                  description: "Invoice reminders and payment confirmations.",
                  defaultChecked: false,
                },
                {
                  id: "notify-digest",
                  label: "Weekly digest",
                  description: "Performance summary and team highlights.",
                  defaultChecked: true,
                },
              ].map(({ id, label, description, defaultChecked }) => (
                <label
                  key={id}
                  htmlFor={id}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
                >
                  <input
                    id={id}
                    type="checkbox"
                    defaultChecked={defaultChecked}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>
                    <span className="block font-semibold text-slate-900 dark:text-white">{label}</span>
                    <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{description}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section
            id="billing"
            className="profile-reveal rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Billing</p>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Plan and usage</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                  Manage subscriptions, payment methods, and invoices.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-500"
              >
                Manage billing
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900/80">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Plan</p>
                <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">Pro</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">$49 / month</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900/80">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Usage</p>
                <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">74%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">220 / 300 seats</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900/80">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Next invoice</p>
                <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">$1,078</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Due Feb 12, 2026</p>
              </div>
            </div>
          </section>
          <section
            id="apps"
            className="profile-reveal rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Connected apps</p>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Integrations</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                  Manage apps, tokens, and automations.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                View API keys
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {[
                {
                  name: "Slack",
                  description: "Message alerts and workflow sync",
                  status: "Connected",
                },
                {
                  name: "Google Workspace",
                  description: "Calendar and SSO",
                  status: "Connected",
                },
                {
                  name: "Zapier",
                  description: "Automation pipelines",
                  status: "Limited",
                },
              ].map((app) => (
                <div
                  key={app.name}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{app.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{app.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                      {app.status}
                    </span>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            id="locale"
            className="profile-reveal rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Language & time</p>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Regional settings</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                  Set your language, time zone, and date format.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Save preferences
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="language" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Language
                </label>
                <select
                  id="language"
                  name="language"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100"
                  defaultValue="en"
                >
                  <option value="en">English (US)</option>
                  <option value="en-uk">English (UK)</option>
                  <option value="bn">Bangla</option>
                </select>
              </div>
              <div>
                <label htmlFor="timezone" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Time zone
                </label>
                <select
                  id="timezone"
                  name="timezone"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100"
                  defaultValue="asia-dhaka"
                >
                  <option value="asia-dhaka">Asia/Dhaka (GMT+6)</option>
                  <option value="asia-kolkata">Asia/Kolkata (GMT+5:30)</option>
                  <option value="asia-singapore">Asia/Singapore (GMT+8)</option>
                  <option value="utc">UTC</option>
                </select>
              </div>
              <div>
                <label htmlFor="date-format" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Date format
                </label>
                <select
                  id="date-format"
                  name="date-format"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100"
                  defaultValue="dd-mm-yyyy"
                >
                  <option value="dd-mm-yyyy">DD / MM / YYYY</option>
                  <option value="mm-dd-yyyy">MM / DD / YYYY</option>
                  <option value="yyyy-mm-dd">YYYY / MM / DD</option>
                </select>
              </div>
              <div>
                <label htmlFor="region" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Region
                </label>
                <input
                  id="region"
                  name="region"
                  defaultValue="Bangladesh"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100"
                />
              </div>
            </div>
          </section>

          <section
            id="account"
            className="profile-reveal rounded-2xl border border-red-200 bg-red-50/70 p-6 shadow-sm dark:border-red-900/40 dark:bg-red-950/40"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-red-400">Account</p>
                <h2 className="text-lg font-semibold text-red-700 dark:text-red-200">Danger zone</h2>
                <p className="mt-1 text-sm text-red-600/80 dark:text-red-200/70">
                  Disable your account or permanently delete your data.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 shadow-sm transition hover:bg-red-50 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
              >
                Contact support
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-red-200 bg-white/80 p-4 text-sm text-red-600 shadow-sm dark:border-red-900/50 dark:bg-red-950/60 dark:text-red-200">
                <p className="font-semibold text-red-700 dark:text-red-100">Deactivate account</p>
                <p className="mt-1 text-xs text-red-500 dark:text-red-300">
                  Temporarily disable access without losing data.
                </p>
                <button
                  type="button"
                  className="mt-3 inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 shadow-sm transition hover:bg-red-50 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
                >
                  Deactivate
                </button>
              </div>
              <div className="rounded-xl border border-red-200 bg-white/80 p-4 text-sm text-red-600 shadow-sm dark:border-red-900/50 dark:bg-red-950/60 dark:text-red-200">
                <p className="font-semibold text-red-700 dark:text-red-100">Delete account</p>
                <p className="mt-1 text-xs text-red-500 dark:text-red-300">
                  Permanently remove all data. This cannot be undone.
                </p>
                <button
                  type="button"
                  className="mt-3 inline-flex items-center justify-center rounded-xl bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-red-500"
                >
                  Delete account
                </button>
              </div>
            </div>
          </section>

          <section className="profile-reveal rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Quick links</p>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">More tools</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                  Jump to other account utilities when needed.
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Email preferences", icon: Mail },
                { label: "Team members", icon: Users },
                { label: "Sign-in methods", icon: Lock },
              ].map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-left text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
