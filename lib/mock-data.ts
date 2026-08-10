import type {
  Transaction,
  Profile,
  Budget,
  SplitBill,
  RecurringBill,
  AppNotification,
} from "@/types";

export const mockProfile: Profile = {
  id: "u_1",
  full_name: "Raka Pratama",
  username: "rakapratama",
  email: "raka@moneymate.app",
  avatar_url: null,
  preferred_currency: "IDR",
  monthly_budget_goal: 8_000_000,
  theme: "system",
  created_at: "2026-01-04T08:00:00Z",
};

const cat = <T,>(v: T) => v;

export const mockTransactions: Transaction[] = [
  { id: "t1", user_id: "u_1", type: "expense", amount: 125000, category: cat("Food"), description: "Lunch at Warung Padang", date: "2026-07-28", payment_method: "E-Wallet", created_at: "2026-07-28T12:30:00Z" },
  { id: "t2", user_id: "u_1", type: "income", amount: 12_500_000, category: cat("Salary"), description: "Monthly salary - July", date: "2026-07-25", payment_method: "Bank Transfer", created_at: "2026-07-25T09:00:00Z" },
  { id: "t3", user_id: "u_1", type: "expense", amount: 450000, category: cat("Shopping"), description: "New running shoes", date: "2026-07-24", payment_method: "Credit Card", created_at: "2026-07-24T17:12:00Z" },
  { id: "t4", user_id: "u_1", type: "expense", amount: 89000, category: cat("Transportation"), description: "Grab to office", date: "2026-07-24", payment_method: "E-Wallet", created_at: "2026-07-24T08:05:00Z" },
  { id: "t5", user_id: "u_1", type: "expense", amount: 320000, category: cat("Entertainment"), description: "Cinema + snacks", date: "2026-07-23", payment_method: "Debit Card", created_at: "2026-07-23T19:40:00Z" },
  { id: "t6", user_id: "u_1", type: "income", amount: 2_100_000, category: cat("Freelance"), description: "Logo design project", date: "2026-07-22", payment_method: "Bank Transfer", created_at: "2026-07-22T14:00:00Z" },
  { id: "t7", user_id: "u_1", type: "expense", amount: 1_250_000, category: cat("Bills"), description: "Electricity bill", date: "2026-07-20", payment_method: "Bank Transfer", created_at: "2026-07-20T10:00:00Z" },
  { id: "t8", user_id: "u_1", type: "expense", amount: 275000, category: cat("Health"), description: "Pharmacy - vitamins", date: "2026-07-19", payment_method: "Cash", created_at: "2026-07-19T16:20:00Z" },
  { id: "t9", user_id: "u_1", type: "expense", amount: 610000, category: cat("Food"), description: "Groceries - weekly", date: "2026-07-18", payment_method: "Debit Card", created_at: "2026-07-18T11:00:00Z" },
  { id: "t10", user_id: "u_1", type: "expense", amount: 199000, category: cat("Education"), description: "Online course - Udemy", date: "2026-07-16", payment_method: "Credit Card", created_at: "2026-07-16T20:00:00Z" },
  { id: "t11", user_id: "u_1", type: "expense", amount: 1_800_000, category: cat("Travel"), description: "Train tickets - Bandung", date: "2026-07-14", payment_method: "E-Wallet", created_at: "2026-07-14T09:00:00Z" },
  { id: "t12", user_id: "u_1", type: "income", amount: 500000, category: cat("Gift"), description: "Birthday gift from Mom", date: "2026-07-10", payment_method: "Cash", created_at: "2026-07-10T09:00:00Z" },
  { id: "t13", user_id: "u_1", type: "expense", amount: 95000, category: cat("Food"), description: "Coffee with Bella", date: "2026-07-09", payment_method: "E-Wallet", created_at: "2026-07-09T15:30:00Z" },
  { id: "t14", user_id: "u_1", type: "expense", amount: 350000, category: cat("Shopping"), description: "Skincare restock", date: "2026-07-07", payment_method: "Credit Card", created_at: "2026-07-07T13:00:00Z" },
  { id: "t15", user_id: "u_1", type: "expense", amount: 129000, category: cat("Transportation"), description: "Fuel top-up", date: "2026-07-05", payment_method: "Debit Card", created_at: "2026-07-05T08:00:00Z" },
];

export const monthlyTrend = [
  { month: "Feb", income: 12_000_000, expense: 8_400_000 },
  { month: "Mar", income: 12_000_000, expense: 9_100_000 },
  { month: "Apr", income: 13_200_000, expense: 8_750_000 },
  { month: "May", income: 12_000_000, expense: 10_200_000 },
  { month: "Jun", income: 14_600_000, expense: 9_300_000 },
  { month: "Jul", income: 15_100_000, expense: 7_838_000 },
];

export const mockBudgets: Budget[] = [
  { id: "b1", user_id: "u_1", category: "Food", amount: 1_500_000, spent: 830_000, month: "2026-07" },
  { id: "b2", user_id: "u_1", category: "Shopping", amount: 700_000, spent: 800_000, month: "2026-07" },
  { id: "b3", user_id: "u_1", category: "Transportation", amount: 500_000, spent: 218_000, month: "2026-07" },
  { id: "b4", user_id: "u_1", category: "Entertainment", amount: 400_000, spent: 320_000, month: "2026-07" },
  { id: "b5", user_id: "u_1", category: "Bills", amount: 1_500_000, spent: 1_250_000, month: "2026-07" },
];

export const mockSplitBills: SplitBill[] = [
  {
    id: "sb1",
    user_id: "u_1",
    title: "Dinner with Friends",
    total_amount: 640000,
    split_type: "equal",
    share_code: "MM-7F2K9",
    created_at: "2026-07-26T19:00:00Z",
    members: [
      { id: "m1", name: "Andi", share: 160000, status: "paid", avatar_color: "#22C55E" },
      { id: "m2", name: "Bella", share: 160000, status: "paid", avatar_color: "#F59E0B" },
      { id: "m3", name: "Kevin", share: 160000, status: "pending", avatar_color: "#EF4444" },
      { id: "m4", name: "Sarah", share: 160000, status: "pending", avatar_color: "#23324A" },
    ],
  },
  {
    id: "sb2",
    user_id: "u_1",
    title: "Weekend Trip to Bandung",
    total_amount: 2_400_000,
    split_type: "custom",
    share_code: "MM-9X1PZ",
    created_at: "2026-07-14T09:00:00Z",
    members: [
      { id: "m5", name: "Raka", share: 900000, status: "paid", avatar_color: "#CFEBFF" },
      { id: "m6", name: "Dimas", share: 750000, status: "paid", avatar_color: "#22C55E" },
      { id: "m7", name: "Fira", share: 750000, status: "paid", avatar_color: "#F59E0B" },
    ],
  },
];

export const mockBills: RecurringBill[] = [
  { id: "rb1", user_id: "u_1", name: "Netflix", amount: 186000, category: "Entertainment", due_date: "2026-08-02", repeat: "monthly", is_paid: false, icon: "clapperboard" },
  { id: "rb2", user_id: "u_1", name: "Electricity", amount: 450000, category: "Utilities", due_date: "2026-08-05", repeat: "monthly", is_paid: false, icon: "zap" },
  { id: "rb3", user_id: "u_1", name: "Internet", amount: 375000, category: "Utilities", due_date: "2026-08-08", repeat: "monthly", is_paid: false, icon: "wifi" },
  { id: "rb4", user_id: "u_1", name: "Rent", amount: 3_500_000, category: "Housing", due_date: "2026-08-01", repeat: "monthly", is_paid: false, icon: "home" },
  { id: "rb5", user_id: "u_1", name: "Health Insurance", amount: 320000, category: "Insurance", due_date: "2026-07-31", repeat: "monthly", is_paid: false, icon: "shield" },
  { id: "rb6", user_id: "u_1", name: "Spotify", amount: 54990, category: "Entertainment", due_date: "2026-08-12", repeat: "monthly", is_paid: true, icon: "music" },
];

export const mockNotifications: AppNotification[] = [
  { id: "n1", type: "budget_exceeded", title: "Budget exceeded", message: "You've gone over your Shopping budget by Rp100.000 this month.", created_at: "2026-07-28T09:00:00Z", read: false },
  { id: "n2", type: "bill_due", title: "Bill due tomorrow", message: "Health Insurance (Rp320.000) is due tomorrow.", created_at: "2026-07-28T08:00:00Z", read: false },
  { id: "n3", type: "receipt_scanned", title: "Receipt scanned", message: "Your receipt from Kopi Kenangan was scanned successfully.", created_at: "2026-07-27T15:12:00Z", read: true },
  { id: "n4", type: "split_payment", title: "Split bill payment received", message: "Andi marked their share of \u201cDinner with Friends\u201d as paid.", created_at: "2026-07-27T11:00:00Z", read: true },
  { id: "n5", type: "monthly_report", title: "Monthly report available", message: "Your June financial report is ready to view.", created_at: "2026-07-01T07:00:00Z", read: true },
];

export const categoryColors: Record<string, string> = {
  Food: "#F59E0B",
  Transportation: "#3B82F6",
  Shopping: "#EC4899",
  Entertainment: "#8B5CF6",
  Health: "#22C55E",
  Education: "#06B6D4",
  Bills: "#EF4444",
  Travel: "#14B8A6",
  Others: "#64748B",
};

export function summarize(transactions: Transaction[]) {
  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  return {
    income,
    expense,
    balance: income - expense,
    savings: income > 0 ? Math.round(((income - expense) / income) * 100) : 0,
  };
}

export function categoryBreakdown(transactions: Transaction[]) {
  const map = new Map<string, number>();
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => map.set(t.category, (map.get(t.category) ?? 0) + t.amount));
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value, color: categoryColors[name] ?? "#64748B" }))
    .sort((a, b) => b.value - a.value);
}
