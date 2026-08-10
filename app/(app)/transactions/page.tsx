"use client";

import * as React from "react";
import { Plus, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { TransactionFormDialog } from "@/components/transactions/transaction-form-dialog";
import { Button } from "@/components/ui/button";

export default function TransactionsPage() {
  const [openExpense, setOpenExpense] = React.useState(false);
  const [openIncome, setOpenIncome] = React.useState(false);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Transactions"
        subtitle="Every income and expense, all in one place."
        actions={
          <>
            <Button variant="outline" onClick={() => setOpenIncome(true)}>
              <TrendingUp className="h-4 w-4" /> Add Income
            </Button>
            <Button onClick={() => setOpenExpense(true)}>
              <Plus className="h-4 w-4" /> Add Expense
            </Button>
          </>
        }
      />
      <TransactionsTable />

      <TransactionFormDialog type="expense" open={openExpense} onOpenChange={setOpenExpense} />
      <TransactionFormDialog type="income" open={openIncome} onOpenChange={setOpenIncome} />
    </div>
  );
}
