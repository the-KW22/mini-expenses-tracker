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
import IncomeForm from './IncomeForm';

interface IncomeSource {
  _id: string | { toString(): string };
  name: string;
  icon?: string;
  color?: string;
}

interface Income {
  _id: string;
  incomeSourceId: string;
  amount: number;
  date: Date;
  note?: string;
}

interface EditIncomeDialogProps {
  income: Income;
  incomeSources: IncomeSource[];
}

export default function EditIncomeDialog({
  income,
  incomeSources,
}: EditIncomeDialogProps) {
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
          <DialogTitle>Edit Income</DialogTitle>
          <DialogDescription>
            Update the details of your income below.
          </DialogDescription>
        </DialogHeader>
        <IncomeForm
          mode="edit"
          incomeId={income._id}
          defaultValues={{
            incomeSourceId: income.incomeSourceId,
            amount: income.amount,
            date: new Date(income.date),
            note: income.note || undefined,
          }}
          incomeSources={incomeSources}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
