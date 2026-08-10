"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

import { AuthShell } from "@/components/auth/auth-shell";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { mockProfile } from "@/lib/mock-data";

const schema = z.object({
  username: z
    .string()
    .min(3, "At least 3 characters")
    .max(20, "At most 20 characters")
    .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, underscore only"),
});
type FormValues = z.infer<typeof schema>;

const TAKEN_USERNAMES = ["admin", "rakapratama", "test"];

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState<"idle" | "checking" | "available" | "taken">("idle");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const username = watch("username");

  React.useEffect(() => {
    if (!username || username.length < 3) {
      setStatus("idle");
      return;
    }
    setStatus("checking");
    const t = setTimeout(() => {
      setStatus(TAKEN_USERNAMES.includes(username.toLowerCase()) ? "taken" : "available");
    }, 450);
    return () => clearTimeout(t);
  }, [username]);

  async function onSubmit(values: FormValues) {
    if (status === "taken") {
      toast.error("That username is already taken");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({ username: values.username })
        .eq("id", user.id);
      if (error) {
        toast.error("Couldn't save username", { description: error.message });
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    toast.success("You're all set!");
    router.push("/dashboard");
  }

  return (
    <AuthShell title="One last step" subtitle="Choose a unique username — this is your public identity on MoneyMate.">
      <div className="mb-6 flex items-center gap-3 rounded-xl bg-surface-muted p-3">
        <Avatar name={mockProfile.full_name} size={44} />
        <div>
          <p className="text-sm font-medium">{mockProfile.full_name}</p>
          <p className="text-xs text-muted-foreground">{mockProfile.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <Input id="username" placeholder="rakapratama" {...register("username")} />
            {status === "available" && (
              <CheckCircle2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-income" />
            )}
            {status === "taken" && (
              <XCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-expense" />
            )}
          </div>
          {errors.username ? (
            <p className="text-xs text-expense">{errors.username.message}</p>
          ) : status === "taken" ? (
            <p className="text-xs text-expense">Username already taken</p>
          ) : status === "available" ? (
            <p className="text-xs text-income">Username available</p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Continue to dashboard
        </Button>
      </form>
    </AuthShell>
  );
}
