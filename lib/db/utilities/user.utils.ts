import mongoose from 'mongoose';
import { connectDB } from '../connection';
import User from '@/models/User';
import Category from '@/models/Category';
import SubCategory from '@/models/SubCategory';
import Expense from '@/models/Expense';
import Budget from '@/models/Budget';
import IncomeSource from '@/models/IncomeSource';
import Income from '@/models/Income';
import { IUser, ThemeType } from '@/types';

// Get user by email
export async function getUserByEmail(email:string): Promise<IUser | null>{
    try{
        await connectDB();
        
        return await User.findOne({ email: email.toLowerCase() }).lean();
    } catch (error) {
        console.error('Error getting user by email:', error);
        throw new Error('Failed to fetch user');
    }
}

// Get user by ID, used for session management, profile fetching
export async function getUserById(
    userId: string | mongoose.Types.ObjectId
) : Promise<IUser | null> {
    try {
        await connectDB();

        const userObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;

        return await User.findById(userObjectId).select('-password').lean();
    } catch (error) {
        console.error('Error getting user by ID:', error);
        throw new Error('Failed to fetch user');
    }
}

// Create a new user, used for registration
export async function createUser(userData: {
    name: string;
    email: string;
    password: string;
}) : Promise<IUser> {
    try {
        await connectDB();

        const newUser = await User.create({
            name: userData.name,
            email: userData.email.toLowerCase(),
            password: userData.password,
        });

        return newUser;
    } catch (error: unknown) {
        console.error('Error creating user: ', error);

        // Handle duplicate email (MongoDB error code 11000)
        if (error instanceof Error && 'code' in error && (error as { code: number }).code === 11000) {
            throw new Error('Email already exists');
        }

        throw new Error('Failed to create user');
    }
}

// Update user profile, used for profile editing
export async function updateUser(
  userId: string | mongoose.Types.ObjectId,
  updateData: Partial<Pick<IUser, 'name' | 'image' | 'theme'>>
): Promise<IUser | null> {
  try {
    await connectDB();

    const userObjectId = typeof userId === 'string' 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;

    const updatedUser = await User.findByIdAndUpdate(
      userObjectId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password').lean();

    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
}

// Check if email exist, used for registration validation
export async function emailExists(email: string): Promise<boolean> {
  try {
    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() }).select('_id').lean();
    return !!user;
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
}

// Get user with password, used for password verification
export async function getUserWithPassword(
  userId: string | mongoose.Types.ObjectId
): Promise<IUser | null> {
  try {
    await connectDB();

    const userObjectId = typeof userId === 'string'
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    return await User.findById(userObjectId).lean();
  } catch (error) {
    console.error('Error getting user with password:', error);
    throw new Error('Failed to fetch user');
  }
}

// Update user password, used for password change
export async function updateUserPassword(
  userId: string | mongoose.Types.ObjectId,
  hashedPassword: string
): Promise<boolean> {
  try {
    await connectDB();

    const userObjectId = typeof userId === 'string'
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const result = await User.findByIdAndUpdate(
      userObjectId,
      { $set: { password: hashedPassword } },
      { new: true }
    );

    return !!result;
  } catch (error) {
    console.error('Error updating password:', error);
    throw new Error('Failed to update password');
  }
}

// Delete user account and all associated data
export async function deleteUserAccount(
  userId: string | mongoose.Types.ObjectId
): Promise<boolean> {
  try {
    await connectDB();

    const userObjectId = typeof userId === 'string'
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    // Delete all user data in parallel
    await Promise.all([
      Expense.deleteMany({ userId: userObjectId }),
      Income.deleteMany({ userId: userObjectId }),
      Budget.deleteMany({ userId: userObjectId }),
      SubCategory.deleteMany({ userId: userObjectId }),
      Category.deleteMany({ userId: userObjectId }),
      IncomeSource.deleteMany({ userId: userObjectId }),
    ]);

    // Delete the user
    const result = await User.findByIdAndDelete(userObjectId);

    return !!result;
  } catch (error) {
    console.error('Error deleting user account:', error);
    throw new Error('Failed to delete account');
  }
}

// Update user theme preference
export async function updateUserTheme(
  userId: string | mongoose.Types.ObjectId,
  theme: ThemeType
): Promise<boolean> {
  try {
    await connectDB();

    const userObjectId = typeof userId === 'string'
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const result = await User.findByIdAndUpdate(
      userObjectId,
      { $set: { theme } },
      { new: true }
    );

    return !!result;
  } catch (error) {
    console.error('Error updating theme:', error);
    throw new Error('Failed to update theme');
  }
}