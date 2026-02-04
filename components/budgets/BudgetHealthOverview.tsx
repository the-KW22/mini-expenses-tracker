import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertTriangle, AlertCircle, XCircle } from 'lucide-react';
import { getBudgetAlertLevel } from '@/lib/utils/index';
import { BudgetProgress } from '@/types';

interface BudgetHealthOverviewProps {
  budgetProgress: BudgetProgress[];
}

export default function BudgetHealthOverview({ budgetProgress }: BudgetHealthOverviewProps) {
  if (budgetProgress.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Budget Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-30 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No budgets recorded yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Count budgets by status
  const statusCounts = budgetProgress.reduce(
    (acc, budget) => {
      const level = getBudgetAlertLevel(budget.percentage);
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    },
    { safe: 0, warning: 0, danger: 0, over: 0 } as Record<string, number>
  );

  const statuses = [
    {
      key: 'safe',
      label: 'On Track',
      count: statusCounts.safe,
      icon: CheckCircle2,
      bgColor: 'bg-success/20',
      textColor: 'text-success-dark',
      description: 'Under 80%',
    },
    {
      key: 'warning',
      label: 'Warning',
      count: statusCounts.warning,
      icon: AlertTriangle,
      bgColor: 'bg-warning/20',
      textColor: 'text-warning-dark',
      description: '80-89%',
    },
    {
      key: 'danger',
      label: 'Critical',
      count: statusCounts.danger,
      icon: AlertCircle,
      bgColor: 'bg-danger/30',
      textColor: 'text-danger-dark',
      description: '90-99%',
    },
    {
      key: 'over',
      label: 'Over Budget',
      count: statusCounts.over,
      icon: XCircle,
      bgColor: 'bg-destructive/10',
      textColor: 'text-destructive',
      description: '100%+',
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Budget Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {statuses.map((status) => {
            const Icon = status.icon;
            return (
              <div
                key={status.key}
                className={`flex items-center gap-3 p-3 rounded-lg ${status.bgColor}`}
              >
                <div className={`shrink-0 ${status.textColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className={`text-2xl font-bold ${status.textColor}`}>
                    {status.count}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {status.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
