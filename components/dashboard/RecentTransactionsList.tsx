import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatAmount, formatDate } from '@/lib/utils/index';
import * as LucideIcons from 'lucide-react';
import { type LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';

const IconsMap: Record<string, LucideIcon> = LucideIcons as unknown as Record<string, LucideIcon>;

interface Transaction {
  id: string;
  type: 'expense' | 'income';
  title?: string;
  amount: number;
  date: Date | string;
  categoryName?: string;
  sourceName?: string;
  icon?: string;
  color?: string;
}

interface RecentTransactionsListProps {
  transactions: Transaction[];
}

export default function RecentTransactionsList({ transactions }: RecentTransactionsListProps) {
  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">No recent transactions</p>
            <p className="text-xs text-muted-foreground mt-1">
              Start by adding an income or expense
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">Recent Transactions</CardTitle>
        <div className="flex gap-2">
          <Link
            href="/expenses"
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {transactions.map((transaction) => {
          const IconComponent = transaction.icon ? IconsMap[transaction.icon] : null;
          const isIncome = transaction.type === 'income';
          const label = transaction.title || transaction.sourceName || transaction.categoryName || 'Unknown';

          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center ${
                    isIncome ? 'bg-success/20' : 'bg-danger/20'
                  }`}
                >
                  {IconComponent ? (
                    <IconComponent
                      className="h-4 w-4"
                      style={{ color: transaction.color }}
                    />
                  ) : isIncome ? (
                    <ArrowUpRight className="h-4 w-4 text-success-dark" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-danger-dark" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium truncate max-w-37.5">{label}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(transaction.date, 'short')}
                  </p>
                </div>
              </div>
              <p
                className={`text-sm font-semibold ${
                  isIncome ? 'text-success-dark' : 'text-danger-dark'
                }`}
              >
                {isIncome ? '+' : '-'}{formatAmount(transaction.amount)}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
