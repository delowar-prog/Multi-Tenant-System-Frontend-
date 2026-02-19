"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { api } from "src/lib/api";

type TicketMessage = {
  id: number;
  message: string;
  sender_type: "tenant_user" | "admin" | string;
};

type SupportTicket = {
  id: number;
  ticket_no: string;
  subject: string;
  status: string;
  assigned_to: number | null;
  messages: TicketMessage[];
};

type TicketPayload = SupportTicket | { data: SupportTicket };

export default function AssignTicketPage() {
  const params = useParams<{ ticketId: string }>();
  const router = useRouter();
  const ticketId = params?.ticketId;

  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [assignTo, setAssignTo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTicket = async () => {
      if (!ticketId) {
        setError("Ticket id is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        const response = await api.get<TicketPayload>(`/support-tickets/${ticketId}`);
        const payload = response.data;
        const ticketData = "data" in payload ? payload.data : payload;

        setTicket(ticketData);
        setAssignTo(ticketData.assigned_to !== null ? String(ticketData.assigned_to) : "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load ticket.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTicket();
  }, [ticketId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ticket || !assignTo.trim()) {
      setError("Assign to is required.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const body = { assigned_to: assignTo.trim() };
    const attempts = [
      () => api.post(`/support-tickets/${ticket.id}/assign`, body),
      () => api.put(`/support-tickets/${ticket.id}`, body),
      () => api.patch(`/support-tickets/${ticket.id}`, body),
    ];

    let lastError: unknown = null;
    for (const attempt of attempts) {
      try {
        await attempt();
        router.push("/support");
        return;
      } catch (submitError) {
        lastError = submitError;
      }
    }

    setError(
      lastError instanceof Error
        ? lastError.message
        : "Failed to assign the ticket."
    );
    setIsSubmitting(false);
  };

  const firstMessage = ticket?.messages?.[0]?.message ?? "-";

  return (
    <div className="p-6 bg-white rounded-lg shadow border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-slate-100">
          Assign Ticket
        </h1>
        <Link
          href="/support"
          className="text-sm font-semibold text-white px-2 py-1 rounded bg-emerald-600 dark:text-white"
        >
          Back
        </Link>
      </div>

      {isLoading && <p className="mt-5 text-sm">Loading ticket...</p>}
      {!isLoading && error && <p className="mt-5 text-sm text-red-500">{error}</p>}

      {!isLoading && !error && ticket && (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="rounded-md border border-gray-200 p-4 dark:border-slate-700">
            <p className="text-sm">
              <span className="font-semibold">Ticket No:</span>{" "}
              {ticket.ticket_no || "-"}
            </p>
            <p className="text-sm mt-1">
              <span className="font-semibold">Subject:</span> {ticket.subject}
            </p>
            <p className="text-sm mt-1">
              <span className="font-semibold">Status:</span> {ticket.status}
            </p>
            <p className="text-sm mt-1">
              <span className="font-semibold">Message:</span> {firstMessage}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200">
              Assign to <span className="text-red-500">*</span>
            </label>
            <input
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
              placeholder="Enter user id / assignee"
              className="mt-2 w-full max-w-md rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
}
