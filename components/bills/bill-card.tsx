"use client";

import { motion } from "framer-motion";
import { Zap, Wifi, Home, Shield, Music, Clapperboard, Receipt, Check, Repeat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { RecurringBill } from "@/types";

const iconMap: Record<string, React.ElementType> = {
  zap: Zap, wifi: Wifi, home: Home, shield: Shield, music: Music, clapperboard: Clapperboard,
};

export function BillCard({
  bill,
  index,
  onTogglePaid,
}: {
  bill: RecurringBill;
  index: number;
  onTogglePaid: (id: string) => void;
}) {
  const Icon = iconMap[bill.icon] ?? Receipt;
  const daysUntil = Math.ceil((new Date(bill.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const overdue = daysUntil < 0 && !bill.is_paid;
  const dueSoon = daysUntil >= 0 && daysUntil <= 3 && !bill.is_paid;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cream text-navy">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium">{bill.name}</p>
              {bill.repeat === "monthly" && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Repeat className="h-3 w-3" /> Monthly
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Due {formatDate(bill.due_date)}</p>
          </div>
          <div className="text-right">
            <p className="font-tabular font-semibold">{formatCurrency(bill.amount)}</p>
            {bill.is_paid ? (
              <Badge variant="income">Paid</Badge>
            ) : overdue ? (
              <Badge variant="expense">Overdue</Badge>
            ) : dueSoon ? (
              <Badge variant="warning">Due soon</Badge>
            ) : (
              <Badge variant="outline">Upcoming</Badge>
            )}
          </div>
          <Button
            size="icon"
            variant={bill.is_paid ? "outline" : "default"}
            className="ml-1 h-9 w-9 shrink-0"
            onClick={() => onTogglePaid(bill.id)}
            aria-label="Mark as paid"
          >
            <Check className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
