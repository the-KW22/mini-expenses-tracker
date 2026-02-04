'use server';

import { auth } from '@/lib/auth';
import { updateUserTheme } from '@/lib/db/utilities';
import { ThemeType } from '@/types';

const validThemes: ThemeType[] = ['sage', 'rose', 'lavender', 'mint', 'peach', 'lemon'];

// Update user theme preference
export async function updateThemeAction(theme: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'You must be logged in to update theme',
      };
    }

    // Validate theme
    if (!validThemes.includes(theme as ThemeType)) {
      return {
        success: false,
        error: 'Invalid theme',
      };
    }

    // Update theme in database
    const updated = await updateUserTheme(session.user.id, theme as ThemeType);

    if (!updated) {
      return {
        success: false,
        error: 'Failed to update theme',
      };
    }

    return {
      success: true,
      message: 'Theme updated successfully',
    };
  } catch (error) {
    console.error('Update theme error:', error);
    return {
      success: false,
      error: 'Failed to update theme',
    };
  }
}
