import mongoose from 'mongoose';
import { connectDB } from '../connection';
import Budget from '@/models/Budget';
import { IBudget, BudgetProgress } from '@/types';
import { getTotalExpensesForCategory } from './expense.utils';

// Type for populated budget (after .populate() calls)
interface PopulatedBudget extends Omit<IBudget, 'categoryId' | 'subCategoryId'> {
    categoryId?: {
        _id: mongoose.Types.ObjectId;
        name: string;
        icon?: string;
        color?: string;
    };
    subCategoryId?: {
        _id: mongoose.Types.ObjectId;
        name: string;
    };
}

// Get all budgets for a user in a specific month, used for budget list page
export async function getBudgetsByMonth(
  userId: string | mongoose.Types.ObjectId,
  month: string
): Promise<PopulatedBudget[]> {
  try {
    await connectDB();

    const userObjectId = typeof userId === 'string' 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;

    return await Budget.find({ 
      userId: userObjectId, 
      month 
    })
      .populate('categoryId', 'name icon color')
      .populate('subCategoryId', 'name')
      .sort({ createdAt: -1 })
      .lean();
  } catch (error) {
    console.error('Error getting budgets:', error);
    throw new Error('Failed to fetch budgets');
  }
}

// Get a single budget by ID, used for budget details, edit form
export async function getBudgetById(
  budgetId: string | mongoose.Types.ObjectId,
  userId: string | mongoose.Types.ObjectId
): Promise<PopulatedBudget | null> {
  try {
    await connectDB();

    const budgetObjectId = typeof budgetId === 'string' 
      ? new mongoose.Types.ObjectId(budgetId) 
      : budgetId;

    const userObjectId = typeof userId === 'string' 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;

    return await Budget.findOne({ 
      _id: budgetObjectId, 
      userId: userObjectId 
    })
      .populate('categoryId', 'name icon color')
      .populate('subCategoryId', 'name')
      .lean();
  } catch (error) {
    console.error('Error getting budget:', error);
    throw new Error('Failed to fetch budget');
  }
}


// Create a new budget, used for add budget form
export async function createBudget(budgetData: {
  userId: string | mongoose.Types.ObjectId;
  categoryId?: string | mongoose.Types.ObjectId;
  subCategoryId?: string | mongoose.Types.ObjectId;
  limit: number;
  month: string;
}): Promise<IBudget> {
  try {
    await connectDB();

    const newBudget = await Budget.create(budgetData);
    return newBudget;
  } catch (error: unknown) {
    console.error('Error creating budget:', error);

    // Handle duplicate budget error (MongoDB error code 11000)
    if (error instanceof Error && 'code' in error && (error as { code: number }).code === 11000) {
      throw new Error('Budget already exists for this category/sub-category in this month');
    }

    throw new Error('Failed to create budget');
  }
}

// Update a budget, used for edit budget form
export async function updateBudget(
  budgetId: string | mongoose.Types.ObjectId,
  userId: string | mongoose.Types.ObjectId,
  updateData: Partial<{
    limit: number;
    month: string;
  }>
): Promise<IBudget | null> {
  try {
    await connectDB();

    const budgetObjectId = typeof budgetId === 'string' 
      ? new mongoose.Types.ObjectId(budgetId) 
      : budgetId;

    const userObjectId = typeof userId === 'string' 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;

    const updatedBudget = await Budget.findOneAndUpdate(
      { _id: budgetObjectId, userId: userObjectId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    return updatedBudget;
  } catch (error) {
    console.error('Error updating budget:', error);
    throw new Error('Failed to update budget');
  }
}

// Delete a budget, used for delete budget action
export async function deleteBudget(
  budgetId: string | mongoose.Types.ObjectId,
  userId: string | mongoose.Types.ObjectId
): Promise<boolean> {
  try {
    await connectDB();

    const budgetObjectId = typeof budgetId === 'string' 
      ? new mongoose.Types.ObjectId(budgetId) 
      : budgetId;

    const userObjectId = typeof userId === 'string' 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;

    const result = await Budget.deleteOne({ 
      _id: budgetObjectId, 
      userId: userObjectId 
    });

    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting budget:', error);
    throw new Error('Failed to delete budget');
  }
}

// Get budget progress with spending information, used for dashboard budget progress bars with alerts
export async function getBudgetProgress(
  userId: string | mongoose.Types.ObjectId,
  month: string
): Promise<BudgetProgress[]> {
  try {
    await connectDB();

    const userObjectId = typeof userId === 'string' 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;

    // Get all budgets for the month
    const budgets = await Budget.find({ 
      userId: userObjectId, 
      month 
    })
      .populate('categoryId', 'name icon color')
      .populate('subCategoryId', 'name')
      .lean();

    // Calculate spending for each budget
    const budgetProgress = await Promise.all(
      budgets.map(async (budget: PopulatedBudget) => {
        let spent = 0;

        // Calculate spent amount based on budget type
        if (budget.subCategoryId && budget.categoryId) {
          // Sub-category budget
          spent = await getTotalExpensesForCategory(
            userObjectId,
            budget.categoryId._id,
            month,
            budget.subCategoryId._id
          );
        } else if (budget.categoryId) {
          // Category budget (includes all sub-categories)
          spent = await getTotalExpensesForCategory(
            userObjectId,
            budget.categoryId._id,
            month
          );
        }

        const remaining = budget.limit - spent;
        const percentage = budget.limit > 0 ? Math.round((spent / budget.limit) * 100) : 0;

        return {
          budgetId: budget._id.toString(),
          categoryName: budget.categoryId?.name || 'Unknown',
          subCategoryName: budget.subCategoryId?.name,
          limit: budget.limit,
          spent,
          remaining,
          percentage,
          isOverBudget: spent > budget.limit,
        };
      })
    );

    return budgetProgress;
  } catch (error) {
    console.error('Error getting budget progress:', error);
    throw new Error('Failed to fetch budget progress');
  }
}

// Check if a budget exist for a category/sub-category in a month, used for validation before creating new budget
export async function budgetExists(
  userId: string | mongoose.Types.ObjectId,
  month: string,
  categoryId?: string | mongoose.Types.ObjectId,
  subCategoryId?: string | mongoose.Types.ObjectId
): Promise<boolean> {
  try {
    await connectDB();

    const userObjectId = typeof userId === 'string' 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;

    const query: {
      userId: mongoose.Types.ObjectId;
      month: string;
      categoryId?: mongoose.Types.ObjectId;
      subCategoryId?: mongoose.Types.ObjectId;
    } = { userId: userObjectId, month };

    if (categoryId) {
      const categoryObjectId = typeof categoryId === 'string' 
        ? new mongoose.Types.ObjectId(categoryId) 
        : categoryId;
      query.categoryId = categoryObjectId;
    }

    if (subCategoryId) {
      const subCategoryObjectId = typeof subCategoryId === 'string' 
        ? new mongoose.Types.ObjectId(subCategoryId) 
        : subCategoryId;
      query.subCategoryId = subCategoryObjectId;
    }

    const budget = await Budget.findOne(query).select('_id').lean();
    return !!budget;
  } catch (error) {
    console.error('Error checking budget existence:', error);
    return false;
  }
}

// Get total budget limit for a month, used for dashboard summary
export async function getTotalBudgetForMonth(
  userId: string | mongoose.Types.ObjectId,
  month: string
): Promise<number> {
  try {
    await connectDB();

    const userObjectId = typeof userId === 'string' 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;

    const result = await Budget.aggregate([
      { 
        $match: { 
          userId: userObjectId, 
          month,
          // Only count category-level budgets to avoid double-counting
          subCategoryId: null
        } 
      },
      { 
        $group: { 
          _id: null, 
          total: { $sum: '$limit' } 
        } 
      }
    ]);

    return result[0]?.total || 0;
  } catch (error) {
    console.error('Error getting total budget:', error);
    throw new Error('Failed to calculate total budget');
  }
}