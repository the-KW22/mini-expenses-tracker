import { Schema, model, models } from 'mongoose';
import { ISubCategory } from '@/types';

const SubCategorySchema = new Schema<ISubCategory>(
  {
    name: {
      type: String,
      required: [true, 'Sub-category name is required'],
      trim: true,
      maxlength: [50, 'Sub-category name must not exceed 50 characters'],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category ID is required'],
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

// Compound index: faster queries when filtering by categoryId + userId
SubCategorySchema.index({ categoryId: 1, userId: 1 });

// Index for userId (used frequently)
SubCategorySchema.index({ userId: 1 });

const SubCategory = models.SubCategory || model<ISubCategory>('SubCategory', SubCategorySchema);
export default SubCategory;