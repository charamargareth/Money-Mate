"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Mail, MessageCircle, Loader2, Clock } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface SupportForm {
  subject: string;
  topic: string;
  message: string;
}

export default function SupportPage() {
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const { register, handleSubmit, reset } = useForm<SupportForm>();

  async function onSubmit() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
    toast.success("Message sent — we'll get back to you soon");
    reset();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Contact Support" subtitle="We usually reply within one business day." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-soft text-navy dark:text-sky">
              <Mail className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="text-sm font-medium">Email us</p>
              <p className="text-xs text-muted-foreground">support@moneymate.app</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream text-navy">
              <Clock className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="text-sm font-medium">Response time</p>
              <p className="text-xs text-muted-foreground">Within 24 hours, Mon–Fri</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" /> Send a message
          </CardTitle>
          <CardDescription>Tell us what's going on and we'll help sort it out.</CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="rounded-xl bg-income-soft p-6 text-center text-sm text-income">
              Thanks — your message has been sent. We&apos;ll follow up by email.
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Brief summary" {...register("subject", { required: true })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Topic</Label>
                  <Select defaultValue="general">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General question</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="bug">Report a bug</SelectItem>
                      <SelectItem value="feature">Feature request</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" rows={5} placeholder="How can we help?" {...register("message", { required: true })} />
              </div>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Send message
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
