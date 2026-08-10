"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, ScanLine, Users, PiggyBank, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const slides = [
  {
    icon: Wallet,
    title: "Welcome to MoneyMate",
    desc: "Track every rupiah in and out, all from one calm dashboard.",
  },
  {
    icon: ScanLine,
    title: "Scan receipts with AI",
    desc: "Snap a photo and let AI fill in the merchant, total, and category for you.",
  },
  {
    icon: Users,
    title: "Split bills effortlessly",
    desc: "Split dinner or a trip, then share a link so everyone can pay their part.",
  },
  {
    icon: PiggyBank,
    title: "Stay on budget",
    desc: "Set monthly limits per category and get warned before you overspend.",
  },
];

const STORAGE_KEY = "moneymate_onboarding_seen";

export function OnboardingModal() {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    const seen = typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY);
    if (!seen) setOpen(true);
  }, []);

  function finish() {
    window.localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  const slide = slides[step];
  const isLast = step === slides.length - 1;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && finish()}>
      <DialogContent className="max-w-sm text-center">
        <button onClick={finish} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center px-2 py-4"
          >
            <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-soft text-navy dark:text-sky">
              <slide.icon className="h-7 w-7" />
            </span>
            <h2 className="font-display text-xl font-semibold">{slide.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{slide.desc}</p>
          </motion.div>
        </AnimatePresence>

        <div className="mb-5 flex justify-center gap-1.5">
          {slides.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-navy dark:bg-sky" : "w-1.5 bg-border"}`} />
          ))}
        </div>

        <div className="flex gap-2">
          {step > 0 && (
            <Button variant="outline" className="flex-1" onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
          )}
          <Button className="flex-1" onClick={() => (isLast ? finish() : setStep((s) => s + 1))}>
            {isLast ? "Get started" : "Next"} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        {!isLast && (
          <button onClick={finish} className="mt-3 text-xs text-muted-foreground hover:text-foreground">
            Skip
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}
