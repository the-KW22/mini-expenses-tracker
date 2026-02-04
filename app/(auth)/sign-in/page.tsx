'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, type LoginInput } from '@/lib/validations/auth';
import { loginAction } from '@/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Wallet } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);

    try {
      const result = await loginAction(data);

      if (result.success) {
        toast.success(result.message);
        router.push('/dashboard');
        router.refresh();
      } else {
        toast.error(result.error || 'Login failed');
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
          Welcome back
        </h1>
        <p className="text-text-secondary">
          Enter your credentials to access your account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            placeholder="Enter your password"
            className="h-11"
            {...register('password')}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full h-11" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-text-secondary">
        Don&apos;t have an account?{' '}
        <Link
          href="/sign-up"
          className="font-medium text-primary hover:text-primary-dark transition-colors"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
