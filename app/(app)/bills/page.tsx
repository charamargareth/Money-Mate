"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { BillCard } from "@/components/bills/bill-card";
import { BillsCalendar } from "@/components/bills/bills-calendar";
import { CreateBillDialog } from "@/components/bills/create-bill-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { mockBills } from "@/lib/mock-data";
import type { RecurringBill } from "@/types";
import { toast } from "sonner";

export default function BillsPage() {
  const [bills, setBills] = React.useState<RecurringBill[]>(mockBills);

  function togglePaid(id: string) {
    setBills((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const next = { ...b, is_paid: !b.is_paid };
        toast.success(next.is_paid ? `${b.name} marked as paid` : `${b.name} marked as unpaid`);
        return next;
      })
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Bill Reminders"
        subtitle="Recurring bills so nothing sneaks up on you."
        actions={<CreateBillDialog onCreate={(b) => setBills((prev) => [b, ...prev])} />}
      />

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-3">
          {bills.map((b, i) => (
            <BillCard key={b.id} bill={b} index={i} onTogglePaid={togglePaid} />
          ))}
        </TabsContent>
        <TabsContent value="calendar">
          <BillsCalendar bills={bills} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
