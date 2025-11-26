'use client'

import { memo } from 'react'
import { useServiceWorkerSetup } from '@/lib/hooks/useServiceWorkerSetup'

/**
 * ServiceWorkerRegistration Component
 * Registers the Service Worker on app load and syncs notification permission state
 */
export const ServiceWorkerRegistration = memo(
  function ServiceWorkerRegistration() {
    useServiceWorkerSetup()

    // This component doesn't render anything
    return null
  },
)
