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
import type { RecurringBill, BillFrequency } from "@/types";

const schema = z.object({
  name: z.string().min(1, "Required"),
  amount: z.coerce.number().positive("Enter an amount greater than 0"),
  dueDate: z.string().min(1, "Required"),
  repeat: z.enum(["monthly", "weekly", "yearly", "one-time"]),
});
type FormValues = z.infer<typeof schema>;

export function CreateBillDialog({ onCreate }: { onCreate: (bill: RecurringBill) => void }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) as Resolver<FormValues>, defaultValues: { repeat: "monthly" } });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    onCreate({
      id: `rb_${Date.now()}`,
      user_id: "u_1",
      name: values.name,
      amount: values.amount,
      category: "Others",
      due_date: values.dueDate,
      repeat: values.repeat as BillFrequency,
      is_paid: false,
      icon: "receipt",
    });
    toast.success("Bill reminder added", { description: values.name });
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4" /> Add bill</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a recurring bill</DialogTitle>
          <DialogDescription>Get reminded before it's due.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="name">Bill name</Label>
            <Input id="name" placeholder="e.g. Netflix" {...register("name")} />
            {errors.name && <p className="text-xs text-expense">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" placeholder="0" {...register("amount")} />
              {errors.amount && <p className="text-xs text-expense">{errors.amount.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dueDate">Due date</Label>
              <Input id="dueDate" type="date" {...register("dueDate")} />
              {errors.dueDate && <p className="text-xs text-expense">{errors.dueDate.message}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Repeat</Label>
            <Controller
              control={control}
              name="repeat"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="one-time">One-time</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Add bill
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
