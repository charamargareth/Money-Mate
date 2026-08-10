import {
  LayoutDashboard,
  ArrowLeftRight,
  ScanLine,
  Users,
  PiggyBank,
  LineChart,
  BellRing,
  FileDown,
  Settings,
  HelpCircle,
  MessageCircleQuestion,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const primaryNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/scan-receipt", label: "Scan Receipt", icon: ScanLine },
  { href: "/split-bill", label: "Split Bill", icon: Users },
  { href: "/budget", label: "Budget", icon: PiggyBank },
  { href: "/analytics", label: "Analytics", icon: LineChart },
  { href: "/bills", label: "Bill Reminders", icon: BellRing },
  { href: "/reports", label: "Reports", icon: FileDown },
];

export const secondaryNav: NavItem[] = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help & FAQ", icon: HelpCircle },
  { href: "/support", label: "Contact Support", icon: MessageCircleQuestion },
];

export const mobileTabs: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/transactions", label: "History", icon: ArrowLeftRight },
  { href: "/budget", label: "Budget", icon: PiggyBank },
  { href: "/analytics", label: "Insights", icon: LineChart },
];
