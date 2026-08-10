"use client";

import * as React from "react";
import { Bell, PiggyBank, CalendarClock, ScanLine, Users, FileBarChart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { mockNotifications } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { NotificationType } from "@/types";

const iconMap: Record<NotificationType, React.ElementType> = {
  budget_exceeded: PiggyBank,
  bill_due: CalendarClock,
  receipt_scanned: ScanLine,
  split_payment: Users,
  monthly_report: FileBarChart,
};

const colorMap: Record<NotificationType, string> = {
  budget_exceeded: "bg-warning-soft text-warning",
  bill_due: "bg-expense-soft text-expense",
  receipt_scanned: "bg-sky-soft text-navy dark:text-sky",
  split_payment: "bg-income-soft text-income",
  monthly_report: "bg-surface-muted text-foreground",
};

export function NotificationsMenu() {
  const unread = mockNotifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-muted"
        >
          <Bell className="h-[18px] w-[18px]" />
          {unread > 0 && (
            <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-expense ring-2 ring-surface" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <DropdownMenuLabel className="px-4 py-3 text-sm font-semibold text-foreground">
          Notifications
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-96 overflow-y-auto p-1.5">
          {mockNotifications.map((n) => {
            const Icon = iconMap[n.type];
            return (
              <div
                key={n.id}
                className={cn(
                  "flex items-start gap-3 rounded-lg px-2.5 py-2.5 transition-colors hover:bg-surface-muted",
                  !n.read && "bg-sky-soft/50"
                )}
              >
                <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", colorMap[n.type])}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-snug">{n.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
