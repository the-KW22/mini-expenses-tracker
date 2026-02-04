import { Schema, model, models } from 'mongoose';
import { ICategory } from '@/types';

const CategorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            trim: true,
            maxlength: [50, 'Category name must not exceed 50 characters'],
        },

        icon: {
            type: String,
            default: null,
        },

        color: {
            type: String,
            default: null,
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
CategorySchema.index({ userId: 1, name: 1 });

// Index for userId (used frequently)
CategorySchema.index({ userId: 1 });

const Category = models.Category || model<ICategory>('Category', CategorySchema);
export default Category;