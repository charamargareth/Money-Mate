"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";
import { GlobalSearch } from "@/components/layout/global-search";
import { NotificationsMenu } from "@/components/layout/notifications-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { mockProfile } from "@/lib/mock-data";
import { Settings, LogOut, HelpCircle } from "lucide-react";

export function Topbar({ title }: { title?: string }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-background/80 px-5 py-3.5 backdrop-blur-xl lg:px-8">
      <div className="flex items-center gap-2 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-cream">
            <Wallet className="h-4 w-4" />
          </span>
        </Link>
      </div>

      {title ? (
        <h1 className="hidden font-display text-xl font-semibold tracking-tight lg:block">{title}</h1>
      ) : (
        <div className="hidden lg:block" />
      )}

      <div className="hidden flex-1 justify-center md:flex">
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-1">
        <div className="md:hidden">
          <GlobalSearch compact />
        </div>
        <ThemeToggle />
        <NotificationsMenu />
        <DropdownMenu>
          <DropdownMenuTrigger className="ml-1">
            <Avatar name={mockProfile.full_name} size={36} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="font-medium text-foreground">{mockProfile.full_name}</p>
              <p className="text-xs font-normal text-muted-foreground">@{mockProfile.username}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings"><Settings className="h-4 w-4" /> Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/help"><HelpCircle className="h-4 w-4" /> Help & FAQ</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="text-expense">
              <Link href="/login"><LogOut className="h-4 w-4" /> Log out</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
