'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { themes } from '@/lib/constants/themes';
import { cn } from '@/lib/utils';
import { updateThemeAction } from '@/actions/settings.actions';

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = async (newTheme: string) => {
    // Update local theme immediately for responsive UI
    setTheme(newTheme);

    // Save to database
    setIsSaving(true);
    try {
      await updateThemeAction(newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Appearance</CardTitle>
          <CardDescription>Customize the look of your app</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {themes.map((t) => (
              <div
                key={t.id}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
                <span className="text-xs text-muted-foreground">{t.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Appearance</CardTitle>
        <CardDescription>Customize the look of your app</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => handleThemeChange(t.id)}
              disabled={isSaving}
              className="flex flex-col items-center gap-2 group disabled:opacity-50"
            >
              <div
                className={cn(
                  'relative w-12 h-12 rounded-full border-2 transition-all',
                  'hover:scale-110 hover:shadow-md',
                  theme === t.id
                    ? 'border-foreground ring-2 ring-foreground ring-offset-2 ring-offset-background'
                    : 'border-transparent'
                )}
                style={{ backgroundColor: t.colors.primary }}
              >
                {theme === t.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-5 h-5 text-white drop-shadow-md" />
                  </div>
                )}
              </div>
              <span
                className={cn(
                  'text-xs transition-colors',
                  theme === t.id ? 'text-foreground font-medium' : 'text-muted-foreground'
                )}
              >
                {t.name}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
