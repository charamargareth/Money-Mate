"use client";

import * as React from "react";
import { Search, ScanLine, Users, PiggyBank, ShieldCheck, LineChart } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    category: "Getting started",
    icon: LineChart,
    items: [
      { q: "How do I add my first transaction?", a: "Go to Dashboard or Transactions and tap \u201cAdd Expense\u201d or \u201cAdd Income\u201d. Fill in the amount, category, and date, then save." },
      { q: "Can I change my currency later?", a: "Yes — head to Settings \u2192 Preferences and pick a new preferred currency at any time." },
    ],
  },
  {
    category: "AI receipt scanning",
    icon: ScanLine,
    items: [
      { q: "What file types can I upload?", a: "JPG, PNG, and PDF receipts up to 10MB are supported." },
      { q: "What happens if the scan fails?", a: "You'll see a clear error message with a retry option, or you can enter the transaction manually." },
    ],
  },
  {
    category: "Split bills",
    icon: Users,
    items: [
      { q: "What's the difference between equal and custom split?", a: "Equal split divides the total evenly among members. Custom split lets you set a specific amount for each person." },
      { q: "How do others pay their share?", a: "Share the QR code or link from the split bill's detail page — they can scan or click it to see what they owe." },
    ],
  },
  {
    category: "Budgets & analytics",
    icon: PiggyBank,
    items: [
      { q: "When will I get a budget warning?", a: "MoneyMate notifies you at 80% and 100% of any category budget." },
      { q: "Can I export my analytics?", a: "Yes — visit Reports to export your transactions as PDF, Excel, or CSV for any date range." },
    ],
  },
  {
    category: "Security",
    icon: ShieldCheck,
    items: [
      { q: "Is my financial data encrypted?", a: "Yes. Sessions are encrypted, and every table is protected with Row Level Security so only you can access your data." },
      { q: "How do I delete my account?", a: "Contact support and we'll permanently delete your account and all associated data within 30 days." },
    ],
  },
];

export default function HelpPage() {
  const [query, setQuery] = React.useState("");
  const q = query.toLowerCase();

  const filtered = faqs
    .map((section) => ({
      ...section,
      items: section.items.filter((i) => !q || i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q)),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Help & FAQ" subtitle="Answers to common questions about MoneyMate." />

      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search help articles…" className="h-12 pl-10" />
      </div>

      <div className="space-y-5">
        {filtered.map((section) => (
          <Card key={section.category}>
            <CardContent className="p-5">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-soft text-navy dark:text-sky">
                  <section.icon className="h-4 w-4" />
                </span>
                <h3 className="font-display font-semibold">{section.category}</h3>
              </div>
              <Accordion type="single" collapsible>
                {section.items.map((item, i) => (
                  <AccordionItem key={item.q} value={`${section.category}-${i}`}>
                    <AccordionTrigger>{item.q}</AccordionTrigger>
                    <AccordionContent>{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">No results for &ldquo;{query}&rdquo;</p>
        )}
      </div>
    </div>
  );
}
