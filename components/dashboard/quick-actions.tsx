"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, ScanLine, Users } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";
import { TransactionFormDialog } from "@/components/transactions/transaction-form-dialog";

type QuickAction = {
  key: "expense" | "income" | "scan" | "split";
  label: string;
  icon: typeof TrendingDown;
  color: string;
  href?: string;
};

const actions: QuickAction[] = [
  { key: "expense", label: "Add Expense", icon: TrendingDown, color: "bg-expense-soft text-expense" },
  { key: "income", label: "Add Income", icon: TrendingUp, color: "bg-income-soft text-income" },
  { key: "scan", label: "Scan Receipt", icon: ScanLine, color: "bg-sky-soft text-navy dark:text-sky", href: "/scan-receipt" },
  { key: "split", label: "Split Bill", icon: Users, color: "bg-cream text-navy", href: "/split-bill" },
];

export function QuickActions() {
  const [openExpense, setOpenExpense] = React.useState(false);
  const [openIncome, setOpenIncome] = React.useState(false);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {actions.map((a, i) => {
          const content = (
            <motion.div
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="card-surface flex flex-col items-center gap-2.5 rounded-xl p-4 text-center cursor-pointer transition-shadow hover:shadow-[var(--shadow-lift)]"
            >
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.color}`}>
                <a.icon className="h-5 w-5" />
              </span>
              <span className="text-xs font-medium">{a.label}</span>
            </motion.div>
          );

          if (a.href) {
            return (
              <Link key={a.key} href={a.href}>
                {content}
              </Link>
            );
          }
          if (a.key === "expense") {
            return (
              <button key={a.key} onClick={() => setOpenExpense(true)} className="text-left">
                {content}
              </button>
            );
          }
          return (
            <button key={a.key} onClick={() => setOpenIncome(true)} className="text-left">
              {content}
            </button>
          );
        })}
      </div>

      <TransactionFormDialog type="expense" open={openExpense} onOpenChange={setOpenExpense} />
      <TransactionFormDialog type="income" open={openIncome} onOpenChange={setOpenIncome} />
    </>
  );
}
