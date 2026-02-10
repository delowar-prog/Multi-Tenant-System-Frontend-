"use client";

import React, { useState } from "react";
import Link from "next/link";

const subjectOptions = ["Farmer Hold", "Wallet change", "General Query"];

export default function CreateTicketPage() {
  const [subject, setSubject] = useState(subjectOptions[0]);
  const [message, setMessage] = useState("Please hold the farmer PB NO-10XXXXXX.");

  return (
    <div className="p-6 bg-white rounded-lg shadow border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-slate-100">Create Ticket</h1>
        <Link
          href="/support"
          className="text-sm font-semibold text-white px-2 py-1 rounded bg-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          Back
        </Link>
      </div>

      <div className="mt-5 rounded-md border border-gray-200 bg-gray-50 p-5 dark:border-slate-700 dark:bg-slate-800/60">
        <div className="max-w-4xl">
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200">
            Subject <span className="text-red-500">*</span>
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-2 w-64 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {subjectOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <label className="mt-8 block text-sm font-semibold text-gray-700 dark:text-slate-200">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />

          <div className="mt-4 flex items-center gap-3 text-sm font-semibold text-gray-700 dark:text-slate-200">
            <span>add attachment</span>
            <button className="inline-flex h-8 w-10 items-center justify-center rounded-md bg-emerald-600 text-white hover:bg-emerald-700">
              +
            </button>
          </div>

          <button className="mt-6 rounded-md bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
