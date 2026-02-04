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
import BudgetForm from './BudgetForm';

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
  _id: string;
  categoryId: string;
  subCategoryId?: string;
  limit: number;
  month: string;
}

interface EditBudgetDialogProps {
  budget: Budget;
  categories: Category[];
  subCategories: SubCategory[];
}

export default function EditBudgetDialog({
  budget,
  categories,
  subCategories,
}: EditBudgetDialogProps) {
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Budget</DialogTitle>
          <DialogDescription>
            Update the budget limit or month.
          </DialogDescription>
        </DialogHeader>
        <BudgetForm
          mode="edit"
          budgetId={budget._id}
          defaultValues={{
            categoryId: budget.categoryId,
            subCategoryId: budget.subCategoryId,
            limit: budget.limit,
            month: budget.month,
          }}
          categories={categories}
          subCategories={subCategories}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}