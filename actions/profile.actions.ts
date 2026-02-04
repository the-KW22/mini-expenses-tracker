'use server';

import { auth, signOut } from '@/lib/auth';
import { updateUser, getUserWithPassword, updateUserPassword, deleteUserAccount } from '@/lib/db/utilities';
import {
  updateNameSchema,
  changePasswordSchema,
  type UpdateNameInput,
  type ChangePasswordInput,
} from '@/lib/validations/profile';
import bcrypt from 'bcryptjs';

// Update user profile name
export async function updateProfileAction(data: UpdateNameInput) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'You must be logged in to update your profile',
      };
    }

    // Validate input
    const validatedData = updateNameSchema.parse(data);

    // Update user
    const updatedUser = await updateUser(session.user.id, {
      name: validatedData.name,
    });

    if (!updatedUser) {
      return {
        success: false,
        error: 'Failed to update profile',
      };
    }

    return {
      success: true,
      message: 'Profile updated successfully',
    };
  } catch (error) {
    console.error('Update profile error:', error);
    return {
      success: false,
      error: 'Failed to update profile',
    };
  }
}

// Change user password
export async function changePasswordAction(data: ChangePasswordInput) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'You must be logged in to change your password',
      };
    }

    // Validate input
    const validatedData = changePasswordSchema.parse(data);

    // Get user with password for verification
    const user = await getUserWithPassword(session.user.id);

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      validatedData.currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return {
        success: false,
        error: 'Current password is incorrect',
      };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10);

    // Update password
    const updated = await updateUserPassword(session.user.id, hashedPassword);

    if (!updated) {
      return {
        success: false,
        error: 'Failed to update password',
      };
    }

    return {
      success: true,
      message: 'Password changed successfully',
    };
  } catch (error) {
    console.error('Change password error:', error);
    return {
      success: false,
      error: 'Failed to change password',
    };
  }
}

// Delete user account and all data
export async function deleteAccountAction() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'You must be logged in to delete your account',
      };
    }

    // Delete account and all associated data
    const deleted = await deleteUserAccount(session.user.id);

    if (!deleted) {
      return {
        success: false,
        error: 'Failed to delete account',
      };
    }

    // Sign out the user
    await signOut({ redirect: false });

    return {
      success: true,
      message: 'Account deleted successfully',
    };
  } catch (error) {
    console.error('Delete account error:', error);
    return {
      success: false,
      error: 'Failed to delete account',
    };
  }
}
