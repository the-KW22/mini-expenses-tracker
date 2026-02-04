'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getMonthOptions, formatMonth } from '@/lib/utils/index';
import { Calendar } from 'lucide-react';

interface BudgetMonthSelectorProps {
  currentMonth: string;
}

export default function BudgetMonthSelector({ currentMonth }: BudgetMonthSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const monthOptions = getMonthOptions();

  const handleMonthChange = (month: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('month', month);
    router.push(`/budgets?${params.toString()}`);
  };

  return (
    <Select value={currentMonth} onValueChange={handleMonthChange}>
      <SelectTrigger className="w-45">
        <Calendar className="h-4 w-4 mr-2" />
        <SelectValue placeholder={formatMonth(currentMonth)} />
      </SelectTrigger>
      <SelectContent>
        {monthOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
