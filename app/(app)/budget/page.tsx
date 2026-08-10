"use client";

import * as React from "react";
import { PiggyBank } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { BudgetCard } from "@/components/budget/budget-card";
import { CreateBudgetDialog } from "@/components/budget/create-budget-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { mockBudgets } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import type { Budget } from "@/types";

export default function BudgetPage() {
  const [budgets, setBudgets] = React.useState<Budget[]>(mockBudgets);

  const totalBudget = budgets.reduce((s, b) => s + b.amount, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Budget Planner"
        subtitle="Set monthly limits per category and stay ahead of overspending."
        actions={<CreateBudgetDialog onCreate={(b) => setBudgets((prev) => [b, ...prev])} />}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total budgeted</p>
            <p className="mt-1 font-tabular text-2xl font-semibold">{formatCurrency(totalBudget)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total spent</p>
            <p className="mt-1 font-tabular text-2xl font-semibold text-expense">{formatCurrency(totalSpent)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className="mt-1 font-tabular text-2xl font-semibold text-income">{formatCurrency(totalBudget - totalSpent)}</p>
          </CardContent>
        </Card>
      </div>

      {budgets.length === 0 ? (
        <div className="card-surface flex flex-col items-center gap-3 rounded-xl py-20 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted text-muted-foreground">
            <PiggyBank className="h-6 w-6" />
          </span>
          <p className="font-medium">No budgets set yet</p>
          <p className="max-w-xs text-sm text-muted-foreground">Create a monthly budget to start tracking category limits.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {budgets.map((b, i) => (
            <BudgetCard key={b.id} budget={b} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
