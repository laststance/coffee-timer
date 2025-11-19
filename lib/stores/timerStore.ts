import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { MAX_TIMER_TOTAL_SECONDS } from '@/lib/constants/time'

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

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      // Initial state
      timeRemaining: 300, // 5 minutes default
      initialTime: 300,
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
        const { timeRemaining } = get()
        const now = Date.now()
        set({
          isRunning: true,
          isPaused: false,
          targetEndTime: now + timeRemaining * 1000,
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
          currentRemaining = Math.max(0, Math.ceil(remainingMs / 1000))
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
          const remainingSeconds = Math.ceil(remainingMs / 1000)
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
          const remainingSeconds = Math.ceil(remainingMs / 1000)
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
