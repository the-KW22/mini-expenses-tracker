import mongoose from "mongoose";
import { connectDB } from "../connection";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";
import IncomeSource from "@/models/IncomeSource";
import { PRESET_CATEGORIES, PRESET_INCOMES } from "@/config/seed-data";

// Seed preset categories and sub-categories for a new user
// This function is called automatically when a user registers
export async function seedCategoriesForUser(
    userId: string | mongoose.Types.ObjectId
): Promise<void> {
    try {
        await connectDB();

        const userObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;

        console.log(`🌱 Seeding categories for user: ${userObjectId}`);

        // Step 1: Create all categories
        const categoryPromises = PRESET_CATEGORIES.map((presetCategory) => {
            return Category.create({
                name: presetCategory.name,
                icon: presetCategory.icon,
                color: presetCategory.color,
                userId: userObjectId,
            });
        });

        const createdCategories = await Promise.all(categoryPromises);
        console.log(`✅ Created ${createdCategories.length} categories`);

        // Step 2: Create all sub-categories
        const subCategoryData: {
            name: string;
            categoryId: mongoose.Types.ObjectId;
            userId: mongoose.Types.ObjectId;
        }[] = [];

        PRESET_CATEGORIES.forEach((presetCategory, index) => {
            const category = createdCategories[index];
            if (!category || !category._id) {
                console.error(`❌ Missing category at index ${index}`);
                return;
            }

            presetCategory.subCategories.forEach((subCategory) => {
                subCategoryData.push({
                    name: subCategory.name,
                    categoryId: category._id,
                    userId: userObjectId,
                });
            });
        });

        console.log(`📝 Preparing to insert ${subCategoryData.length} sub-categories`);

        // Bulk insert all sub-categories at once
        const createdSubCategories = await SubCategory.insertMany(subCategoryData, { ordered: false });
        console.log(`✅ Created ${createdSubCategories.length} sub-categories`);

        console.log(`🎉 Seeding complete for user: ${userObjectId}`);
    } catch (error: unknown) {
        console.error('❌ Error seeding categories:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to seed categories for user: ${message}`);
    }
}

// Check if user has categories, to prevent duplicate seeding
export async function userHasCategories(
    userId: string | mongoose.Types.ObjectId
): Promise<boolean> {
    try {
        await connectDB();

        const userObjectId = typeof userId === 'string'
            ? new mongoose.Types.ObjectId(userId)
            : userId;

        const count = await Category.countDocuments({ userId: userObjectId });
        return count > 0;
    } catch (error) {
        console.error('❌ Error checking user categories:', error);
        return false;
    }
}

// Seed preset income sources for a new user
// This function is called automatically when a user registers
export async function seedIncomeSourcesForUser(
    userId: string | mongoose.Types.ObjectId
): Promise<void> {
    try {
        await connectDB();

        const userObjectId = typeof userId === 'string'
            ? new mongoose.Types.ObjectId(userId)
            : userId;

        console.log(`🌱 Seeding income sources for user: ${userObjectId}`);

        const incomeSourceData = PRESET_INCOMES.map((presetIncome) => ({
            name: presetIncome.name,
            icon: presetIncome.icon,
            color: presetIncome.color,
            userId: userObjectId,
        }));

        const createdIncomeSources = await IncomeSource.insertMany(incomeSourceData, { ordered: false });
        console.log(`✅ Created ${createdIncomeSources.length} income sources`);

        console.log(`🎉 Income source seeding complete for user: ${userObjectId}`);
    } catch (error: unknown) {
        console.error('❌ Error seeding income sources:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to seed income sources for user: ${message}`);
    }
}

// Check if user has income sources, to prevent duplicate seeding
export async function userHasIncomeSources(
    userId: string | mongoose.Types.ObjectId
): Promise<boolean> {
    try {
        await connectDB();

        const userObjectId = typeof userId === 'string'
            ? new mongoose.Types.ObjectId(userId)
            : userId;

        const count = await IncomeSource.countDocuments({ userId: userObjectId });
        return count > 0;
    } catch (error) {
        console.error('❌ Error checking user income sources:', error);
        return false;
    }
}

// Seed all data for a new user (categories + income sources)
export async function seedAllForUser(
    userId: string | mongoose.Types.ObjectId
): Promise<void> {
    await seedCategoriesForUser(userId);
    await seedIncomeSourcesForUser(userId);
}