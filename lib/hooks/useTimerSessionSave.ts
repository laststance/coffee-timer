import { useEffect, useRef, type MutableRefObject } from 'react'
import type { SoundPreset } from '@/lib/stores/settingsStore'
import { authClient } from '@/lib/auth-client'

/**
 * Auto-save completed timer sessions to the server for authenticated users.
 * Uses the same completion detection pattern as useTimerCompletion.
 * Non-blocking fire-and-forget fetch — never delays sound or notification.
 *
 * @param timeRemaining - Current time remaining in seconds
 * @param initialTime - Original timer duration in seconds
 * @param soundPreset - Sound preset used for this session
 * @param userSetTimeRef - Ref tracking if user manually set time (avoid false triggers)
 *
 * @example
 * useTimerSessionSave(timeRemaining, initialTime, soundPreset, userSetTimeRef)
 */
export function useTimerSessionSave(
  timeRemaining: number,
  initialTime: number,
  soundPreset: SoundPreset,
  userSetTimeRef: MutableRefObject<boolean>,
): void {
  const { data: session } = authClient.useSession()
  const previousTimeRef = useRef(timeRemaining)

  useEffect(() => {
    // Same completion detection as useTimerCompletion:
    // timer just hit 0, but not because user manually set it to 0
    if (
      previousTimeRef.current > 0 &&
      timeRemaining === 0 &&
      !userSetTimeRef.current &&
      session?.user
    ) {
      // Fire-and-forget: don't block sound or notification
      fetch('/api/timer-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          durationSeconds: initialTime,
          completedAt: new Date().toISOString(),
          soundPreset,
        }),
      }).catch((error) => {
        console.error('[TimerSessionSave] Failed to save session:', error)
      })
    }
    previousTimeRef.current = timeRemaining
  }, [timeRemaining, initialTime, soundPreset, userSetTimeRef, session])
}
