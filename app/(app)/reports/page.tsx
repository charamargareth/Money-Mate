"use client";

import * as React from "react";
import { FileDown, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { mockTransactions } from "@/lib/mock-data";
import { exportCSV, exportExcel, exportPDF } from "@/lib/export";
import { formatCurrency } from "@/lib/utils";

export default function ReportsPage() {
  const [category, setCategory] = React.useState("all");
  const [from, setFrom] = React.useState("2026-07-01");
  const [to, setTo] = React.useState("2026-07-31");

  const filtered = mockTransactions.filter((t) => {
    const inRange = t.date >= from && t.date <= to;
    const matchesCategory = category === "all" || t.category === category;
    return inRange && matchesCategory;
  });

  const categories = Array.from(new Set(mockTransactions.map((t) => t.category)));
  const total = filtered.reduce((s, t) => s + (t.type === "income" ? t.amount : -t.amount), 0);

  async function handleExport(format: "csv" | "excel" | "pdf") {
    if (filtered.length === 0) {
      toast.error("No transactions match your filters");
      return;
    }
    if (format === "csv") exportCSV(filtered);
    if (format === "excel") await exportExcel(filtered);
    if (format === "pdf") await exportPDF(filtered);
    toast.success(`Report exported as ${format.toUpperCase()}`);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Reports" subtitle="Export your transactions as PDF, Excel, or CSV." />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter transactions</CardTitle>
          <CardDescription>Choose a date range and category, then export.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-4">
          <div className="space-y-1.5">
            <Label htmlFor="from">From</Label>
            <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="to">To</Label>
            <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>{filtered.length} transactions found</CardTitle>
            <CardDescription>
              Net total: <span className={total >= 0 ? "text-income" : "text-expense"}>{formatCurrency(total)}</span>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            <Button variant="outline" onClick={() => handleExport("pdf")}>
              <FileText className="h-4 w-4 text-expense" /> Export PDF
            </Button>
            <Button variant="outline" onClick={() => handleExport("excel")}>
              <FileSpreadsheet className="h-4 w-4 text-income" /> Export Excel
            </Button>
            <Button variant="outline" onClick={() => handleExport("csv")}>
              <FileDown className="h-4 w-4 text-navy dark:text-sky" /> Export CSV
            </Button>
          </div>

          <div className="max-h-80 divide-y divide-border overflow-y-auto rounded-xl border border-border">
            {filtered.map((t) => (
              <div key={t.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span className="text-muted-foreground">{t.date}</span>
                <span className="flex-1 truncate px-3">{t.description}</span>
                <span className={t.type === "income" ? "text-income" : "text-expense"}>
                  {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                </span>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">No transactions in this range</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
