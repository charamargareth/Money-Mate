"use client";

import { motion } from "framer-motion";
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { CountUp } from "@/components/shared/count-up";
import { formatCurrency } from "@/lib/utils";
import { mockTransactions, summarize } from "@/lib/mock-data";

export function SummaryCards() {
  const { income, expense, balance, savings } = summarize(mockTransactions);

  const cards = [
    {
      label: "Total Balance",
      value: balance,
      icon: Wallet,
      accent: "bg-navy text-cream",
      note: "Across all accounts",
      featured: true,
    },
    {
      label: "Total Income",
      value: income,
      icon: TrendingUp,
      accent: "bg-income-soft text-income",
      note: "This month",
    },
    {
      label: "Total Expense",
      value: expense,
      icon: TrendingDown,
      accent: "bg-expense-soft text-expense",
      note: "This month",
    },
    {
      label: "Savings",
      value: savings,
      icon: PiggyBank,
      accent: "bg-sky-soft text-navy dark:text-sky",
      note: "of income saved",
      isPercent: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.4 }}
          className={`card-surface relative overflow-hidden rounded-xl p-5 transition-shadow hover:shadow-[var(--shadow-lift)] ${
            c.featured ? "bg-navy text-white" : ""
          }`}
        >
          {c.featured && (
            <>
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-sky/20 blur-2xl animate-float-slow" />
              <div className="absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-cream/10 blur-2xl animate-float-slower" />
            </>
          )}
          <div className="relative flex items-start justify-between">
            <span className={`text-sm font-medium ${c.featured ? "text-white/70" : "text-muted-foreground"}`}>
              {c.label}
            </span>
            <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${c.featured ? "bg-white/10 text-cream" : c.accent}`}>
              <c.icon className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className={`relative mt-3 font-tabular text-2xl font-semibold tracking-tight lg:text-[28px] ${c.featured ? "text-white" : "text-foreground"}`}>
            {c.isPercent ? (
              <>
                <CountUp value={c.value} />%
              </>
            ) : (
              <CountUp value={c.value} format={(n) => formatCurrency(n)} />
            )}
          </div>
          <p className={`relative mt-1 text-xs ${c.featured ? "text-white/60" : "text-muted-foreground"}`}>{c.note}</p>
        </motion.div>
      ))}
    </div>
  );
}
