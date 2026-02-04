'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteBudgetAction } from '@/actions/budget.actions';
import { toast } from 'sonner';
import { formatAmount, formatMonth } from '@/lib/utils/index';

interface DeleteBudgetDialogProps {
  budgetId: string;
  categoryName: string;
  subCategoryName?: string;
  budgetLimit: number;
  budgetMonth: string;
}

export default function DeleteBudgetDialog({
  budgetId,
  categoryName,
  subCategoryName,
  budgetLimit,
  budgetMonth,
}: DeleteBudgetDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const result = await deleteBudgetAction(budgetId);

      if (result.success) {
        toast.success(result.message);
        setOpen(false);
      } else {
        toast.error(result.error || 'Failed to delete budget');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const budgetName = subCategoryName
    ? `${categoryName} - ${subCategoryName}`
    : categoryName;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the budget for &quot;{budgetName}&quot; ({formatAmount(budgetLimit)}) 
            in {formatMonth(budgetMonth)}. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}