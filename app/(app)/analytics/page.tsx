"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { AnalyticsFilters } from "@/components/analytics/analytics-filters";
import { AnalyticsSummary } from "@/components/analytics/analytics-summary";
import { SpendingTrendChart, IncomeExpenseChart, CategoryPieChart } from "@/components/dashboard/charts";
import { BudgetUsageCard } from "@/components/dashboard/budget-usage-card";

export default function AnalyticsPage() {
  const [period, setPeriod] = React.useState("month");

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Financial Analytics" subtitle="A closer look at how your money moves." />
      <AnalyticsFilters period={period} onPeriodChange={setPeriod} />

      <div className="space-y-5">
        <AnalyticsSummary />

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SpendingTrendChart />
          </div>
          <CategoryPieChart />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <IncomeExpenseChart />
          <BudgetUsageCard />
        </div>
      </div>
    </div>
  );
}
