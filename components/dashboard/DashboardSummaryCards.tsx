import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import { formatAmount } from '@/lib/utils/index';

interface DashboardSummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  totalBudget: number;
  budgetRemaining: number;
}

export default function DashboardSummaryCards({
  totalIncome,
  totalExpenses,
  totalBudget,
  budgetRemaining,
}: DashboardSummaryCardsProps) {
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Income Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Income
              </p>
              <p className="text-2xl font-bold mt-2 text-success-dark">
                {formatAmount(totalIncome)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                This month
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-success-dark" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Expenses Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Expenses
              </p>
              <p className="text-2xl font-bold mt-2 text-danger-dark">
                {formatAmount(totalExpenses)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                This month
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-danger/20 flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-danger-dark" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Remaining Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Budget Remaining
              </p>
              <p className={`text-2xl font-bold mt-2 ${budgetRemaining >= 0 ? 'text-info-dark' : 'text-destructive'}`}>
                {formatAmount(Math.abs(budgetRemaining))}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {totalBudget > 0 ? `of ${formatAmount(totalBudget)} budget` : 'No budget set'}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-info/20 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-info-dark" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Net Savings Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Net Savings
              </p>
              <p className={`text-2xl font-bold mt-2 ${netSavings >= 0 ? 'text-primary-dark' : 'text-destructive'}`}>
                {netSavings >= 0 ? '' : '-'}{formatAmount(Math.abs(netSavings))}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {savingsRate >= 0 ? `${savingsRate}% saved` : `${Math.abs(savingsRate)}% overspent`}
              </p>
            </div>
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${netSavings >= 0 ? 'bg-primary/20' : 'bg-destructive/10'}`}>
              <PiggyBank className={`h-6 w-6 ${netSavings >= 0 ? 'text-primary-dark' : 'text-destructive'}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
