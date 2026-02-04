'use client';

import Link from 'next/link';
import { Wallet, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MobileHeaderProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export default function MobileHeader({ user }: MobileHeaderProps) {
  const getInitials = (name: string) => {
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-background/80 backdrop-blur-md border-b border-border-light lg:hidden">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left: Menu Button & Logo */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            data-mobile-menu
            onClick={() => {
              document.dispatchEvent(new CustomEvent('toggle-sidebar'));
            }}
          >
            <Menu className="size-5" />
          </Button>

          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex items-center justify-center size-9 rounded-lg bg-primary">
              <Wallet className="size-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-md text-text-primary hidden sm:block">
              Mini Expenses Tracker
            </span>
          </Link>
        </div>

        {/* Right: User Avatar (clicking opens sidebar) */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => {
            document.dispatchEvent(new CustomEvent('toggle-sidebar'));
          }}
        >
          <Avatar className="size-8 border-2 border-primary/20">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </div>
    </header>
  );
}
