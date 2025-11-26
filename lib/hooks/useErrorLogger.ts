import { useEffect } from 'react'

/**
 * Custom hook for logging errors to console.
 * Extracts useEffect logic for error boundary components.
 *
 * @param error - The error object to log
 */
export function useErrorLogger(error: Error & { digest?: string }): void {
  useEffect(() => {
    console.error(error)
  }, [error])
}
