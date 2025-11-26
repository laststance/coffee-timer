import { useSyncExternalStore } from 'react'

/**
 * Dummy subscribe function for useSyncExternalStore.
 * Server-side rendering always returns the snapshot value.
 */
const subscribe = () => () => {}

/**
 * Returns true when mounted on client, false on server.
 */
const getSnapshot = () => true
const getServerSnapshot = () => false

/**
 * Custom hook to track component mount state.
 * Useful for avoiding hydration mismatches.
 * Uses useSyncExternalStore to avoid setState in useEffect lint error.
 *
 * @returns Whether the component is mounted on the client
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
