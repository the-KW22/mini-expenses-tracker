'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import {
  createIncome,
  updateIncome,
  deleteIncome,
  getIncomeById,
} from '@/lib/db/utilities';
import { incomeSchema, type IncomeFormData } from '@/lib/validations/income';
import { ZodError } from 'zod';

// Add new income
export async function addIncomeAction(data: IncomeFormData) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return {
                success: false,
                error: 'You must be logged in to add an income',
            };
        }

        // Validate input
        const validatedData = incomeSchema.parse(data);

        // Create Income
        await createIncome({
            incomeSourceId: validatedData.incomeSourceId,
            amount: validatedData.amount,
            date: validatedData.date,
            userId: session.user.id,
            note: validatedData.note || undefined,
        });

        // Revalidate dashboard and incomes page
        revalidatePath('/dashboard');
        revalidatePath('/incomes');

        return {
            success: true,
            message: 'Income added successfully',
        };
    } catch (error: unknown) {
        console.error('Add income error:', error);

        if (error instanceof ZodError) {
            return {
                success: false,
                error: 'Invalid input data',
                issues: error.issues,
            };
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to add income',
        };
    }
}

// Update an existing income
export async function updateIncomeAction(
    incomeId: string,
    data: IncomeFormData
) {
    try {
        // Check authentication
        const session = await auth();

        if (!session?.user.id) {
            return {
                success: false,
                error: 'You must be logged in to update an income',
            };
        }

        // Verify ownership
        const income = await getIncomeById(incomeId, session.user.id);
        if (!income) {
            return {
                success: false,
                error: 'Income not found or you do not have permission to edit it',
            };
        }

        const validatedData = incomeSchema.parse(data);

        // Update income
        await updateIncome(incomeId, session.user.id, {
            incomeSourceId: validatedData.incomeSourceId,
            amount: validatedData.amount,
            date: validatedData.date,
            note: validatedData.note || undefined,
        });

        // Revalidate pages
        revalidatePath('/dashboard');
        revalidatePath('/incomes');

        return {
            success: true,
            message: 'Income updated successfully',
        };
    } catch (error: unknown) {
        console.error('Update income error:', error);

        if (error instanceof ZodError) {
            return {
                success: false,
                error: 'Invalid input data',
                issues: error.issues,
            };
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update income',
        };
    }
}

// Delete an income
export async function deleteIncomeAction(incomeId: string) {
    try {
        // Check authentication
        const session = await auth();
        if (!session?.user?.id) {
            return {
                success: false,
                error: 'You must be logged in to delete an income',
            };
        }

        // Verify ownership
        const income = await getIncomeById(incomeId, session.user.id);
        if (!income) {
            return {
                success: false,
                error: 'Income not found or you do not have permission to delete it',
            };
        }

        // Delete income
        const deleted = await deleteIncome(incomeId, session.user.id);

        if (!deleted) {
            return {
                success: false,
                error: 'Failed to delete income',
            };
        }

        // Revalidate pages
        revalidatePath('/dashboard');
        revalidatePath('/incomes');

        return {
            success: true,
            message: 'Income deleted successfully',
        };
    } catch (error: unknown) {
        console.error('Delete income error:', error);

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete income',
        };
    }
}
