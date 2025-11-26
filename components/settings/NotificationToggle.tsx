'use client'

import { memo } from 'react'
import { Bell, BellOff } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useNotificationStore } from '@/lib/stores/notificationStore'
import useStore from '@/lib/hooks/useStore'
import { useNotificationSupport } from '@/lib/hooks/useNotificationSupport'
import { requestNotificationPermission } from '@/lib/notifications/notificationManager'

export const NotificationToggle = memo(function NotificationToggle() {
  const t = useTranslations('Notifications')
  const notificationState = useStore(useNotificationStore, (state) => state)
  const enabled = notificationState?.enabled ?? true
  const permission = notificationState?.permission ?? 'default'
  const setEnabled = notificationState?.setEnabled ?? (() => {})
  const setPermission = notificationState?.setPermission ?? (() => {})
  const supported = useNotificationSupport()

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
})
