import { useEffect, useRef, MutableRefObject } from 'react'
import type { SoundPreset } from '@/lib/stores/settingsStore'
import { audioManager } from '@/lib/audio/audioManager'
import { showNotification } from '@/lib/notifications/notificationManager'

/**
 * Custom hook to handle timer completion - plays sound and shows notification.
 *
 * @param timeRemaining - Current time remaining in seconds
 * @param soundPreset - The sound preset to play
 * @param volume - Volume level (0-100)
 * @param notificationsEnabled - Whether notifications are enabled
 * @param permission - Current notification permission status
 * @param userSetTimeRef - Ref tracking if user manually set time
 * @param notificationTitle - Title for the notification
 * @param notificationBody - Body text for the notification
 */
export function useTimerCompletion(
  timeRemaining: number,
  soundPreset: SoundPreset,
  volume: number,
  notificationsEnabled: boolean,
  permission: NotificationPermission | 'default',
  userSetTimeRef: MutableRefObject<boolean>,
  notificationTitle: string,
  notificationBody: string,
): void {
  const previousTimeRef = useRef(timeRemaining)

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
          title: notificationTitle,
          body: notificationBody,
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
    userSetTimeRef,
    notificationTitle,
    notificationBody,
  ])
}
