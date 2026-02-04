"use server";

import { signIn, signOut } from '@/lib/auth';
import { createUser, emailExists, seedCategoriesForUser, seedIncomeSourcesForUser } from '@/lib/db/utilities';
import { signInSchema, registerSchema, type LoginInput, type RegisterInput } from '@/lib/validations/auth';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';

// Register a new user
export async function registerAction(data: RegisterInput) {
    try {
        // Validate input
        const validatedData = registerSchema.parse(data);

        // Check if email exist
        const exists = await emailExists(validatedData.email);
        if(exists) {
            return {
                success: false,
                error: 'Email already exists',
            };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        // Create user
        const newUser = await createUser({
            name: validatedData.name,
            email: validatedData.email,
            password: hashedPassword,
        });

        // Seed categories and income sources for new user
        await seedCategoriesForUser(newUser._id);
        await seedIncomeSourcesForUser(newUser._id);

        return {
            success: true,
            message: 'Account created successfully! Please login'
        };
    } catch (error: unknown) {
        console.error('Registration error:', error);
        const message = error instanceof Error ? error.message : 'Registration failed';
        
        if(message === 'ZodError'){
            return {
                success: false,
                error: 'Invalid input data',
            };
        }

        return {
            success: false,
            error: message || 'Registration failed. Pelase try again'
        };
    }
}

// Sign in user
export async function loginAction(data: LoginInput) {
    try {
        // Validate input
        const validatedData = signInSchema.parse(data);

        // Attempt sign in
        await signIn('credentials', {
            email: validatedData.email,
            password: validatedData.password,
            redirect: false,
        });

        return {
            success: true,
            message: 'Login successful!',
        };
    } catch(error: unknown) {
        console.error('Login error:', error);

        if(error instanceof AuthError) {
            switch (error.type){
                case 'CredentialsSignin':
                    return {
                        success: false,
                        error: 'Invalid email or password',
                    };
                default:
                    return {
                        success: false,
                        error: 'Login failed. Please try again.',
                    };
            }
        }

        const message = error instanceof Error ? error.message : 'Registration failed';
        if (message === 'ZodError') {
            return {
                success: false,
                error: 'Invalid input data',
            }
        };
    }

    return {
        success: false,
        error: 'Login failed. Please try again.',
    }
}

// Sign out user
export async function signOutAction(){
    try {
        await signOut({ redirect: false });
        return {
            success: true,
            message: 'Logged out successfully',
        };
    } catch (error) {
        console.error('Logout error:', error);
        return {
            success: false,
            error: 'Logout failed',
        };
    }
}