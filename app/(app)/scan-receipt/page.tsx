import { PageHeader } from "@/components/shared/page-header";
import { ReceiptScanner } from "@/components/receipt/receipt-scanner";

export const metadata = { title: "Scan Receipt — MoneyMate" };

export default function ScanReceiptPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="AI Receipt Scanner"
        subtitle="Upload a photo of your receipt — MoneyMate reads it and drafts the expense for you."
      />
      <ReceiptScanner />
      <p className="mt-6 text-xs text-muted-foreground">
        In production this calls Google Cloud Vision (or Tesseract) for OCR, then a categorization
        step suggests the expense category and description. This demo simulates that pipeline —
        see the README for wiring up real OCR and the OpenAI categorization API.
      </p>
    </div>
  );
}
