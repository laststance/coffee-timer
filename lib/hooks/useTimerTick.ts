import { useEffect } from 'react'
import { useTimerStore } from '@/lib/stores/timerStore'

/**
 * Custom hook to set up interval for ticking when timer is running.
 *
 * @param isRunning - Whether the timer is currently running
 */
export function useTimerTick(isRunning: boolean): void {
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      useTimerStore.getState().tick()
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])
}
