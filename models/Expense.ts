import { Schema, model, models } from "mongoose";
import { IExpense } from "@/types";

const ExpenseSchema = new Schema<IExpense>(
    {
        title: {
            type: String,
            required: [true, 'Expense title is required'],
            trim: true,
            maxLength: [50, 'Title must not exceed 50 characters'],
        },

        amount: {
            type: Number,
            require: [true, 'Amount is required'],
            min: [0, 'Amount must be positive'],
        },

        date: {
            type: Date,
            required: [true, 'Date is required'],
            default: Date.now,
        },

        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required'],
        },

        subCategoryId: {
            type: Schema.Types.ObjectId,
            ref: 'SubCategory',
            default: null,
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
        },

        note: {
            type: String,
            default: null,
            maxLength: [200, 'Note must not exceed 200 characters'],
        },
    },

    {
        timestamps: true,
    }
);

// Compound index: userId + date (most common query pattern)
ExpenseSchema.index({ userId: 1, date: -1 });

// Index for categoryId (for category-based filtering)
ExpenseSchema.index({ categoryId: 1 });

// Compound index: userId + categoryId + date (for filtered queries)
ExpenseSchema.index({ userId: 1, categoryId: 1, date: -1 });

const Expense = models.Expense || model<IExpense>('Expense', ExpenseSchema);
export default Expense;