import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  DEFAULT_TIMER_SECONDS,
  MAX_TIMER_TOTAL_SECONDS,
  MILLISECONDS_PER_SECOND,
} from '@/lib/constants/time'

interface TimerState {
  // State
  timeRemaining: number // seconds
  initialTime: number // seconds
  isRunning: boolean
  isPaused: boolean
  targetEndTime: number | null // timestamp when timer should end
  lastUpdateTime: number // timestamp of last update (for pause/resume)

  // Actions
  setTime: (minutes: number, seconds: number) => void
  start: () => void
  pause: () => void
  reset: () => void
  tick: () => void
  updateTimeRemaining: () => void // recalculate time based on timestamp
}

/**
 * Chooses the countdown length when Start is pressed so completed timers restart from the displayed duration.
 * @param timeRemaining - Current countdown seconds left on the timer.
 * @param initialTime - Duration seconds selected in the time input.
 * @returns
 * - Remaining seconds while idle or paused
 * - Initial duration seconds after the timer has completed
 * - 0 when no startable duration exists
 * @example
 * getStartDurationSeconds(0, 120) // => 120
 */
const getStartDurationSeconds = (
  timeRemaining: number,
  initialTime: number,
): number => {
  if (timeRemaining > 0) {
    return timeRemaining
  }

  return initialTime
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      // Initial state
      timeRemaining: DEFAULT_TIMER_SECONDS,
      initialTime: DEFAULT_TIMER_SECONDS,
      isRunning: false,
      isPaused: false,
      targetEndTime: null,
      lastUpdateTime: Date.now(),

      // Actions
      setTime: (minutes: number, seconds: number) => {
        const totalSeconds = Math.max(
          0,
          Math.min(MAX_TIMER_TOTAL_SECONDS, minutes * 60 + seconds),
        )
        set({
          timeRemaining: totalSeconds,
          initialTime: totalSeconds,
          isRunning: false,
          isPaused: false,
          targetEndTime: null,
          lastUpdateTime: Date.now(),
        })
      },

      start: () => {
        const { initialTime, timeRemaining } = get()
        const now = Date.now()
        const startDurationSeconds = getStartDurationSeconds(
          timeRemaining,
          initialTime,
        )

        if (startDurationSeconds <= 0) {
          set({
            timeRemaining: 0,
            isRunning: false,
            isPaused: false,
            targetEndTime: null,
            lastUpdateTime: now,
          })
          return
        }

        // A completed timer has 0 remaining but still has a selected duration.
        set({
          timeRemaining: startDurationSeconds,
          isRunning: true,
          isPaused: false,
          targetEndTime: now + startDurationSeconds * MILLISECONDS_PER_SECOND,
          lastUpdateTime: now,
        })
      },

      pause: () => {
        const { targetEndTime } = get()
        const now = Date.now()

        // Calculate current remaining time when pausing
        let currentRemaining = 0
        if (targetEndTime) {
          const remainingMs = targetEndTime - now
          currentRemaining = Math.max(
            0,
            Math.ceil(remainingMs / MILLISECONDS_PER_SECOND),
          )
        }

        set({
          isRunning: false,
          isPaused: true,
          timeRemaining: currentRemaining,
          targetEndTime: null,
          lastUpdateTime: now,
        })
      },

      reset: () => {
        const { initialTime } = get()
        set({
          timeRemaining: initialTime,
          isRunning: false,
          isPaused: false,
          targetEndTime: null,
          lastUpdateTime: Date.now(),
        })
      },

      tick: () => {
        const { isRunning, targetEndTime } = get()
        if (!isRunning || !targetEndTime) return

        const now = Date.now()
        const remainingMs = targetEndTime - now

        if (remainingMs <= 0) {
          // Timer completed
          set({
            timeRemaining: 0,
            isRunning: false,
            targetEndTime: null,
            lastUpdateTime: now,
          })
        } else {
          // Update remaining time based on actual elapsed time
          const remainingSeconds = Math.ceil(
            remainingMs / MILLISECONDS_PER_SECOND,
          )
          set({
            timeRemaining: remainingSeconds,
            lastUpdateTime: now,
          })
        }
      },

      updateTimeRemaining: () => {
        const { isRunning, targetEndTime } = get()
        if (!isRunning || !targetEndTime) return

        const now = Date.now()
        const remainingMs = targetEndTime - now

        if (remainingMs <= 0) {
          // Timer completed while tab was hidden
          set({
            timeRemaining: 0,
            isRunning: false,
            targetEndTime: null,
            lastUpdateTime: now,
          })
        } else {
          // Recalculate remaining time
          const remainingSeconds = Math.ceil(
            remainingMs / MILLISECONDS_PER_SECOND,
          )
          set({
            timeRemaining: remainingSeconds,
            lastUpdateTime: now,
          })
        }
      },
    }),
    {
      name: 'timer-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
