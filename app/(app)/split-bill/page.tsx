"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SplitBillCard } from "@/components/split-bill/split-bill-card";
import { CreateSplitBillDialog } from "@/components/split-bill/create-split-bill-dialog";
import { mockSplitBills } from "@/lib/mock-data";
import type { SplitBill } from "@/types";
import { Users } from "lucide-react";

export default function SplitBillPage() {
  const [bills, setBills] = React.useState<SplitBill[]>(mockSplitBills);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Split Bill"
        subtitle="Create group expenses and keep track of who's paid."
        actions={<CreateSplitBillDialog onCreate={(b) => setBills((prev) => [b, ...prev])} />}
      />

      {bills.length === 0 ? (
        <div className="card-surface flex flex-col items-center gap-3 rounded-xl py-20 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted text-muted-foreground">
            <Users className="h-6 w-6" />
          </span>
          <p className="font-medium">No split bills yet</p>
          <p className="max-w-xs text-sm text-muted-foreground">Create one to split a dinner, trip, or rent with friends.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bills.map((bill, i) => (
            <SplitBillCard key={bill.id} bill={bill} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
