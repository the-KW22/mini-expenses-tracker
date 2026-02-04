import { z } from 'zod';

// Income Form Validation Schema
export const incomeSchema = z.object({
    incomeSourceId: z
        .string()
        .min(1, 'Income source is required'),
    amount: z
        .number()
        .min(0.01, 'Amount must be greater than 0')
        .max(999999.99, 'Amount is too large'),
    date: z.date(),
    note: z
        .string()
        .max(200, 'Note must not exceed 200 characters')
        .optional()
        .nullable(),
});

export type IncomeFormData = z.infer<typeof incomeSchema>;

// Income filter schema
export const incomeFilterSchema = z.object({
    incomeSourceId: z.string().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    minAmount: z.number().optional(),
    maxAmount: z.number().optional(),
});

export type IncomeFilterData = z.infer<typeof incomeFilterSchema>;
