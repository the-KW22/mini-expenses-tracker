'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import {
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetById,
  budgetExists,
} from '@/lib/db/utilities/index';
import { budgetSchema, type BudgetFormData } from '@/lib/validations/budget';

// Add new budget
export async function addBudgetAction(data: BudgetFormData) {
    try {
        const session = await auth();
        if(!session?.user?.id){
            return {
                success: false,
                error: 'You must be logged in to add a budget',
            };
        }

        // Validate input
        const validatedData = budgetSchema.parse(data);

        // Check if budget already exists for this category/sub-category in this month
        const exists = await budgetExists(
            session.user.id,
            validatedData.month,
            validatedData.categoryId,
            validatedData.subCategoryId || undefined
        );

        if (exists) {
            return {
                success: false,
                error: 'A budget already exists for this category/sub-category in this month',
            };
        }

        // Create budget
        await createBudget({
            userId: session.user.id,
            categoryId: validatedData.categoryId,
            subCategoryId: validatedData.subCategoryId || undefined,
            limit: validatedData.limit,
            month: validatedData.month,
        });

        // Revalidate pages
        revalidatePath('/dashboard');
        revalidatePath('/budgets');

        return {
            success: true,
            message: 'Budget created successfully',
        };
    } catch (error: unknown) {
        console.error('Add budget error:', error);

        if (error instanceof Error && error.name === 'ZodError') {
            return {
                success: false,
                error: 'Invalid input data',
            };
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create budget',
        };
    }
}

// Update existing budget
export async function updateBudgetAction(
  budgetId: string,
  data: { limit: number; month: string }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'You must be logged in to update a budget',
      };
    }

    // Verify ownership
    const budget = await getBudgetById(budgetId, session.user.id);
    if (!budget) {
      return {
        success: false,
        error: 'Budget not found or you do not have permission to edit it',
      };
    }

    // Validate input
    if (data.limit <= 0) {
      return {
        success: false,
        error: 'Budget limit must be greater than 0',
      };
    }

    if (!/^\d{4}-\d{2}$/.test(data.month)) {
      return {
        success: false,
        error: 'Invalid month format',
      };
    }

    // Update budget
    await updateBudget(budgetId, session.user.id, {
      limit: data.limit,
      month: data.month,
    });

    // Revalidate pages
    revalidatePath('/dashboard');
    revalidatePath('/budgets');

    return {
      success: true,
      message: 'Budget updated successfully',
    };
  } catch (error: unknown) {
    console.error('Update budget error:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update budget',
    };
  }
}

// Delete a budget
export async function deleteBudgetAction(budgetId: string) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'You must be logged in to delete a budget',
      };
    }

    // Verify ownership
    const budget = await getBudgetById(budgetId, session.user.id);
    if (!budget) {
      return {
        success: false,
        error: 'Budget not found or you do not have permission to delete it',
      };
    }

    // Delete budget
    const deleted = await deleteBudget(budgetId, session.user.id);

    if (!deleted) {
      return {
        success: false,
        error: 'Failed to delete budget',
      };
    }

    // Revalidate pages
    revalidatePath('/dashboard');
    revalidatePath('/budgets');

    return {
      success: true,
      message: 'Budget deleted successfully',
    };
  } catch (error: unknown) {
    console.error('Delete budget error:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete budget',
    };
  }
}