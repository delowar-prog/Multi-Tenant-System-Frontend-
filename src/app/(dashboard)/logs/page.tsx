"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "src/lib/api";

type LogItem = {
  id?: number | string;
  log_id?: number | string;
  uuid?: string;
  action?: string;
  event?: string;
  activity?: string;
  type?: string;
  message?: string;
  description?: string;
  details?: string;
  note?: string;
  user?: {
    name?: string;
    email?: string;
  };
  user_name?: string;
  username?: string;
  actor?: string;
  performed_by?: string;
  email?: string;
  resource?: string;
  module?: string;
  subject?: string;
  entity?: string;
  ip?: string;
  ip_address?: string;
  ipAddress?: string;
  log_name?: string;
  logName?: string;
  level?: string;
  severity?: string;
  status?: string;
  created_at?: string;
  createdAt?: string;
  timestamp?: string;
  logged_at?: string;
  date?: string;
  [key: string]: unknown;
};

type LogsApiResponse = {
  data?: unknown;
  logs?: unknown;
  items?: unknown;
  results?: unknown;
};

const normalizeLogs = (payload: unknown): LogItem[] => {
  if (Array.isArray(payload)) return payload as LogItem[];
  if (!payload || typeof payload !== "object") return [];

  const container = payload as LogsApiResponse;
  const direct = container.data ?? container.logs ?? container.items ?? container.results;
  if (Array.isArray(direct)) return direct as LogItem[];

  if (direct && typeof direct === "object") {
    const nested = (direct as LogsApiResponse).data;
    if (Array.isArray(nested)) return nested as LogItem[];
  }

  return [];
};

const toText = (value: unknown) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value instanceof Date) return value.toISOString();
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const getRawId = (log: LogItem) => toText(log.id ?? log.log_id ?? log.uuid).trim();

const getDisplayId = (log: LogItem, index: number) => {
  const raw = getRawId(log);
  return raw !== "" ? raw : index + 1;
};

const getActor = (log: LogItem) => {
  const value =
    log.user?.name ??
    log.user_name ??
    log.username ??
    log.actor ??
    log.performed_by ??
    log.email;
  const text = toText(value).trim();
  return text || "System";
};

const getActorMeta = (log: LogItem) => {
  const value = log.user?.email ?? log.email;
  return toText(value).trim();
};

const getAction = (log: LogItem) => {
  const value = log.action ?? log.event ?? log.activity ?? log.type;
  const text = toText(value).trim();
  return text || "Activity";
};

const getResource = (log: LogItem) => {
  const value = log.resource ?? log.module ?? log.subject ?? log.entity;
  const text = toText(value).trim();
  return text || "-";
};

const getMessage = (log: LogItem) => {
  const value = log.message ?? log.description ?? log.details ?? log.note;
  const text = toText(value).trim();
  return text || "-";
};

const getIp = (log: LogItem) => {
  const value = log.ip ?? log.ip_address ?? log.ipAddress;
  const text = toText(value).trim();
  return text || "-";
};

const getLevel = (log: LogItem) => {
  const value = log.level ?? log.severity ?? log.status;
  const text = toText(value).trim();
  return text || "-";
};

const getLogName = (log: LogItem) => {
  const value = log.log_name ?? log.logName;
  const text = toText(value).trim();
  return text || "-";
};

const getTimestamp = (log: LogItem) =>
  log.created_at ?? log.createdAt ?? log.timestamp ?? log.logged_at ?? log.date ?? "-";

const formatDate = (value: unknown) => {
  if (!value) return "-";
  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleString();
};

const getLevelBadgeClass = (level: string) => {
  const normalized = level.toLowerCase();
  if (normalized.includes("error") || normalized.includes("fail")) {
    return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
  }
  if (normalized.includes("warn")) {
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
  }
  if (normalized.includes("success")) {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
  }
  if (normalized.includes("info")) {
    return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
  }
  return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
};

export default function LogsPage() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [logNameFilter, setLogNameFilter] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const loadLogs = useCallback(async (mode: "initial" | "refresh" = "initial") => {
    if (mode === "refresh") {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await api.get("/alllogs");
      const items = normalizeLogs(response.data);
      setLogs(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching logs");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadLogs("initial");
  }, [loadLogs]);

  const levelOptions = useMemo(() => {
    const bucket = new Set<string>();
    logs.forEach((log) => {
      const level = toText(getLevel(log)).trim();
      if (level && level !== "-") {
        bucket.add(level);
      }
    });
    return Array.from(bucket);
  }, [logs]);

  const logNameOptions = useMemo(() => {
    const bucket = new Set<string>();
    logs.forEach((log) => {
      const logName = toText(getLogName(log)).trim();
      if (logName && logName !== "-") {
        bucket.add(logName);
      }
    });
    return Array.from(bucket);
  }, [logs]);

  const filteredLogs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const normalizedLevel = levelFilter === "all" ? "" : levelFilter.toLowerCase();
    const normalizedLogName = logNameFilter === "all" ? "" : logNameFilter.toLowerCase();

    return logs.filter((log) => {
      const levelValue = toText(getLevel(log)).toLowerCase();
      if (normalizedLevel && levelValue !== normalizedLevel) {
        return false;
      }

      const logNameValue = toText(getLogName(log)).toLowerCase();
      if (normalizedLogName && logNameValue !== normalizedLogName) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = [
        getRawId(log),
        getActor(log),
        getAction(log),
        getResource(log),
        getMessage(log),
        getIp(log),
        getLevel(log),
        getLogName(log),
      ]
        .map(toText)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [logs, query, levelFilter, logNameFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));

  useEffect(() => {
    setPage(1);
  }, [query, levelFilter, logNameFilter, pageSize, logs.length]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [page, totalPages]);

  const currentLogs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, page, pageSize]);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
        Loading logs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow border border-gray-200 text-red-500 dark:border-slate-700 dark:bg-slate-900">
        Error: {error}
      </div>
    );
  }

  const showingFrom = filteredLogs.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = Math.min(page * pageSize, filteredLogs.length);

  return (
    <div className="p-6 bg-white rounded-lg shadow border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">System Logs</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Audit trail across users and services.</p>
        </div>
        <button
          onClick={() => loadLogs("refresh")}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by user, action, ip, message"
              className="w-72 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
            />
          </div>
          <div>
            <label htmlFor="level-filter" className="sr-only">Level</label>
            <select
              id="level-filter"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="all">All levels</option>
              {levelOptions.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="log-name-filter" className="sr-only">Log name</label>
            <select
              id="log-name-filter"
              value={logNameFilter}
              onChange={(e) => setLogNameFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="all">All log names</option>
              {logNameOptions.map((logName) => (
                <option key={logName} value={logName}>
                  {logName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center">
          <label htmlFor="per-page" className="text-sm text-gray-700 mr-2 dark:text-slate-300">Show:</label>
          <select
            id="per-page"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <label className="text-sm text-gray-700 ml-1 dark:text-slate-300">entries</label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-t-lg dark:bg-slate-900 dark:border-slate-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-800">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Resource</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">IP</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Message</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-slate-900 dark:divide-slate-700">
            {currentLogs.map((log, index) => {
              const displayIndex = (page - 1) * pageSize + index;
              const actor = getActor(log);
              const actorMeta = getActorMeta(log);
              const level = toText(getLevel(log)) || "-";
              const message = getMessage(log);

              return (
                <tr key={String(getDisplayId(log, displayIndex))} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">
                    {getDisplayId(log, displayIndex)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-100">
                    <div className="font-medium text-gray-900 dark:text-slate-100">{actor}</div>
                    {actorMeta && (
                      <div className="text-xs text-gray-500 dark:text-slate-400">{actorMeta}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                    {getAction(log)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                    {getResource(log)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                    {getIp(log)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getLevelBadgeClass(level)}`}>
                      {level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                    {formatDate(getTimestamp(log))}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-300">
                    <div className="max-w-[320px] truncate" title={toText(message)}>
                      {message}
                    </div>
                  </td>
                </tr>
              );
            })}
            {currentLogs.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-6 text-center text-sm text-gray-500 dark:text-slate-300">
                  No logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap justify-between items-center mt-4 px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg dark:bg-slate-800 dark:border-slate-700">
        <div className="text-sm text-gray-700 dark:text-slate-300">
          Showing {showingFrom} to {showingTo} of {filteredLogs.length} entries
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className={`rounded-lg border px-3 py-1.5 ${
              page === 1
                ? "border-slate-200 text-slate-300 dark:border-slate-700 dark:text-slate-600"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Prev
          </button>
          <span className="text-slate-600 dark:text-slate-300">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            className={`rounded-lg border px-3 py-1.5 ${
              page === totalPages
                ? "border-slate-200 text-slate-300 dark:border-slate-700 dark:text-slate-600"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
