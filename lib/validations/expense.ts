import { z } from 'zod';

// Expense From Validation Schema
export const expenseSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(100, 'Title must not exceed 100 characters'),
    amount: z
        .number()
        .min(0.01, 'Amount must be greater than 0')
        .max(9999.99, 'Amount is too large'),
    date: z.date(),
    categoryId: z
        .string()
        .min(1, 'Category is required'),
    subCategoryId: z
        .string()
        .optional()
        .nullable(),
    note: z
        .string()
        .max(500, 'Note must not exceed 500 characters')
        .optional()
        .nullable(),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;

// Expense filter schema
export const expenseFilterSchema = z.object({
    categoryId: z.string().optional(),
    subCategoryId: z.string().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    minAmount: z.number().optional(),
    maxAmount: z.number().optional(),
});

export type expenseFilterSchema = z.infer<typeof expenseFilterSchema>;