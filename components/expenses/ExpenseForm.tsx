'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseSchema, type ExpenseFormData } from '@/lib/validations/expense';
import { addExpenseAction, updateExpenseAction } from '@/actions/expense.action';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';
import * as LucideIcons from 'lucide-react';
import { Loader2, CalendarIcon, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toUTCDate } from '@/lib/utils/index';

const IconsMap: Record<string, LucideIcon> = LucideIcons as unknown as Record<string, LucideIcon>;
import { format } from 'date-fns';

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

// Helper to convert ObjectId or string to string
const toStringId = (id: string | { toString(): string }): string =>
  typeof id === 'string' ? id : id.toString();

interface ExpenseFormProps {
  mode: 'add' | 'edit';
  expenseId?: string;
  defaultValues?: {
    title: string;
    amount: number;
    date: Date;
    categoryId: string;
    subCategoryId?: string;
    note?: string;
  };
  categories: Category[];
  subCategories: SubCategory[];
  onSuccess?: () => void;
}

export default function ExpenseForm({
  mode,
  expenseId,
  defaultValues,
  categories,
  subCategories,
  onSuccess,
}: ExpenseFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    defaultValues?.categoryId || ''
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: defaultValues || {
      title: '',
      amount: 0,
      date: new Date(),
      categoryId: '',
      subCategoryId: null,
      note: null,
    },
  });

  const watchDate = watch('date');
  const watchCategoryId = watch('categoryId');

  // Filter sub-categories based on selected category
  const filteredSubCategories = subCategories.filter(
    (sub) => toStringId(sub.categoryId) === selectedCategoryId
  );

  // Reset sub-category when category changes
  useEffect(() => {
    if (watchCategoryId !== selectedCategoryId) {
      setSelectedCategoryId(watchCategoryId);
      setValue('subCategoryId', null);
    }
  }, [watchCategoryId, selectedCategoryId, setValue]);

  const onSubmit = async (data: ExpenseFormData) => {
    setIsLoading(true);

    try {
      const result =
        mode === 'add'
          ? await addExpenseAction(data)
          : await updateExpenseAction(expenseId!, data);

      if (result.success) {
        toast.success(result.message);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(result.error || 'Operation failed');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="e.g. Lunch at restaurant"
          {...register('title')}
          disabled={isLoading}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register('amount', { valueAsNumber: true })}
          disabled={isLoading}
        />
        {errors.amount && (
          <p className="text-sm text-destructive">{errors.amount.message}</p>
        )}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !watchDate && 'text-muted-foreground'
              )}
              disabled={isLoading}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {watchDate ? format(watchDate, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={watchDate}
              onSelect={(date) => setValue('date', toUTCDate(date || new Date()))}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.date && (
          <p className="text-sm text-destructive">{errors.date.message}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="categoryId">Category</Label>
        <Select
          value={watchCategoryId}
          onValueChange={(value) => setValue('categoryId', value)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category">
              {watchCategoryId && (() => {
                const selectedCategory = categories.find(c => toStringId(c._id) === watchCategoryId);
                if (selectedCategory) {
                  const IconComponent = selectedCategory.icon ? IconsMap[selectedCategory.icon] : null;
                  return (
                    <span className="flex items-center gap-2">
                      {IconComponent && (
                        <IconComponent
                          className="h-4 w-4"
                          style={{ color: selectedCategory.color }}
                        />
                      )}
                      {selectedCategory.name}
                    </span>
                  );
                }
                return null;
              })()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => {
              const IconComponent = category.icon ? IconsMap[category.icon] : null;
              return (
                <SelectItem key={toStringId(category._id)} value={toStringId(category._id)}>
                  <span className="flex items-center gap-2">
                    {IconComponent && (
                      <IconComponent
                        className="h-4 w-4"
                        style={{ color: category.color }}
                      />
                    )}
                    {category.name}
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {errors.categoryId && (
          <p className="text-sm text-destructive">{errors.categoryId.message}</p>
        )}
      </div>

      {/* Sub-Category */}
      {filteredSubCategories.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="subCategoryId">Sub-Category (Optional)</Label>
          <Select
            value={watch('subCategoryId') || 'none'}
            onValueChange={(value) =>
              setValue('subCategoryId', value === 'none' ? null : value)
            }
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sub-category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {filteredSubCategories.map((subCategory) => (
                <SelectItem key={toStringId(subCategory._id)} value={toStringId(subCategory._id)}>
                  {subCategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Note */}
      <div className="space-y-2">
        <Label htmlFor="note">Note (Optional)</Label>
        <Textarea
          id="note"
          placeholder="Add any additional notes..."
          rows={3}
          {...register('note')}
          disabled={isLoading}
        />
        {errors.note && (
          <p className="text-sm text-destructive">{errors.note.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {mode === 'add' ? 'Adding...' : 'Updating...'}
          </>
        ) : mode === 'add' ? (
          'Add Expense'
        ) : (
          'Update Expense'
        )}
      </Button>
    </form>
  );
}