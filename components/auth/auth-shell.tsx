"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-navy p-12 text-white md:flex">
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-sky/15 blur-3xl animate-float-slow" />
        <div className="absolute -bottom-24 -right-16 h-96 w-96 rounded-full bg-cream/10 blur-3xl animate-float-slower" />
        <Link href="/" className="relative flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cream text-navy">
            <Wallet className="h-4.5 w-4.5" />
          </span>
          <span className="font-display text-lg font-semibold">MoneyMate</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <h2 className="font-display text-3xl font-semibold leading-tight">
            Your finances, finally in one calm place.
          </h2>
          <p className="mt-4 max-w-sm text-white/70">
            Track spending, split bills, and hit budget goals — all with a dashboard
            that actually feels good to open.
          </p>
        </motion.div>

        <p className="relative text-sm text-white/50">© 2026 MoneyMate</p>
      </div>

      <div className="flex items-center justify-center bg-background px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 flex items-center gap-2 md:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-cream">
              <Wallet className="h-4.5 w-4.5" />
            </span>
            <span className="font-display text-lg font-semibold">MoneyMate</span>
          </div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </motion.div>
      </div>
    </div>
  );
}
