"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Wallet,
  ScanLine,
  Users,
  PieChart,
  BellRing,
  LineChart,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { CountUp } from "@/components/shared/count-up";
import { formatCurrency } from "@/lib/utils";

const features = [
  {
    icon: Wallet,
    title: "Expense & income tracking",
    desc: "Log every transaction in seconds, tag it by category, and see exactly where your money goes.",
  },
  {
    icon: ScanLine,
    title: "AI receipt scanner",
    desc: "Snap a photo of any receipt — MoneyMate reads the merchant, total, and items for you.",
  },
  {
    icon: Users,
    title: "Split bills, fairly",
    desc: "Split dinner, trips, or rent equally or custom, then share a link so everyone can pay their part.",
  },
  {
    icon: PieChart,
    title: "Budgets that warn you",
    desc: "Set monthly limits per category and get nudged before you overspend, not after.",
  },
  {
    icon: LineChart,
    title: "Analytics that make sense",
    desc: "Spending trends, savings rate, and category breakdowns in charts you'll actually read.",
  },
  {
    icon: BellRing,
    title: "Bill reminders",
    desc: "Never miss rent, Netflix, or insurance again — recurring bills with a calendar view.",
  },
];

const steps = [
  { title: "Connect your finances", desc: "Create your account and set your currency and monthly goal." },
  { title: "Track automatically", desc: "Add transactions manually or scan a receipt — AI fills the rest." },
  { title: "See it all clearly", desc: "Dashboards, budgets, and reports turn numbers into decisions." },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <Nav />
      <Hero />
      <LogosStrip />
      <Features />
      <HowItWorks />
      <SecurityBlurb />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-cream">
            <Wallet className="h-4.5 w-4.5" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">MoneyMate</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">Features</a>
          <a href="#how-it-works" className="transition-colors hover:text-foreground">How it works</a>
          <a href="#security" className="transition-colors hover:text-foreground">Security</a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/register">
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-16 md:pt-24">
      <div className="grid items-center gap-16 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-warning" />
            AI receipt scanning, built in
          </div>
          <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-navy dark:text-foreground md:text-5xl lg:text-6xl">
            Know exactly where your money goes.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            MoneyMate tracks expenses, scans receipts with AI, splits bills with friends,
            and keeps every budget on target — in one calm, beautiful dashboard.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/register">
                Start for free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="cream" asChild>
              <Link href="/login">I already have an account</Link>
            </Button>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
            <div>
              <div className="font-display text-2xl font-semibold text-foreground">50K+</div>
              transactions tracked
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <div className="font-display text-2xl font-semibold text-foreground">4.9/5</div>
              average rating
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative mx-auto flex max-w-md items-center justify-center"
        >
          <div className="absolute -left-10 -top-10 h-72 w-72 rounded-full bg-cream animate-float-slow blur-2xl" />
          <div className="absolute -bottom-14 -right-6 h-64 w-64 rounded-full bg-sky animate-float-slower blur-2xl" />

          <div className="glass relative w-full rounded-2xl p-6 shadow-[var(--shadow-lift)]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total balance</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-cream">
                <Wallet className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3 font-tabular text-4xl font-semibold tracking-tight text-navy dark:text-foreground">
              <CountUp value={7262000} format={(n) => formatCurrency(n, "IDR")} />
            </div>
            <div className="mt-1 text-sm text-income">+12.4% from last month</div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-income-soft p-3">
                <div className="text-xs text-muted-foreground">Income</div>
                <div className="font-tabular font-semibold text-income">Rp15.100.000</div>
              </div>
              <div className="rounded-xl bg-expense-soft p-3">
                <div className="text-xs text-muted-foreground">Expense</div>
                <div className="font-tabular font-semibold text-expense">Rp7.838.000</div>
              </div>
            </div>

            <div className="mt-5 flex items-end gap-1.5">
              {[40, 65, 50, 80, 60, 90, 70].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.5 + i * 0.06, duration: 0.5, ease: "easeOut" }}
                  className="flex-1 rounded-t-md bg-gradient-to-t from-sky to-navy/70"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function LogosStrip() {
  return (
    <section className="border-y border-border/60 bg-surface-muted/40 py-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 text-sm font-medium tracking-wide text-muted-foreground">
        {["Trusted by freelancers", "Loved by small teams", "Built for households", "Used by students"].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Everything your finances need, nothing they don't
        </h2>
        <p className="mt-4 text-muted-foreground">
          Six tools that work together so you spend less time managing money and more time living.
        </p>
      </div>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="card-surface group rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-soft text-navy dark:text-sky transition-transform duration-300 group-hover:scale-110">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface-muted/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Set up once, stay on top forever
          </h2>
        </div>
        <div className="relative mt-14 grid gap-8 md:grid-cols-3">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-border md:block" />
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative"
            >
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-navy font-display text-lg font-semibold text-cream">
                {i + 1}
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SecurityBlurb() {
  return (
    <section id="security" className="mx-auto max-w-7xl px-6 py-24">
      <div className="card-surface flex flex-col items-start gap-6 rounded-2xl p-8 md:flex-row md:items-center md:p-12">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cream text-navy">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold">Bank-grade security by default</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Row Level Security on every table, encrypted sessions, and rate-limited endpoints mean
            your financial data is only ever visible to you — not other users, not us.
          </p>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <div className="relative overflow-hidden rounded-2xl bg-navy px-8 py-16 text-center md:px-16">
        <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-sky/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-cream/10 blur-3xl" />
        <h2 className="relative font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
          Start managing money with clarity today
        </h2>
        <p className="relative mx-auto mt-4 max-w-lg text-white/70">
          Free to start. No credit card required.
        </p>
        <Button size="lg" variant="cream" asChild className="relative mt-8">
          <Link href="/register">
            Create your account <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy text-cream">
            <Wallet className="h-3.5 w-3.5" />
          </span>
          <span className="font-display font-semibold text-foreground">MoneyMate</span>
        </div>
        <div className="flex gap-6">
          <Link href="/help" className="hover:text-foreground">Help & FAQ</Link>
          <Link href="/support" className="hover:text-foreground">Contact support</Link>
        </div>
        <p>© 2026 MoneyMate. All rights reserved.</p>
      </div>
    </footer>
  );
}
