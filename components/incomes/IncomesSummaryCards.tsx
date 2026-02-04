import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Receipt, Calculator } from 'lucide-react';
import { formatAmount } from '@/lib/utils/index';

interface IncomesSummaryCardsProps {
  totalIncome: number;
  transactionCount: number;
  daysInMonth: number;
}

export default function IncomesSummaryCards({
  totalIncome,
  transactionCount,
  daysInMonth,
}: IncomesSummaryCardsProps) {
  const dailyAverage = daysInMonth > 0 ? totalIncome / daysInMonth : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Income Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Income
              </p>
              <p className="text-3xl font-bold mt-2">
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

      {/* Transaction Count Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Transactions
              </p>
              <p className="text-3xl font-bold mt-2">
                {transactionCount}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {transactionCount === 1 ? 'income' : 'incomes'} recorded
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Receipt className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Average Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Daily Average
              </p>
              <p className="text-3xl font-bold mt-2">
                {formatAmount(dailyAverage)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                per day this month
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-secondary/50 flex items-center justify-center">
              <Calculator className="h-6 w-6 text-secondary-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
