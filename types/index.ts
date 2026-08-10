export type TransactionType = "income" | "expense";

export type IncomeCategory =
  | "Salary"
  | "Freelance"
  | "Bonus"
  | "Investment"
  | "Gift"
  | "Others";

export type ExpenseCategory =
  | "Food"
  | "Transportation"
  | "Shopping"
  | "Entertainment"
  | "Health"
  | "Education"
  | "Bills"
  | "Travel"
  | "Others";

export type PaymentMethod =
  | "Cash"
  | "Debit Card"
  | "Credit Card"
  | "Bank Transfer"
  | "E-Wallet";

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  category: IncomeCategory | ExpenseCategory;
  description: string;
  date: string; // ISO date
  payment_method: PaymentMethod;
  notes?: string;
  receipt_url?: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  username: string;
  email: string;
  avatar_url?: string | null;
  preferred_currency: string;
  monthly_budget_goal: number;
  theme: "light" | "dark" | "system";
  created_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category: ExpenseCategory;
  amount: number;
  spent: number;
  month: string; // "2026-07"
}

export interface SplitBillMember {
  id: string;
  name: string;
  share: number;
  status: "paid" | "pending";
  avatar_color: string;
}

export interface SplitBill {
  id: string;
  user_id: string;
  title: string;
  total_amount: number;
  split_type: "equal" | "custom";
  members: SplitBillMember[];
  created_at: string;
  share_code: string;
}

export type BillFrequency = "monthly" | "weekly" | "yearly" | "one-time";

export interface RecurringBill {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  category: string;
  due_date: string; // ISO date
  repeat: BillFrequency;
  is_paid: boolean;
  icon: string;
}

export type NotificationType =
  | "budget_exceeded"
  | "bill_due"
  | "receipt_scanned"
  | "split_payment"
  | "monthly_report";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

export interface ExtractedReceipt {
  merchant: string;
  date: string;
  time: string;
  total: number;
  tax?: number;
  payment_method?: PaymentMethod;
  items: { name: string; price: number; qty: number }[];
  suggested_category: ExpenseCategory;
  suggested_description: string;
  confidence: number;
}
