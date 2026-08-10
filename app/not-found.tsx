"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Wallet, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 text-center">
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cream animate-float-slow blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-sky animate-float-slower blur-3xl" />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative">
        <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-navy text-cream">
          <Wallet className="h-7 w-7" />
        </span>
        <h1 className="font-display text-7xl font-semibold tracking-tight text-navy dark:text-foreground">404</h1>
        <p className="mt-4 text-xl font-medium">This page doesn&apos;t add up</p>
        <p className="mx-auto mt-2 max-w-sm text-muted-foreground">
          The page you&apos;re looking for might have moved, or never existed in the first place.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" /> Go back
          </Button>
          <Button asChild>
            <Link href="/dashboard"><Home className="h-4 w-4" /> Back to dashboard</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
