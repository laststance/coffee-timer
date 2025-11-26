import { useSyncExternalStore } from 'react'
import { isNotificationSupported } from '@/lib/notifications/notificationManager'

/**
 * Dummy subscribe function for useSyncExternalStore.
 * Notification support doesn't change during runtime.
 */
const subscribe = () => () => {}

/**
 * Returns notification support status on client.
 */
const getSnapshot = () => isNotificationSupported()

/**
 * Returns false on server (notifications not supported in SSR).
 */
const getServerSnapshot = () => false

/**
 * Custom hook to check if notifications are supported in the browser.
 * Uses useSyncExternalStore to avoid setState in useEffect lint error.
 *
 * @returns Whether notifications are supported
 */
export function useNotificationSupport(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
