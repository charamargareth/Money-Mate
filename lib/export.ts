"use client";

import type { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export function exportCSV(transactions: Transaction[], filename = "moneymate-report.csv") {
  const header = ["Date", "Type", "Category", "Description", "Payment Method", "Amount"];
  const rows = transactions.map((t) => [
    t.date,
    t.type,
    t.category,
    `"${t.description.replace(/"/g, '""')}"`,
    t.payment_method,
    t.amount.toString(),
  ]);
  const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
  downloadBlob(csv, filename, "text/csv");
}

export async function exportExcel(transactions: Transaction[], filename = "moneymate-report.xlsx") {
  const XLSX = await import("xlsx");
  const data = transactions.map((t) => ({
    Date: t.date,
    Type: t.type,
    Category: t.category,
    Description: t.description,
    "Payment Method": t.payment_method,
    Amount: t.amount,
  }));
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
  XLSX.writeFile(workbook, filename);
}

export async function exportPDF(transactions: Transaction[], filename = "moneymate-report.pdf") {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("MoneyMate — Transaction Report", 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Generated ${formatDate(new Date())}`, 14, 24);

  autoTable(doc, {
    startY: 30,
    head: [["Date", "Type", "Category", "Description", "Amount"]],
    body: transactions.map((t) => [
      formatDate(t.date),
      t.type === "income" ? "Income" : "Expense",
      t.category,
      t.description,
      `${t.type === "income" ? "+" : "-"}${formatCurrency(t.amount)}`,
    ]),
    headStyles: { fillColor: [35, 50, 74] },
    styles: { fontSize: 9 },
  });

  doc.save(filename);
}

function downloadBlob(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
