'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

/**
 * Custom hook to handle PWA shortcut actions from URL parameters.
 * Handles 'start' and 'settings' actions from PWA shortcuts.
 *
 * @param onStartTimer - Callback to start the timer
 * @param onOpenSettings - Callback to open settings
 * @param isHydrated - Whether the app is hydrated
 */
export function useShortcutHandler(
  onStartTimer: () => void,
  onOpenSettings: () => void,
  isHydrated: boolean,
): void {
  const searchParams = useSearchParams()
  const action = searchParams.get('action')
  const actionHandledRef = useRef(false)

  useEffect(() => {
    if (!isHydrated || actionHandledRef.current) return

    if (action === 'start') {
      actionHandledRef.current = true
      onStartTimer()
      window.history.replaceState({}, '', window.location.pathname)
    } else if (action === 'settings') {
      actionHandledRef.current = true
      onOpenSettings()
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [action, isHydrated, onStartTimer, onOpenSettings])
}
