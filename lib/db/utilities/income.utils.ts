import mongoose from 'mongoose';
import { connectDB } from '../connection';
import Income from '@/models/Income';
import { IIncome } from '@/types';

// Type for populated income (after .populate() calls)
interface PopulatedIncome extends Omit<IIncome, 'incomeSourceId'> {
    incomeSourceId: {
        _id: mongoose.Types.ObjectId;
        name: string;
        icon: string;
        color: string;
    };
}

// Get recent incomes for a user, used for dashboard recent transactions list
export async function getRecentIncomes(
    userId: string | mongoose.Types.ObjectId,
    limit: number = 10
): Promise<PopulatedIncome[]> {
    try {
        await connectDB();

        const userObjectId = typeof userId === 'string'
            ? new mongoose.Types.ObjectId(userId)
            : userId;

        return await Income.find({ userId: userObjectId })
            .populate('incomeSourceId', 'name icon color')
            .sort({ date: -1, createdAt: -1 })
            .limit(limit)
            .lean();
    } catch (error) {
        console.error('Error getting recent incomes:', error);
        throw new Error('Failed to fetch recent incomes');
    }
}

// Get incomes for a specific month, used for monthly income list
export async function getIncomesByMonth(
    userId: string | mongoose.Types.ObjectId,
    month: string
): Promise<PopulatedIncome[]> {
    try {
        await connectDB();

        const userObjectId = typeof userId === 'string'
            ? new mongoose.Types.ObjectId(userId)
            : userId;

        // Parse month string to get start and end dates
        const [year, monthNum] = month.split('-');
        const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59, 999);

        return await Income.find({
            userId: userObjectId,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        })
            .populate('incomeSourceId', 'name icon color')
            .sort({ date: -1 })
            .lean();
    } catch (error) {
        console.error('Error getting incomes by month:', error);
        throw new Error('Failed to fetch incomes');
    }
}

// Get a single income by ID, used for income detail, edit income form
export async function getIncomeById(
    incomeId: string | mongoose.Types.ObjectId,
    userId: string | mongoose.Types.ObjectId
): Promise<PopulatedIncome | null> {
    try {
        await connectDB();

        const incomeObjectId = typeof incomeId === 'string'
            ? new mongoose.Types.ObjectId(incomeId)
            : incomeId;

        const userObjectId = typeof userId === 'string'
            ? new mongoose.Types.ObjectId(userId)
            : userId;

        return await Income.findOne({
            _id: incomeObjectId,
            userId: userObjectId
        })
            .populate('incomeSourceId', 'name icon color')
            .lean();
    } catch (error) {
        console.error('Error getting income:', error);
        throw new Error('Failed to fetch income');
    }
}

// Create a new income, used for add new income form
export async function createIncome(incomeData: {
    incomeSourceId: string | mongoose.Types.ObjectId;
    amount: number;
    date: Date;
    userId: string | mongoose.Types.ObjectId;
    note?: string;
}): Promise<IIncome> {
    try {
        await connectDB();

        const newIncome = await Income.create(incomeData);
        return newIncome;
    } catch (error) {
        console.error('Error creating income:', error);
        throw new Error('Failed to create income');
    }
}

// Update an income, used for edit income form
export async function updateIncome(
    incomeId: string | mongoose.Types.ObjectId,
    userId: string | mongoose.Types.ObjectId,
    updateData: Partial<{
        incomeSourceId: string | mongoose.Types.ObjectId;
        amount: number;
        date: Date;
        note?: string;
    }>
): Promise<IIncome | null> {
    try {
        await connectDB();

        const incomeObjectId = typeof incomeId === 'string'
            ? new mongoose.Types.ObjectId(incomeId)
            : incomeId;

        const userObjectId = typeof userId === 'string'
            ? new mongoose.Types.ObjectId(userId)
            : userId;

        const updatedIncome = await Income.findOneAndUpdate(
            { _id: incomeObjectId, userId: userObjectId },
            { $set: updateData },
            { new: true, runValidators: true }
        ).lean();

        return updatedIncome;
    } catch (error) {
        console.error('Error updating income:', error);
        throw new Error('Failed to update income');
    }
}

// Delete an income, used for delete income action
export async function deleteIncome(
    incomeId: string | mongoose.Types.ObjectId,
    userId: string | mongoose.Types.ObjectId
): Promise<boolean> {
    try {
        await connectDB();

        const incomeObjectId = typeof incomeId === 'string'
            ? new mongoose.Types.ObjectId(incomeId)
            : incomeId;

        const userObjectId = typeof userId === 'string'
            ? new mongoose.Types.ObjectId(userId)
            : userId;

        const result = await Income.deleteOne({
            _id: incomeObjectId,
            userId: userObjectId
        });

        return result.deletedCount > 0;
    } catch (error) {
        console.error('Error deleting income:', error);
        throw new Error('Failed to delete income');
    }
}

// Get total income for a specific month, used for dashboard summary
export async function getTotalIncomeForMonth(
    userId: string | mongoose.Types.ObjectId,
    month: string
): Promise<number> {
    try {
        await connectDB();

        const userObjectId = typeof userId === 'string'
            ? new mongoose.Types.ObjectId(userId)
            : userId;

        // Parse month
        const [year, monthNum] = month.split('-');
        const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59, 999);

        const result = await Income.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        return result[0]?.total || 0;
    } catch (error) {
        console.error('Error getting total income:', error);
        throw new Error('Failed to calculate total income');
    }
}

// Get income grouped by source for a specific month, used for dashboard charts
export async function getIncomesBySource(
    userId: string | mongoose.Types.ObjectId,
    month: string
): Promise<Array<{
    incomeSourceId: string;
    name: string;
    icon: string;
    color: string;
    total: number;
}>> {
    try {
        await connectDB();

        const userObjectId = typeof userId === 'string'
            ? new mongoose.Types.ObjectId(userId)
            : userId;

        // Parse month
        const [year, monthNum] = month.split('-');
        const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59, 999);

        const result = await Income.aggregate([
            // Stage 1: Filter by user and date
            {
                $match: {
                    userId: userObjectId,
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            // Stage 2: Group by incomeSourceId and sum amounts
            {
                $group: {
                    _id: '$incomeSourceId',
                    total: { $sum: '$amount' }
                }
            },
            // Stage 3: Lookup income source details
            {
                $lookup: {
                    from: 'incomesources',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'source'
                }
            },
            // Stage 4: Unwind the source array
            {
                $unwind: '$source'
            },
            // Stage 5: Project final structure
            {
                $project: {
                    incomeSourceId: { $toString: '$_id' },
                    name: '$source.name',
                    icon: '$source.icon',
                    color: '$source.color',
                    total: 1,
                    _id: 0
                }
            },
            // Stage 6: Sort by total (highest first)
            { $sort: { total: -1 } }
        ]);

        return result;
    } catch (error) {
        console.error('Error getting incomes by source:', error);
        throw new Error('Failed to fetch income by source');
    }
}

// Get total income for a specific income source in a month
export async function getTotalIncomeForSource(
    userId: string | mongoose.Types.ObjectId,
    incomeSourceId: string | mongoose.Types.ObjectId,
    month: string
): Promise<number> {
    try {
        await connectDB();

        const userObjectId = typeof userId === 'string'
            ? new mongoose.Types.ObjectId(userId)
            : userId;

        const sourceObjectId = typeof incomeSourceId === 'string'
            ? new mongoose.Types.ObjectId(incomeSourceId)
            : incomeSourceId;

        // Parse month
        const [year, monthNum] = month.split('-');
        const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59, 999);

        const result = await Income.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    incomeSourceId: sourceObjectId,
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        return result[0]?.total || 0;
    } catch (error) {
        console.error('Error getting total income for source:', error);
        throw new Error('Failed to calculate total income for source');
    }
}