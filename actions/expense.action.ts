'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import {
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseById,
} from '@/lib/db/utilities';
import { expenseSchema, type ExpenseFormData } from '@/lib/validations/expense';
import { ZodError } from 'zod';

// Add new expense
export async function addExpenseAction(data: ExpenseFormData){
    try {
        const session = await auth();

        if(!session?.user?.id){
            return {
                success: false,
                error: 'You must be logged in to add an expense',
            };
        }

        // Validate input
        const validatedData = expenseSchema.parse(data);

        // Create Expense
        await createExpense({
            title: validatedData.title,
            amount: validatedData.amount,
            date: validatedData.date,
            categoryId: validatedData.categoryId,
            subCategoryId: validatedData.subCategoryId || undefined,
            userId: session.user.id,
            note: validatedData.note || undefined,
        });

        // Revalidate dashboard and expenses page
        revalidatePath('/dashboard');
        revalidatePath('/expenses');

        return {
            success: true,
            message: 'Expense added successfully',
        };
    } catch (error: unknown){
        console.error('Add expense error:', error);

        if (error instanceof ZodError) {
            return {
                success: false,
                error: 'Invalid input data',
                issues: error.issues,
            };
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to add expense',
        };
    }
}

// Update an existing expense
export async function updateExpenseAction(
    expenseId: string,
    data: ExpenseFormData
) {
    try {
        // Check authentication
        const session = await auth();

        if(!session?.user.id) {
            return {
                success: false,
                error: 'You must be logged in to update an expense',
            };
        }

        // Verify ownership
        const expense = await getExpenseById(expenseId,  session.user.id);
        if(!expense) {
            return{
                success: false,
                error: 'Expense not found or you do not have permission to edit it',
            };
        }

        const validatedData = expenseSchema.parse(data);

        // Update expense
        await updateExpense(expenseId, session.user.id, {
            title: validatedData.title,
            amount: validatedData.amount,
            date: validatedData.date,
            categoryId: validatedData.categoryId,
            subCategoryId: validatedData.subCategoryId || undefined,
            note: validatedData.note || undefined,
        });

        // Revalidate pages
        revalidatePath('/dashboard');
        revalidatePath('/expenses');

        return {
            success: true,
            message: 'Expense updated successfully',
        };
    } catch (error: unknown){
        console.error('Update expense error:', error);

        if (error instanceof ZodError) {
            return {
                success: false,
                error: 'Invalid input data',
                issues: error.issues,
            };
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update expense',
        };
    }
}

// Delete an expense
export async function deleteExpenseAction(expenseId: string) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'You must be logged in to delete an expense',
      };
    }

    // Verify ownership
    const expense = await getExpenseById(expenseId, session.user.id);
    if (!expense) {
      return {
        success: false,
        error: 'Expense not found or you do not have permission to delete it',
      };
    }

    // Delete expense
    const deleted = await deleteExpense(expenseId, session.user.id);

    if (!deleted) {
      return {
        success: false,
        error: 'Failed to delete expense',
      };
    }

    // Revalidate pages
    revalidatePath('/dashboard');
    revalidatePath('/expenses');

    return {
      success: true,
      message: 'Expense deleted successfully',
    };
  } catch (error: unknown) {
    console.error('Delete expense error:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete expense',
    };
  }
}