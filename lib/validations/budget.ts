import { z } from 'zod';

// Budget Form Validation Schema
export const budgetSchema = z.object({
    categoryId: z
        .string()
        .min(1, 'Category is required'),
    subCategoryId: z
        .string()
        .optional()
        .nullable(),
    limit: z
    .number()
    .min(0.01, 'Budget limit must be greater than 0')
    .max(999999.99, 'Budget limit is too large'),
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, 'Invalid month format (YYYY-MM)'),
});

export type BudgetFormData = z.infer<typeof budgetSchema>;