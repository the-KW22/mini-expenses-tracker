import { Schema, model, models } from 'mongoose';
import { IIncomeSource } from '@/types';

const IncomeSourceSchema = new Schema<IIncomeSource>(
    {
        name: {
            type: String,
            required: [true, 'Income source name is required'],
            trim: true,
            maxlength: [50, 'Income source name must not exceed 50 characters'],
        },

        icon: {
            type: String,
            required: [true, 'Icon is required'],
        },

        color: {
            type: String,
            required: [true, 'Color is required'],
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
        },
    },
    {
        timestamps: true,
    }
);

// Compound index: faster queries when filtering by userId + name
IncomeSourceSchema.index({ userId: 1, name: 1 });

// Index for userId (used frequently)
IncomeSourceSchema.index({ userId: 1 });

const IncomeSource = models.IncomeSource || model<IIncomeSource>('IncomeSource', IncomeSourceSchema);
export default IncomeSource;
