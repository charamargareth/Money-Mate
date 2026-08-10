import { PageHeader } from "@/components/shared/page-header";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { SpendingTrendChart, IncomeExpenseChart, CategoryPieChart } from "@/components/dashboard/charts";
import { BudgetUsageCard } from "@/components/dashboard/budget-usage-card";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { UpcomingBills } from "@/components/dashboard/upcoming-bills";
import { OnboardingModal } from "@/components/onboarding/onboarding-modal";
import { mockProfile } from "@/lib/mock-data";

export const metadata = { title: "Dashboard — MoneyMate" };

export default function DashboardPage() {
  const firstName = mockProfile.full_name.split(" ")[0];
  return (
    <div className="mx-auto max-w-7xl">
      <OnboardingModal />
      <PageHeader title={`Good to see you, ${firstName}`} subtitle="Here's what's happening with your money this month." />

      <div className="space-y-6">
        <SummaryCards />

        <section>
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Quick actions</h2>
          <QuickActions />
        </section>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SpendingTrendChart />
          </div>
          <CategoryPieChart />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <IncomeExpenseChart />
          <BudgetUsageCard />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <RecentTransactions />
          <UpcomingBills />
        </div>
      </div>
    </div>
  );
}
