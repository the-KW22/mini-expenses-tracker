import mongoose from 'mongoose';
import { connectDB } from '../connection';
import Expense from '@/models/Expense';
import Income from '@/models/Income';
import Budget from '@/models/Budget';
import { getCurrentMonth } from '@/lib/utils/index';

// Get dashboard summary for current month, return total expenses, total budget and remaining amount
export async function getDashboardSummary (
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

        // Get total expenses for the month
        const expenseResult = await Expense.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    date: {$gte: startDate, $lte: endDate}
                }
            },

            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount'}
                }
            }
        ]);

        const totalExpenses = expenseResult[0]?.total || 0;

        // Get total budget for the month (only category-level budgets)
        const budgetResult = await Budget.aggregate([
        {
            $match: {
            userId: userObjectId,
            month: currentMonth,
            subCategoryId: null // Only count category-level budgets
            }
        },
        {
            $group: {
            _id: null,
            total: { $sum: '$limit' }
            }
        }
        ]);

        const totalBudget = budgetResult[0]?.total || 0;
        const remaining = totalBudget - totalExpenses;
        const percentageUsed = totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0;

        return {
            totalExpenses,
            totalBudget,
            remaining,
            percentageUsed,
            month: currentMonth,
        };
    } catch (error) {
        console.error('Error getting dashboard summary:', error);
        throw new Error('Failed to fetch dashboard summary');
    }
}

// Check if user has any expenses
export async function userHasExpenses(
    userId: string | mongoose.Types.ObjectId
) : Promise <boolean> {
    try {
        await connectDB();

        const userObjectId = typeof userId === 'string'
            ? new mongoose.Types.ObjectId(userId)
            : userId;

        const count = await Expense.countDocuments({ userId: userObjectId });
        return count > 0;
    } catch(error) {
        console.error('Error checking expenses:', error);
        return false;
    }
}

// Check if user has any budget
export async function userHasBudgets(
  userId: string | mongoose.Types.ObjectId,
  month?: string
): Promise<boolean> {
  try {
    await connectDB();

    const userObjectId = typeof userId === 'string'
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const currentMonth = month || getCurrentMonth();
    const count = await Budget.countDocuments({
      userId: userObjectId,
      month: currentMonth
    });
    return count > 0;
  } catch (error) {
    console.error('Error checking budgets:', error);
    return false;
  }
}

// Get daily totals for expenses and incomes in a month, used for trend charts
export async function getDailyTotals(
  userId: string | mongoose.Types.ObjectId,
  month: string
): Promise<Array<{
  date: string;
  day: number;
  expenses: number;
  income: number;
}>> {
  try {
    await connectDB();

    const userObjectId = typeof userId === 'string'
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const [year, monthNum] = month.split('-');
    const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59, 999);
    const daysInMonth = endDate.getDate();

    // Get daily expenses aggregation
    const expensesByDay = await Expense.aggregate([
      {
        $match: {
          userId: userObjectId,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dayOfMonth: '$date' },
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Get daily income aggregation
    const incomesByDay = await Income.aggregate([
      {
        $match: {
          userId: userObjectId,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dayOfMonth: '$date' },
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Create lookup maps
    const expenseMap = new Map(expensesByDay.map(e => [e._id, e.total]));
    const incomeMap = new Map(incomesByDay.map(i => [i._id, i.total]));

    // Build daily totals array for all days in month
    const dailyTotals = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${monthNum}-${String(day).padStart(2, '0')}`;
      dailyTotals.push({
        date: dateStr,
        day,
        expenses: expenseMap.get(day) || 0,
        income: incomeMap.get(day) || 0
      });
    }

    return dailyTotals;
  } catch (error) {
    console.error('Error getting daily totals:', error);
    throw new Error('Failed to fetch daily totals');
  }
}