'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { BudgetProgress } from '@/types';
import { formatAmount } from '@/lib/utils/index';

interface BudgetAlertsProps {
  budgets: BudgetProgress[];
}

export default function BudgetAlerts({ budgets }: BudgetAlertsProps) {
  useEffect(() => {
    // Check for budget alerts
    budgets.forEach((budget) => {
      const budgetName = budget.subCategoryName
        ? `${budget.categoryName} - ${budget.subCategoryName}`
        : budget.categoryName;

      // Over budget (100%+)
      if (budget.isOverBudget) {
        toast.error(`Budget Alert: ${budgetName}`, {
          description: `You've exceeded your budget by ${formatAmount(
            Math.abs(budget.remaining)
          )}!`,
          duration: 10000,
        });
      }
      // Danger (90-99%)
      else if (budget.percentage >= 90) {
        toast.warning(`Budget Alert: ${budgetName}`, {
          description: `You've used ${budget.percentage}% of your budget. Only ${formatAmount(
            budget.remaining
          )} remaining.`,
          duration: 8000,
        });
      }
      // Warning (80-89%)
      else if (budget.percentage >= 80) {
        toast.warning(`Budget Alert: ${budgetName}`, {
          description: `You've used ${budget.percentage}% of your budget.`,
          duration: 5000,
        });
      }
    });
  }, [budgets]);

  return null; // This component only handles side effects
}