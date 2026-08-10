"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Wallet, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { mobileTabs, primaryNav, secondaryNav } from "@/components/layout/nav-items";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Avatar } from "@/components/ui/avatar";
import { mockProfile } from "@/lib/mock-data";

export function MobileBottomNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/90 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 px-1 py-1.5">
          {mobileTabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-medium transition-colors",
                  active ? "text-navy dark:text-sky" : "text-muted-foreground"
                )}
              >
                <tab.icon className={cn("h-5 w-5", active && "scale-110")} />
                {tab.label}
              </Link>
            );
          })}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-medium text-muted-foreground">
                <Menu className="h-5 w-5" />
                More
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[80vh] rounded-t-3xl">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-cream">
                  <Wallet className="h-4.5 w-4.5" />
                </span>
                <span className="font-display text-lg font-semibold">MoneyMate</span>
              </div>
              <div className="mb-4 flex items-center gap-3 rounded-xl bg-surface-muted p-3">
                <Avatar name={mockProfile.full_name} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{mockProfile.full_name}</p>
                  <p className="truncate text-xs text-muted-foreground">@{mockProfile.username}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[...primaryNav, ...secondaryNav].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex flex-col items-center gap-2 rounded-xl border border-border p-3 text-center text-xs font-medium"
                  >
                    <item.icon className="h-5 w-5 text-navy dark:text-sky" />
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border p-3 text-center text-xs font-medium text-expense"
                >
                  <LogOut className="h-5 w-5" />
                  Log out
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
      <div className="h-16 lg:hidden" />
    </>
  );
}
