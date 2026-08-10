"use client";

import { motion } from "framer-motion";
import { TrendingUp, Award, Percent, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CountUp } from "@/components/shared/count-up";
import { formatCurrency, percentage } from "@/lib/utils";
import { mockTransactions, mockBudgets, summarize, categoryBreakdown } from "@/lib/mock-data";

export function AnalyticsSummary() {
  const { income, expense, savings } = summarize(mockTransactions);
  const topCategory = categoryBreakdown(mockTransactions)[0];
  const totalBudget = mockBudgets.reduce((s, b) => s + b.amount, 0);
  const totalSpent = mockBudgets.reduce((s, b) => s + b.spent, 0);
  const budgetPerformance = 100 - percentage(totalSpent, totalBudget);

  const items = [
    { label: "Savings rate", value: savings, suffix: "%", icon: Percent, color: "text-income" },
    { label: "Highest spending", value: topCategory?.value ?? 0, icon: Award, color: "text-expense", isCurrency: true, note: topCategory?.name },
    { label: "Net this period", value: income - expense, icon: TrendingUp, color: "text-navy dark:text-sky", isCurrency: true },
    { label: "Budget performance", value: Math.max(0, budgetPerformance), suffix: "%", icon: Target, color: "text-warning", note: "under budget" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, i) => (
        <motion.div key={item.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <p className={`mt-2 font-tabular text-2xl font-semibold ${item.color}`}>
                {item.isCurrency ? <CountUp value={item.value} format={(n) => formatCurrency(n)} /> : <CountUp value={item.value} />}
                {item.suffix}
              </p>
              {item.note && <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
