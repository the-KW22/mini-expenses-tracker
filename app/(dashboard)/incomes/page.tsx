import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
  getIncomesByMonth,
  getIncomeSourcesByUser,
  getIncomesBySource,
} from '@/lib/db/utilities/index';
import { getCurrentMonth, formatMonth, isValidMonthFormat, getMonthEnd } from '@/lib/utils/index';
import AddIncomeDialog from '@/components/incomes/AddIncomeDialog';
import IncomesSummaryCards from '@/components/incomes/IncomesSummaryCards';
import IncomeMonthSelector from '@/components/incomes/IncomeMonthSelector';
import IncomesSourceBreakdown from '@/components/incomes/IncomesSourceBreakdown';
import IncomesTableWithFilters from '@/components/incomes/IncomesTableWithFilters';

interface IncomesPageProps {
  searchParams: Promise<{ month?: string }>;
}

export default async function IncomesPage({ searchParams }: IncomesPageProps) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const params = await searchParams;
  const currentMonth = params.month && isValidMonthFormat(params.month)
    ? params.month
    : getCurrentMonth();

  // Fetch data in parallel
  const [incomesRaw, incomeSourcesRaw, sourceIncomesRaw] = await Promise.all([
    getIncomesByMonth(session.user.id, currentMonth),
    getIncomeSourcesByUser(session.user.id),
    getIncomesBySource(session.user.id, currentMonth),
  ]);

  // Serialize data to plain objects for Client Components
  const incomes = JSON.parse(JSON.stringify(incomesRaw));
  const incomeSources = JSON.parse(JSON.stringify(incomeSourcesRaw));
  const sourceIncomes = JSON.parse(JSON.stringify(sourceIncomesRaw));

  // Calculate summary stats
  const totalIncome = incomes.reduce(
    (sum: number, inc: { amount: number }) => sum + inc.amount,
    0
  );
  const transactionCount = incomes.length;

  // Calculate total days in the month (for average calculation)
  const monthEnd = getMonthEnd(currentMonth);
  const daysInMonth = monthEnd.getDate();

  const monthLabel = formatMonth(currentMonth);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Incomes</h1>
          <p className="text-muted-foreground mt-1">
            Manage your incomes and track your earnings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <IncomeMonthSelector currentMonth={currentMonth} />
          <AddIncomeDialog incomeSources={incomeSources} />
        </div>
      </div>

      {/* Summary Cards */}
      <IncomesSummaryCards
        totalIncome={totalIncome}
        transactionCount={transactionCount}
        daysInMonth={daysInMonth}
      />

      {/* Two Column Layout for Source Breakdown and Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Source Breakdown - Sidebar */}
        <div className="lg:col-span-1">
          <IncomesSourceBreakdown
            sourceIncomes={sourceIncomes}
            totalIncome={totalIncome}
          />
        </div>

        {/* Incomes Table - Main Content */}
        <div className="lg:col-span-2">
          <IncomesTableWithFilters
            incomes={incomes}
            incomeSources={incomeSources}
            monthLabel={monthLabel}
          />
        </div>
      </div>
    </div>
  );
}
