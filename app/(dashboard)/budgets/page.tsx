import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
  getBudgetsByMonth,
  getBudgetProgress,
  getCategoriesByUser,
  getAllSubCategoriesByUser,
} from '@/lib/db/utilities/index';
import { getCurrentMonth, formatMonth, isValidMonthFormat } from '@/lib/utils/index';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AddBudgetDialog from '@/components/budgets/AddBudgetDialog';
import BudgetsList from '@/components/budgets/BudgetList';
import BudgetAlerts from '@/components/budgets/BudgetAlerts';
import BudgetsSummaryCards from '@/components/budgets/BudgetsSummaryCards';
import BudgetMonthSelector from '@/components/budgets/BudgetMonthSelector';
import BudgetHealthOverview from '@/components/budgets/BudgetHealthOverview';

interface BudgetsPageProps {
  searchParams: Promise<{ month?: string }>;
}

export default async function BudgetsPage({ searchParams }: BudgetsPageProps) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const params = await searchParams;
  const currentMonth = params.month && isValidMonthFormat(params.month)
    ? params.month
    : getCurrentMonth();

  // Fetch data
  const [budgetsRaw, budgetProgressRaw, categoriesRaw, subCategoriesRaw] = await Promise.all([
    getBudgetsByMonth(session.user.id, currentMonth),
    getBudgetProgress(session.user.id, currentMonth),
    getCategoriesByUser(session.user.id),
    getAllSubCategoriesByUser(session.user.id),
  ]);

  // Serialize data to plain objects for Client Components
  const budgets = JSON.parse(JSON.stringify(budgetsRaw));
  const budgetProgress = JSON.parse(JSON.stringify(budgetProgressRaw));
  const categories = JSON.parse(JSON.stringify(categoriesRaw));
  const subCategories = JSON.parse(JSON.stringify(subCategoriesRaw));

  // Calculate summary stats from budget progress
  const totalBudget = budgetProgress.reduce(
    (sum: number, b: { limit: number }) => sum + b.limit,
    0
  );
  const totalSpent = budgetProgress.reduce(
    (sum: number, b: { spent: number }) => sum + b.spent,
    0
  );
  const remaining = totalBudget - totalSpent;

  const monthLabel = formatMonth(currentMonth);

  return (
    <div className="space-y-6">
      {/* Budget Alerts */}
      <BudgetAlerts budgets={budgetProgress} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground mt-1">
            Manage your monthly budgets and track your spending limits
          </p>
        </div>
        <div className="flex items-center gap-3">
          <BudgetMonthSelector currentMonth={currentMonth} />
          <AddBudgetDialog
            categories={categories}
            subCategories={subCategories}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <BudgetsSummaryCards
        totalBudget={totalBudget}
        totalSpent={totalSpent}
        remaining={remaining}
      />

      {/* Budget Health Overview */}
      <BudgetHealthOverview budgetProgress={budgetProgress} />

      {/* Budget List */}
      <Card>
        <CardHeader>
          <CardTitle>Budgets for {monthLabel}</CardTitle>
          <CardDescription>
            {budgets.length} budget{budgets.length !== 1 ? 's' : ''} set for this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BudgetsList
            budgets={budgets}
            budgetProgress={budgetProgress}
            categories={categories}
            subCategories={subCategories}
          />
        </CardContent>
      </Card>
    </div>
  );
}
