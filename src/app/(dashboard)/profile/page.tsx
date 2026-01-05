"use client";

import { useEffect, useMemo, useState } from "react";
import type { ElementType } from "react";
import { Building2, KeyRound, Mail, MapPin, Phone, ShieldCheck, Users } from "lucide-react";
import { fetchProfile } from "src/services/profileServices";
import type { ProfileResponse } from "src/services/profileServices";

type InfoRowProps = {
  icon: ElementType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
};

type StatCardProps = {
  icon: ElementType<{ className?: string }>;
  label: string;
  value: string | number;
};

const formatLabel = (value: string) =>
  value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getInitials = (name: string) => {
  const parts = name.trim().split(" ").filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";
};

const InfoRow = ({ icon: Icon, label, value, href }: InfoRowProps) => (
  <div className="flex items-start gap-3">
    <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
      <Icon className="h-4 w-4" />
    </span>
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      {href ? (
        <a href={href} className="text-sm font-medium text-slate-800 hover:text-slate-900 dark:text-slate-100">
          {value}
        </a>
      ) : (
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{value}</p>
      )}
    </div>
  </div>
);

const StatCard = ({ icon: Icon, label, value }: StatCardProps) => (
  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
      <Icon className="h-4 w-4" />
    </span>
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-lg font-semibold text-slate-900 dark:text-white">{value}</p>
    </div>
  </div>
);

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await fetchProfile();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const initials = useMemo(() => {
    if (!profile?.user?.name) return "U";
    return getInitials(profile.user.name);
  }, [profile]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="profile-reveal profile-stagger-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="h-6 w-40 rounded bg-slate-200/70 dark:bg-slate-700/60" />
          <div className="mt-4 h-12 w-72 rounded bg-slate-200/70 dark:bg-slate-700/60" />
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="h-16 rounded-xl bg-slate-200/70 dark:bg-slate-700/60" />
            <div className="h-16 rounded-xl bg-slate-200/70 dark:bg-slate-700/60" />
            <div className="h-16 rounded-xl bg-slate-200/70 dark:bg-slate-700/60" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="profile-reveal profile-stagger-2 h-56 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900" />
          <div className="profile-reveal profile-stagger-3 h-56 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900" />
          <div className="profile-reveal profile-stagger-4 h-56 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:col-span-3" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
        {error}
      </div>
    );
  }

  if (!profile) return null;

  const { user, roles, permissions } = profile;
  const isSuperAdmin = Number(user.is_super_admin) === 1;
  const roleCount = roles.length;
  const permissionCount = permissions.length;

  return (
    <div className="space-y-6">
      <section className="profile-reveal profile-stagger-1 relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),_transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.3),_transparent_60%)]" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-sky-200 via-indigo-200 to-transparent opacity-70 blur-2xl dark:from-sky-500/20 dark:via-indigo-500/20" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-gradient-to-br from-emerald-100 via-white to-transparent opacity-70 blur-2xl dark:from-emerald-500/10 dark:via-transparent" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-xl font-semibold text-white shadow-lg dark:bg-white dark:text-slate-900">
              {initials}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{user.name}</h1>
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  {isSuperAdmin ? "Super Admin" : "Tenant Member"}
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-300">{user.email}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-300">
                <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 dark:border-slate-700 dark:bg-slate-900/80">
                  User ID: {user.id}
                </span>
                <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 dark:border-slate-700 dark:bg-slate-900/80">
                  Tenant: {user.tenant_id ?? "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-3">
            <StatCard icon={Users} label="Roles" value={roleCount} />
            <StatCard icon={KeyRound} label="Permissions" value={permissionCount} />
            <StatCard icon={ShieldCheck} label="Status" value={isSuperAdmin ? "Elevated" : "Active"} />
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="profile-reveal profile-stagger-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Account</p>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Contact and Organization</h2>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Profile
            </span>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <InfoRow icon={Mail} label="Email" value={user.email} href={`mailto:${user.email}`} />
            <InfoRow icon={Phone} label="Phone" value={user.phone ?? "Not set"} href={user.phone ? `tel:${user.phone}` : undefined} />
            <InfoRow icon={MapPin} label="Address" value={user.address ?? "Not set"} />
            <InfoRow icon={Building2} label="Tenant ID" value={user.tenant_id ?? "N/A"} />
          </div>
        </section>

        <section className="profile-reveal profile-stagger-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Roles</p>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Assigned Roles</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Role-based access for this tenant.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {roles.map((role) => (
              <span
                key={role}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {formatLabel(role)}
              </span>
            ))}
            {roles.length === 0 && (
              <span className="text-sm text-slate-500 dark:text-slate-300">No roles assigned</span>
            )}
          </div>
        </section>

        <section className="profile-reveal profile-stagger-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Permissions</p>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Access Permissions</h2>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {permissionCount} total
            </span>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {permissions.map((permission) => (
              <div
                key={permission}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                  <KeyRound className="h-4 w-4" />
                </span>
                <span className="font-medium">{formatLabel(permission)}</span>
              </div>
            ))}
            {permissions.length === 0 && (
              <span className="text-sm text-slate-500 dark:text-slate-300">No permissions assigned</span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
