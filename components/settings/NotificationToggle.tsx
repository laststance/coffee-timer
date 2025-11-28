'use client'

import { memo } from 'react'
import { Bell, BellOff } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { useNotificationStore } from '@/lib/stores/notificationStore'
import useStore from '@/lib/hooks/useStore'
import { useNotificationSupport } from '@/lib/hooks/useNotificationSupport'
import { requestNotificationPermission } from '@/lib/notifications/notificationManager'

/**
 * NotificationToggle - Theme-aware notification toggle
 *
 * For Liquid Glass themes:
 * - Glass container with subtle border
 * - Glass toggle switch with smooth animations
 * - Color tint for active state
 *
 * For original themes (light/dark/coffee):
 * - Standard solid styling
 * - Maintains original visual appearance
 */
export const NotificationToggle = memo(function NotificationToggle() {
  const t = useTranslations('Notifications')
  const { resolvedTheme } = useTheme()
  const notificationState = useStore(useNotificationStore, (state) => state)
  const enabled = notificationState?.enabled ?? true
  const permission = notificationState?.permission ?? 'default'
  const setEnabled = notificationState?.setEnabled ?? (() => {})
  const setPermission = notificationState?.setPermission ?? (() => {})
  const supported = useNotificationSupport()

  // Check if current theme is a liquid-glass variant
  const isLiquidGlass = resolvedTheme?.startsWith('liquid-glass') ?? false

  const handleToggle = async () => {
    if (!supported) return

    // If turning on and permission not granted, request it
    if (!enabled && permission !== 'granted') {
      const result = await requestNotificationPermission()
      setPermission(result)
      if (result === 'granted') {
        setEnabled(true)
      }
    } else {
      // Just toggle the preference
      setEnabled(!enabled)
    }
  }

  // Don't show if not supported
  if (!supported) {
    return null
  }

  const isActive = enabled && permission === 'granted'
  const isBlocked = permission === 'denied'

  // For original themes: render standard toggle
  if (!isLiquidGlass) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-primary">
          {t('title')}
        </label>

        <div className="flex items-center justify-between rounded-lg border border-bg-secondary bg-bg-secondary/50 p-4">
          <div className="flex items-center gap-3">
            {isActive ? (
              <Bell className="h-5 w-5 text-primary-green" />
            ) : (
              <BellOff className="h-5 w-5 text-text-secondary" />
            )}
            <div>
              <p className="text-sm font-medium text-text-primary">
                {isActive ? t('enabled') : t('disabled')}
              </p>
              {isBlocked && (
                <p className="mt-1 text-xs text-red-500">
                  {t('permissionDeniedDescription')}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleToggle}
            disabled={isBlocked}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              isActive ? 'bg-primary-green' : 'bg-gray-300'
            }`}
            role="switch"
            aria-checked={isActive}
            aria-label={t('title')}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isActive ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    )
  }

  // For Liquid Glass themes: render glass toggle
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-primary">
        {t('title')}
      </label>

      <div
        className={`flex items-center justify-between rounded-xl glass glass-highlight p-4 transition-colors ${isActive ? 'glass-tint-green' : ''}`}
      >
        <div className="flex items-center gap-3">
          {isActive ? (
            <Bell className="h-5 w-5 text-primary-green" />
          ) : (
            <BellOff className="h-5 w-5 text-text-secondary" />
          )}
          <div>
            <p className="text-sm font-medium text-text-primary">
              {isActive ? t('enabled') : t('disabled')}
            </p>
            {isBlocked && (
              <p className="mt-1 text-xs text-red-500">
                {t('permissionDeniedDescription')}
              </p>
            )}
          </div>
        </div>

        {/* Glass Toggle Switch */}
        <motion.button
          onClick={handleToggle}
          disabled={isBlocked}
          className={`relative inline-flex h-7 w-12 items-center rounded-full glass glass-highlight transition-colors focus:outline-none focus:ring-2 focus:ring-primary-green/50 disabled:cursor-not-allowed disabled:opacity-50 ${
            isActive ? 'glass-tint-green' : ''
          }`}
          role="switch"
          aria-checked={isActive}
          aria-label={t('title')}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            className={`inline-block h-5 w-5 rounded-full glass glass-elevated glass-highlight ${
              isActive ? 'bg-primary-green/20' : ''
            }`}
            animate={{
              x: isActive ? 24 : 4,
            }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
            }}
          />
        </motion.button>
      </div>
    </div>
  )
})
