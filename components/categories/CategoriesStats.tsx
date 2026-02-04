import { Card, CardContent } from '@/components/ui/card';
import { FolderOpen, Layers, TrendingDown, Activity } from 'lucide-react';
import { formatAmount } from '@/lib/utils/index';

interface CategoriesStatsProps {
  totalCategories: number;
  totalSubCategories: number;
  totalExpenses: number;
  categoriesWithExpenses: number;
}

export default function CategoriesStats({
  totalCategories,
  totalSubCategories,
  totalExpenses,
  categoriesWithExpenses,
}: CategoriesStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Categories */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <FolderOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCategories}</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Sub-Categories */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-info/20 flex items-center justify-center shrink-0">
              <Layers className="h-6 w-6 text-info-dark" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalSubCategories}</p>
              <p className="text-sm text-muted-foreground">Sub-Categories</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Categories */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center shrink-0">
              <Activity className="h-6 w-6 text-success-dark" />
            </div>
            <div>
              <p className="text-2xl font-bold">{categoriesWithExpenses}</p>
              <p className="text-sm text-muted-foreground">Active This Month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Spent */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-danger/20 flex items-center justify-center shrink-0">
              <TrendingDown className="h-6 w-6 text-danger-dark" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatAmount(totalExpenses)}</p>
              <p className="text-sm text-muted-foreground">Total Spent</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
