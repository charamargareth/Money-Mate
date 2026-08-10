"use client";

import * as React from "react";
import { Search, Receipt, Users, CalendarClock, Tag } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { mockTransactions, mockBills, mockSplitBills, categoryColors } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export function GlobalSearch({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, []);

  const q = query.trim().toLowerCase();

  const transactions = q
    ? mockTransactions.filter((t) => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)).slice(0, 4)
    : [];
  const bills = q ? mockBills.filter((b) => b.name.toLowerCase().includes(q)).slice(0, 3) : [];
  const splits = q ? mockSplitBills.filter((s) => s.title.toLowerCase().includes(q)).slice(0, 3) : [];
  const categories = q
    ? Array.from(new Set(Object.keys(categoryColors))).filter((c) => c.toLowerCase().includes(q)).slice(0, 4)
    : [];

  const hasResults = transactions.length || bills.length || splits.length || categories.length;

  return (
    <>
      {compact ? (
        <button
          onClick={() => setOpen(true)}
          aria-label="Search"
          className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-muted"
        >
          <Search className="h-[18px] w-[18px]" />
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex h-10 w-full max-w-xs items-center gap-2 rounded-xl border border-border bg-surface px-3.5 text-sm text-muted-foreground transition-colors hover:bg-surface-muted"
        >
          <Search className="h-4 w-4" />
          Search transactions, bills…
          <kbd className="ml-auto rounded-md border border-border bg-surface-muted px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
        </button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="top-[20%] translate-y-0 p-0">
          <DialogTitle className="sr-only">Global search</DialogTitle>
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search transactions, categories, bills, split bills…"
              className="h-auto border-none p-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <div className="max-h-96 overflow-y-auto p-2">
            {!q && <p className="px-3 py-6 text-center text-sm text-muted-foreground">Start typing to search across MoneyMate</p>}
            {q && !hasResults && <p className="px-3 py-6 text-center text-sm text-muted-foreground">No results for &ldquo;{query}&rdquo;</p>}

            {transactions.length > 0 && (
              <div className="mb-2">
                <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground">Transactions</p>
                {transactions.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-surface-muted">
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 truncate text-sm">{t.description}</span>
                    <span className="font-tabular text-sm">{formatCurrency(t.amount)}</span>
                  </div>
                ))}
              </div>
            )}
            {bills.length > 0 && (
              <div className="mb-2">
                <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground">Bills</p>
                {bills.map((b) => (
                  <div key={b.id} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-surface-muted">
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 truncate text-sm">{b.name}</span>
                    <span className="font-tabular text-sm">{formatCurrency(b.amount)}</span>
                  </div>
                ))}
              </div>
            )}
            {splits.length > 0 && (
              <div className="mb-2">
                <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground">Split bills</p>
                {splits.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-surface-muted">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 truncate text-sm">{s.title}</span>
                    <span className="font-tabular text-sm">{formatCurrency(s.total_amount)}</span>
                  </div>
                ))}
              </div>
            )}
            {categories.length > 0 && (
              <div>
                <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground">Categories</p>
                {categories.map((c) => (
                  <div key={c} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-surface-muted">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{c}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
