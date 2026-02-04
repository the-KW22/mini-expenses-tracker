import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
  getExpensesByMonth,
  getCategoriesByUser,
  getAllSubCategoriesByUser,
  getExpensesByCategory,
} from '@/lib/db/utilities/index';
import { getCurrentMonth, formatMonth, isValidMonthFormat, getMonthEnd } from '@/lib/utils/index';
import AddExpenseDialog from '@/components/expenses/AddExpenseDialog';
import ExpensesSummaryCards from '@/components/expenses/ExpensesSummaryCards';
import MonthSelector from '@/components/expenses/MonthSelector';
import ExpensesCategoryBreakdown from '@/components/expenses/ExpensesCategoryBreakdown';
import ExpensesTableWithFilters from '@/components/expenses/ExpensesTableWithFilters';

interface ExpensesPageProps {
  searchParams: Promise<{ month?: string }>;
}

export default async function ExpensesPage({ searchParams }: ExpensesPageProps) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const params = await searchParams;
  const currentMonth = params.month && isValidMonthFormat(params.month)
    ? params.month
    : getCurrentMonth();

  // Fetch data in parallel
  const [expensesRaw, categoriesRaw, subCategoriesRaw, categoryExpensesRaw] = await Promise.all([
    getExpensesByMonth(session.user.id, currentMonth),
    getCategoriesByUser(session.user.id),
    getAllSubCategoriesByUser(session.user.id),
    getExpensesByCategory(session.user.id, currentMonth),
  ]);

  // Serialize data to plain objects for Client Components
  const expenses = JSON.parse(JSON.stringify(expensesRaw));
  const categories = JSON.parse(JSON.stringify(categoriesRaw));
  const subCategories = JSON.parse(JSON.stringify(subCategoriesRaw));
  const categoryExpenses = JSON.parse(JSON.stringify(categoryExpensesRaw));

  // Calculate summary stats
  const totalExpenses = expenses.reduce(
    (sum: number, exp: { amount: number }) => sum + exp.amount,
    0
  );
  const transactionCount = expenses.length;

  // Calculate total days in the month (for average calculation)
  const monthEnd = getMonthEnd(currentMonth);
  const daysInMonth = monthEnd.getDate();

  const monthLabel = formatMonth(currentMonth);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground mt-1">
            Manage your expenses and track your spending
          </p>
        </div>
        <div className="flex items-center gap-3">
          <MonthSelector currentMonth={currentMonth} />
          <AddExpenseDialog
            categories={categories}
            subCategories={subCategories}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <ExpensesSummaryCards
        totalExpenses={totalExpenses}
        transactionCount={transactionCount}
        daysInMonth={daysInMonth}
      />

      {/* Two Column Layout for Category Breakdown and Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown - Sidebar */}
        <div className="lg:col-span-1">
          <ExpensesCategoryBreakdown
            categoryExpenses={categoryExpenses}
            totalExpenses={totalExpenses}
          />
        </div>

        {/* Expenses Table - Main Content */}
        <div className="lg:col-span-2">
          <ExpensesTableWithFilters
            expenses={expenses}
            categories={categories}
            subCategories={subCategories}
            monthLabel={monthLabel}
          />
        </div>
      </div>
    </div>
  );
}
