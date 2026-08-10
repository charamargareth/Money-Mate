"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, TrendingDown, TrendingUp, ScanLine, Users, X } from "lucide-react";
import { TransactionFormDialog } from "@/components/transactions/transaction-form-dialog";

export function Fab() {
  const [open, setOpen] = React.useState(false);
  const [openExpense, setOpenExpense] = React.useState(false);
  const [openIncome, setOpenIncome] = React.useState(false);

  const items = [
    { label: "Add expense", icon: TrendingDown, action: () => setOpenExpense(true) },
    { label: "Add income", icon: TrendingUp, action: () => setOpenIncome(true) },
    { label: "Scan receipt", icon: ScanLine, href: "/scan-receipt" },
    { label: "Split bill", icon: Users, href: "/split-bill" },
  ];

  return (
    <>
      <div className="fixed bottom-24 right-5 z-40 flex flex-col items-end gap-3 lg:bottom-8">
        <AnimatePresence>
          {open &&
            items.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.9 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-2.5"
              >
                <span className="rounded-lg bg-navy px-2.5 py-1 text-xs font-medium text-white shadow-md">
                  {item.label}
                </span>
                {item.href ? (
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-foreground shadow-[var(--shadow-lift)]"
                  >
                    <item.icon className="h-4.5 w-4.5" />
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      item.action?.();
                      setOpen(false);
                    }}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-foreground shadow-[var(--shadow-lift)]"
                  >
                    <item.icon className="h-4.5 w-4.5" />
                  </button>
                )}
              </motion.div>
            ))}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setOpen((o) => !o)}
          aria-label="Quick actions"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-cream shadow-[0_10px_30px_rgba(35,50,74,0.35)]"
        >
          <motion.span animate={{ rotate: open ? 135 : 0 }} transition={{ duration: 0.2 }}>
            {open ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
          </motion.span>
        </motion.button>
      </div>

      <TransactionFormDialog type="expense" open={openExpense} onOpenChange={setOpenExpense} />
      <TransactionFormDialog type="income" open={openIncome} onOpenChange={setOpenIncome} />
    </>
  );
}
