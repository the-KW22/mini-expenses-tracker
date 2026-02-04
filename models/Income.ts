import { Schema, model, models } from "mongoose";
import { IIncome } from "@/types";

const IncomeSchema = new Schema<IIncome>(
    {
        incomeSourceId: {
            type: Schema.Types.ObjectId,
            ref: 'IncomeSource',
            required: [true, 'Income source is required'],
        },

        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0, 'Amount must be positive'],
        },

        date: {
            type: Date,
            required: [true, 'Date is required'],
            default: Date.now,
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
IncomeSchema.index({ userId: 1, date: -1 });

// Index for filtering by income source
IncomeSchema.index({ userId: 1, incomeSourceId: 1 });

// Index for incomeSourceId (for source-based filtering)
IncomeSchema.index({ incomeSourceId: 1 });

const Income = models.Income || model<IIncome>('Income', IncomeSchema);
export default Income;
