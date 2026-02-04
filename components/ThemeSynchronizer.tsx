'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';

interface ThemeSynchronizerProps {
  savedTheme?: string;
}

export default function ThemeSynchronizer({ savedTheme }: ThemeSynchronizerProps) {
  const { setTheme } = useTheme();
  const hasApplied = useRef(false);

  useEffect(() => {
    // Only apply the saved theme once when component mounts
    // This ensures the user's saved preference is restored on login
    if (savedTheme && !hasApplied.current) {
      setTheme(savedTheme);
      hasApplied.current = true;
    }
  }, [savedTheme, setTheme]);

  return null;
}
