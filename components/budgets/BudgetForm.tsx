'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { budgetSchema, type BudgetFormData } from '@/lib/validations/budget';
import { addBudgetAction, updateBudgetAction } from '@/actions/budget.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import * as LucideIcons from 'lucide-react';
import { Loader2, type LucideIcon } from 'lucide-react';
import { getCurrentMonth, getMonthOptions } from '@/lib/utils/index';

const IconsMap: Record<string, LucideIcon> = LucideIcons as unknown as Record<string, LucideIcon>;

// Helper to convert ObjectId or string to string
const toStringId = (id: string | { toString(): string }): string =>
  typeof id === 'string' ? id : id.toString();

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

interface BudgetFormProps {
  mode: 'add' | 'edit';
  budgetId?: string;
  defaultValues?: {
    categoryId: string;
    subCategoryId?: string;
    limit: number;
    month: string;
  };
  categories: Category[];
  subCategories: SubCategory[];
  onSuccess?: () => void;
}

export default function BudgetForm({
  mode,
  budgetId,
  defaultValues,
  categories,
  subCategories,
  onSuccess,
}: BudgetFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    defaultValues?.categoryId || ''
  );

  const monthOptions = getMonthOptions();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: defaultValues || {
      categoryId: '',
      subCategoryId: null,
      limit: 0,
      month: getCurrentMonth(),
    },
  });

  const watchCategoryId = watch('categoryId');
  const watchMonth = watch('month');

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

  const onSubmit = async (data: BudgetFormData) => {
    setIsLoading(true);

    try {
      const result =
        mode === 'add'
          ? await addBudgetAction(data)
          : await updateBudgetAction(budgetId!, {
              limit: data.limit,
              month: data.month,
            });

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
      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="categoryId">Category</Label>
        <Select
          value={watchCategoryId}
          onValueChange={(value) => setValue('categoryId', value)}
          disabled={isLoading || mode === 'edit'}
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
        {mode === 'edit' && (
          <p className="text-xs text-muted-foreground">
            Category cannot be changed when editing
          </p>
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
            disabled={isLoading || mode === 'edit'}
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
          {mode === 'edit' && (
            <p className="text-xs text-muted-foreground">
              Sub-category cannot be changed when editing
            </p>
          )}
        </div>
      )}

      {/* Budget Limit */}
      <div className="space-y-2">
        <Label htmlFor="limit">Budget Limit</Label>
        <Input
          id="limit"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register('limit', { valueAsNumber: true })}
          disabled={isLoading}
        />
        {errors.limit && (
          <p className="text-sm text-destructive">{errors.limit.message}</p>
        )}
      </div>

      {/* Month */}
      <div className="space-y-2">
        <Label htmlFor="month">Month</Label>
        <Select
          value={watchMonth}
          onValueChange={(value) => setValue('month', value)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.month && (
          <p className="text-sm text-destructive">{errors.month.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {mode === 'add' ? 'Creating...' : 'Updating...'}
          </>
        ) : mode === 'add' ? (
          'Create Budget'
        ) : (
          'Update Budget'
        )}
      </Button>
    </form>
  );
}