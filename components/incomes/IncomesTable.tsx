import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatAmount, formatDate } from '@/lib/utils/index';
import * as LucideIcons from 'lucide-react';
import { type LucideIcon, Wallet } from 'lucide-react';
import EditIncomeDialog from './EditIncomeDialog';
import DeleteIncomeDialog from './DeleteIncomeDialog';

const IconsMap: Record<string, LucideIcon> = LucideIcons as unknown as Record<string, LucideIcon>;

// Helper to convert ObjectId or string to string
const toStringId = (id: string | { toString(): string }): string =>
  typeof id === 'string' ? id : id.toString();

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

interface IncomesTableProps {
  incomes: Income[];
  incomeSources: IncomeSource[];
}

export default function IncomesTable({
  incomes,
  incomeSources,
}: IncomesTableProps) {
  if (incomes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <Wallet className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No incomes found</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          No incomes match your current filters, or you haven&apos;t added any incomes yet.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="max-h-140 overflow-y-auto" data-lenis-prevent>
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="w-48 max-w-48">Note</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {incomes.map((income) => {
            // Get icon component
            const IconComponent = income.incomeSourceId.icon
              ? IconsMap[income.incomeSourceId.icon]
              : null;

            return (
              <TableRow key={toStringId(income._id)}>
                {/* Date */}
                <TableCell className="font-medium">
                  {formatDate(income.date, 'short')}
                </TableCell>

                {/* Source */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    {IconComponent && (
                      <div
                        className="h-8 w-8 rounded flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${income.incomeSourceId.color}20`,
                        }}
                      >
                        <IconComponent
                          className="h-4 w-4"
                          style={{ color: income.incomeSourceId.color }}
                        />
                      </div>
                    )}
                    <p className="text-sm font-medium truncate">
                      {income.incomeSourceId.name}
                    </p>
                  </div>
                </TableCell>

                {/* Note */}
                <TableCell className="w-48 max-w-48">
                  <div className="min-w-0">
                    {income.note ? (
                      <p className="text-sm text-muted-foreground truncate">
                        {income.note}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground/50 italic">
                        No note
                      </p>
                    )}
                  </div>
                </TableCell>

                {/* Amount */}
                <TableCell className="text-right font-semibold text-success-dark">
                  +{formatAmount(income.amount)}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <EditIncomeDialog
                      income={{
                        _id: toStringId(income._id),
                        incomeSourceId: toStringId(income.incomeSourceId._id),
                        amount: income.amount,
                        date: income.date,
                        note: income.note,
                      }}
                      incomeSources={incomeSources}
                    />
                    <DeleteIncomeDialog
                      incomeId={toStringId(income._id)}
                      incomeSourceName={income.incomeSourceId.name}
                      incomeAmount={income.amount}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
