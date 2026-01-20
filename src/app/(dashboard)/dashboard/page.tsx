"use client";
import { useMemo, useState, ChangeEvent } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Program {
  id: number;
  name: string;
}

export default function Home(){
  // demo data (API থেকে আনবেন)
  const data: Program[] = useMemo(
    () => [
      { id: 1, name: "Bachalor" },
      { id: 3, name: "Masters" },
      { id: 4, name: "M.B.B.S." },
    ],
    []
  );

  const [q, setQ] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(50);
  const [page, setPage] = useState<number>(1);
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const filtered = useMemo(
    () =>
      data.filter(
        (r) =>
          r.name.toLowerCase().includes(q.toLowerCase()) ||
          String(r.id).includes(q)
      ),
    [data, q]
  );

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) =>
        sortAsc ? a.id - b.id : b.id - a.id
      ),
    [filtered, sortAsc]
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

  const current = useMemo(
    () =>
      sorted.slice(
        (page - 1) * pageSize,
        (page - 1) * pageSize + pageSize
      ),
    [sorted, page, pageSize]
  );

  // paginate reset on dependencies
  if (page > totalPages) setPage(1);

  // Mock stats
  const stats = [
    { title: "Total Programs", value: data.length, icon: "📚" },
    { title: "Total Users", value: 150, icon: "👥" },
    { title: "Active Sessions", value: 45, icon: "🔥" },
    { title: "Revenue", value: "$12,500", icon: "💰" },
  ];

  // Mock chart data
  const chartData = [
    { name: 'Bachelor', students: 120 },
    { name: 'Masters', students: 80 },
    { name: 'M.B.B.S.', students: 60 },
  ];

  return (
    <div className="p-4 text-slate-900 dark:text-slate-100 sm:p-6">
      {/* Dashboard Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800">
            <div className="flex items-center">
              <div className="text-2xl">{stat.icon}</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800">
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Program Enrollment</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="students" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Header */}
      <h2 className="text-[18px] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        All Programs ({sorted.length})
      </h2>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex flex-col sm:flex-row gap-5">
          <div>
            <label className="mb-1 text-xs font-medium text-gray-700 dark:text-slate-300">
              Delivery Type
            </label>
            <select
              defaultValue=""
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-400"
            >
              <option value="">All</option>
              <option value="Emergency">Emergency</option>
              <option value="Regular">Regular</option>
            </select>
          </div>
          <div>
            <label className="mb-1 text-xs font-medium text-gray-700 dark:text-slate-300">
              Delivery Type
            </label>
            <select
              defaultValue=""
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-400"
            >
              <option value="">All</option>
              <option value="Emergency">Emergency</option>
              <option value="Regular">Regular</option>
            </select>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-3 sm:max-w-md">
          <div className="relative w-full">
            <input
              value={q}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search programs..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>

          <div className="hidden items-center gap-2 text-sm text-slate-600 dark:text-slate-300 sm:flex">
            <span>Show:</span>
            <select
              value={pageSize}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span>entries</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50/70 dark:bg-slate-800">
            <tr>
              <th className="whitespace-nowrap px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                <button
                  onClick={() => setSortAsc((s) => !s)}
                  className="inline-flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-100"
                >
                  ID
                  <span className="text-slate-400 dark:text-slate-500">
                    {sortAsc ? "▲" : "▼"}
                  </span>
                </button>
              </th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                Name
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-900">
            {current.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                <td className="px-6 py-3 text-sm text-slate-700 dark:text-slate-200">{r.id}</td>
                <td className="px-6 py-3 text-sm text-slate-800 dark:text-slate-100">
                  {r.name}
                </td>
              </tr>
            ))}
            {current.length === 0 && (
              <tr>
                <td
                  colSpan={2}
                  className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400"
                >
                  No programs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing {sorted.length === 0 ? 0 : (page - 1) * pageSize + 1} to{" "}
          {Math.min(page * pageSize, sorted.length)} of {sorted.length} entries
        </p>
        <div className="flex items-center gap-2 text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
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
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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

      {/* Mobile "Show" control */}
      <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 sm:hidden">
        <span>Show:</span>
        <select
          value={pageSize}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          {[10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span>entries</span>
      </div>
    </div>
  );
}
