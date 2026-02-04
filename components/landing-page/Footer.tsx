import Link from "next/link";
import { Wallet } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border-light bg-surface-hover">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-6 gap-4">
          {/* Logo and App name */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center size-7 rounded-md bg-primary">
              <Wallet className="size-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium text-text-primary">
              Mini Expenses Tracker
            </span>
          </Link>

          {/* Copyright */}
          <p className="text-sm text-text-muted">
            &copy; {currentYear} Mini Expenses Tracker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}