"use client";

import * as React from "react";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval,
  isSameMonth, isSameDay, format, addMonths, subMonths, isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils";
import type { RecurringBill } from "@/types";

export function BillsCalendar({ bills }: { bills: RecurringBill[] }) {
  const [month, setMonth] = React.useState(new Date(2026, 6, 1)); // July 2026, matches mock data

  const start = startOfWeek(startOfMonth(month));
  const end = endOfWeek(endOfMonth(month));
  const days = eachDayOfInterval({ start, end });

  const billsByDay = (day: Date) => bills.filter((b) => isSameDay(new Date(b.due_date), day));

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">{format(month, "MMMM yyyy")}</h3>
          <div className="flex gap-1.5">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setMonth((m) => subMonths(m, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setMonth((m) => addMonths(m, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const dayBills = billsByDay(day);
            const inMonth = isSameMonth(day, month);
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "min-h-[76px] rounded-lg border border-transparent p-1.5 text-xs transition-colors",
                  inMonth ? "hover:border-border hover:bg-surface-muted" : "opacity-30",
                  isToday(day) && "border-navy bg-sky-soft dark:border-sky"
                )}
              >
                <span className={cn("font-medium", isToday(day) && "text-navy dark:text-sky")}>{format(day, "d")}</span>
                <div className="mt-1 space-y-1">
                  {dayBills.slice(0, 2).map((b) => (
                    <div
                      key={b.id}
                      className={cn(
                        "truncate rounded px-1 py-0.5 text-[10px] font-medium",
                        b.is_paid ? "bg-income-soft text-income" : "bg-expense-soft text-expense"
                      )}
                      title={`${b.name} · ${formatCurrency(b.amount)}`}
                    >
                      {b.name}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
