import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatAmount, calculatePercentage } from '@/lib/utils/index';
import * as LucideIcons from 'lucide-react';
import { type LucideIcon, Circle } from 'lucide-react';

const IconsMap: Record<string, LucideIcon> = LucideIcons as unknown as Record<string, LucideIcon>;

interface SourceIncome {
  incomeSourceId: string;
  name: string;
  color: string;
  total: number;
  icon?: string;
}

interface IncomesSourceBreakdownProps {
  sourceIncomes: SourceIncome[];
  totalIncome: number;
}

export default function IncomesSourceBreakdown({
  sourceIncomes,
  totalIncome,
}: IncomesSourceBreakdownProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Income by Source</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sourceIncomes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No incomes recorded yet
          </p>
        ) : (
          sourceIncomes.map((source) => {
          const percentage = calculatePercentage(source.total, totalIncome);
          const IconComponent = source.icon ? IconsMap[source.icon] : null;

          return (
            <div key={source.incomeSourceId} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {IconComponent ? (
                    <IconComponent
                      className="h-5 w-5"
                      style={{ color: source.color }}
                    />
                  ) : (
                    <Circle
                      className="h-5 w-5"
                      style={{ color: source.color, fill: source.color }}
                    />
                  )}
                  <span className="text-sm font-medium">{source.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{formatAmount(source.total)}</span>
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
                    backgroundColor: source.color,
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
