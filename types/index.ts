import mongoose, { Document } from 'mongoose';

// ===== USER TYPES =====
export type ThemeType = 'sage' | 'rose' | 'lavender' | 'mint' | 'peach' | 'lemon';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  image?: string;
  theme?: ThemeType;
  createdAt: Date;
  updatedAt: Date;
}

// ===== CATEGORY TYPES =====
export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  icon?: string;
  color?: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ===== SUB-CATEGORY TYPES =====
export interface ISubCategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  categoryId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ===== EXPENSE TYPES =====
export interface IExpense extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  date: Date;
  categoryId: mongoose.Types.ObjectId;
  subCategoryId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ===== BUDGET TYPES =====
export interface IBudget extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  categoryId?: mongoose.Types.ObjectId;
  subCategoryId?: mongoose.Types.ObjectId;
  limit: number;
  month: string; // Format: YYYY-MM
  createdAt: Date;
  updatedAt: Date;
}

// ===== INCOME SOURCE TYPES =====
export interface IIncomeSource extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  icon: string;
  color: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ===== INCOME TYPES =====
export interface IIncome extends Document {
  _id: mongoose.Types.ObjectId;
  incomeSourceId: mongoose.Types.ObjectId;
  amount: number;
  date: Date;
  userId: mongoose.Types.ObjectId;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ===== CLIENT-SIDE TYPES (without Document extension) =====
export type User = Omit<IUser, keyof Document>;
export type Category = Omit<ICategory, keyof Document>;
export type SubCategory = Omit<ISubCategory, keyof Document>;
export type Expense = Omit<IExpense, keyof Document>;
export type Budget = Omit<IBudget, keyof Document>;
export type IncomeSource = Omit<IIncomeSource, keyof Document>;
export type Income = Omit<IIncome, keyof Document>;

// ===== FORM TYPES =====
export interface ExpenseFormData {
  title: string;
  amount: number;
  date: Date;
  categoryId: string;
  subCategoryId?: string;
  note?: string;
}

export interface BudgetFormData {
  categoryId?: string;
  subCategoryId?: string;
  limit: number;
  month: string;
}

export interface IncomeFormData {
  incomeSourceId: string;
  amount: number;
  date: Date;
  note?: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

// ===== DASHBOARD TYPES =====
export interface BudgetProgress {
  budgetId: string;
  categoryName: string;
  subCategoryName?: string;
  limit: number;
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
}

export interface MonthlyStats {
  totalExpenses: number;
  totalBudget: number;
  expensesByCategory: {
    categoryId: string;
    categoryName: string;
    total: number;
    color?: string;
  }[];
}