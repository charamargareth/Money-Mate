"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { primaryNav, secondaryNav } from "@/components/layout/nav-items";
import { Avatar } from "@/components/ui/avatar";
import { mockProfile } from "@/lib/mock-data";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-surface/60 backdrop-blur-xl lg:flex">
      <Link href="/dashboard" className="flex items-center gap-2 px-6 py-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-cream">
          <Wallet className="h-4.5 w-4.5" />
        </span>
        <span className="font-display text-lg font-semibold tracking-tight">MoneyMate</span>
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {primaryNav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-navy text-cream shadow-[0_6px_16px_rgba(35,50,74,0.25)]"
                  : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}

        <div className="my-3 h-px bg-border" />

        {secondaryNav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-surface-muted text-foreground" : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-surface-muted">
          <Avatar name={mockProfile.full_name} size={38} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{mockProfile.full_name}</p>
            <p className="truncate text-xs text-muted-foreground">@{mockProfile.username}</p>
          </div>
          <Link href="/login" aria-label="Log out" className="text-muted-foreground hover:text-expense">
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
