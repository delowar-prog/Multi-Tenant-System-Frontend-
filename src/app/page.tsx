"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Manrope, Sora } from "next/font/google";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Sparkles,
  Star,
} from "lucide-react";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const slides = [
  {
    id: "operations",
    tag: "Exclusive operations",
    title: "Multi-tenant command center",
    description:
      "Orchestrate roles, permissions, and compliance with one deliberate cockpit built for institutions.",
    highlight: "Zero-downtime updates across every tenant.",
    stats: [
      { label: "Active tenants", value: "240+" },
      { label: "Roles secured", value: "12K" },
      { label: "Audit events", value: "1.4M" },
    ],
    gradient: "from-emerald-400/20 via-teal-400/10 to-transparent",
  },
  {
    id: "security",
    tag: "Exclusive security",
    title: "Policy-first access",
    description:
      "Ship every product with enterprise grade authorization. Build once and map access for every team.",
    highlight: "Granular approvals with instant traceability.",
    stats: [
      { label: "Approval time", value: "42 sec" },
      { label: "Risk alerts", value: "98%" },
      { label: "SLA uptime", value: "99.98%" },
    ],
    gradient: "from-amber-400/20 via-rose-400/10 to-transparent",
  },
  {
    id: "insights",
    tag: "Exclusive insights",
    title: "Real-time governance analytics",
    description:
      "Surface the access story with live dashboards, anomaly detection, and smart workflows.",
    highlight: "Insights delivered every 5 minutes.",
    stats: [
      { label: "Dashboards", value: "48" },
      { label: "Signals", value: "6.8K" },
      { label: "Teams onboarded", value: "120" },
    ],
    gradient: "from-sky-400/20 via-cyan-400/10 to-transparent",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$39",
    cycle: "/month",
    tagline: "For small teams piloting multi-tenant access.",
    features: ["Up to 5 tenants", "Standard RBAC", "Email support", "Audit log (7 days)"],
  },
  {
    name: "Growth",
    price: "$89",
    cycle: "/month",
    tagline: "For scaling teams that need advanced control.",
    features: [
      "Unlimited tenants",
      "Advanced RBAC",
      "Policy automation",
      "Audit log (90 days)",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cycle: "",
    tagline: "For regulated orgs with bespoke workflows.",
    features: [
      "Dedicated success team",
      "Custom integrations",
      "Private cloud",
      "Audit log (365 days)",
    ],
  },
];

const projects = [
  {
    name: "University Suite",
    description: "Unified role provisioning across 14 faculties.",
    tags: ["RBAC", "Compliance", "Education"],
  },
  {
    name: "HealthGrid",
    description: "Zero-trust access workflows for clinical teams.",
    tags: ["Security", "Healthcare", "Audit"],
  },
  {
    name: "Civic Portal",
    description: "Citizen services with transparent approvals.",
    tags: ["Government", "Workflow", "Analytics"],
  },
];

const clients = ["NovaLabs", "Brightline", "CivicStack", "Vantage", "Northwind", "BlueCore"];

const testimonials = [
  {
    quote:
      "We moved 200+ roles into a single policy engine and cut provisioning time by 70 percent.",
    name: "A. Rahman",
    title: "Head of IT, University Suite",
  },
  {
    quote:
      "The audit timeline feels like a story. We can prove access decisions in minutes.",
    name: "S. Karim",
    title: "Security Lead, HealthGrid",
  },
  {
    quote:
      "Finally a multi-tenant admin that does not feel like a patchwork. It is calm and precise.",
    name: "M. Santos",
    title: "Product Ops, Civic Portal",
  },
];

export default function LandingPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideCount = slides.length;

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slideCount);
    }, 6000);

    return () => clearInterval(id);
  }, [slideCount]);

  const activeSlide = slides[activeIndex];

  return (
    <div className={`${manrope.className} min-h-screen bg-[#F4F8F2] text-slate-900`}>
      <header className="sticky top-0 z-30 border-b border-emerald-100/60 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className={`${sora.className} text-lg font-semibold`}>App Seba</p>
              <p className="text-xs text-slate-500">Multi-tenant access suite</p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#plans" className="transition hover:text-slate-900">Plans</a>
            <a href="#projects" className="transition hover:text-slate-900">Projects</a>
            <a href="#clients" className="transition hover:text-slate-900">Clients</a>
            <a href="#testimonials" className="transition hover:text-slate-900">Testimonials</a>
            <a href="#footer" className="transition hover:text-slate-900">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:text-emerald-800 md:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-4 pb-20 pt-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.15),_transparent_60%)]" />
          <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-gradient-to-br from-emerald-200 via-teal-100 to-transparent opacity-70 blur-3xl" />
          <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-gradient-to-br from-amber-100 via-white to-transparent opacity-70 blur-3xl" />

          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="profile-reveal profile-stagger-1 space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Exclusive landing
              </span>
              <h1 className={`${sora.className} text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl`}>
                A bold landing for a precise multi-tenant platform.
              </h1>
              <p className="max-w-xl text-lg text-slate-600">
                Launch with a curated experience that communicates trust, clarity, and operational control. Show your
                value in seconds with an exclusive hero slider and modern subscription storytelling.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                  Start the suite
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#plans"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                >
                  View pricing
                </a>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-slate-600">
                {["SOC2-ready processes", "Rapid tenant onboarding", "Global audit trails"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="profile-reveal profile-stagger-2 relative">
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${activeSlide.gradient}`} />
              <div className="relative rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-xl backdrop-blur">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {activeSlide.tag}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveIndex((prev) => (prev - 1 + slideCount) % slideCount)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:text-slate-900"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveIndex((prev) => (prev + 1) % slideCount)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:text-slate-900"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="relative mt-6 min-h-[260px]">
                  {slides.map((slide, index) => (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-all duration-500 ${
                        index === activeIndex
                          ? "translate-y-0 opacity-100"
                          : "pointer-events-none translate-y-4 opacity-0"
                      }`}
                    >
                      <h2 className={`${sora.className} text-2xl font-semibold text-slate-900`}>
                        {slide.title}
                      </h2>
                      <p className="mt-2 text-sm text-slate-600">{slide.description}</p>
                      <p className="mt-3 text-sm font-semibold text-emerald-700">{slide.highlight}</p>
                      <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        {slide.stats.map((stat) => (
                          <div
                            key={stat.label}
                            className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center"
                          >
                            <p className="text-lg font-semibold text-slate-900">{stat.value}</p>
                            <p className="text-xs text-slate-500">{stat.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-2">
                  {slides.map((slide, index) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`h-2 w-10 rounded-full transition ${
                        index === activeIndex ? "bg-emerald-600" : "bg-emerald-200"
                      }`}
                      aria-label={`Go to ${slide.title}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="plans" className="px-4 pb-20">
          <div className="mx-auto max-w-6xl">
            <div className="profile-reveal profile-stagger-1 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Subscription plans</p>
                <h2 className={`${sora.className} text-3xl font-semibold text-slate-900`}>
                  Pricing that scales with your tenants
                </h2>
              </div>
              <p className="max-w-md text-sm text-slate-600">
                Select a plan that mirrors your governance maturity. Upgrade any time as your teams grow.
              </p>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`profile-reveal rounded-3xl border p-6 shadow-sm transition ${
                    plan.highlighted
                      ? "border-emerald-300 bg-white shadow-lg"
                      : "border-slate-200 bg-white/80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className={`${sora.className} text-xl font-semibold text-slate-900`}>{plan.name}</h3>
                    {plan.highlighted && (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">
                    {plan.price}
                    <span className="text-sm font-medium text-slate-500">{plan.cycle}</span>
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{plan.tagline}</p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className={`mt-6 w-full rounded-full px-4 py-2 text-sm font-semibold transition ${
                      plan.highlighted
                        ? "bg-emerald-600 text-white hover:bg-emerald-500"
                        : "border border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    Choose {plan.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="px-4 pb-20">
          <div className="mx-auto max-w-6xl">
            <div className="profile-reveal profile-stagger-1 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Projects</p>
                <h2 className={`${sora.className} text-3xl font-semibold text-slate-900`}>
                  Strategic deployments
                </h2>
              </div>
              <p className="max-w-md text-sm text-slate-600">
                A snapshot of recent multi-tenant rollouts across regulated industries.
              </p>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {projects.map((project) => (
                <div
                  key={project.name}
                  className="profile-reveal rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h3 className={`${sora.className} text-xl font-semibold text-slate-900`}>{project.name}</h3>
                  <p className="mt-2 text-sm text-slate-600">{project.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="clients" className="px-4 pb-20">
          <div className="mx-auto max-w-6xl">
            <div className="profile-reveal profile-stagger-1 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Clients</p>
              <h2 className={`${sora.className} text-3xl font-semibold text-slate-900`}>
                Trusted by ambitious teams
              </h2>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {clients.map((client) => (
                <div
                  key={client}
                  className="profile-reveal rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-center text-sm font-semibold text-slate-600"
                >
                  {client}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="px-4 pb-20">
          <div className="mx-auto max-w-6xl">
            <div className="profile-reveal profile-stagger-1 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Testimonials</p>
                <h2 className={`${sora.className} text-3xl font-semibold text-slate-900`}>
                  Teams that rely on clarity
                </h2>
              </div>
              <p className="max-w-md text-sm text-slate-600">
                Decision makers highlight the calm, predictable operations the platform delivers.
              </p>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="profile-reveal rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-slate-600">"{testimonial.quote}"</p>
                  <div className="mt-5">
                    <p className={`${sora.className} text-sm font-semibold text-slate-900`}>{testimonial.name}</p>
                    <p className="text-xs text-slate-500">{testimonial.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer id="footer" className="border-t border-emerald-100/70 bg-white px-4 py-14">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <p className={`${sora.className} text-lg font-semibold`}>App Seba</p>
                <p className="text-xs text-slate-500">Multi-tenant access suite</p>
              </div>
            </div>
            <p className="text-sm text-slate-600">
              Exclusive experiences for institutions that require precision, reliability, and visible governance.
            </p>
          </div>

          <div>
            <p className={`${sora.className} text-sm font-semibold text-slate-900`}>Company</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>About</li>
              <li>Careers</li>
              <li>Security</li>
              <li>Press</li>
            </ul>
          </div>
          <div>
            <p className={`${sora.className} text-sm font-semibold text-slate-900`}>Resources</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>Docs</li>
              <li>API status</li>
              <li>Support</li>
              <li>Case studies</li>
            </ul>
          </div>
          <div>
            <p className={`${sora.className} text-sm font-semibold text-slate-900`}>Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>hello@appseba.com</li>
              <li>+880 1711 000 000</li>
              <li>Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-emerald-100 pt-6 text-xs text-slate-500">
          <p>2026 App Seba. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Compliance</span>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/8801711000000?text=Hello%20App%20Seba%20team"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-500"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-5 w-5" />
        WhatsApp
      </a>
    </div>
  );
}
