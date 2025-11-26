'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes'

/**
 * Supported themes for the application.
 * Defined outside component to maintain referential equality.
 */
const SUPPORTED_THEMES = ['light', 'dark', 'coffee']

export const ThemeProvider = React.memo(function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      defaultTheme="coffee"
      themes={SUPPORTED_THEMES}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
})
