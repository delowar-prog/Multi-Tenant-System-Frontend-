"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "src/lib/api";

//-----------
export interface TicketMessage {
  id: number;
  ticket_id: number;
  sender_id: number;
  sender_type: "tenant_user" | "admin" | string;
  message: string;
  attachments: string[]; // যদি object আসে তাহলে type পরিবর্তন করতে হবে
  created_at: string;
  updated_at: string;
}
export interface User{
  phone:number;
}
export interface SupportTicket {
  id: number;
  tenant_id: string; // UUID
  branch_id: string; // UUID
  user_id: number;
  ticket_no: string;
  category_id: number;
  subject: string;
  priority: "low" | "medium" | "high" | string;
  status: "open" | "closed" | "pending" | string;
  assigned_to: number | null;
  last_reply_at: string | null;
  created_at: string;
  updated_at: string;
  messages: TicketMessage[];
  user:User;
}
export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}
export interface TicketResponse {
  current_page: number;
  data: SupportTicket[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

const statusStyles: Record<string, string> = {
  open: "bg-sky-500 text-white",
  pending: "bg-amber-500 text-white",
  closed: "bg-emerald-500 text-white",
};

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await api.get<TicketResponse | SupportTicket[]>(
          "/support-tickets"
        );

        const payload = response.data;
        if (Array.isArray(payload)) {
          setTickets(payload);
          return;
        }

        setTickets(payload.data ?? []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load support tickets."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadTickets();
  }, []);

  const getStatusStyle = (status: string) =>
    statusStyles[status.toLowerCase()] ?? "bg-slate-500 text-white";

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
            {isLoading && (
              <tr>
                <td className="px-4 py-3 text-center" colSpan={9}>
                  Loading tickets...
                </td>
              </tr>
            )}
            {!isLoading && error && (
              <tr>
                <td className="px-4 py-3 text-center text-red-500" colSpan={9}>
                  {error}
                </td>
              </tr>
            )}
            {!isLoading && !error && tickets.length === 0 && (
              <tr>
                <td className="px-4 py-3 text-center" colSpan={9}>
                  No tickets found.
                </td>
              </tr>
            )}
            {!isLoading &&
              !error &&
              tickets.map((ticket, index) => {
                const firstMessage = ticket.messages?.[0];
                const senderName =
                  firstMessage?.sender_type === "admin"
                    ? "Admin"
                    : firstMessage?.sender_type === "tenant_user"
                    ? "Tenant User"
                    : firstMessage?.sender_type ?? "-";

                return (
                  <tr
                    key={ticket.id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-800"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{ticket.ticket_no || "-"}</td>
                    <td className="px-4 py-3 font-medium">{ticket.subject}</td>
                    <td className="px-4 py-3">{firstMessage?.message || "-"}</td>
                    <td className="px-4 py-3">{senderName}</td>
                    <td className="px-4 py-3">{ticket.user.phone}</td>
                    <td className="px-4 py-3">
                      {ticket.assigned_to ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/support/${ticket.ticket_no || ticket.id}`}
                          className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                        >
                          View
                        </Link>
                        <Link
                          href={`/support/${ticket.id}/assign`}
                          className="rounded-md bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600"
                        >
                          Assign
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
