'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';

interface Category {
  _id: string | { toString(): string };
  name: string;
}

interface ExpenseFiltersProps {
  categories: Category[];
  onFilterChange: (filters: { search: string; categoryId: string }) => void;
}

export default function ExpenseFilters({
  categories,
  onFilterChange,
}: ExpenseFiltersProps) {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('all');

  useEffect(() => {
    onFilterChange({
      search,
      categoryId: categoryId === 'all' ? '' : categoryId,
    });
  }, [search, categoryId, onFilterChange]);

  const hasFilters = search !== '' || categoryId !== 'all';

  const clearFilters = () => {
    setSearch('');
    setCategoryId('all');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search expenses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Category Filter */}
      <Select value={categoryId} onValueChange={setCategoryId}>
        <SelectTrigger className="w-full sm:w-45">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => {
            const id = typeof category._id === 'string'
              ? category._id
              : category._id.toString();
            return (
              <SelectItem key={id} value={id}>
                {category.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {/* Clear Filters Button */}
      {hasFilters && (
        <Button variant="ghost" size="icon" onClick={clearFilters}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
