/**
 * ThemeColorUpdater Component
 *
 * ## Purpose
 * Dynamically updates the browser's theme-color meta tag when users switch between
 * Coffee Timer's themes (light, dark, coffee). This provides a better visual experience
 * by updating the browser UI chrome (address bar, status bar, etc.) to match the
 * selected theme.
 *
 * ## Technical Background & Limitations
 *
 * ### PWA Theme Color Architecture
 * Progressive Web Apps use two mechanisms for theme color:
 *
 * 1. **Manifest theme_color** (app/manifest.ts):
 *    - Static value loaded at PWA installation time
 *    - Controls desktop PWA window title bar color
 *    - CANNOT be changed dynamically after installation
 *    - Cached by browser, requires PWA reinstallation to update
 *    - Current implementation: Set to coffee theme (#5d4037) as default
 *
 * 2. **Meta theme-color tag** (HTML <head>):
 *    - Can be updated dynamically via JavaScript
 *    - Controls browser chrome (address bar, status bar) in web context
 *    - Limited effect on installed PWA window chrome
 *    - Works well on mobile browsers (status bar color)
 *    - Partial support on desktop browsers
 *
 * ### Why This Component Exists
 *
 * According to Web Standards (MDN, W3C):
 * > "manifests are static JSON-formatted files which can't change on user input.
 * > This means that they can only provide a theme_color key at a time:
 * > there's no chance to make it dynamic."
 *
 * Since manifest theme_color cannot be changed dynamically, we use JavaScript to
 * update the meta tag for improved browser experience:
 * - ✅ Mobile browsers: Status bar color updates immediately
 * - ✅ Desktop browsers (web view): Address bar color updates
 * - ⚠️ Installed PWA (desktop): Limited effect, requires reinstallation
 *
 * ### Browser Support Matrix
 * - Chrome/Edge (Android): ✅ Excellent - status bar updates immediately
 * - Safari (iOS): ⚠️ Limited - respects initial value, partial dynamic updates
 * - Chrome/Edge (Desktop): ✅ Good - address bar updates in browser mode
 * - Chrome/Edge (Installed PWA): ⚠️ Limited - title bar color cached from manifest
 * - Safari (macOS): ⚠️ Limited - similar caching behavior
 *
 * ## Implementation Details
 *
 * ### Theme Color Mapping
 * Each theme has a carefully chosen primary color that reflects its visual identity:
 *
 * - **Light Theme**: #047857 (Darker emerald green)
 *   - Provides good contrast on light backgrounds
 *   - Professional and clean appearance
 *
 * - **Dark Theme**: #000000 (Black)
 *   - Clean dark header for PWA
 *   - Provides strong contrast in dark mode
 *
 * - **Coffee Theme**: #5d4037 (Espresso brown) ← DEFAULT
 *   - Warm, coffee-inspired color
 *   - Matches the relaxing, café aesthetic
 *   - Set as default to align with manifest and app identity
 *
 * ### How It Works
 *
 * 1. Component uses next-themes `useTheme` hook to listen for theme changes
 * 2. When theme changes, useEffect triggers
 * 3. Locates existing <meta name="theme-color"> tag in document
 * 4. Updates the content attribute with the new color
 * 5. Browser applies the color to its UI chrome (where supported)
 *
 * ### Integration
 *
 * This component should be placed inside ThemeProvider in the root layout:
 *
 * ```tsx
 * <ThemeProvider attribute="data-theme" defaultTheme="coffee" themes={['light', 'dark', 'coffee']}>
 *   <ThemeColorUpdater /> // ← Add here
 *   {children}
 * </ThemeProvider>
 * ```
 *
 * ## Research References
 * - MDN: Progressive Web Apps - Customize your app's theme and background colors
 *   https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Customize_your_app_colors
 * - W3C: Web Application Manifest - theme_color member
 * - Next.js 15: Viewport API and Metadata API documentation
 *
 * @component
 * @example
 * ```tsx
 * import { ThemeColorUpdater } from '@/components/ThemeColorUpdater'
 *
 * export default function Layout({ children }) {
 *   return (
 *     <ThemeProvider>
 *       <ThemeColorUpdater />
 *       {children}
 *     </ThemeProvider>
 *   )
 * }
 * ```
 */

'use client'

import { memo } from 'react'
import { useTheme } from 'next-themes'
import { useThemeColorUpdater } from '@/lib/hooks/useThemeColorUpdater'

/**
 * ThemeColorUpdater Component
 *
 * Renders nothing visually (returns null) but performs a side effect:
 * Updates the browser's theme-color meta tag when the theme changes.
 *
 * @returns {null} - This component has no visual output
 */
export const ThemeColorUpdater = memo(function ThemeColorUpdater() {
  const { theme } = useTheme()

  useThemeColorUpdater(theme)

  // This component performs side effects only, no rendering needed
  return null
})
