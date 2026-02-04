import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatAmount } from '@/lib/utils/index';
import * as LucideIcons from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

const IconsMap: Record<string, LucideIcon> = LucideIcons as unknown as Record<string, LucideIcon>;

interface SubCategory {
  _id: string;
  name: string;
}

interface CategoryStats {
  categoryId: string;
  categoryName: string;
  categoryIcon?: string;
  categoryColor?: string;
  count: number;
  total: number;
}

interface SubCategoryStats {
  subCategoryId: string;
  categoryId: string;
  subCategoryName: string;
  count: number;
  total: number;
}

interface CategoryCardProps {
  category: {
    _id: string;
    name: string;
    icon?: string;
    color?: string;
  };
  subCategories: SubCategory[];
  stats?: CategoryStats;
  subCategoryStats: SubCategoryStats[];
}

export default function CategoryCard({
  category,
  subCategories,
  stats,
  subCategoryStats,
}: CategoryCardProps) {
  // Get icon component
  const IconComponent = category.icon
    ? IconsMap[category.icon]
    : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          {/* Category Icon */}
          {IconComponent && (
            <div
              className="h-12 w-12 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <IconComponent
                className="h-6 w-6"
                style={{ color: category.color }}
              />
            </div>
          )}

          {/* Category Info */}
          <div className="flex-1 min-w-0">
            <CardTitle className="truncate">{category.name}</CardTitle>
            {stats && (
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span>{stats.count} transaction{stats.count !== 1 ? 's' : ''}</span>
                <span>·</span>
                <span className="font-semibold text-foreground">
                  {formatAmount(stats.total)}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Sub-Categories */}
        {subCategories.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Sub-Categories ({subCategories.length})
            </p>
            <div className="grid grid-cols-2 gap-2">
              {subCategories.map((subCategory) => {
                // Find stats for this sub-category
                const subStats = subCategoryStats.find(
                  (s) => s.subCategoryId === subCategory._id
                );

                return (
                  <div
                    key={subCategory._id}
                    className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <span className="text-sm truncate flex-1">
                      {subCategory.name}
                    </span>
                    {subStats && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {subStats.count}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No sub-categories
          </p>
        )}
      </CardContent>
    </Card>
  );
}