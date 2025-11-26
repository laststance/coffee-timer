import { useEffect } from 'react'

/**
 * Theme color mapping for Coffee Timer themes.
 */
const THEME_COLORS = {
  light: '#047857',
  dark: '#000000',
  coffee: '#5d4037',
} as const

/**
 * Custom hook to update browser theme-color meta tag when theme changes.
 *
 * @param theme - Current theme name
 */
export function useThemeColorUpdater(theme: string | undefined): void {
  useEffect(() => {
    if (!theme) return

    const metaThemeColor = document.querySelector('meta[name="theme-color"]')

    if (metaThemeColor && theme in THEME_COLORS) {
      const newColor = THEME_COLORS[theme as keyof typeof THEME_COLORS]
      metaThemeColor.setAttribute('content', newColor)
    }
  }, [theme])
}
