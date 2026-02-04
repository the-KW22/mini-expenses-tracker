import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatAmount, formatDate } from '@/lib/utils/index';
import * as LucideIcons from 'lucide-react';
import { type LucideIcon, Receipt } from 'lucide-react';
import EditExpenseDialog from './EditExpenseDialog';

const IconsMap: Record<string, LucideIcon> = LucideIcons as unknown as Record<string, LucideIcon>;
import DeleteExpenseDialog from './DeleteExpenseDialog';

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

interface Expense {
  _id: string | { toString(): string };
  title: string;
  amount: number;
  date: Date;
  categoryId: {
    _id: string | { toString(): string };
    name: string;
    icon?: string;
    color?: string;
  };
  subCategoryId?: {
    _id: string | { toString(): string };
    name: string;
  };
  note?: string;
}

interface ExpensesTableProps {
  expenses: Expense[];
  categories: Category[];
  subCategories: SubCategory[];
}

export default function ExpensesTable({
  expenses,
  categories,
  subCategories,
}: ExpensesTableProps) {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <Receipt className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No expenses found</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          No expenses match your current filters, or you haven&apos;t added any expenses yet.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="max-h-140 overflow-y-auto" data-lenis-prevent>
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className="w-48 max-w-48">Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {expenses.map((expense) => {
            // Get icon component
            const IconComponent = expense.categoryId.icon
              ? IconsMap[expense.categoryId.icon]
              : null;

            return (
              <TableRow key={toStringId(expense._id)}>
                {/* Date */}
                <TableCell className="font-medium">
                  {formatDate(expense.date, 'short')}
                </TableCell>

                {/* Description */}
                <TableCell className="w-48 max-w-48">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{expense.title}</p>
                    {expense.note && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {expense.note}
                      </p>
                    )}
                  </div>
                </TableCell>

                {/* Category */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    {IconComponent && (
                      <div
                        className="h-8 w-8 rounded flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${expense.categoryId.color}20`,
                        }}
                      >
                        <IconComponent
                          className="h-4 w-4"
                          style={{ color: expense.categoryId.color }}
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {expense.categoryId.name}
                      </p>
                      {expense.subCategoryId && (
                        <p className="text-xs text-muted-foreground truncate">
                          {expense.subCategoryId.name}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* Amount */}
                <TableCell className="text-right font-semibold text-destructive">
                  -{formatAmount(expense.amount)}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <EditExpenseDialog
                      expense={{
                        _id: toStringId(expense._id),
                        title: expense.title,
                        amount: expense.amount,
                        date: expense.date,
                        categoryId: toStringId(expense.categoryId._id),
                        subCategoryId: expense.subCategoryId ? toStringId(expense.subCategoryId._id) : undefined,
                        note: expense.note,
                      }}
                      categories={categories}
                      subCategories={subCategories}
                    />
                    <DeleteExpenseDialog
                      expenseId={toStringId(expense._id)}
                      expenseTitle={expense.title}
                      expenseAmount={expense.amount}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}