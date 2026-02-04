import { Schema, model, models } from 'mongoose';
import { IBudget } from '@/types';

const BudgetSchema = new Schema<IBudget>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'SubCategory',
      default: null,
    },
    limit: {
      type: Number,
      required: [true, 'Budget limit is required'],
      min: [0, 'Budget limit must be positive'],
    },
    month: {
      type: String,
      required: [true, 'Month is required'],
      match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index: userId + month (most common query)
BudgetSchema.index({ userId: 1, month: 1 });

// Unique constraint: One budget per category/subcategory per month per user
// User can't have 2 budgets for "Food" category in "2025-01"
BudgetSchema.index(
  { userId: 1, categoryId: 1, subCategoryId: 1, month: 1 },
  { unique: true }
);

const Budget = models.Budget || model<IBudget>('Budget', BudgetSchema);
export default Budget;