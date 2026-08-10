"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Check, Copy, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { mockSplitBills } from "@/lib/mock-data";
import { formatCurrency, formatDate, percentage } from "@/lib/utils";
import type { SplitBillMember } from "@/types";

export default function SplitBillDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const bill = mockSplitBills.find((b) => b.id === params.id) ?? mockSplitBills[0];

  const [members, setMembers] = React.useState<SplitBillMember[]>(bill.members);
  const paidTotal = members.filter((m) => m.status === "paid").reduce((s, m) => s + m.share, 0);
  const shareLink = `https://moneymate.app/split/${bill.share_code}`;

  function togglePaid(id: string) {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: m.status === "paid" ? "pending" : "paid" } : m))
    );
  }

  function copyLink() {
    navigator.clipboard.writeText(shareLink).catch(() => {});
    toast.success("Share link copied to clipboard");
  }

  function shareSummary() {
    const summary = members.map((m) => `${m.name}: ${formatCurrency(m.share)} (${m.status})`).join("\n");
    navigator.clipboard.writeText(`${bill.title}\n${summary}`).catch(() => {});
    toast.success("Payment summary copied — paste it anywhere");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <button
        onClick={() => router.push("/split-bill")}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to split bills
      </button>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">{bill.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Created {formatDate(bill.created_at)} · {bill.split_type === "equal" ? "Equal split" : "Custom split"}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={shareSummary}><Share2 className="h-4 w-4" /> Share summary</Button>
          <Button variant="outline" onClick={copyLink}><Copy className="h-4 w-4" /> Copy link</Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Total & progress</CardTitle>
              <CardDescription>{formatCurrency(paidTotal)} collected of {formatCurrency(bill.total_amount)}</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={percentage(paidTotal, bill.total_amount)} indicatorClassName="bg-income" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>Tap a member to toggle their payment status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {members.map((m, i) => (
                <motion.button
                  key={m.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => togglePaid(m.id)}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-surface-muted"
                >
                  <Avatar name={m.name} size={38} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="font-tabular text-xs text-muted-foreground">{formatCurrency(m.share)}</p>
                  </div>
                  {m.status === "paid" ? (
                    <Badge variant="income"><Check className="h-3 w-3" /> Paid</Badge>
                  ) : (
                    <Badge variant="warning">Pending</Badge>
                  )}
                </motion.button>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Scan to pay</CardTitle>
            <CardDescription>Share this QR code or link with the group</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="rounded-xl bg-white p-4 shadow-inner">
              <QRCodeSVG value={shareLink} size={160} fgColor="#23324A" />
            </div>
            <p className="break-all rounded-lg bg-surface-muted px-3 py-2 text-center text-xs text-muted-foreground">
              {shareLink}
            </p>
            <Button variant="cream" className="w-full" onClick={copyLink}>
              <Copy className="h-4 w-4" /> Copy shareable link
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
