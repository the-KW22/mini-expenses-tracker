import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getCurrentMonth, formatMonth } from '@/lib/utils/index';
import { getDashboardSummary, getDailyTotals } from '@/lib/db/utilities/dashboard.utils';
import { getTotalIncomeForMonth, getRecentIncomes, getIncomesBySource } from '@/lib/db/utilities/income.utils';
import { getBudgetProgress } from '@/lib/db/utilities/budget.utils';
import { getExpensesByCategory, getRecentExpenses } from '@/lib/db/utilities/expense.utils';

import DashboardMonthSelector from '@/components/dashboard/DashboardMonthSelector';
import DashboardSummaryCards from '@/components/dashboard/DashboardSummaryCards';
import CashFlowHeroCard from '@/components/dashboard/CashFlowHeroCard';
import ExpensePieChart from '@/components/dashboard/charts/ExpensePieChart';
import DailyTrendChart from '@/components/dashboard/charts/DailyTrendChart';
import RecentTransactionsList from '@/components/dashboard/RecentTransactionsList';
import BudgetHealthOverview from '@/components/budgets/BudgetHealthOverview';
import ExpensesCategoryBreakdown from '@/components/expenses/ExpensesCategoryBreakdown';
import IncomesSourceBreakdown from '@/components/incomes/IncomesSourceBreakdown';

interface DashboardPageProps {
  searchParams: Promise<{ month?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const params = await searchParams;
  const currentMonth = params.month || getCurrentMonth();
  const userId = session.user.id;

  // Fetch all data in parallel for performance
  const [
    dashboardSummary,
    totalIncome,
    budgetProgress,
    expensesByCategory,
    incomesBySource,
    recentExpenses,
    recentIncomes,
    dailyTotals,
  ] = await Promise.all([
    getDashboardSummary(userId, currentMonth),
    getTotalIncomeForMonth(userId, currentMonth),
    getBudgetProgress(userId, currentMonth),
    getExpensesByCategory(userId, currentMonth),
    getIncomesBySource(userId, currentMonth),
    getRecentExpenses(userId, 5),
    getRecentIncomes(userId, 5),
    getDailyTotals(userId, currentMonth),
  ]);

  // Serialize data for client components
  const serializedExpensesByCategory = JSON.parse(JSON.stringify(
    expensesByCategory.map(cat => ({
      categoryId: cat.categoryId.toString(),
      categoryName: cat.categoryName,
      color: cat.color || '#8884d8',
      total: cat.total,
      icon: cat.icon,
    }))
  ));

  const serializedIncomesBySource = JSON.parse(JSON.stringify(incomesBySource));
  const serializedBudgetProgress = JSON.parse(JSON.stringify(budgetProgress));
  const serializedDailyTotals = JSON.parse(JSON.stringify(dailyTotals));

  // Combine and sort recent transactions
  const combinedTransactions = [
    ...recentExpenses.map(expense => ({
      id: expense._id.toString(),
      type: 'expense' as const,
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
      categoryName: expense.categoryId?.name,
      icon: expense.categoryId?.icon,
      color: expense.categoryId?.color,
    })),
    ...recentIncomes.map(income => ({
      id: income._id.toString(),
      type: 'income' as const,
      amount: income.amount,
      date: income.date,
      sourceName: income.incomeSourceId?.name,
      icon: income.incomeSourceId?.icon,
      color: income.incomeSourceId?.color,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const serializedTransactions = JSON.parse(JSON.stringify(combinedTransactions));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Your financial overview for {formatMonth(currentMonth)}
          </p>
        </div>
        <DashboardMonthSelector currentMonth={currentMonth} />
      </div>

      {/* Cash Flow Hero Card */}
      <CashFlowHeroCard
        totalIncome={totalIncome}
        totalExpenses={dashboardSummary.totalExpenses}
        month={currentMonth}
      />

      {/* Summary Cards */}
      <DashboardSummaryCards
        totalIncome={totalIncome}
        totalExpenses={dashboardSummary.totalExpenses}
        totalBudget={dashboardSummary.totalBudget}
        budgetRemaining={dashboardSummary.remaining}
      />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpensePieChart
          categoryExpenses={serializedExpensesByCategory}
          totalExpenses={dashboardSummary.totalExpenses}
        />
        <DailyTrendChart dailyData={serializedDailyTotals} />
      </div>

      {/* Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetHealthOverview budgetProgress={serializedBudgetProgress} />
        <RecentTransactionsList transactions={serializedTransactions} />
      </div>

      {/* Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpensesCategoryBreakdown
          categoryExpenses={serializedExpensesByCategory}
          totalExpenses={dashboardSummary.totalExpenses}
        />
        <IncomesSourceBreakdown
          sourceIncomes={serializedIncomesBySource}
          totalIncome={totalIncome}
        />
      </div>
    </div>
  );
}
