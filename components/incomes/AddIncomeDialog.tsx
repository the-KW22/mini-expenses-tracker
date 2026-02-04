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
import IncomeForm from './IncomeForm';

interface IncomeSource {
  _id: string | { toString(): string };
  name: string;
  icon?: string;
  color?: string;
}

interface AddIncomeDialogProps {
  incomeSources: IncomeSource[];
}

export default function AddIncomeDialog({
  incomeSources,
}: AddIncomeDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Income
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Income</DialogTitle>
          <DialogDescription>
            Enter the details of your income below.
          </DialogDescription>
        </DialogHeader>
        <IncomeForm
          mode="add"
          incomeSources={incomeSources}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
