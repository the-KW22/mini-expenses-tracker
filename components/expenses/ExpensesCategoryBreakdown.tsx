import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatAmount, calculatePercentage } from '@/lib/utils/index';
import * as LucideIcons from 'lucide-react';
import { type LucideIcon, Circle } from 'lucide-react';

const IconsMap: Record<string, LucideIcon> = LucideIcons as unknown as Record<string, LucideIcon>;

interface CategoryExpense {
  categoryId: string;
  categoryName: string;
  color: string;
  total: number;
  icon?: string;
}

interface ExpensesCategoryBreakdownProps {
  categoryExpenses: CategoryExpense[];
  totalExpenses: number;
}

export default function ExpensesCategoryBreakdown({
  categoryExpenses,
  totalExpenses,
}: ExpensesCategoryBreakdownProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categoryExpenses.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No expenses recorded yet
          </p>
        ) : (
          categoryExpenses.map((category) => {
          const percentage = calculatePercentage(category.total, totalExpenses);
          const IconComponent = category.icon ? IconsMap[category.icon] : null;

          return (
            <div key={category.categoryId} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {IconComponent ? (
                    <IconComponent
                      className="h-5 w-5"
                      style={{ color: category.color }}
                    />
                  ) : (
                    <Circle
                      className="h-5 w-5"
                      style={{ color: category.color, fill: category.color }}
                    />
                  )}
                  <span className="text-sm font-medium">{category.categoryName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{formatAmount(category.total)}</span>
                  <span className="text-xs text-muted-foreground w-10 text-right">
                    {percentage}%
                  </span>
                </div>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: category.color,
                  }}
                />
              </div>
            </div>
          );
        })
        )}
      </CardContent>
    </Card>
  );
}
