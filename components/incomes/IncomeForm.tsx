'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { incomeSchema, type IncomeFormData } from '@/lib/validations/income';
import { addIncomeAction, updateIncomeAction } from '@/actions/income.action';
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
import { format } from 'date-fns';

const IconsMap: Record<string, LucideIcon> = LucideIcons as unknown as Record<string, LucideIcon>;

interface IncomeSource {
  _id: string | { toString(): string };
  name: string;
  icon?: string;
  color?: string;
}

// Helper to convert ObjectId or string to string
const toStringId = (id: string | { toString(): string }): string =>
  typeof id === 'string' ? id : id.toString();

interface IncomeFormProps {
  mode: 'add' | 'edit';
  incomeId?: string;
  defaultValues?: {
    incomeSourceId: string;
    amount: number;
    date: Date;
    note?: string;
  };
  incomeSources: IncomeSource[];
  onSuccess?: () => void;
}

export default function IncomeForm({
  mode,
  incomeId,
  defaultValues,
  incomeSources,
  onSuccess,
}: IncomeFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: defaultValues || {
      incomeSourceId: '',
      amount: 0,
      date: new Date(),
      note: null,
    },
  });

  const watchDate = watch('date');
  const watchIncomeSourceId = watch('incomeSourceId');

  const onSubmit = async (data: IncomeFormData) => {
    setIsLoading(true);

    try {
      const result =
        mode === 'add'
          ? await addIncomeAction(data)
          : await updateIncomeAction(incomeId!, data);

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

      {/* Income Source */}
      <div className="space-y-2">
        <Label htmlFor="incomeSourceId">Income Source</Label>
        <Select
          value={watchIncomeSourceId}
          onValueChange={(value) => setValue('incomeSourceId', value)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select income source">
              {watchIncomeSourceId && (() => {
                const selectedSource = incomeSources.find(s => toStringId(s._id) === watchIncomeSourceId);
                if (selectedSource) {
                  const IconComponent = selectedSource.icon ? IconsMap[selectedSource.icon] : null;
                  return (
                    <span className="flex items-center gap-2">
                      {IconComponent && (
                        <IconComponent
                          className="h-4 w-4"
                          style={{ color: selectedSource.color }}
                        />
                      )}
                      {selectedSource.name}
                    </span>
                  );
                }
                return null;
              })()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {incomeSources.map((source) => {
              const IconComponent = source.icon ? IconsMap[source.icon] : null;
              return (
                <SelectItem key={toStringId(source._id)} value={toStringId(source._id)}>
                  <span className="flex items-center gap-2">
                    {IconComponent && (
                      <IconComponent
                        className="h-4 w-4"
                        style={{ color: source.color }}
                      />
                    )}
                    {source.name}
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {errors.incomeSourceId && (
          <p className="text-sm text-destructive">{errors.incomeSourceId.message}</p>
        )}
      </div>

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
          'Add Income'
        ) : (
          'Update Income'
        )}
      </Button>
    </form>
  );
}
