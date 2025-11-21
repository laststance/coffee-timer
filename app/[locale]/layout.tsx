import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { ServiceWorkerRegistration } from '@/components/notifications/ServiceWorkerRegistration'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ThemeColorUpdater } from '@/components/ThemeColorUpdater'
import '../globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Coffee Timer',
    template: '%s | Coffee Timer',
  },
  description:
    'Simple, relaxing coffee timer application with web push notifications. Perfect for productivity and focus sessions.',
  keywords: [
    'timer',
    'productivity',
    'focus',
    'pomodoro',
    'time management',
    'web app',
    'coffee',
  ],
  authors: [{ name: 'Coffee Timer Team' }],
  creator: 'Coffee Timer',
  publisher: 'Coffee Timer',
  formatDetection: {
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CoffeeTimer',
    startupImage: [
      {
        url: '/apple-touch-icon.png',
        media: '(orientation: portrait)',
      },
    ],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icon-maskable.svg',
        color: '#10B981',
      },
    ],
  },
  manifest: '/api/manifest',
  other: {
    'msapplication-TileColor': '#10B981',
    'msapplication-TileImage': '/icon-192x192.png',
    'msapplication-config': '/browserconfig.xml',
    'color-scheme': 'light',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'CoffeeTimer',
  },
}

/**
 * Viewport Configuration
 *
 * The themeColor here generates the initial <meta name="theme-color"> tag
 * in the HTML <head>. This provides the default browser chrome color.
 *
 * IMPORTANT: This is the INITIAL value loaded on page load.
 * For DYNAMIC theme color updates when users switch themes, see:
 * - components/ThemeColorUpdater.tsx (updates meta tag on theme change)
 *
 * Set to coffee theme (#5d4037) to match:
 * - app/manifest.ts theme_color (PWA install default)
 * - ThemeProvider defaultTheme="coffee" (app default theme)
 * - app/globals.css [data-theme='coffee'] primary color
 *
 * Theme color mapping:
 * - Coffee (default): #5d4037 (espresso brown)
 * - Dark: #10b981 (bright green)
 * - Light: #047857 (darker green)
 *
 * Previous value: '#10B981' (dark theme green - mismatch)
 * Current value: '#5d4037' (coffee theme - correct default)
 */
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#5d4037',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

const isSupportedLocale = (
  value: string,
): value is (typeof routing.locales)[number] =>
  routing.locales.some((supportedLocale) => supportedLocale === value)

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Ensure that the incoming `locale` is valid
  if (!isSupportedLocale(locale)) {
    notFound()
  }

  const resolvedLocale = locale

  // Enable static rendering
  setRequestLocale(resolvedLocale)

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  return (
    <html lang={resolvedLocale} suppressHydrationWarning>
      <body className="bg-bg-primary text-text-primary antialiased">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="coffee"
          enableSystem
          themes={['light', 'dark', 'coffee']}
        >
          {/*
            ThemeColorUpdater: Dynamically updates browser theme-color meta tag
            when users switch between themes. See component documentation for
            technical details and browser support information.
          */}
          <ThemeColorUpdater />
          <ServiceWorkerRegistration />
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
