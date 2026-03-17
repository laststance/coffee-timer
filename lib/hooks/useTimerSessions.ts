import { useState, useEffect, useCallback } from 'react'
import type { TimerSessionRecord } from '@/lib/types/timerSession'

/**
 * Custom hook to fetch, edit, and delete timer sessions from the API.
 * Manages loading state and provides CRUD operations.
 *
 * @returns Object with sessions array, loading state, and mutation handlers
 *
 * @example
 * const { sessions, isLoading, editSession, deleteSession } = useTimerSessions()
 */
export function useTimerSessions() {
  const [sessions, setSessions] = useState<TimerSessionRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetch('/api/timer-sessions')
      .then((res) => res.json())
      .then((data: TimerSessionRecord[]) => {
        if (!cancelled) {
          setSessions(data)
          setIsLoading(false)
        }
      })
      .catch((error) => {
        console.error('[useTimerSessions] Failed to fetch sessions:', error)
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const editSession = useCallback(
    async (
      id: string,
      updates: { note?: string; durationSeconds?: number },
    ) => {
      try {
        const res = await fetch(`/api/timer-sessions/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        })
        if (!res.ok) return
        const updated: TimerSessionRecord = await res.json()
        setSessions((prev) => prev.map((s) => (s.id === id ? updated : s)))
      } catch (error) {
        console.error('[useTimerSessions] Failed to edit session:', error)
      }
    },
    [],
  )

  const deleteSession = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/timer-sessions/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) return
      setSessions((prev) => prev.filter((s) => s.id !== id))
    } catch (error) {
      console.error('[useTimerSessions] Failed to delete session:', error)
    }
  }, [])

  return { sessions, isLoading, editSession, deleteSession }
}
