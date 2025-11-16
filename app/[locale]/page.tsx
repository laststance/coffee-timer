'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTimerStore } from '@/lib/stores/timerStore'
import { useSettingsStore } from '@/lib/stores/settingsStore'
import { useNotificationStore } from '@/lib/stores/notificationStore'
import useStore from '@/lib/hooks/useStore'
import { audioManager } from '@/lib/audio/audioManager'
import { showNotification } from '@/lib/notifications/notificationManager'
import { TimerDisplay } from '@/components/timer/TimerDisplay'
import { TimerControls } from '@/components/timer/TimerControls'
import { TimeInput } from '@/components/timer/TimeInput'
import { SettingsPanel } from '@/components/settings/SettingsPanel'
import { LanguageToggle } from '@/components/LanguageToggle'
import { ServiceWorkerRegistration } from '@/components/notifications/ServiceWorkerRegistration'
import { NotificationTest } from '@/components/notifications/NotificationTest'

export default function Home() {
  const t = useTranslations('App')
  const tNotifications = useTranslations('Notifications')
  // Use hydration-safe hook to prevent SSR mismatches
  const timerState = useStore(useTimerStore, (state) => state)
  const settingsState = useStore(useSettingsStore, (state) => state)
  const notificationState = useStore(useNotificationStore, (state) => state)

  // Provide defaults during hydration
  const timeRemaining = timerState?.timeRemaining ?? 300
  const initialTime = timerState?.initialTime ?? 300
  const isRunning = timerState?.isRunning ?? false
  const isPaused = timerState?.isPaused ?? false
  const setTime = timerState?.setTime ?? (() => {})
  const start = timerState?.start ?? (() => {})
  const pause = timerState?.pause ?? (() => {})
  const reset = timerState?.reset ?? (() => {})
  const soundPreset = settingsState?.soundPreset ?? 'ascending-chime'
  const volume = settingsState?.volume ?? 70

  const notificationsEnabled = notificationState?.enabled ?? true
  const permission = notificationState?.permission ?? 'default'
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const previousTimeRef = useRef(timeRemaining)
  const userSetTimeRef = useRef(false)

  // Initialize AudioContext and preload sound on timer start (user interaction)
  const handleStart = useCallback(async () => {
    // Initialize AudioContext (satisfies browser autoplay policy)
    await audioManager.initialize()

    // Preload current sound preset for instant playback
    const currentPreset = useSettingsStore.getState().soundPreset
    if (currentPreset !== 'none') {
      await audioManager.preload(currentPreset)
    }

    // Start the timer
    useTimerStore.getState().start()
  }, [])

  // Track when user manually sets time
  useEffect(() => {
    // When initialTime changes, it means user called setTime()
    userSetTimeRef.current = true
  }, [initialTime])

  // Clear the flag when timer starts
  useEffect(() => {
    if (isRunning) {
      userSetTimeRef.current = false
    }
  }, [isRunning])

  // Preload sound when preset changes (if AudioContext initialized)
  useEffect(() => {
    if (soundPreset !== 'none') {
      audioManager.preload(soundPreset).catch((error) => {
        console.error('[Timer] Failed to preload sound:', error)
      })
    }
  }, [soundPreset])

  // Set up interval for ticking when timer is running
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      // Call tick from the store directly to avoid dependency issues
      useTimerStore.getState().tick()
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

  // Handle Page Visibility API for background timer
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Tab became visible - recalculate time remaining
        useTimerStore.getState().updateTimeRemaining()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Play sound and show notification when timer completes
  useEffect(() => {
    // Detect when timer just hit 0 (but not if user manually set it to 0)
    if (
      previousTimeRef.current > 0 &&
      timeRemaining === 0 &&
      !userSetTimeRef.current
    ) {
      // Play sound
      audioManager.play(soundPreset, volume)

      // Show notification if enabled and permission granted
      if (notificationsEnabled && permission === 'granted') {
        showNotification({
          title: tNotifications('timerCompleteTitle'),
          body: tNotifications('timerCompleteBody'),
        }).catch((error) => {
          console.error('[Timer] Failed to show notification:', error)
        })
      }
    }
    previousTimeRef.current = timeRemaining
  }, [
    timeRemaining,
    soundPreset,
    volume,
    notificationsEnabled,
    permission,
    tNotifications,
  ])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 p-8">
      {/* Service Worker Registration - runs once on mount */}
      <ServiceWorkerRegistration />

      <div className="mx-auto w-full max-w-2xl space-y-12">
        {/* Header with Language and Settings */}
        <div className="relative text-center">
          <h1 className="text-4xl font-bold text-text-primary">{t('title')}</h1>
          <p className="mt-2 text-text-secondary">{t('description')}</p>

          {/* Language Toggle - Left Side */}
          <div className="absolute left-0 top-0">
            <LanguageToggle />
          </div>

          {/* Settings Button - Right Side */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="absolute right-0 top-0 rounded-full p-3 min-w-11 min-h-11 flex items-center justify-center text-text-secondary transition-colors hover:bg-bg-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-green"
            aria-label="Open settings"
          >
            <Settings className="h-6 w-6" />
          </button>
        </div>

        {/* Timer Display */}
        <TimerDisplay
          timeRemaining={timeRemaining}
          isRunning={isRunning}
          isPaused={isPaused}
          initialTime={initialTime}
        />

        {/* Timer Controls */}
        <TimerControls
          onStart={handleStart}
          onPause={pause}
          onReset={reset}
          isRunning={isRunning}
        />

        {/* Time Input */}
        <TimeInput
          onTimeChange={setTime}
          disabled={isRunning}
          initialMinutes={Math.floor(initialTime / 60)}
          initialSeconds={initialTime % 60}
        />

        {/* Notification Test - Development/Testing UI */}
        <div className="mt-8 border-t border-bg-secondary pt-8">
          <NotificationTest />
        </div>
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </main>
  )
}
