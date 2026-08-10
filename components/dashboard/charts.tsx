"use client";

import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from "recharts";
import { useTheme } from "next-themes";
import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { monthlyTrend, categoryBreakdown, mockTransactions } from "@/lib/mock-data";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";

function useChartColors() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === "dark";
  return {
    grid: dark ? "#2a3646" : "#eef1f5",
    text: dark ? "#94a3b8" : "#64748b",
    navy: dark ? "#cfebff" : "#23324a",
    sky: "#cfebff",
    income: "#22c55e",
    expense: "#ef4444",
  };
}

interface ChartTooltipProps {
  active?: boolean;
  label?: string;
  payload?: { dataKey: string; name: string; value: number; color: string }[];
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card-surface rounded-lg px-3 py-2 text-xs shadow-[var(--shadow-lift)]">
      {label && <p className="mb-1 font-medium">{label}</p>}
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

export function SpendingTrendChart() {
  const c = useChartColors();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Spending Trend</CardTitle>
        <CardDescription>Expenses over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent className="h-72 pl-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyTrend} margin={{ left: 8, right: 16 }}>
            <defs>
              <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c.expense} stopOpacity={0.35} />
                <stop offset="100%" stopColor={c.expense} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={c.grid} vertical={false} />
            <XAxis dataKey="month" stroke={c.text} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={c.text} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => formatCompactNumber(v)} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="expense" name="Expense" stroke={c.expense} strokeWidth={2.5} fill="url(#expenseFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function IncomeExpenseChart() {
  const c = useChartColors();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expense</CardTitle>
        <CardDescription>Last 6 months compared</CardDescription>
      </CardHeader>
      <CardContent className="h-72 pl-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyTrend} margin={{ left: 8, right: 16 }} barGap={6}>
            <CartesianGrid stroke={c.grid} vertical={false} />
            <XAxis dataKey="month" stroke={c.text} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={c.text} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => formatCompactNumber(v)} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: c.grid }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="income" name="Income" fill={c.income} radius={[6, 6, 0, 0]} />
            <Bar dataKey="expense" name="Expense" fill={c.expense} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function CategoryPieChart() {
  const data = categoryBreakdown(mockTransactions);
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense by Category</CardTitle>
        <CardDescription>Where your money went this month</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="h-56 w-56 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={90} paddingAngle={3} strokeWidth={0}>
                {data.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full flex-1 space-y-2.5">
          {data.map((d) => (
            <div key={d.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                {d.name}
              </div>
              <div className="text-right">
                <span className="font-tabular font-medium">{formatCurrency(d.value)}</span>
                <span className="ml-2 text-xs text-muted-foreground">{Math.round((d.value / total) * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
