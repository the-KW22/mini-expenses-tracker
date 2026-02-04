import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
  getAllCategoriesWithSubCategories,
  getCategoryStatistics,
  getSubCategoryStatistics,
  getDashboardSummary,
} from '@/lib/db/utilities/index';
import { getCurrentMonth } from '@/lib/utils/index';
import CategoryCard from '@/components/categories/CategoryCard';
import CategoriesStats from '@/components/categories/CategoriesStats';

export default async function CategoriesPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const currentMonth = getCurrentMonth();

  // Fetch data
  const [categoriesWithSubs, categoryStats, subCategoryStats, summary] = await Promise.all([
    getAllCategoriesWithSubCategories(session.user.id),
    getCategoryStatistics(session.user.id, currentMonth),
    getSubCategoryStatistics(session.user.id, currentMonth),
    getDashboardSummary(session.user.id, currentMonth),
  ]);

  // Calculate totals
  const totalCategories = categoriesWithSubs.length;
  const totalSubCategories = categoriesWithSubs.reduce(
    (sum, cat) => sum + cat.subCategories.length,
    0
  );
  const categoriesWithExpenses = categoryStats.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground mt-1">
          View your expense categories and their usage statistics
        </p>
      </div>

      {/* Statistics Overview */}
      <CategoriesStats
        totalCategories={totalCategories}
        totalSubCategories={totalSubCategories}
        totalExpenses={summary.totalExpenses}
        categoriesWithExpenses={categoriesWithExpenses}
      />

      {/* Categories Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoriesWithSubs.map((category) => {
            // Find stats for this category
            const stats = categoryStats.find(
              (s) => s.categoryId.toString() === category._id.toString()
            );

            // Filter sub-category stats for this category
            const categorySubStats = subCategoryStats.filter(
              (s) => s.categoryId.toString() === category._id.toString()
            );

            return (
              <CategoryCard
                key={category._id.toString()}
                category={{
                  _id: category._id.toString(),
                  name: category.name,
                  icon: category.icon,
                  color: category.color,
                }}
                subCategories={category.subCategories.map((sub) => ({
                  _id: sub._id.toString(),
                  name: sub.name,
                }))}
                stats={stats}
                subCategoryStats={categorySubStats}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}