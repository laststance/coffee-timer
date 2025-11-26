import { useEffect, useRef, MutableRefObject } from 'react'

/**
 * Custom hook to track when user manually sets time and clear the flag when timer starts.
 *
 * @param initialTime - The initial time value that changes when user sets time
 * @param isRunning - Whether the timer is currently running
 * @returns A ref that tracks whether user manually set the time
 */
export function useTimerSetTimeTracker(
  initialTime: number,
  isRunning: boolean,
): MutableRefObject<boolean> {
  const userSetTimeRef = useRef(false)

  // Track when user manually sets time
  useEffect(() => {
    userSetTimeRef.current = true
  }, [initialTime])

  // Clear the flag when timer starts
  useEffect(() => {
    if (isRunning) {
      userSetTimeRef.current = false
    }
  }, [isRunning])

  return userSetTimeRef
}
