import mongoose from 'mongoose';
import { connectDB } from '../connection';
import IncomeSource from '@/models/IncomeSource';
import { IIncomeSource } from '@/types';

// Get all income sources for a user, used for income source dropdown and list
export async function getIncomeSourcesByUser(
    userId: string | mongoose.Types.ObjectId
): Promise<IIncomeSource[]> {
    try {
        await connectDB();

        const userObjectId = typeof userId === 'string'
            ? new mongoose.Types.ObjectId(userId)
            : userId;

        return await IncomeSource.find({ userId: userObjectId })
            .sort({ name: 1 })
            .lean();
    } catch (error) {
        console.error('Error getting income sources:', error);
        throw new Error('Failed to fetch income sources');
    }
}

// Get single income source by ID, used for income source details, validation
export async function getIncomeSourceById(
    incomeSourceId: string | mongoose.Types.ObjectId,
    userId: string | mongoose.Types.ObjectId
): Promise<IIncomeSource | null> {
    try {
        await connectDB();

        const incomeSourceObjectId = typeof incomeSourceId === 'string'
            ? new mongoose.Types.ObjectId(incomeSourceId)
            : incomeSourceId;

        const userObjectId = typeof userId === 'string'
            ? new mongoose.Types.ObjectId(userId)
            : userId;

        return await IncomeSource.findOne({
            _id: incomeSourceObjectId,
            userId: userObjectId
        }).lean();
    } catch (error) {
        console.error('Error getting income source:', error);
        throw new Error('Failed to fetch income source');
    }
}

// Create a new income source
export async function createIncomeSource(incomeSourceData: {
    name: string;
    icon: string;
    color: string;
    userId: string | mongoose.Types.ObjectId;
}): Promise<IIncomeSource> {
    try {
        await connectDB();

        const newIncomeSource = await IncomeSource.create(incomeSourceData);
        return newIncomeSource;
    } catch (error) {
        console.error('Error creating income source:', error);
        throw new Error('Failed to create income source');
    }
}

// Update an income source
export async function updateIncomeSource(
    incomeSourceId: string | mongoose.Types.ObjectId,
    userId: string | mongoose.Types.ObjectId,
    updateData: Partial<{
        name: string;
        icon: string;
        color: string;
    }>
): Promise<IIncomeSource | null> {
    try {
        await connectDB();

        const incomeSourceObjectId = typeof incomeSourceId === 'string'
            ? new mongoose.Types.ObjectId(incomeSourceId)
            : incomeSourceId;

        const userObjectId = typeof userId === 'string'
            ? new mongoose.Types.ObjectId(userId)
            : userId;

        const updatedIncomeSource = await IncomeSource.findOneAndUpdate(
            { _id: incomeSourceObjectId, userId: userObjectId },
            { $set: updateData },
            { new: true, runValidators: true }
        ).lean();

        return updatedIncomeSource;
    } catch (error) {
        console.error('Error updating income source:', error);
        throw new Error('Failed to update income source');
    }
}

// Delete an income source
export async function deleteIncomeSource(
    incomeSourceId: string | mongoose.Types.ObjectId,
    userId: string | mongoose.Types.ObjectId
): Promise<boolean> {
    try {
        await connectDB();

        const incomeSourceObjectId = typeof incomeSourceId === 'string'
            ? new mongoose.Types.ObjectId(incomeSourceId)
            : incomeSourceId;

        const userObjectId = typeof userId === 'string'
            ? new mongoose.Types.ObjectId(userId)
            : userId;

        const result = await IncomeSource.deleteOne({
            _id: incomeSourceObjectId,
            userId: userObjectId
        });

        return result.deletedCount > 0;
    } catch (error) {
        console.error('Error deleting income source:', error);
        throw new Error('Failed to delete income source');
    }
}