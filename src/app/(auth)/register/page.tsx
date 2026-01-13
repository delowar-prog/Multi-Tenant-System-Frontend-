"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { useAuth } from "src/context/authContext";
import { register } from "src/services/authService";
import { fetchLandingPlans, LandingPlanApi } from "src/services/planServices";

export default function RegisterForm() {
  const { setUser } = useAuth();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [plans, setPlans] = useState<LandingPlanApi[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan_id");

  useEffect(() => {
    if (!planParam) {
      return;
    }

    const parsed = Number(planParam);
    if (Number.isFinite(parsed)) {
      setSelectedPlanId(parsed);
    }
  }, [planParam]);

  useEffect(() => {
    let isMounted = true;

    const loadPlans = async () => {
      try {
        setPlansLoading(true);
        setPlansError(null);
        const data = await fetchLandingPlans();

        if (isMounted) {
          setPlans(data);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred while fetching plans";
        console.error("Register plan fetch error:", err);

        if (isMounted) {
          setPlansError(errorMessage);
        }
      } finally {
        if (isMounted) {
          setPlansLoading(false);
        }
      }
    };

    loadPlans();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatPlanPrice = (price: LandingPlanApi["price"]) => {
    const numeric = typeof price === "number" ? price : Number(price);

    if (Number.isFinite(numeric)) {
      if (numeric === 0) {
        return "Free";
      }

      return `BDT ${numeric.toFixed(2)}`;
    }

    if (typeof price === "string" && price.trim().length > 0) {
      return price;
    }

    return "Custom";
  };

  const formatPlanCycle = (days?: number) => {
    if (!days) {
      return "";
    }

    if (days === 30) {
      return "/month";
    }

    if (days === 365) {
      return "/year";
    }

    return `/${days} days`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Simple client-side validations
    if (name.trim().length < 2) {
      alert("Please enter your full name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    if (phone && !/^\+?[0-9\s-]{7,15}$/.test(phone)) {
      alert("Please enter a valid phone number.");
      return;
    }
    if (!selectedPlanId) {
      alert("Please select a plan.");
      return;
    }
    const payload = { name, email, password, phone, address, plan_id: selectedPlanId };

    try {
      setLoading(true);
      const data = await register(payload);
      setUser(data.user);
      // Success alert
      await Swal.fire({
        icon: "success",
        title: "Registered Successfully!",
        text: "Welcome aboard dYZ%",
        confirmButtonColor: "#10b981",
        confirmButtonText: "Go to Dashboard",
      });

      router.push("/dashboard");
    } catch (err: any) {
      console.error("Registration failed:", err.response?.data || err.message);
      // Error alert
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err.response?.data?.message || "Please check your details and try again.",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl rounded-2xl border border-emerald-100 bg-white/90 p-8 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
      <h2 className="mb-6 text-center text-2xl font-bold text-slate-900 dark:text-slate-100">
        Create your account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
            Full name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-slate-900 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder-slate-500"
            placeholder="Jane Doe"
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-slate-900 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder-slate-500"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-slate-900 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder-slate-500"
            placeholder="Create a password"
            autoComplete="new-password"
            minLength={6}
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Minimum 6 characters.</p>
        </div>

        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
            Phone (optional)
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-slate-900 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder-slate-500"
            placeholder="+880 1XXX-XXXXXX"
            autoComplete="tel"
          />
        </div>

        <div>
          <label htmlFor="address" className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
            Address (optional)
          </label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="min-h-[90px] w-full rounded-lg border border-slate-200 bg-white p-2.5 text-slate-900 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder-slate-500"
            placeholder="House, street, city, postal code"
            autoComplete="street-address"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-300">Select a plan</p>
          {plansLoading ? (
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-400">
              Loading plans...
            </div>
          ) : plansError ? (
            <div className="rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm text-rose-600 dark:border-rose-700/60 dark:bg-slate-950/60 dark:text-rose-400">
              Unable to load plans right now.
            </div>
          ) : plans.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-400">
              No plans available yet.
            </div>
          ) : (
            <div className="space-y-3">
              {plans.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                const priceLabel = formatPlanPrice(plan.price);
                const cycleLabel = formatPlanCycle(plan.duration_days);

                return (
                  <label
                    key={plan.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2 text-sm transition ${
                      isSelected
                        ? "border-emerald-300 bg-emerald-50/70 text-slate-900 dark:border-emerald-500/60 dark:bg-emerald-500/10 dark:text-slate-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      checked={isSelected}
                      onChange={() =>
                        setSelectedPlanId((current) => (current === plan.id ? null : plan.id))
                      }
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{plan.name}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {priceLabel}
                          {cycleLabel && ` ${cycleLabel}`}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {plan.duration_days} days access
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-600 py-2.5 font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="text-emerald-700 hover:underline dark:text-emerald-400">
          Sign in
        </Link>
      </p>
    </div>
  );
}
