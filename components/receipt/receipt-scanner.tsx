"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  UploadCloud, ScanLine, CheckCircle2, AlertTriangle, Loader2,
  Receipt as ReceiptIcon, RotateCcw, X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";
import type { ExtractedReceipt } from "@/types";

type Stage = "idle" | "uploading" | "processing" | "review" | "error";

const expenseCategories = ["Food", "Transportation", "Shopping", "Entertainment", "Health", "Education", "Bills", "Travel", "Others"];

const schema = z.object({
  merchant: z.string().min(1, "Required"),
  date: z.string().min(1, "Required"),
  time: z.string().min(1, "Required"),
  total: z.coerce.number().positive("Enter a valid amount"),
  category: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  paymentMethod: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

// Simulated OCR result — in production this calls Google Vision / Tesseract
// then an LLM (or heuristics) suggests category + description.
const MOCK_EXTRACTION: ExtractedReceipt = {
  merchant: "Kopi Kenangan - Sudirman",
  date: new Date().toISOString().slice(0, 10),
  time: "14:32",
  total: 58000,
  tax: 5800,
  payment_method: "E-Wallet",
  items: [
    { name: "Kopi Kenangan Mantan", price: 22000, qty: 1 },
    { name: "Croissant Butter", price: 28000, qty: 1 },
  ],
  suggested_category: "Food",
  suggested_description: "Coffee & pastry at Kopi Kenangan",
  confidence: 0.94,
};

export function ReceiptScanner() {
  const [stage, setStage] = React.useState<Stage>("idle");
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) as Resolver<FormValues> });

  function handleFile(file: File) {
    setFileName(file.name);
    if (file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
    runPipeline();
  }

  function runPipeline() {
    setStage("uploading");
    setProgress(0);
    const uploadTimer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(uploadTimer);
          return 100;
        }
        return p + 14;
      });
    }, 120);

    setTimeout(() => {
      clearInterval(uploadTimer);
      setProgress(100);
      setStage("processing");

      setTimeout(() => {
        // Simulated 3% failure just to demonstrate error handling UX
        const failed = Math.random() < 0.03;
        if (failed) {
          setStage("error");
          return;
        }
        setStage("review");
        reset({
          merchant: MOCK_EXTRACTION.merchant,
          date: MOCK_EXTRACTION.date,
          time: MOCK_EXTRACTION.time,
          total: MOCK_EXTRACTION.total,
          category: MOCK_EXTRACTION.suggested_category,
          description: MOCK_EXTRACTION.suggested_description,
          paymentMethod: MOCK_EXTRACTION.payment_method,
        });
      }, 1900);
    }, 1100);
  }

  function reset_() {
    setStage("idle");
    setFileName(null);
    setPreviewUrl(null);
    setProgress(0);
  }

  function onSubmit(values: FormValues) {
    toast.success("Receipt saved as an expense", {
      description: `${values.merchant} — ${formatCurrency(values.total)}`,
    });
    reset_();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {stage === "idle" && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <label
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFile(file);
                  }}
                  className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-surface-muted/50 px-6 py-16 text-center transition-colors hover:border-navy dark:hover:border-sky"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-soft text-navy dark:text-sky">
                    <UploadCloud className="h-6 w-6" />
                  </span>
                  <p className="font-medium">Drop your receipt here, or click to upload</p>
                  <p className="text-sm text-muted-foreground">Supports JPG, PNG, and PDF up to 10MB</p>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFile(file);
                    }}
                  />
                </label>
              </motion.div>
            )}

            {(stage === "uploading" || stage === "processing") && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-5 py-16 text-center"
              >
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt="Receipt preview" className="h-32 rounded-lg object-cover shadow-md" />
                ) : (
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-soft text-navy dark:text-sky">
                    <ReceiptIcon className="h-7 w-7" />
                  </span>
                )}

                {stage === "uploading" ? (
                  <div className="w-full max-w-xs">
                    <p className="mb-2 text-sm font-medium">Uploading {fileName}…</p>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                      <motion.div className="h-full bg-navy" animate={{ width: `${progress}%` }} />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}>
                      <ScanLine className="h-6 w-6 text-navy dark:text-sky" />
                    </motion.div>
                    <p className="text-sm font-medium">Reading your receipt with AI…</p>
                    <p className="text-xs text-muted-foreground">Extracting merchant, items, and totals</p>
                  </div>
                )}
              </motion.div>
            )}

            {stage === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4 py-16 text-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-expense-soft text-expense">
                  <AlertTriangle className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-medium">We couldn&apos;t read that receipt</p>
                  <p className="mt-1 text-sm text-muted-foreground">Try a clearer photo with good lighting, or enter it manually.</p>
                </div>
                <Button variant="outline" onClick={reset_}>
                  <RotateCcw className="h-4 w-4" /> Try again
                </Button>
              </motion.div>
            )}

            {stage === "review" && (
              <motion.div key="review" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-income-soft text-income">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <p className="font-medium">Receipt scanned successfully</p>
                <p className="mt-1 text-sm text-muted-foreground">Review the details on the right, then save.</p>
                {previewUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt="Receipt preview" className="mx-auto mt-5 max-h-64 rounded-lg object-contain shadow-md" />
                )}
                <button onClick={reset_} className="mx-auto mt-4 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" /> Scan a different receipt
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          {stage !== "review" ? (
            <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-2 text-center text-muted-foreground">
              <ReceiptIcon className="h-8 w-8" />
              <p className="text-sm">Extracted details will appear here once a receipt is scanned.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="mb-1 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">Extracted details</h3>
                <span className="rounded-full bg-income-soft px-2.5 py-1 text-xs font-medium text-income">
                  {Math.round(MOCK_EXTRACTION.confidence * 100)}% confidence
                </span>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="merchant">Merchant</Label>
                <Input id="merchant" {...register("merchant")} />
                {errors.merchant && <p className="text-xs text-expense">{errors.merchant.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" {...register("date")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" {...register("time")} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="total">Total amount</Label>
                <Input id="total" type="number" {...register("total")} />
                {errors.total && <p className="text-xs text-expense">{errors.total.message}</p>}
              </div>

              <div className="rounded-xl bg-surface-muted p-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">Items detected</p>
                <div className="space-y-1.5">
                  {MOCK_EXTRACTION.items.map((item) => (
                    <div key={item.name} className="flex justify-between text-sm">
                      <span>{item.qty}× {item.name}</span>
                      <span className="font-tabular">{formatCurrency(item.price)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t border-border pt-1.5 text-sm text-muted-foreground">
                    <span>Tax</span>
                    <span className="font-tabular">{formatCurrency(MOCK_EXTRACTION.tax ?? 0)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Suggested category</Label>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {expenseCategories.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register("description")} />
              </div>

              <Button type="submit" className="w-full">Save as expense</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
