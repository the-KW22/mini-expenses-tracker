import mongoose from 'mongoose';
import { connectDB } from '../connection';
import Expense from '@/models/Expense';
import { getCurrentMonth } from '@/lib/utils/index';

/**
 * Get expense count and total amount for each category
 */
export async function getCategoryStatistics(
  userId: string | mongoose.Types.ObjectId,
  month?: string
) {
  try {
    await connectDB();

    const userObjectId = typeof userId === 'string' 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;

    const currentMonth = month || getCurrentMonth();
    const [year, monthNum] = currentMonth.split('-');
    const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59, 999);

    // Get statistics by category
    const result = await Expense.aggregate([
      // Stage 1: Filter by user and date
      {
        $match: {
          userId: userObjectId,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      // Stage 2: Group by category
      {
        $group: {
          _id: '$categoryId',
          count: { $sum: 1 },
          total: { $sum: '$amount' }
        }
      },
      // Stage 3: Join with categories collection
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      // Stage 4: Unwind category array
      {
        $unwind: '$category'
      },
      // Stage 5: Project final structure
      {
        $project: {
          categoryId: '$_id',
          categoryName: '$category.name',
          categoryIcon: '$category.icon',
          categoryColor: '$category.color',
          count: 1,
          total: 1,
          _id: 0
        }
      },
      // Stage 6: Sort by total (highest first)
      { $sort: { total: -1 } }
    ]);

    return result;
  } catch (error) {
    console.error('Error getting category statistics:', error);
    throw new Error('Failed to fetch category statistics');
  }
}

/**
 * Get expense count and total amount for each sub-category
 */
export async function getSubCategoryStatistics(
  userId: string | mongoose.Types.ObjectId,
  month?: string
) {
  try {
    await connectDB();

    const userObjectId = typeof userId === 'string' 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;

    const currentMonth = month || getCurrentMonth();
    const [year, monthNum] = currentMonth.split('-');
    const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59, 999);

    // Get statistics by sub-category
    const result = await Expense.aggregate([
      // Stage 1: Filter by user, date, and only expenses with sub-categories
      {
        $match: {
          userId: userObjectId,
          date: { $gte: startDate, $lte: endDate },
          subCategoryId: { $ne: null }
        }
      },
      // Stage 2: Group by sub-category
      {
        $group: {
          _id: '$subCategoryId',
          categoryId: { $first: '$categoryId' },
          count: { $sum: 1 },
          total: { $sum: '$amount' }
        }
      },
      // Stage 3: Join with subcategories collection
      {
        $lookup: {
          from: 'subcategories',
          localField: '_id',
          foreignField: '_id',
          as: 'subCategory'
        }
      },
      // Stage 4: Unwind sub-category array
      {
        $unwind: '$subCategory'
      },
      // Stage 5: Project final structure
      {
        $project: {
          subCategoryId: '$_id',
          categoryId: 1,
          subCategoryName: '$subCategory.name',
          count: 1,
          total: 1,
          _id: 0
        }
      },
      // Stage 6: Sort by total (highest first)
      { $sort: { total: -1 } }
    ]);

    return result;
  } catch (error) {
    console.error('Error getting sub-category statistics:', error);
    throw new Error('Failed to fetch sub-category statistics');
  }
}