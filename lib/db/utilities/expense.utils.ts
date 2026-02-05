import mongoose from 'mongoose';
import { connectDB } from '../connection';
import Expense from '@/models/Expense';
import { IExpense } from '@/types';

// Type for populated expense (after .populate() calls)
interface PopulatedExpense extends Omit<IExpense, 'categoryId' | 'subCategoryId'> {
    categoryId: {
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

// Get recent expenses for a user, used for dashboard recent transactions list
export async function getRecentExpenses(
    userId: string | mongoose.Types.ObjectId,
    limit: number = 10
): Promise<PopulatedExpense[]> {
    try {
        await connectDB();

        const userObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;

        return await Expense.find({ userId: userObjectId })
        .sort({ date: -1, createdAt: -1})
        .limit(limit)
        .populate('categoryId', 'name icon color')
        .populate('subCategoryId', 'name')
        .lean();
    } catch (error) {
        console.error('Error getting recent expenses:', error);
        throw new Error('Failed to fetch recent expenses');
    }
}

// Get expenses for a specific month, used for monthly expense list, budget tracking
export async function getExpensesByMonth(
    userId: string | mongoose.Types.ObjectId,
    month: string
): Promise<PopulatedExpense[]> {
    try {
        await connectDB();

        const userObjectId = typeof userId === 'string' 
        ? new mongoose.Types.ObjectId(userId) 
        : userId;

        // Parse month string to get start and end dates (use UTC to avoid timezone issues)
        const [year, monthNum] = month.split('-');
        const startDate = new Date(Date.UTC(parseInt(year), parseInt(monthNum) - 1, 1));
        const endDate = new Date(Date.UTC(parseInt(year), parseInt(monthNum), 0, 23, 59, 59, 999));

        return await Expense.find({
        userId: userObjectId,
        date: { 
            $gte: startDate, 
            $lte: endDate 
        }
        })
        .sort({ date: -1 })
        .populate('categoryId', 'name icon color')
        .populate('subCategoryId', 'name')
        .lean();
    } catch (error) {
        console.error('Error getting expenses by month:', error);
        throw new Error('Failed to fetch expenses');
    }
}

// Get a single expense by ID, used for expense detail, edit expense form
export async function getExpenseById(
    expenseId: string | mongoose.Types.ObjectId,
    userId: string | mongoose.Types.ObjectId
): Promise<PopulatedExpense | null> {
    try {
        await connectDB();

        const expenseObjectId = typeof expenseId === 'string' 
        ? new mongoose.Types.ObjectId(expenseId) 
        : expenseId;

        const userObjectId = typeof userId === 'string' 
        ? new mongoose.Types.ObjectId(userId) 
        : userId;

        return await Expense.findOne({ 
        _id: expenseObjectId, 
        userId: userObjectId 
        })
        .populate('categoryId', 'name icon color')
        .populate('subCategoryId', 'name')
        .lean();
    } catch (error) {
        console.error('Error getting expense:', error);
        throw new Error('Failed to fetch expense');
    }
}

// Create a new expense, used for add new expense form
export async function createExpense(expenseData: {
    title: string;
    amount: number;
    date: Date;
    categoryId: string | mongoose.Types.ObjectId;
    subCategoryId?: string | mongoose.Types.ObjectId;
    userId: string | mongoose.Types.ObjectId;
    note?: string;
}): Promise<IExpense> {
    try {
        await connectDB();

        const newExpense = await Expense.create(expenseData);
        return newExpense;
    } catch (error) {
        console.error('Error creating expense:', error);
        throw new Error('Failed to create expense');
    }
}

// Update an expense, used for edit expense form
export async function updateExpense(
    expenseId: string | mongoose.Types.ObjectId,
    userId: string | mongoose.Types.ObjectId,
    updateData: Partial<{
        title: string;
        amount: number;
        date: Date;
        categoryId: string | mongoose.Types.ObjectId;
        subCategoryId?: string | mongoose.Types.ObjectId;
        note?: string;
    }>
): Promise<IExpense | null> {
  try {
    await connectDB();

    const expenseObjectId = typeof expenseId === 'string' 
        ? new mongoose.Types.ObjectId(expenseId) 
        : expenseId;

    const userObjectId = typeof userId === 'string' 
        ? new mongoose.Types.ObjectId(userId) 
        : userId;

    const updatedExpense = await Expense.findOneAndUpdate(
        { _id: expenseObjectId, userId: userObjectId },
        { $set: updateData },
        { new: true, runValidators: true }
    ).lean();

    return updatedExpense;
  } catch (error) {
    console.error('Error updating expense:', error);
    throw new Error('Failed to update expense');
  }
}

// Delete an expense, used for delete expense action
export async function deleteExpense(
  expenseId: string | mongoose.Types.ObjectId,
  userId: string | mongoose.Types.ObjectId
): Promise<boolean> {
  try {
    await connectDB();

    const expenseObjectId = typeof expenseId === 'string' 
      ? new mongoose.Types.ObjectId(expenseId) 
      : expenseId;

    const userObjectId = typeof userId === 'string' 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;

    const result = await Expense.deleteOne({ 
      _id: expenseObjectId, 
      userId: userObjectId 
    });

    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw new Error('Failed to delete expense');
  }
}

// Get total expense by category for a specific month, used for dashboard charts, category breakdown
export async function getExpensesByCategory(
  userId: string | mongoose.Types.ObjectId,
  month: string
): Promise<Array<{
  categoryId: mongoose.Types.ObjectId;
  categoryName: string;
  color: string;
  icon?: string;
  total: number;
}>> {
  try {
    await connectDB();

    const userObjectId = typeof userId === 'string' 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;

    // Parse month (use UTC to avoid timezone issues)
    const [year, monthNum] = month.split('-');
    const startDate = new Date(Date.UTC(parseInt(year), parseInt(monthNum) - 1, 1));
    const endDate = new Date(Date.UTC(parseInt(year), parseInt(monthNum), 0, 23, 59, 59, 999));

    const result = await Expense.aggregate([
      // Stage 1: Filter by user and date
      {
        $match: {
          userId: userObjectId,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      // Stage 2: Group by category and sum amounts
      {
        $group: {
          _id: '$categoryId',
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
          color: '$category.color',
          icon: '$category.icon',
          total: 1,
          _id: 0
        }
      },
      // Stage 6: Sort by total (highest first)
      { $sort: { total: -1 } }
    ]);

    return result;
  } catch (error) {
    console.error('Error getting expenses by category:', error);
    throw new Error('Failed to fetch category expenses');
  }
}

// Get total expenses for a specific category in a month, used for budget progress calculation
export async function getTotalExpensesForCategory(
  userId: string | mongoose.Types.ObjectId,
  categoryId: string | mongoose.Types.ObjectId,
  month: string,
  subCategoryId?: string | mongoose.Types.ObjectId
): Promise<number> {
  try {
    await connectDB();

    const userObjectId = typeof userId === 'string' 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;

    const categoryObjectId = typeof categoryId === 'string' 
      ? new mongoose.Types.ObjectId(categoryId) 
      : categoryId;

    // Parse month (use UTC to avoid timezone issues)
    const [year, monthNum] = month.split('-');
    const startDate = new Date(Date.UTC(parseInt(year), parseInt(monthNum) - 1, 1));
    const endDate = new Date(Date.UTC(parseInt(year), parseInt(monthNum), 0, 23, 59, 59, 999));

    const match: {
      userId: mongoose.Types.ObjectId;
      categoryId: mongoose.Types.ObjectId;
      date: { $gte: Date; $lte: Date };
      subCategoryId?: mongoose.Types.ObjectId;
    } = {
      userId: userObjectId,
      categoryId: categoryObjectId,
      date: { $gte: startDate, $lte: endDate }
    };

    // If sub-category specified, filter by it
    if (subCategoryId) {
      const subCategoryObjectId = typeof subCategoryId === 'string' 
        ? new mongoose.Types.ObjectId(subCategoryId) 
        : subCategoryId;
      match.subCategoryId = subCategoryObjectId;
    }

    const result = await Expense.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    return result[0]?.total || 0;
  } catch (error) {
    console.error('Error getting total expenses:', error);
    throw new Error('Failed to calculate total expenses');
  }
}