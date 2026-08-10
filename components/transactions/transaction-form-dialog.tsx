"use client";

import * as React from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { TransactionType } from "@/types";

const incomeCategories = ["Salary", "Freelance", "Bonus", "Investment", "Gift", "Others"];
const expenseCategories = ["Food", "Transportation", "Shopping", "Entertainment", "Health", "Education", "Bills", "Travel", "Others"];
const paymentMethods = ["Cash", "Debit Card", "Credit Card", "Bank Transfer", "E-Wallet"];

const schema = z.object({
  amount: z.coerce.number().positive("Enter an amount greater than 0"),
  category: z.string().min(1, "Select a category"),
  description: z.string().min(1, "Add a short description"),
  date: z.string().min(1, "Select a date"),
  paymentMethod: z.string().min(1, "Select a payment method"),
  notes: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export function TransactionFormDialog({
  type,
  open,
  onOpenChange,
  children,
}: {
  type: TransactionType;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}) {
  const [loading, setLoading] = React.useState(false);
  const categories = type === "income" ? incomeCategories : expenseCategories;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: { date: new Date().toISOString().slice(0, 10) },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700)); // simulate write to Supabase
    setLoading(false);
    toast.success(type === "income" ? "Income added" : "Expense added", {
      description: `${values.description} — ${values.category}`,
    });
    reset();
    onOpenChange?.(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{type === "income" ? "Add income" : "Add expense"}</DialogTitle>
          <DialogDescription>
            {type === "income" ? "Log money coming in." : "Log a purchase or payment."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" step="0.01" placeholder="0" {...register("amount")} />
            {errors.amount && <p className="text-xs text-expense">{errors.amount.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <p className="text-xs text-expense">{errors.category.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...register("date")} />
              {errors.date && <p className="text-xs text-expense">{errors.date.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder={type === "income" ? "e.g. Monthly salary" : "e.g. Lunch with team"} {...register("description")} />
            {errors.description && <p className="text-xs text-expense">{errors.description.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Payment method</Label>
            <Controller
              control={control}
              name="paymentMethod"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.paymentMethod && <p className="text-xs text-expense">{errors.paymentMethod.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" placeholder="Anything else to remember?" {...register("notes")} />
          </div>

          <DialogFooter>
            <Button type="submit" variant={type === "income" ? "accent" : "default"} disabled={loading} className="w-full sm:w-auto">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Save {type === "income" ? "income" : "expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
