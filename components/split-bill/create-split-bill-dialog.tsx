"use client";

import * as React from "react";
import { useForm, useFieldArray, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import type { SplitBill, SplitBillMember } from "@/types";

const memberColors = ["#22C55E", "#F59E0B", "#EF4444", "#23324A", "#CFEBFF", "#8B5CF6"];

const schema = z.object({
  title: z.string().min(1, "Give this bill a name"),
  totalAmount: z.coerce.number().positive("Enter an amount greater than 0"),
  splitType: z.enum(["equal", "custom"]),
  members: z
    .array(z.object({ name: z.string().min(1, "Required"), amount: z.coerce.number().min(0).optional() }))
    .min(2, "Add at least 2 members"),
});
type FormValues = z.infer<typeof schema>;

export function CreateSplitBillDialog({ onCreate }: { onCreate: (bill: SplitBill) => void }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      splitType: "equal",
      members: [{ name: "", amount: 0 }, { name: "", amount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "members" });
  const splitType = watch("splitType");
  const totalAmount = watch("totalAmount") || 0;
  const members = watch("members");

  async function onSubmit(values: FormValues) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);

    const share = values.totalAmount / values.members.length;
    const newMembers: SplitBillMember[] = values.members.map((m, i) => ({
      id: `m_${Date.now()}_${i}`,
      name: m.name,
      share: values.splitType === "equal" ? share : m.amount ?? 0,
      status: "pending",
      avatar_color: memberColors[i % memberColors.length],
    }));

    onCreate({
      id: `sb_${Date.now()}`,
      user_id: "u_1",
      title: values.title,
      total_amount: values.totalAmount,
      split_type: values.splitType,
      share_code: `MM-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      created_at: new Date().toISOString(),
      members: newMembers,
    });

    toast.success("Split bill created", { description: values.title });
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4" /> New split bill</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Split a bill</DialogTitle>
          <DialogDescription>Add everyone involved, then choose how to split it.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="title">Bill name</Label>
            <Input id="title" placeholder="e.g. Dinner with Friends" {...register("title")} />
            {errors.title && <p className="text-xs text-expense">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="totalAmount">Total amount</Label>
            <Input id="totalAmount" type="number" placeholder="0" {...register("totalAmount")} />
            {errors.totalAmount && <p className="text-xs text-expense">{errors.totalAmount.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Split type</Label>
            <Controller
              control={control}
              name="splitType"
              render={({ field }) => (
                <Tabs value={field.value} onValueChange={field.onChange}>
                  <TabsList className="w-full">
                    <TabsTrigger value="equal" className="flex-1">Equal split</TabsTrigger>
                    <TabsTrigger value="custom" className="flex-1">Custom split</TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Members</Label>
            {fields.map((field, i) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input placeholder={`Member ${i + 1} name`} {...register(`members.${i}.name` as const)} />
                {splitType === "custom" ? (
                  <Input
                    type="number"
                    placeholder="Amount"
                    className="w-32"
                    {...register(`members.${i}.amount` as const)}
                  />
                ) : (
                  <span className="w-32 shrink-0 rounded-xl bg-surface-muted px-3 py-2.5 text-center text-xs font-tabular text-muted-foreground">
                    {members.length > 0 && totalAmount > 0
                      ? formatCurrency(totalAmount / members.length)
                      : "—"}
                  </span>
                )}
                {fields.length > 2 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)}>
                    <Trash2 className="h-4 w-4 text-expense" />
                  </Button>
                )}
              </div>
            ))}
            {errors.members && <p className="text-xs text-expense">{errors.members.message as string}</p>}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ name: "", amount: 0 })}>
              <Plus className="h-3.5 w-3.5" /> Add member
            </Button>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Create split bill
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
