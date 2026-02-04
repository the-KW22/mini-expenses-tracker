import mongoose from 'mongoose';
import { connectDB } from '../connection';
import Category from '@/models/Category';
import SubCategory from '@/models/SubCategory';
import { ICategory, ISubCategory } from '@/types';

// Get all categories for user, used for category dropdown and category list page
export async function getCategoriesByUser(
    userId: string | mongoose.Types.ObjectId
) : Promise<ICategory[]> {
    try{
        await connectDB();

        const userObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;

        return await Category.find({ userId: userObjectId})
        .sort({ name: 1})
        .lean();
    } catch (error) {
        console.error('Error getting categories:', error);
        throw new Error('Failed to fetch categories');
    }
}

// Get single category by ID, used for category details, validation
export async function getCategoryById(
    categoryId: string | mongoose.Types.ObjectId,
    userId: string | mongoose.Types.ObjectId,
) : Promise<ICategory | null> {
    try {
        await connectDB();

        const categoryObjectId = typeof categoryId === 'string' 
        ? new mongoose.Types.ObjectId(categoryId) 
        : categoryId;

        const userObjectId = typeof userId === 'string' 
        ? new mongoose.Types.ObjectId(userId) 
        : userId;

        return await Category.findOne({ 
        _id: categoryObjectId, 
        userId: userObjectId 
        }).lean();
    } catch (error) {
        console.error('Error getting category:', error);
        throw new Error('Failed to fetch category');
    }
}

// Get sub-categories for a specific cateogry, used for sub-category dropdown
export async function getSubCategoriesByCategory(
  categoryId: string | mongoose.Types.ObjectId,
  userId: string | mongoose.Types.ObjectId
): Promise<ISubCategory[]> {
  try {
    await connectDB();

    const categoryObjectId = typeof categoryId === 'string' 
      ? new mongoose.Types.ObjectId(categoryId) 
      : categoryId;

    const userObjectId = typeof userId === 'string' 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;

    return await SubCategory.find({ 
      categoryId: categoryObjectId, 
      userId: userObjectId 
    })
      .sort({ name: 1 })
      .lean();
  } catch (error) {
    console.error('Error getting sub-categories:', error);
    throw new Error('Failed to fetch sub-categories');
  }
}

// Get all sub-categories for a user, used for complete sub-category list
export async function getAllSubCategoriesByUser(
  userId: string | mongoose.Types.ObjectId
): Promise<ISubCategory[]> {
  try {
    await connectDB();

    const userObjectId = typeof userId === 'string' 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;

    return await SubCategory.find({ userId: userObjectId })
      .sort({ name: 1 })
      .lean();
  } catch (error) {
    console.error('Error getting all sub-categories:', error);
    throw new Error('Failed to fetch sub-categories');
  }
}

// Get category with its sub-categories, used for category detail page, expense form with cascading dropdown
export async function getCategoryWithSubCategories(
  categoryId: string | mongoose.Types.ObjectId,
  userId: string | mongoose.Types.ObjectId
): Promise<{
  category: ICategory;
  subCategories: ISubCategory[];
} | null> {
  try {
    await connectDB();

    const categoryObjectId = typeof categoryId === 'string' 
      ? new mongoose.Types.ObjectId(categoryId) 
      : categoryId;

    const userObjectId = typeof userId === 'string' 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;

    const category = await Category.findOne({ 
      _id: categoryObjectId, 
      userId: userObjectId 
    }).lean();

    if (!category) return null;

    const subCategories = await SubCategory.find({ 
      categoryId: categoryObjectId, 
      userId: userObjectId 
    })
      .sort({ name: 1 })
      .lean();

    return { category, subCategories };
  } catch (error) {
    console.error('Error getting category with sub-categories:', error);
    throw new Error('Failed to fetch category details');
  }
}

// Get all categories and their sub-categories, used for complete category tree view, reports
export async function getAllCategoriesWithSubCategories(
  userId: string | mongoose.Types.ObjectId
): Promise<Array<ICategory & { subCategories: ISubCategory[] }>> {
  try {
    await connectDB();

    const userObjectId = typeof userId === 'string' 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;

    // Get all categories
    const categories = await Category.find({ userId: userObjectId })
      .sort({ name: 1 })
      .lean();

    // Get all sub-categories
    const allSubCategories = await SubCategory.find({ userId: userObjectId })
      .sort({ name: 1 })
      .lean();

    // Map sub-categories to their parent categories
    const categoriesWithSubs = categories.map((category) => ({
      ...category,
      subCategories: allSubCategories.filter(
        (sub) => sub.categoryId.toString() === category._id.toString()
      ),
    }));

    return categoriesWithSubs;
  } catch (error) {
    console.error('Error getting categories with sub-categories:', error);
    throw new Error('Failed to fetch categories');
  }
}