'use client'

import { useState, useEffect } from 'react'
import { Bell, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useNotificationStore } from '@/lib/stores/notificationStore'
import { useSettingsStore } from '@/lib/stores/settingsStore'
import useStore from '@/lib/hooks/useStore'
import {
  requestNotificationPermission,
  showNotification,
  isNotificationSupported,
} from '@/lib/notifications/notificationManager'
import { audioManager } from '@/lib/audio/audioManager'

/**
 * NotificationTest Component
 * Provides UI for testing notifications and managing permissions
 */
export function NotificationTest() {
  const t = useTranslations('Notifications')
  const notificationState = useStore(useNotificationStore, (state) => state)
  const permission = notificationState?.permission ?? 'default'
  const setPermission = notificationState?.setPermission ?? (() => {})
  const settingsState = useStore(useSettingsStore, (state) => state)
  const soundPreset = settingsState?.soundPreset ?? 'ascending-chime'
  const volume = settingsState?.volume ?? 70
  const [isRequesting, setIsRequesting] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    setSupported(isNotificationSupported())
  }, [])

  const handleRequestPermission = async () => {
    setIsRequesting(true)
    try {
      const result = await requestNotificationPermission()
      setPermission(result)
    } finally {
      setIsRequesting(false)
    }
  }

  const handleTestNotification = async () => {
    setIsSending(true)
    try {
      // Play sound
      audioManager.play(soundPreset, volume)

      // Show notification
      const success = await showNotification({
        title: t('testTitle'),
        body: t('testBody'),
      })

      if (!success) {
        console.warn('[NotificationTest] Failed to show notification')
      }
    } finally {
      setIsSending(false)
    }
  }

  // Not supported
  if (!supported) {
    return (
      <div className="rounded-lg border border-bg-secondary bg-bg-primary p-4">
        <div className="flex items-start gap-3">
          <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
          <div>
            <h3 className="font-semibold text-text-primary">
              {t('notSupported')}
            </h3>
            <p className="mt-1 text-sm text-text-secondary">
              {t('notSupportedDescription')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Permission Status */}
      <div className="rounded-lg border border-bg-secondary bg-bg-primary p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {permission === 'granted' && (
              <>
                <CheckCircle className="h-5 w-5 text-primary-green" />
                <div>
                  <h3 className="font-semibold text-text-primary">
                    {t('permissionGranted')}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {t('permissionGrantedDescription')}
                  </p>
                </div>
              </>
            )}

            {permission === 'denied' && (
              <>
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <h3 className="font-semibold text-text-primary">
                    {t('permissionDenied')}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {t('permissionDeniedDescription')}
                  </p>
                </div>
              </>
            )}

            {permission === 'default' && (
              <>
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <div>
                  <h3 className="font-semibold text-text-primary">
                    {t('permissionDefault')}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {t('permissionDefaultDescription')}
                  </p>
                </div>
              </>
            )}
          </div>

          {permission === 'default' && (
            <button
              onClick={handleRequestPermission}
              disabled={isRequesting}
              className="rounded-lg bg-primary-green px-4 py-3 min-h-[44px] font-semibold text-white shadow-soft transition-colors hover:bg-primary-green-dark focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2 disabled:opacity-50"
            >
              {isRequesting ? t('requesting') : t('requestPermission')}
            </button>
          )}
        </div>
      </div>

      {/* Test Notification Button */}
      {permission === 'granted' && (
        <div className="rounded-lg border border-bg-secondary bg-bg-primary p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-text-secondary" />
              <div>
                <h3 className="font-semibold text-text-primary">
                  {t('testNotification')}
                </h3>
                <p className="text-sm text-text-secondary">
                  {t('testNotificationDescription')}
                </p>
              </div>
            </div>

            <button
              onClick={handleTestNotification}
              disabled={isSending}
              className="rounded-lg border-2 border-primary-green px-4 py-3 min-h-[44px] font-semibold text-primary-green transition-colors hover:bg-primary-green hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2 disabled:opacity-50"
            >
              {isSending ? t('sending') : t('sendTest')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
