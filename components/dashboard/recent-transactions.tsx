"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockTransactions, categoryColors } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export function RecentTransactions() {
  const recent = mockTransactions.slice(0, 6);
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest activity</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/transactions">View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-1">
        {recent.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-surface-muted"
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ background: `${categoryColors[t.category] ?? "#64748B"}1f`, color: categoryColors[t.category] ?? "#64748B" }}
            >
              {t.type === "income" ? <ArrowDownRight className="h-4.5 w-4.5" /> : <ArrowUpRight className="h-4.5 w-4.5" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{t.description}</p>
              <p className="text-xs text-muted-foreground">{t.category} · {formatDate(t.date)}</p>
            </div>
            <span className={`font-tabular text-sm font-semibold ${t.type === "income" ? "text-income" : "text-expense"}`}>
              {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
            </span>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
