"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { resetPassword } from "src/services/authService";

type Status = "idle" | "loading" | "success" | "error";

const getErrorMessage = (err: unknown) => {
  if (typeof err === "object" && err !== null) {
    const maybeResponse = err as { response?: { data?: { message?: string } } };
    if (maybeResponse.response?.data?.message) return maybeResponse.response.data.message;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
};

export default function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const email = params.get("email") ?? "";
  const token = params.get("token") ?? "";

  const validationError = useMemo(() => {
    if (!email || !token) return "The reset link is missing required data.";
    if (!password || !confirmPassword) return "";
    if (password !== confirmPassword) return "Passwords do not match.";
    return "";
  }, [email, token, password, confirmPassword]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validationError) {
      setStatus("error");
      setMessage(validationError);
      return;
    }

    setStatus("loading");
    setMessage("");
    try {
      await resetPassword({
        email,
        token,
        password,
        password_confirmation: confirmPassword,
      });
      setStatus("success");
      setMessage("Password updated successfully. You can now sign in.");
      setTimeout(() => {
        router.push("/login");
      }, 800);
    } catch (err) {
      setStatus("error");
      setMessage(getErrorMessage(err));
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Reset password</h2>
        <p className="mt-2 text-sm text-gray-500">
          Set a new password for <span className="font-medium text-gray-700">{email || "your account"}</span>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
            New password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a strong password"
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="mb-1 block text-sm font-medium text-gray-700">
            Confirm password
          </label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Re-enter your password"
          />
        </div>

        {validationError && status !== "success" && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
            {validationError}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading" || !!validationError}
          className="w-full rounded-lg bg-blue-600 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {status === "loading" ? "Saving..." : "Update password"}
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
        Back to{" "}
        <Link href="/login" className="font-medium text-blue-600 hover:underline">
          sign in
        </Link>
      </p>
    </div>
  );
}
