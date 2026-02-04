import { Card, CardContent } from '@/components/ui/card';
import { Wallet, TrendingDown, TrendingUp } from 'lucide-react';
import { formatAmount, calculatePercentage } from '@/lib/utils/index';

interface BudgetsSummaryCardsProps {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
}

export default function BudgetsSummaryCards({
  totalBudget,
  totalSpent,
  remaining,
}: BudgetsSummaryCardsProps) {
  const percentageUsed = calculatePercentage(totalSpent, totalBudget);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Budget Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Budget
              </p>
              <p className="text-3xl font-bold mt-2">
                {formatAmount(totalBudget)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                This month
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Spent Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Spent
              </p>
              <p className="text-3xl font-bold mt-2">
                {formatAmount(totalSpent)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {percentageUsed}% of budget used
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-danger/20 flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-danger-dark" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Remaining Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Remaining
              </p>
              <p className="text-3xl font-bold mt-2">
                {formatAmount(Math.abs(remaining))}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {remaining >= 0 ? `${100 - percentageUsed}% left` : 'over budget'}
              </p>
            </div>
            <div
              className={`h-12 w-12 rounded-full flex items-center justify-center ${
                remaining >= 0 ? 'bg-success/20' : 'bg-destructive/10'
              }`}
            >
              <TrendingUp
                className={`h-6 w-6 ${
                  remaining >= 0 ? 'text-success-dark' : 'text-destructive'
                }`}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
