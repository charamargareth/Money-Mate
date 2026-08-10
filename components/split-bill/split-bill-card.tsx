"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { SplitBill } from "@/types";

export function SplitBillCard({ bill, index }: { bill: SplitBill; index: number }) {
  const paidCount = bill.members.filter((m) => m.status === "paid").length;
  const allPaid = paidCount === bill.members.length;

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
      <Link href={`/split-bill/${bill.id}`}>
        <Card className="cursor-pointer transition-transform hover:-translate-y-1">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">{bill.title}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(bill.created_at)}</p>
              </div>
              <Badge variant={allPaid ? "income" : "warning"}>
                {allPaid ? "All paid" : `${paidCount}/${bill.members.length} paid`}
              </Badge>
            </div>

            <p className="mt-4 font-tabular text-2xl font-semibold">{formatCurrency(bill.total_amount)}</p>
            <p className="text-xs text-muted-foreground">
              {bill.split_type === "equal" ? "Split equally" : "Custom split"} · {bill.members.length} people
            </p>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex -space-x-2.5">
                {bill.members.slice(0, 4).map((m) => (
                  <Avatar key={m.id} name={m.name} size={30} className="ring-2 ring-surface" />
                ))}
              </div>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" /> {bill.members.length}
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
