'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="sage"
      enableSystem={false}
      themes={['sage', 'rose', 'lavender', 'mint', 'peach', 'lemon']}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
