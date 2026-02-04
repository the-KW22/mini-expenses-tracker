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

interface IncomeSource {
  _id: string | { toString(): string };
  name: string;
}

interface IncomeFiltersProps {
  incomeSources: IncomeSource[];
  onFilterChange: (filters: { search: string; incomeSourceId: string }) => void;
}

export default function IncomeFilters({
  incomeSources,
  onFilterChange,
}: IncomeFiltersProps) {
  const [search, setSearch] = useState('');
  const [incomeSourceId, setIncomeSourceId] = useState('all');

  useEffect(() => {
    onFilterChange({
      search,
      incomeSourceId: incomeSourceId === 'all' ? '' : incomeSourceId,
    });
  }, [search, incomeSourceId, onFilterChange]);

  const hasFilters = search !== '' || incomeSourceId !== 'all';

  const clearFilters = () => {
    setSearch('');
    setIncomeSourceId('all');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search incomes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Income Source Filter */}
      <Select value={incomeSourceId} onValueChange={setIncomeSourceId}>
        <SelectTrigger className="w-full sm:w-45">
          <SelectValue placeholder="All Sources" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sources</SelectItem>
          {incomeSources.map((source) => {
            const id = typeof source._id === 'string'
              ? source._id
              : source._id.toString();
            return (
              <SelectItem key={id} value={id}>
                {source.name}
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
