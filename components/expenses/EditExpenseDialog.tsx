'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import ExpenseForm from './ExpenseForm';

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
  _id: string;
  title: string;
  amount: number;
  date: Date;
  categoryId: string;
  subCategoryId?: string;
  note?: string;
}

interface EditExpenseDialogProps {
  expense: Expense;
  categories: Category[];
  subCategories: SubCategory[];
}

export default function EditExpenseDialog({
  expense,
  categories,
  subCategories,
}: EditExpenseDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
          <DialogDescription>
            Update the details of your expense below.
          </DialogDescription>
        </DialogHeader>
        <ExpenseForm
          mode="edit"
          expenseId={expense._id}
          defaultValues={{
            title: expense.title,
            amount: expense.amount,
            date: new Date(expense.date),
            categoryId: expense.categoryId,
            subCategoryId: expense.subCategoryId || undefined,
            note: expense.note || undefined,
          }}
          categories={categories}
          subCategories={subCategories}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}