"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, percentage } from "@/lib/utils";
import { categoryColors } from "@/lib/mock-data";
import type { Budget } from "@/types";

export function BudgetCard({ budget, index }: { budget: Budget; index: number }) {
  const pct = percentage(budget.spent, budget.amount);
  const remaining = budget.amount - budget.spent;
  const over = budget.spent > budget.amount;
  const warn = pct >= 80 && !over;

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold"
                style={{ background: `${categoryColors[budget.category] ?? "#64748B"}22`, color: categoryColors[budget.category] ?? "#64748B" }}
              >
                {budget.category[0]}
              </span>
              <h3 className="font-display font-semibold">{budget.category}</h3>
            </div>
            {(over || warn) && (
              <Badge variant={over ? "expense" : "warning"}>
                <AlertTriangle className="h-3 w-3" /> {over ? "Over budget" : "80%+ used"}
              </Badge>
            )}
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-tabular text-xl font-semibold">{formatCurrency(budget.spent)}</span>
            <span className="text-xs text-muted-foreground">of {formatCurrency(budget.amount)}</span>
          </div>

          <Progress value={pct} className="mt-3" indicatorClassName={over ? "bg-expense" : warn ? "bg-warning" : "bg-navy"} />

          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{pct}% used</span>
            <span className={remaining < 0 ? "text-expense" : ""}>
              {remaining < 0 ? `${formatCurrency(Math.abs(remaining))} over` : `${formatCurrency(remaining)} left`}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
