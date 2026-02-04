'use client';

import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ExpenseFilters from './ExpenseFilters';
import ExpensesTable from './ExpensesTable';

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

interface ExpensesTableWithFiltersProps {
  expenses: Expense[];
  categories: Category[];
  subCategories: SubCategory[];
  monthLabel: string;
}

export default function ExpensesTableWithFilters({
  expenses,
  categories,
  subCategories,
  monthLabel,
}: ExpensesTableWithFiltersProps) {
  const [filters, setFilters] = useState({ search: '', categoryId: '' });

  const handleFilterChange = useCallback(
    (newFilters: { search: string; categoryId: string }) => {
      setFilters(newFilters);
    },
    []
  );

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      // Filter by search term
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = expense.title.toLowerCase().includes(searchLower);
        const matchesNote = expense.note?.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesNote) {
          return false;
        }
      }

      // Filter by category
      if (filters.categoryId) {
        const expenseCategoryId =
          typeof expense.categoryId._id === 'string'
            ? expense.categoryId._id
            : expense.categoryId._id.toString();
        if (expenseCategoryId !== filters.categoryId) {
          return false;
        }
      }

      return true;
    });
  }, [expenses, filters]);

  const hasActiveFilters = filters.search !== '' || filters.categoryId !== '';

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Expenses</CardTitle>
        <CardDescription>
          {hasActiveFilters
            ? `Showing ${filteredExpenses.length} of ${expenses.length} expenses`
            : `Showing ${expenses.length} expense${expenses.length !== 1 ? 's' : ''} for ${monthLabel}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ExpenseFilters
          categories={categories}
          onFilterChange={handleFilterChange}
        />
        <ExpensesTable
          expenses={filteredExpenses}
          categories={categories}
          subCategories={subCategories}
        />
      </CardContent>
    </Card>
  );
}
