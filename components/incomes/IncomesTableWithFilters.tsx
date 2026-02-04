'use client';

import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import IncomeFilters from './IncomeFilters';
import IncomesTable from './IncomesTable';

interface IncomeSource {
  _id: string | { toString(): string };
  name: string;
  icon?: string;
  color?: string;
}

interface Income {
  _id: string | { toString(): string };
  amount: number;
  date: Date;
  incomeSourceId: {
    _id: string | { toString(): string };
    name: string;
    icon?: string;
    color?: string;
  };
  note?: string;
}

interface IncomesTableWithFiltersProps {
  incomes: Income[];
  incomeSources: IncomeSource[];
  monthLabel: string;
}

export default function IncomesTableWithFilters({
  incomes,
  incomeSources,
  monthLabel,
}: IncomesTableWithFiltersProps) {
  const [filters, setFilters] = useState({ search: '', incomeSourceId: '' });

  const handleFilterChange = useCallback(
    (newFilters: { search: string; incomeSourceId: string }) => {
      setFilters(newFilters);
    },
    []
  );

  const filteredIncomes = useMemo(() => {
    return incomes.filter((income) => {
      // Filter by search term (searches in note)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesNote = income.note?.toLowerCase().includes(searchLower);
        const matchesSource = income.incomeSourceId.name.toLowerCase().includes(searchLower);
        if (!matchesNote && !matchesSource) {
          return false;
        }
      }

      // Filter by income source
      if (filters.incomeSourceId) {
        const incomeSourceIdStr =
          typeof income.incomeSourceId._id === 'string'
            ? income.incomeSourceId._id
            : income.incomeSourceId._id.toString();
        if (incomeSourceIdStr !== filters.incomeSourceId) {
          return false;
        }
      }

      return true;
    });
  }, [incomes, filters]);

  const hasActiveFilters = filters.search !== '' || filters.incomeSourceId !== '';

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Incomes</CardTitle>
        <CardDescription>
          {hasActiveFilters
            ? `Showing ${filteredIncomes.length} of ${incomes.length} incomes`
            : `Showing ${incomes.length} income${incomes.length !== 1 ? 's' : ''} for ${monthLabel}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <IncomeFilters
          incomeSources={incomeSources}
          onFilterChange={handleFilterChange}
        />
        <IncomesTable
          incomes={filteredIncomes}
          incomeSources={incomeSources}
        />
      </CardContent>
    </Card>
  );
}
