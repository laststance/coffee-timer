import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Coffee Timer',
    short_name: 'CoffeeTimer',
    description:
      'Simple, relaxing coffee timer application with web push notifications',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#F9FAFB',
    /**
     * Theme Color Configuration
     *
     * Set to coffee theme default (#5d4037 - espresso brown) to match
     * the app's default theme and provide a consistent warm, coffee-inspired
     * appearance when the PWA is installed.
     *
     * IMPORTANT: This value is STATIC and loaded at PWA installation time.
     * After installation, changing this value requires users to REINSTALL
     * the PWA to see the updated title bar color.
     *
     * For dynamic theme color updates in browser/web view, see:
     * - components/ThemeColorUpdater.tsx (runtime meta tag updates)
     * - app/[locale]/layout.tsx viewport.themeColor (initial meta tag)
     *
     * Theme color mapping:
     * - Coffee (default): #5d4037 (espresso brown)
     * - Dark: #000000 (black)
     * - Light: #047857 (darker green)
     *
     * Previous value: '#10B981' (dark theme green - mismatch with default)
     * Current value: '#5d4037' (coffee theme - matches app default)
     */
    theme_color: '#5d4037',
    categories: ['productivity', 'utilities', 'lifestyle'],
    icons: [
      {
        src: '/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-192x192-safe.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/badge.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'monochrome',
      },
    ],
    screenshots: [
      {
        src: '/screenshots/desktop-wide.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Coffee Timer - Desktop View',
      },
      {
        src: '/screenshots/mobile-narrow.png',
        sizes: '375x812',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Coffee Timer - Mobile View',
      },
    ],
    shortcuts: [
      {
        name: 'Start Timer',
        short_name: 'Start',
        description: 'Quickly start a timer',
        url: '/?action=start',
        icons: [
          {
            src: '/shortcuts/start.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
      {
        name: 'Settings',
        short_name: 'Settings',
        description: 'Open timer settings',
        url: '/?action=settings',
        icons: [
          {
            src: '/shortcuts/settings.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
    ],
  }
}
