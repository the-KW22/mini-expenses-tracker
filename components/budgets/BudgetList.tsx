import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Wallet, FolderOpen, Layers } from 'lucide-react';
import { formatAmount, getBudgetAlertLevel } from '@/lib/utils/index';
import { BudgetProgress } from '@/types';
import EditBudgetDialog from './EditBudgetDialog';
import DeleteBudgetDialog from './DeleteBudgetDialog';

// Helper to convert ObjectId or string to string
const toStringId = (id: string | { toString(): string }): string =>
  typeof id === 'string' ? id : id.toString();

interface Category {
  _id: string | { toString(): string };
  name: string;
  icon?: string;
  color?: string;
}

interface SubCategory {
  _id: string | { toString(): string };
  name: string;
  categoryId: string | { toString(): string };
}

interface Budget {
  _id: string | { toString(): string };
  categoryId?: {
    _id: string | { toString(): string };
    name: string;
    icon?: string;
    color?: string;
  };
  subCategoryId?: {
    _id: string | { toString(): string };
    name: string;
  };
  limit: number;
  month: string;
}

interface BudgetsListProps {
  budgets: Budget[];
  budgetProgress: BudgetProgress[];
  categories: Category[];
  subCategories: SubCategory[];
}

// Budget card component to avoid repetition
function BudgetCard({
  budget,
  progress,
  categories,
  subCategories,
}: {
  budget: Budget;
  progress: BudgetProgress | undefined;
  categories: Category[];
  subCategories: SubCategory[];
}) {
  const alertLevel = progress
    ? getBudgetAlertLevel(progress.percentage)
    : 'safe';

  const progressColor = {
    safe: 'bg-primary',
    warning: 'bg-warning',
    danger: 'bg-danger',
    over: 'bg-destructive',
  }[alertLevel];

  // Border color based on alert level
  const borderColor = {
    safe: 'border-l-primary',
    warning: 'border-l-warning',
    danger: 'border-l-danger',
    over: 'border-l-destructive',
  }[alertLevel];

  // Background glow for over-budget
  const cardGlow = progress?.isOverBudget
    ? 'shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)]'
    : '';

  return (
    <Card className={`border-l-4 ${borderColor} ${cardGlow} transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate">
                {budget.categoryId?.name ?? 'Unknown Category'}
              </h3>
              {budget.subCategoryId && (
                <Badge variant="outline" className="text-xs">
                  {budget.subCategoryId.name}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Limit: {formatAmount(budget.limit)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <EditBudgetDialog
              budget={{
                _id: toStringId(budget._id),
                categoryId: budget.categoryId ? toStringId(budget.categoryId._id) : '',
                subCategoryId: budget.subCategoryId ? toStringId(budget.subCategoryId._id) : undefined,
                limit: budget.limit,
                month: budget.month,
              }}
              categories={categories}
              subCategories={subCategories}
            />
            <DeleteBudgetDialog
              budgetId={toStringId(budget._id)}
              categoryName={budget.categoryId?.name ?? 'Unknown Category'}
              subCategoryName={budget.subCategoryId?.name}
              budgetLimit={budget.limit}
              budgetMonth={budget.month}
            />
          </div>
        </div>

        {/* Progress */}
        {progress && (
          <div className="space-y-3 pt-3 border-t">
            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {formatAmount(progress.spent)} spent
                </span>
                <div className="flex items-center gap-1.5">
                  {progress.isOverBudget && (
                    <AlertCircle className="h-4 w-4 text-destructive animate-pulse" />
                  )}
                  <span
                    className={`font-bold text-base ${
                      progress.isOverBudget
                        ? 'text-destructive'
                        : alertLevel === 'danger'
                        ? 'text-danger-dark'
                        : alertLevel === 'warning'
                        ? 'text-warning-dark'
                        : 'text-primary'
                    }`}
                  >
                    {progress.percentage}%
                  </span>
                </div>
              </div>
              <Progress
                value={Math.min(progress.percentage, 100)}
                className="h-2.5"
                indicatorClassName={`${progressColor} transition-all duration-500`}
              />
            </div>

            {/* Remaining */}
            <div className={`text-xs px-2 py-1.5 rounded-md inline-block ${
              progress.remaining >= 0
                ? 'bg-primary/10 text-primary'
                : 'bg-destructive/10 text-destructive'
            }`}>
              {progress.remaining >= 0 ? (
                <>
                  <span className="font-semibold">
                    {formatAmount(progress.remaining)}
                  </span>{' '}
                  remaining
                </>
              ) : (
                <>
                  <span className="font-semibold">
                    {formatAmount(Math.abs(progress.remaining))}
                  </span>{' '}
                  over budget
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function BudgetsList({
  budgets,
  budgetProgress,
  categories,
  subCategories,
}: BudgetsListProps) {
  if (budgets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-20 w-20 rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-5 ring-4 ring-primary/10">
          <Wallet className="h-10 w-10 text-primary/60" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No budgets found</h3>
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
          You haven&apos;t set any budgets for this month yet. Create a budget to start tracking your spending limits.
        </p>
      </div>
    );
  }

  // Separate budgets into category and subcategory budgets
  const categoryBudgets = budgets.filter((b) => !b.subCategoryId);
  const subCategoryBudgets = budgets.filter((b) => b.subCategoryId);

  return (
    <div className="space-y-6">
      {/* Category Budgets Section */}
      <div>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <FolderOpen className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold">Category Budgets</h3>
          <Badge variant="secondary" className="text-xs ml-auto">
            {categoryBudgets.length}
          </Badge>
        </div>
        {categoryBudgets.length === 0 ? (
          <div className="text-sm text-muted-foreground py-8 text-center border border-dashed rounded-lg bg-muted/20">
            No category budgets set
          </div>
        ) : (
          <div className="max-h-135 overflow-y-auto pr-2" data-lenis-prevent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryBudgets.map((budget) => (
                <BudgetCard
                  key={toStringId(budget._id)}
                  budget={budget}
                  progress={budgetProgress.find(
                    (p) => p.budgetId === budget._id.toString()
                  )}
                  categories={categories}
                  subCategories={subCategories}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Subcategory Budgets Section */}
      <div>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Layers className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold">Subcategory Budgets</h3>
          <Badge variant="secondary" className="text-xs ml-auto">
            {subCategoryBudgets.length}
          </Badge>
        </div>
        {subCategoryBudgets.length === 0 ? (
          <div className="text-sm text-muted-foreground py-8 text-center border border-dashed rounded-lg bg-muted/20">
            No subcategory budgets set
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto pr-2" data-lenis-prevent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subCategoryBudgets.map((budget) => (
                <BudgetCard
                  key={toStringId(budget._id)}
                  budget={budget}
                  progress={budgetProgress.find(
                    (p) => p.budgetId === budget._id.toString()
                  )}
                  categories={categories}
                  subCategories={subCategories}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}