import { useEffect } from 'react'

/**
 * Theme color mapping for Coffee Timer themes.
 * Maps theme names to their corresponding browser chrome colors.
 *
 * - Light themes: #047857 (darker emerald green for good contrast)
 * - Dark themes: #000000 (black for clean dark appearance)
 * - Coffee themes: #5d4037 (espresso brown, warm café aesthetic)
 *
 * Liquid Glass themes inherit the same PWA header colors as their base themes
 * since the glass effects are visual overlays that don't affect browser chrome.
 */
const THEME_COLORS = {
  light: '#047857',
  dark: '#000000',
  coffee: '#5d4037',
  'liquid-glass-light': '#047857',
  'liquid-glass-dark': '#000000',
  'liquid-glass-coffee': '#5d4037',
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
