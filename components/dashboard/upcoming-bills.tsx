"use client";

import Link from "next/link";
import { Zap, Wifi, Home, Shield, Music, Clapperboard, Receipt } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockBills } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  zap: Zap, wifi: Wifi, home: Home, shield: Shield, music: Music, clapperboard: Clapperboard,
};

export function UpcomingBills() {
  const upcoming = mockBills.filter((b) => !b.is_paid).slice(0, 4);
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Upcoming Bills</CardTitle>
          <CardDescription>Due this month</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/bills">View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-1">
        {upcoming.map((b) => {
          const Icon = iconMap[b.icon] ?? Receipt;
          const dueSoon = new Date(b.due_date).getTime() - Date.now() < 1000 * 60 * 60 * 24 * 3;
          return (
            <div key={b.id} className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-surface-muted">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream text-navy">
                <Icon className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{b.name}</p>
                <p className="text-xs text-muted-foreground">Due {formatDate(b.due_date)}</p>
              </div>
              <div className="text-right">
                <p className="font-tabular text-sm font-semibold">{formatCurrency(b.amount)}</p>
                {dueSoon && <Badge variant="warning" className="mt-0.5">Due soon</Badge>}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
