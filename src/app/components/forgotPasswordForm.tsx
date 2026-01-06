"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { requestPasswordReset } from "src/services/authService";

type Status = "idle" | "loading" | "success" | "error";

const getErrorMessage = (err: unknown) => {
  if (typeof err === "object" && err !== null) {
    const maybeResponse = err as { response?: { data?: { message?: string } } };
    if (maybeResponse.response?.data?.message) return maybeResponse.response.data.message;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
};

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      await requestPasswordReset(email);
      setStatus("success");
      setMessage("If an account with that email exists, you will receive a reset link shortly.");
    } catch (err) {
      setStatus("error");
      setMessage(getErrorMessage(err));
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Forgot password</h2>
        <p className="mt-2 text-sm text-gray-500">
          Enter your email and we will send a secure link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-lg bg-blue-600 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {status === "loading" ? "Sending..." : "Send reset link"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 rounded-lg px-3 py-2 text-sm ${
            status === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
          }`}
          role="status"
        >
          {message}
        </p>
      )}

      <p className="mt-6 text-center text-sm text-gray-500">
        Remembered your password?{" "}
        <Link href="/login" className="font-medium text-blue-600 hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
