"use client";

import * as React from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { Budget } from "@/types";

const expenseCategories = ["Food", "Transportation", "Shopping", "Entertainment", "Health", "Education", "Bills", "Travel", "Others"];

const schema = z.object({
  category: z.string().min(1, "Select a category"),
  amount: z.coerce.number().positive("Enter an amount greater than 0"),
});
type FormValues = z.infer<typeof schema>;

export function CreateBudgetDialog({ onCreate }: { onCreate: (budget: Budget) => void }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) as Resolver<FormValues> });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    onCreate({
      id: `b_${Date.now()}`,
      user_id: "u_1",
      category: values.category as Budget["category"],
      amount: values.amount,
      spent: 0,
      month: new Date().toISOString().slice(0, 7),
    });
    toast.success("Budget created", { description: values.category });
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4" /> New budget</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a monthly budget</DialogTitle>
          <DialogDescription>Set a spending limit for a category this month.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && <p className="text-xs text-expense">{errors.category.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="amount">Monthly limit</Label>
            <Input id="amount" type="number" placeholder="0" {...register("amount")} />
            {errors.amount && <p className="text-xs text-expense">{errors.amount.message}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Create budget
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
