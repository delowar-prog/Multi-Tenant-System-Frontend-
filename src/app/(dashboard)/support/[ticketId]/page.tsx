"use client";

import React, { useState } from "react";
import Link from "next/link";

type Reply = {
  id: number;
  author: string;
  date: string;
  message: string;
  variant: "primary" | "secondary";
};

const replies: Reply[] = [
  {
    id: 1,
    author: "Admin NBSML",
    date: "22/05/2024",
    message: "Please hold the farmer PB NO-10XXXXXX.",
    variant: "primary",
  },
  {
    id: 2,
    author: "admin",
    date: "22/05/2024",
    message: "Farmer hold done",
    variant: "secondary",
  },
];

const replyStyles: Record<Reply["variant"], string> = {
  primary: "bg-rose-50 border-rose-100",
  secondary: "bg-emerald-50 border-emerald-100",
};

export default function TicketDetailsPage() {
  const [reply, setReply] = useState("Thank you");

  return (
    <div className="p-6 bg-white rounded-lg shadow border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-slate-100">
            (#0010) Farmer Hold
          </h1>
          <span className="inline-flex items-center rounded-md bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white">
            Assigned
          </span>
        </div>
        <Link
          href="/support"
          className="text-sm font-semibold text-white px-2 py-1 rounded bg-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          Back
        </Link>
      </div>

      <div className="mt-5 space-y-4">
        {replies.map((item) => (
          <div
            key={item.id}
            className={`rounded-md border px-4 py-3 text-sm text-gray-700 dark:text-slate-200 ${replyStyles[item.variant]}`}
          >
            <div className="font-semibold text-gray-900 dark:text-slate-100">
              {item.author} <span className="font-normal text-gray-500 dark:text-slate-400">({item.date})</span>
            </div>
            <p className="mt-1">{item.message}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200">Write a reply</label>
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={4}
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
  );
}
