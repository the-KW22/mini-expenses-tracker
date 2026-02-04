import Link from "next/link";
import { Wallet } from "lucide-react";
import { Toaster } from "sonner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <Toaster position="top-center" richColors />
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute -top-24 -left-24 size-96 rounded-full bg-primary-dark/30 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 size-96 rounded-full bg-primary-darker/30 blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-white/20 backdrop-blur-sm">
              <Wallet className="size-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-primary-foreground">
              Mini Expenses Tracker
            </span>
          </Link>

          {/* Tagline */}
          <p className="text-2xl font-medium text-primary-foreground leading-relaxed max-w-md">
            Simple, intuitive expense tracking to help you stay on budget and take control of your finances.
          </p>

          {/* Footer */}
          <p className="text-sm text-primary-foreground/60">
            &copy; {new Date().getFullYear()} Mini Expenses Tracker. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden p-4 border-b border-border-light">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center size-9 rounded-lg bg-primary">
              <Wallet className="size-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-text-primary">
              Mini Expenses Tracker
            </span>
          </Link>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-background">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
