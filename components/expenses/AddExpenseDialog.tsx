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
import { Plus } from 'lucide-react';
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

interface AddExpenseDialogProps {
  categories: Category[];
  subCategories: SubCategory[];
}

export default function AddExpenseDialog({
  categories,
  subCategories,
}: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>
            Enter the details of your expense below.
          </DialogDescription>
        </DialogHeader>
        <ExpenseForm
          mode="add"
          categories={categories}
          subCategories={subCategories}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}