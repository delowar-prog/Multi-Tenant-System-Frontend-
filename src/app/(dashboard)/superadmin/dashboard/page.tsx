"use client";

export default function Home() {

    return (
        <div className="p-4 text-slate-900 dark:text-slate-100 sm:p-6">
            {/* Header */}
            <h2 className="text-[18px] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                All Programs
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
                    <h1>This is Super Admin Dashboard</h1>
                </div>
            </div>
        </div>
    );
}
