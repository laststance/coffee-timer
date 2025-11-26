import { useEffect } from 'react'
import { useTimerStore } from '@/lib/stores/timerStore'

/**
 * Custom hook to handle Page Visibility API for background timer.
 * Recalculates time remaining when tab becomes visible.
 */
export function usePageVisibility(): void {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        useTimerStore.getState().updateTimeRemaining()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])
}
