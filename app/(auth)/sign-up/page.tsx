'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';
import { registerAction } from '@/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Wallet } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);

    try {
      const result = await registerAction(data);

      if (result.success) {
        toast.success(result.message);
        router.push('/sign-in');
      } else {
        toast.error(result.error || 'Registration failed');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="flex items-center justify-center mb-6 lg:hidden">
          <div className="flex items-center justify-center size-14 rounded-2xl bg-primary/10">
            <Wallet className="size-7 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
          Create an account
        </h1>
        <p className="text-text-secondary">
          Get started with Mini Expenses Tracker
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-text-primary">
            Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            className="h-11"
            {...register('name')}
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-text-primary">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            className="h-11"
            {...register('email')}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-text-primary">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            className="h-11"
            {...register('password')}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-text-primary">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            className="h-11"
            {...register('confirmPassword')}
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full h-11" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-text-secondary">
        Already have an account?{' '}
        <Link
          href="/sign-in"
          className="font-medium text-primary hover:text-primary-dark transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
