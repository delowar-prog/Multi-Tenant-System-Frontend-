"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "src/context/authContext";
import { api } from "src/lib/api";
import IconComponent from "./iconComponent";

type OpenState = {
  userMgmt: boolean;
  config: boolean;
  institutions: boolean;
  academics: boolean;
  documents: boolean;
};

type SidebarProps = {
  open: OpenState;
  setOpen: React.Dispatch<React.SetStateAction<OpenState>>;
  onNavigate?: () => void;
  isCollapsed: boolean;
};

type IconName =
  | "menu"
  | "clock"
  | "mail"
  | "chev-down"
  | "chev-up"
  | "close"
  | "calendar"
  | "user"
  | "users"
  | "id"
  | "dot"
  | "panel-left-close"
  | "panel-right-open"
  | "edit"
  | "delete"
  | "sun"
  | "moon";

export default function Sidebar({ open, setOpen, onNavigate, isCollapsed }: SidebarProps) {
  const { loading, can, canAny, me } = useAuth();
  const [isImpersonating, setIsImpersonating] = useState(false);

  useEffect(() => {
    const updateImpersonation = () => {
      if (typeof window === "undefined") return;
      setIsImpersonating(Boolean(localStorage.getItem("token_impersonation")));
    };

    updateImpersonation();
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "token_impersonation") {
        updateImpersonation();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("impersonation-changed", updateImpersonation);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("impersonation-changed", updateImpersonation);
    };
  }, []);

  const handleStopImpersonation = async () => {
    if (typeof window === "undefined") return;
    try {
      await api.post("/impersonation/exit");
    } catch (err) {
      console.error("Failed to exit impersonation:", err);
    }
    localStorage.removeItem("token_impersonation");
    const userToken = localStorage.getItem("token");
    if (userToken) {
      api.defaults.headers.common.Authorization = `Bearer ${userToken}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
    setIsImpersonating(false);
    window.dispatchEvent(new Event("impersonation-changed"));
  };
  const LinkItem: React.FC<{
    icon: IconName;
    label: string;
    href: string;
    active?: boolean;
  }> = ({ icon, label, href, active }) => (
    <a
      href={href}
      onClick={onNavigate}
      className={`group relative flex items-center gap-3 px-3 py-2 text-[14px]
      ${active ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"}`}
      title={isCollapsed ? label : undefined}
    >
      {/* left active bar */}
      <span
        className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full
          ${active ? "bg-indigo-500" : "bg-transparent group-hover:bg-slate-300"}`}
      />
      <span
        className={`inline-flex h-8 w-8 items-center justify-center border
          ${active ? "border-indigo-200 bg-white text-indigo-600 dark:border-indigo-700 dark:bg-slate-800 dark:text-indigo-400" : "border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"}
          shadow-sm group-hover:shadow`}
      >
        <IconComponent name={icon} className="h-4 w-4" />
      </span>
      {!isCollapsed && <span className="truncate">{label}</span>}
    </a>
  );

  const Group: React.FC<{
    title: string;
    icon: IconName;
    isOpenKey: keyof OpenState;
    children: React.ReactNode;
  }> = ({ title, icon, isOpenKey, children }) => (
    <div className="space-y-1">
      <button
        onClick={() => setOpen((s) => ({ ...s, [isOpenKey]: !s[isOpenKey] }))}
        className="flex w-full items-center justify-between px-3 py-2 text-left text-[13px] font-semibold text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
      >
        <span className="inline-flex items-center gap-2">
          <IconComponent name={icon} className="h-4 w-4 text-slate-400" />
          {!isCollapsed && title}
        </span>
        {!isCollapsed && (
          <IconComponent name={open[isOpenKey] ? "chev-up" : "chev-down"} className="h-4 w-4 text-slate-400" />
        )}
      </button>
      <div className={`${open[isOpenKey] && !isCollapsed ? "block" : "hidden"} space-y-1 pl-1.5`}>{children}</div>
    </div>
  );

  return (
    <nav className="h-full overflow-y-auto border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {isImpersonating && (
        <div className="mb-3 flex items-center justify-between gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-amber-800 dark:border-amber-700/40 dark:bg-amber-900/30 dark:text-amber-200">
          <span>You are impersonating this tenant</span>
          <button
            type="button"
            onClick={handleStopImpersonation}
            className="rounded border border-amber-300 bg-amber-100 px-2 py-1 text-[10px] font-semibold uppercase text-amber-900 hover:bg-amber-200 dark:border-amber-700 dark:bg-amber-800/60 dark:text-amber-100 dark:hover:bg-amber-800"
          >
            Stop
          </button>
        </div>
      )}
      <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Main</div>
      <div className="flex flex-col gap-1">

        <LinkItem icon="user" label="Dashboard" href={me?.is_super_admin ? "/superadmin/dashboard" : "/dashboard"} />
        <Group title="Organization Config" icon="users" isOpenKey="userMgmt">
          {me?.is_super_admin ?
            <LinkItem icon="user" label="Organization" href={"/superadmin/organization"} /> : ''
          }
          {/* {can("view-branches") && ( */}
            <LinkItem icon="users" label="Branch" href="/branch" />
          {/* )} */}
          {canAny(["manage-users", "view-users"]) && (
            <LinkItem icon="users" label="Users" href="/user" />
          )}
          {can("view-permissions") && (
            <LinkItem icon="id" label="Permissions" href="/permission" />
          )}
          {canAny(["manage-roles", "view-roles"]) && (
            <LinkItem icon="users" label="Roles" href="/role" />
          )}
        </Group>

        <Group title="Configuration" icon="panel-left-close" isOpenKey="config">
          {can("view-categories",) && (
            <LinkItem icon="edit" label="Categories" href="/category" />
          )}
          {can("view-authors") && (
            <LinkItem icon="edit" label="Authors" href="/author" />
          )}
        </Group>

        {can("view-logs") && (
          <LinkItem icon="clock" label="Logs" href="/logs" />
        )}
        <LinkItem icon="calendar" label="Billing" href="/subscriptions/billing" />
        <LinkItem icon="edit" label="Account Settings" href="/account-settings" />

      </div>
    </nav>
  );
}

