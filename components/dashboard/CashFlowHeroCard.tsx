import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react';
import { formatAmount, formatMonth } from '@/lib/utils/index';

interface CashFlowHeroCardProps {
  totalIncome: number;
  totalExpenses: number;
  month: string;
}

export default function CashFlowHeroCard({
  totalIncome,
  totalExpenses,
  month,
}: CashFlowHeroCardProps) {
  const netCashFlow = totalIncome - totalExpenses;
  const isPositive = netCashFlow >= 0;
  const savingsRate = totalIncome > 0 ? Math.round((netCashFlow / totalIncome) * 100) : 0;

  return (
    <Card className={`${isPositive ? 'bg-success/10 border-success/20' : 'bg-danger/10 border-danger/20'}`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Net Cash Flow for {formatMonth(month)}
            </p>
            <div className="flex items-center gap-3">
              <p className={`text-4xl font-bold ${isPositive ? 'text-success-dark' : 'text-destructive'}`}>
                {isPositive ? '+' : '-'}{formatAmount(Math.abs(netCashFlow))}
              </p>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${isPositive ? 'bg-success/20 text-success-dark' : 'bg-danger/20 text-danger-dark'}`}>
                {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {isPositive ? `${savingsRate}% saved` : `${Math.abs(savingsRate)}% deficit`}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {isPositive ? 'You\'re saving money this month!' : 'Expenses exceed income this month'}
            </p>
          </div>

          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                <ArrowUpRight className="h-5 w-5 text-success-dark" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Income</p>
                <p className="text-lg font-semibold text-success-dark">{formatAmount(totalIncome)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-danger/20 flex items-center justify-center">
                <ArrowDownRight className="h-5 w-5 text-danger-dark" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Expenses</p>
                <p className="text-lg font-semibold text-danger-dark">{formatAmount(totalExpenses)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
