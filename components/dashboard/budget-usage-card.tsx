"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { mockBudgets } from "@/lib/mock-data";
import { formatCurrency, percentage } from "@/lib/utils";

export function BudgetUsageCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Usage</CardTitle>
        <CardDescription>How this month&apos;s budgets are tracking</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockBudgets.map((b, i) => {
          const pct = percentage(b.spent, b.amount);
          const over = b.spent > b.amount;
          const warn = pct >= 80;
          return (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium">{b.category}</span>
                <div className="flex items-center gap-2">
                  <span className="font-tabular text-muted-foreground">
                    {formatCurrency(b.spent)} / {formatCurrency(b.amount)}
                  </span>
                  {over ? (
                    <Badge variant="expense">Over</Badge>
                  ) : warn ? (
                    <Badge variant="warning">{pct}%</Badge>
                  ) : (
                    <Badge variant="accent">{pct}%</Badge>
                  )}
                </div>
              </div>
              <Progress
                value={pct}
                indicatorClassName={over ? "bg-expense" : warn ? "bg-warning" : "bg-navy"}
              />
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
