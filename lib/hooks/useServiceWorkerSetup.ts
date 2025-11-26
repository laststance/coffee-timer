import { useEffect } from 'react'
import { useNotificationStore } from '@/lib/stores/notificationStore'
import {
  registerServiceWorker,
  getNotificationPermission,
} from '@/lib/notifications/notificationManager'

/**
 * Custom hook to register Service Worker and sync notification permission state.
 * Registers SW on mount and listens for permission changes.
 */
export function useServiceWorkerSetup(): void {
  useEffect(() => {
    // Register Service Worker
    registerServiceWorker().then((registration) => {
      if (registration) {
        console.log('[App] Service Worker registered successfully')
      }
    })

    // Sync initial permission state
    const permission = getNotificationPermission()
    useNotificationStore.getState().setPermission(permission)

    // Listen for permission changes (some browsers support this)
    if ('permissions' in navigator) {
      navigator.permissions
        .query({ name: 'notifications' as PermissionName })
        .then((permissionStatus) => {
          permissionStatus.addEventListener('change', () => {
            useNotificationStore
              .getState()
              .setPermission(getNotificationPermission())
          })
        })
        .catch((error) => {
          console.warn(
            '[Notifications] Permission monitoring not supported:',
            error,
          )
        })
    }
  }, [])
}
