"use client";

import React from "react";
import Link from "next/link";

type Ticket = {
  id: number;
  ticketNo: string;
  subject: string;
  message: string;
  senderName: string;
  senderContact: string;
  assignTo: string;
  status: "Submitted" | "Solved";
};

const tickets: Ticket[] = [
  {
    id: 1,
    ticketNo: "0010",
    subject: "Farmer Hold",
    message: "Please hold the farmer PB NO-10XXXXXX.",
    senderName: "Admin NBSML",
    senderContact: "",
    assignTo: "",
    status: "Submitted",
  },
  {
    id: 2,
    ticketNo: "",
    subject: "Wallet change",
    message: "Please see the attachment.",
    senderName: "Admin NBSML",
    senderContact: "",
    assignTo: "admin",
    status: "Solved",
  },
];

const statusStyles: Record<Ticket["status"], string> = {
  Submitted: "bg-sky-500 text-white",
  Solved: "bg-emerald-500 text-white",
};

export default function SupportPage() {
  return (
    <div className="p-6 bg-white rounded-lg shadow border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-slate-100">Ticket Information</h1>
        <Link
          href="/support/new"
          className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          <span className="text-lg leading-none">+</span>
          New
        </Link>
      </div>

      <div className="mt-5 overflow-x-auto rounded-md border border-gray-200 dark:border-slate-700">
        <table className="min-w-full bg-white dark:bg-slate-900">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:bg-slate-800 dark:text-slate-300">
              <th className="px-4 py-3">SL. No</th>
              <th className="px-4 py-3">Ticket No</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Sender Name</th>
              <th className="px-4 py-3">Sender Contact</th>
              <th className="px-4 py-3">Assign To</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm text-gray-700 dark:divide-slate-700 dark:text-slate-200">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                <td className="px-4 py-3">{ticket.id}</td>
                <td className="px-4 py-3">{ticket.ticketNo || "-"}</td>
                <td className="px-4 py-3 font-medium">{ticket.subject}</td>
                <td className="px-4 py-3">{ticket.message}</td>
                <td className="px-4 py-3">{ticket.senderName}</td>
                <td className="px-4 py-3">{ticket.senderContact || "-"}</td>
                <td className="px-4 py-3">{ticket.assignTo || "-"}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[ticket.status]}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/support/${ticket.ticketNo || ticket.id}`}
                    className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
