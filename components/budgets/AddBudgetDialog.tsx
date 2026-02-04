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

interface AddBudgetDialogProps {
  categories: Category[];
  subCategories: SubCategory[];
}

export default function AddBudgetDialog({
  categories,
  subCategories,
}: AddBudgetDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Budget
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
          <DialogDescription>
            Set a monthly budget limit for a category or sub-category.
          </DialogDescription>
        </DialogHeader>
        <BudgetForm
          mode="add"
          categories={categories}
          subCategories={subCategories}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}