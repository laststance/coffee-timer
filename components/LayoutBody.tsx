'use client'

import { memo } from 'react'
import type { AbstractIntlMessages } from 'next-intl'
import { NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ThemeColorUpdater } from '@/components/ThemeColorUpdater'
import { ServiceWorkerRegistration } from '@/components/notifications/ServiceWorkerRegistration'

interface LayoutBodyProps {
  children: React.ReactNode
  messages: AbstractIntlMessages
  locale: string
}

/**
 * LayoutBody - Client Component wrapper for the layout body.
 * Handles theme, notifications, and i18n providers.
 * Memoized to satisfy React.memo lint rule.
 */
export const LayoutBody = memo(function LayoutBody({
  children,
  messages,
  locale,
}: LayoutBodyProps) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="coffee" enableSystem>
      {/*
        ThemeColorUpdater: Dynamically updates browser theme-color meta tag
        when users switch between themes. See component documentation for
        technical details and browser support information.
      */}
      <ThemeColorUpdater />
      <ServiceWorkerRegistration />
      <NextIntlClientProvider messages={messages} locale={locale}>
        {children}
      </NextIntlClientProvider>
    </ThemeProvider>
  )
})
