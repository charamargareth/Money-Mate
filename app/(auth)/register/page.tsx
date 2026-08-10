"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";

const schema = z
  .object({
    fullName: z.string().min(2, "Enter your full name"),
    username: z
      .string()
      .min(3, "At least 3 characters")
      .max(20, "At most 20 characters")
      .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, underscore only"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "At least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
type FormValues = z.infer<typeof schema>;

// Demo usernames treated as "already taken" for the live-check UI.
const TAKEN_USERNAMES = ["admin", "rakapratama", "test"];

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [usernameStatus, setUsernameStatus] = React.useState<"idle" | "checking" | "available" | "taken">("idle");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const username = watch("username");

  React.useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameStatus("idle");
      return;
    }
    setUsernameStatus("checking");
    const t = setTimeout(() => {
      setUsernameStatus(TAKEN_USERNAMES.includes(username.toLowerCase()) ? "taken" : "available");
    }, 450);
    return () => clearTimeout(t);
  }, [username]);

  async function onSubmit(values: FormValues) {
    if (usernameStatus === "taken") {
      toast.error("That username is already taken");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.fullName, username: values.username },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    setLoading(false);

    if (error) {
      toast.error("Couldn't create account", { description: error.message });
      return;
    }
    toast.success("Account created — check your email to verify it.");
    router.push("/login");
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start tracking your money in under a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-navy underline-offset-4 hover:underline dark:text-sky">
            Log in
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        <GoogleButton label="Sign up with Google" />
        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" placeholder="Raka Pratama" {...register("fullName")} />
            {errors.fullName && <p className="text-xs text-expense">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Input id="username" placeholder="rakapratama" {...register("username")} />
              {usernameStatus === "available" && (
                <CheckCircle2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-income" />
              )}
              {usernameStatus === "taken" && (
                <XCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-expense" />
              )}
            </div>
            {errors.username ? (
              <p className="text-xs text-expense">{errors.username.message}</p>
            ) : usernameStatus === "taken" ? (
              <p className="text-xs text-expense">Username already taken</p>
            ) : usernameStatus === "available" ? (
              <p className="text-xs text-income">Username available</p>
            ) : (
              <p className="text-xs text-muted-foreground">This is your public identity on MoneyMate</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
            {errors.email && <p className="text-xs text-expense">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
              {errors.password && <p className="text-xs text-expense">{errors.password.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm</Label>
              <Input id="confirmPassword" type="password" placeholder="••••••••" {...register("confirmPassword")} />
              {errors.confirmPassword && <p className="text-xs text-expense">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Create account
          </Button>

          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            By signing up, you agree to MoneyMate&apos;s Terms of Service and Privacy Policy.
          </p>
        </form>
      </div>
    </AuthShell>
  );
}
